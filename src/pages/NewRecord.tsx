import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useCreateRecord } from "@/hooks/useRecords";
import { useHVCreate } from "@/hooks/useHealthVaultDemo";
import { encryptData } from "@/services/fhe";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const NewRecord = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { language } = useUIStore();
  const createRecord = useCreateRecord();
  const hvCreate = useHVCreate();

  const [formData, setFormData] = useState({
    complaint: '',
    diagnosis: '',
    medications: '',
    allergy: '',
    note: '',
    allergyCode: '',
    riskScore: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnChainSubmit = async () => {
    if (!isConnected || !address) {
      toast.error(language === 'id' ? 'Hubungkan wallet terlebih dahulu' : 'Please connect wallet first');
      return;
    }

    const allergyCode = Number(formData.allergyCode || 0);
    const riskScore = Number(formData.riskScore || 0);

    if (Number.isNaN(allergyCode) || Number.isNaN(riskScore)) {
      toast.error(language === 'id' ? 'Nilai kode alergi dan skor risiko tidak valid' : 'Invalid allergy code or risk score');
      return;
    }

    try {
      const hash = await hvCreate.mutateAsync({
        cid: `demo-cid-${Date.now()}`,
        allergy: allergyCode,
        risk: riskScore,
      });
      toast.success(
        language === 'id'
          ? `Transaksi dikirim: ${hash}`
          : `Transaction submitted: ${hash}`
      );
    } catch (error) {
      console.error('Error sending on-chain tx:', error);
      toast.error(language === 'id' ? 'Gagal mengirim transaksi' : 'Failed to send transaction');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast.error(language === 'id' ? 'Hubungkan wallet terlebih dahulu' : 'Please connect wallet first');
      return;
    }

    if (!formData.complaint || !formData.diagnosis) {
      toast.error(language === 'id' ? 'Keluhan dan diagnosa wajib diisi' : 'Complaint and diagnosis are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Encrypt the data
      const encryptedPayload = await encryptData(formData);

      // Create record
      await createRecord.mutateAsync({
        id: `record-${Date.now()}`,
        owner: address,
        createdAt: new Date().toISOString(),
        payload: {
          complaint: encryptedPayload.complaint,
          diagnosis: encryptedPayload.diagnosis,
          medications: encryptedPayload.medications,
          allergy: encryptedPayload.allergy,
          note: encryptedPayload.note || ''
        }
      });

      navigate('/records');
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error(language === 'id' ? 'Gagal membuat rekam medis' : 'Failed to create record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container max-w-3xl p-6 space-y-6">
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
              
              <h1 className="text-3xl font-bold mb-2">
                {t('records.newRecord', language)}
              </h1>
              <p className="text-muted-foreground">
                {language === 'id'
                  ? 'Data akan dienkripsi sebelum disimpan'
                  : 'Data will be encrypted before saving'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Informasi Medis' : 'Medical Information'}</CardTitle>
                  <CardDescription>
                    {t('records.demoMode', language)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="complaint">
                      {t('records.complaint', language)} *
                    </Label>
                    <Textarea
                      id="complaint"
                      value={formData.complaint}
                      onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                      placeholder={language === 'id' ? 'Keluhan atau gejala...' : 'Complaint or symptoms...'}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">
                      {t('records.diagnosis', language)} *
                    </Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      placeholder={language === 'id' ? 'Diagnosa dari dokter...' : 'Doctor\'s diagnosis...'}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">
                      {t('records.medications', language)}
                    </Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      placeholder={language === 'id' ? 'Obat yang diresepkan...' : 'Prescribed medications...'}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergy">
                      {t('records.allergy', language)}
                    </Label>
                    <Input
                      id="allergy"
                      value={formData.allergy}
                      onChange={(e) => setFormData({ ...formData, allergy: e.target.value })}
                      placeholder={language === 'id' ? 'Alergi yang diketahui...' : 'Known allergies...'}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="allergyCode">
                        {language === 'id' ? 'Kode Alergi (u16)' : 'Allergy Code (u16)'}
                      </Label>
                      <Input
                        id="allergyCode"
                        type="number"
                        value={formData.allergyCode}
                        onChange={(e) => setFormData({ ...formData, allergyCode: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="riskScore">
                        {language === 'id' ? 'Skor Risiko (u16)' : 'Risk Score (u16)'}
                      </Label>
                      <Input
                        id="riskScore"
                        type="number"
                        value={formData.riskScore}
                        onChange={(e) => setFormData({ ...formData, riskScore: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">
                      {t('records.note', language)}
                    </Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder={language === 'id' ? 'Catatan tambahan...' : 'Additional notes...'}
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/records')}
                      className="flex-1"
                    >
                      {t('common.cancel', language)}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? t('common.loading', language) : t('common.save', language)}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={hvCreate.isPending}
                      onClick={handleOnChainSubmit}
                      className="flex-1"
                    >
                      {hvCreate.isPending
                        ? language === 'id'
                          ? 'Mengirim...' : 'Submitting...'
                        : language === 'id'
                          ? 'Kirim ke FHEVM'
                          : 'Submit to FHEVM'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewRecord;
