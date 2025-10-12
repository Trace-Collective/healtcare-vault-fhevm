import { useState } from "react";
import { Shield, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useAccessLog } from "@/hooks/useAccess";
import { useGrantAccess, useRevokeAccess } from "@/hooks/useAccess";
import { t } from "@/lib/i18n";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";

const Access = () => {
  const { address } = useAuthStore();
  const { language } = useUIStore();
  const { data: accessLog, isLoading } = useAccessLog(address);
  const grantAccess = useGrantAccess();
  const revokeAccess = useRevokeAccess();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctorAddress, setDoctorAddress] = useState('');

  const handleGrantAccess = async () => {
    if (!address) {
      toast.error(language === 'id' ? 'Hubungkan wallet terlebih dahulu' : 'Please connect wallet first');
      return;
    }

    if (!doctorAddress.trim()) {
      toast.error(language === 'id' ? 'Masukkan alamat dokter' : 'Enter doctor address');
      return;
    }

    try {
      await grantAccess.mutateAsync({ patient: address, doctor: doctorAddress });
      setDoctorAddress('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error granting access:', error);
    }
  };

  const handleRevokeAccess = async (doctor: string) => {
    if (!address) return;

    try {
      await revokeAccess.mutateAsync({ patient: address, doctor });
    } catch (error) {
      console.error('Error revoking access:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeAccess = accessLog?.filter(a => a.status === 'granted') || [];
  const revokedAccess = accessLog?.filter(a => a.status === 'revoked') || [];

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
                  {t('access.title', language)}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'id'
                    ? 'Kelola siapa yang dapat mengakses rekam medis Anda'
                    : 'Manage who can access your health records'}
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('access.grantAccess', language)}
              </Button>
            </div>

            {/* Content */}
            {isLoading ? (
              <Loading text={t('common.loading', language)} />
            ) : (
              <div className="space-y-6">
                {/* Active Access */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'id' ? 'Akses Aktif' : 'Active Access'}</CardTitle>
                    <CardDescription>
                      {language === 'id' ? 'Dokter yang memiliki akses ke rekam medis Anda' : 'Doctors with access to your records'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeAccess.length === 0 ? (
                      <EmptyState
                        icon={Shield}
                        title={language === 'id' ? 'Tidak Ada Akses Aktif' : 'No Active Access'}
                        description={
                          language === 'id'
                            ? 'Belum ada dokter yang memiliki akses ke rekam medis Anda'
                            : 'No doctors have access to your records yet'
                        }
                      />
                    ) : (
                      <div className="space-y-4">
                        {activeAccess.map((access) => (
                          <div
                            key={access.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <code className="text-sm">{access.doctor}</code>
                              <p className="text-xs text-muted-foreground mt-1">
                                {language === 'id' ? 'Diberikan:' : 'Granted:'} {formatDate(access.grantedAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="default">{t('access.granted', language)}</Badge>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRevokeAccess(access.doctor)}
                                title={t('access.revokeAccess', language)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Revoked Access */}
                {revokedAccess.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === 'id' ? 'Riwayat Akses' : 'Access History'}</CardTitle>
                      <CardDescription>
                        {language === 'id' ? 'Akses yang telah dicabut' : 'Revoked access'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {revokedAccess.map((access) => (
                          <div
                            key={access.id}
                            className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                          >
                            <div className="flex-1">
                              <code className="text-sm">{access.doctor}</code>
                              <p className="text-xs text-muted-foreground mt-1">
                                {language === 'id' ? 'Dicabut:' : 'Revoked:'} {access.revokedAt && formatDate(access.revokedAt)}
                              </p>
                            </div>
                            <Badge variant="secondary">{t('access.revoked', language)}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Grant Access Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('access.grantAccess', language)}</DialogTitle>
            <DialogDescription>
              {language === 'id'
                ? 'Masukkan alamat wallet dokter untuk memberikan akses'
                : 'Enter doctor wallet address to grant access'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-address">{t('access.doctorAddress', language)}</Label>
              <Input
                id="doctor-address"
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel', language)}
            </Button>
            <Button onClick={handleGrantAccess} disabled={grantAccess.isPending}>
              {grantAccess.isPending ? t('common.loading', language) : t('access.grantAccess', language)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Access;
