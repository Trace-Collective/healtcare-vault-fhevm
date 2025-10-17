import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useRecord } from "@/hooks/useRecords";
import { useHVGrant, useHVAddDelta, useHVDecrypt } from "@/hooks/useHealthVaultDemo";
import { decryptData } from "@/services/fhe";
import { t } from "@/lib/i18n";
import { Loading } from "@/components/common/Loading";
import { DecryptedHealthRecord } from "@/types/records";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { grantAccess as grantAccessLocal, revokeAccess as revokeAccessLocal } from "@/services/contract";

const RecordDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useUIStore();
  const { address, isConnected, connector } = useAccount();
  const { data: record, isLoading } = useRecord(id);
  const [decryptedData, setDecryptedData] = useState<DecryptedHealthRecord | null>(null);
  const hvGrant = useHVGrant();
  const hvAddDelta = useHVAddDelta();
  const hvDecrypt = useHVDecrypt();
  const [doctorAddress, setDoctorAddress] = useState('');
  const [riskDelta, setRiskDelta] = useState('');
  const queryClient = useQueryClient();

  const ensureConnection = () => {
    if (!isConnected || !address) {
      toast.error(language === 'id' ? 'Hubungkan wallet terlebih dahulu' : 'Please connect wallet first');
      return false;
    }
    return true;
  };

  const syncLocalAccess = async (grant: boolean) => {
    if (!address || !doctorAddress) return;
    try {
      if (grant) {
        await grantAccessLocal(address, doctorAddress);
      } else {
        await revokeAccessLocal(address, doctorAddress);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['records'] }),
        queryClient.invalidateQueries({ queryKey: ['records', address] }),
        id ? queryClient.invalidateQueries({ queryKey: ['record', id] }) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Failed syncing local access state', error);
    }
  };

  const handleGrant = async (grant: boolean) => {
    if (!ensureConnection()) return;
    if (!doctorAddress) {
      toast.error(language === 'id' ? 'Alamat dokter wajib diisi' : 'Doctor address is required');
      return;
    }

    const canWriteOnChain = typeof connector?.getChainId === 'function';
    if (!canWriteOnChain) {
      await syncLocalAccess(grant);
      setDoctorAddress('');
      toast.success(
        language === 'id'
          ? 'Akses diperbarui dalam mode demo'
          : 'Access updated in demo mode'
      );
      return;
    }

    try {
      const hash = await hvGrant.mutateAsync({
        doctor: doctorAddress as `0x${string}`,
        isGranted: grant,
      });
      await syncLocalAccess(grant);
      setDoctorAddress('');
      toast.success(
        language === 'id'
          ? `Transaksi dikirim: ${hash}`
          : `Transaction submitted: ${hash}`
      );
    } catch (error) {
      console.error('Grant access failed', error);
      toast.error(language === 'id' ? 'Gagal mengirim transaksi' : 'Failed to send transaction');
    }
  };

  const handleRiskDelta = async () => {
    if (!ensureConnection()) return;
    if (!record?.contractId) {
      toast.error(language === 'id' ? 'Rekam medis belum memiliki ID kontrak' : 'Record has no contract id yet');
      return;
    }

    let recordKey: bigint;
    try {
      recordKey = BigInt(record.contractId);
    } catch (error) {
      console.error('Invalid record id', error);
      toast.error(language === 'id' ? 'ID rekam medis tidak valid' : 'Record id is invalid');
      return;
    }

    const delta = Number(riskDelta || 0);
    if (Number.isNaN(delta)) {
      toast.error(language === 'id' ? 'Delta risiko tidak valid' : 'Invalid risk delta');
      return;
    }

    try {
      const hash = await hvAddDelta.mutateAsync({ id: recordKey, delta });
      toast.success(
        language === 'id'
          ? `Transaksi dikirim: ${hash}`
          : `Transaction submitted: ${hash}`
      );
    } catch (error) {
      console.error('Add risk delta failed', error);
      toast.error(language === 'id' ? 'Gagal mengirim transaksi' : 'Failed to send transaction');
    }
  };

  const handleDecrypt = async () => {
    if (!ensureConnection()) return;
    if (!record?.contractId) {
      toast.error(language === 'id' ? 'Rekam medis belum memiliki ID kontrak' : 'Record has no contract id yet');
      return;
    }

    let recordKey: bigint;
    try {
      recordKey = BigInt(record.contractId);
    } catch (error) {
      console.error('Invalid record id', error);
      toast.error(language === 'id' ? 'ID rekam medis tidak valid' : 'Record id is invalid');
      return;
    }

    try {
      const hash = await hvDecrypt.mutateAsync({ id: recordKey });
      toast.success(
        language === 'id'
          ? `Permintaan dikirim: ${hash}`
          : `Request submitted: ${hash}`
      );
    } catch (error) {
      console.error('Decrypt request failed', error);
      toast.error(language === 'id' ? 'Gagal mengirim transaksi' : 'Failed to send transaction');
    }
  };

  useEffect(() => {
    if (record) {
      decryptData<{
        complaint: string;
        diagnosis: string;
        medications: string;
        allergy: string;
        note?: string;
      }>(record.payload).then((data) => {
        setDecryptedData({
          ...record,
          payload: data
        });
      });
    }
  }, [record]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="container p-6">
              <Loading text={t('common.loading', language)} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!record || !decryptedData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="container p-6">
              <p>{language === 'id' ? 'Rekam medis tidak ditemukan' : 'Record not found'}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container max-w-4xl p-6 space-y-6">
            {/* Header */}
            <div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/records')}
                className="mb-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'id' ? 'Kembali' : 'Back'}
              </Button>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {language === 'id' ? 'Detail Rekam Medis' : 'Health Record Details'}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(record.createdAt)}
                  </div>
                </div>
                <Badge variant="outline">
                  {t('records.decrypted', language)}
                </Badge>
              </div>
            </div>

            {/* Demo Warning */}
            <Card className="border-warning bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">
                      {t('records.demoMode', language)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'id'
                        ? 'Data ini menggunakan enkripsi placeholder. Implementasi FHE sesungguhnya akan menggunakan Zama FHEVM SDK.'
                        : 'This data uses placeholder encryption. Actual FHE implementation will use Zama FHEVM SDK.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Informasi Medis' : 'Medical Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('records.complaint', language)}</h3>
                  <p className="text-muted-foreground">{decryptedData.payload.complaint || '-'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('records.diagnosis', language)}</h3>
                  <p className="text-muted-foreground">{decryptedData.payload.diagnosis || '-'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('records.medications', language)}</h3>
                  <p className="text-muted-foreground">{decryptedData.payload.medications || '-'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('records.allergy', language)}</h3>
                  <p className="text-muted-foreground">{decryptedData.payload.allergy || '-'}</p>
                </div>

                {decryptedData.payload.note && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('records.note', language)}</h3>
                    <p className="text-muted-foreground">{decryptedData.payload.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Access Information */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Informasi Akses' : 'Access Information'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Pemilik:' : 'Owner:'}
                  </p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{record.owner}</code>
                </div>
                
                {record.grantedTo && record.grantedTo.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {language === 'id' ? 'Akses Diberikan Kepada:' : 'Access Granted To:'}
                    </p>
                    {record.grantedTo.map((addr, idx) => (
                      <code key={idx} className="block text-sm bg-muted px-2 py-1 rounded">
                        {addr}
                      </code>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* On-chain actions */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Aksi FHEVM' : 'FHEVM Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="doctorAddress">
                    {language === 'id' ? 'Alamat Dokter' : 'Doctor Address'}
                  </Label>
                  <Input
                    id="doctorAddress"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="0x..."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGrant(true)}
                      disabled={hvGrant.isPending}
                    >
                      {language === 'id' ? 'Berikan Akses' : 'Grant Access'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGrant(false)}
                      disabled={hvGrant.isPending}
                    >
                      {language === 'id' ? 'Cabut Akses' : 'Revoke Access'}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="contractRecordId">
                      {language === 'id' ? 'ID Rekam Medis (kontrak)' : 'Contract Record ID'}
                    </Label>
                    <code className="block text-sm bg-muted p-3 rounded" id="contractRecordId">
                      {record.contractId != null
                        ? `#${record.contractId}`
                        : language === 'id'
                          ? 'Belum tersedia'
                          : 'Not available'}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskDelta">
                      {language === 'id' ? 'Delta Risiko (u16)' : 'Risk Delta (u16)'}
                    </Label>
                    <Input
                      id="riskDelta"
                      type="number"
                      value={riskDelta}
                      onChange={(e) => setRiskDelta(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      size="sm"
                      onClick={handleRiskDelta}
                      disabled={hvAddDelta.isPending}
                    >
                      {language === 'id' ? 'Tambah Δ Risiko' : 'Add Risk Δ'}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleDecrypt}
                  disabled={hvDecrypt.isPending}
                >
                  {language === 'id' ? 'Minta Dekripsi' : 'Request Decrypt'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordDetail;
