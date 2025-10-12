import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useMyRecords } from "@/hooks/useRecords";
import { t } from "@/lib/i18n";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { RecordCard } from "@/components/records/RecordCard";
import { useAccount } from "wagmi";

const Records = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { language } = useUIStore();
  const { data: records, isLoading } = useMyRecords(address);

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
