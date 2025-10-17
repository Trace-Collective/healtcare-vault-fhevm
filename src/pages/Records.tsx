import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useMyRecords } from "@/hooks/useRecords";
import { useHVGrant, useHVAddDelta, useHVDecrypt } from "@/hooks/useHealthVaultDemo";
import { t } from "@/lib/i18n";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { RecordCard } from "@/components/records/RecordCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const Records = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { language } = useUIStore();
  const { data: records, isLoading } = useMyRecords(address);
  const hvGrant = useHVGrant();
  const hvAddDelta = useHVAddDelta();
  const hvDecrypt = useHVDecrypt();

  const [doctorAddress, setDoctorAddress] = useState('');
  const [selectedContractId, setSelectedContractId] = useState('');
  const [riskDelta, setRiskDelta] = useState('');

  useEffect(() => {
    if (!selectedContractId && records?.length) {
      const firstWithId = records.find((record) => record.contractId != null);
      if (firstWithId?.contractId != null) {
        setSelectedContractId(firstWithId.contractId.toString());
      }
    }
  }, [records, selectedContractId]);

  const ensureConnection = () => {
    if (!isConnected || !address) {
      toast.error(language === 'id' ? 'Hubungkan wallet terlebih dahulu' : 'Please connect wallet first');
      return false;
    }
    return true;
  };

  const handleGrant = async (grant: boolean) => {
    if (!ensureConnection()) return;
    if (!doctorAddress) {
      toast.error(language === 'id' ? 'Alamat dokter wajib diisi' : 'Doctor address is required');
      return;
    }

    try {
      const hash = await hvGrant.mutateAsync({
        doctor: doctorAddress as `0x${string}`,
        isGranted: grant,
      });
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
    if (!selectedContractId) {
      toast.error(language === 'id' ? 'Pilih rekam medis terlebih dahulu' : 'Select a record first');
      return;
    }

    let id: bigint;
    try {
      id = BigInt(selectedContractId);
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
      const hash = await hvAddDelta.mutateAsync({ id, delta });
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
    if (!selectedContractId) {
      toast.error(language === 'id' ? 'Pilih rekam medis terlebih dahulu' : 'Select a record first');
      return;
    }

    let id: bigint;
    try {
      id = BigInt(selectedContractId);
    } catch (error) {
      console.error('Invalid record id', error);
      toast.error(language === 'id' ? 'ID rekam medis tidak valid' : 'Record id is invalid');
      return;
    }

    try {
      const hash = await hvDecrypt.mutateAsync({ id });
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t('records.title', language)}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'id' 
                    ? 'Kelola dan lihat rekam medis terenkripsi Anda'
                    : 'Manage and view your encrypted health records'}
                </p>
              </div>
              <Button onClick={() => navigate('/records/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('records.newRecord', language)}
              </Button>
            </div>

            {/* On-chain demo controls */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Demo Interaksi FHEVM' : 'FHEVM Demo Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
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
                  </div>
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

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="recordId">
                      {language === 'id' ? 'Rekam Medis' : 'Record'}
                    </Label>
                    <Select
                      value={selectedContractId}
                      onValueChange={setSelectedContractId}
                      disabled={!records?.length}
                    >
                      <SelectTrigger id="recordId">
                        <SelectValue
                          placeholder={language === 'id' ? 'Pilih rekam medis' : 'Select a record'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {records?.map((record) => (
                          <SelectItem
                            key={record.id}
                            value={record.contractId?.toString() ?? ''}
                            disabled={record.contractId == null}
                          >
                            {record.contractId != null
                              ? `#${record.contractId} • ${record.id}`
                              : record.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Button
                    size="sm"
                    onClick={handleRiskDelta}
                    disabled={hvAddDelta.isPending}
                  >
                    {language === 'id' ? 'Tambah Δ Risiko' : 'Add Risk Δ'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {language === 'id'
                      ? 'Gunakan tombol berikut untuk meminta dekripsi skor risiko.'
                      : 'Use the button below to request a risk score decryption.'}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDecrypt}
                    disabled={hvDecrypt.isPending}
                  >
                    {language === 'id' ? 'Minta Dekripsi' : 'Request Decrypt'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {!isConnected ? (
              <EmptyState
                icon={FileText}
                title={language === 'id' ? 'Wallet belum terhubung' : 'Wallet not connected'}
                description={
                  language === 'id'
                    ? 'Hubungkan wallet Anda untuk melihat rekam medis terenkripsi'
                    : 'Connect your wallet to view encrypted health records'
                }
              />
            ) : isLoading ? (
              <Loading text={t('common.loading', language)} />
            ) : records && records.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title={language === 'id' ? 'Belum Ada Rekam Medis' : 'No Health Records Yet'}
                description={
                  language === 'id'
                    ? 'Buat rekam medis terenkripsi pertama Anda'
                    : 'Create your first encrypted health record'
                }
                action={{
                  label: t('records.newRecord', language),
                  onClick: () => navigate('/records/new')
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Records;
