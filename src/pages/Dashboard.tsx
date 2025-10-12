import { useNavigate } from "react-router-dom";
import { FileText, Shield, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useMyRecords } from "@/hooks/useRecords";
import { useAccessLog } from "@/hooks/useAccess";
import { t } from "@/lib/i18n";
import { Loading } from "@/components/common/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const { address } = useAuthStore();
  const { language } = useUIStore();
  const { data: records, isLoading: recordsLoading } = useMyRecords(address);
  const { data: accessLog, isLoading: accessLoading } = useAccessLog(address);

  const activeAccess = accessLog?.filter(a => a.status === 'granted').length || 0;

  const stats = [
    {
      title: t('dashboard.totalRecords', language),
      value: records?.length || 0,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: t('dashboard.activeAccess', language),
      value: activeAccess,
      icon: Shield,
      color: "text-secondary"
    }
  ];

  const quickActions = [
    {
      title: t('dashboard.createRecord', language),
      description: language === 'id' ? 'Buat rekam medis terenkripsi baru' : 'Create a new encrypted health record',
      icon: Plus,
      onClick: () => navigate('/records/new'),
      variant: 'default' as const
    },
    {
      title: t('dashboard.manageAccess', language),
      description: language === 'id' ? 'Kelola akses dokter ke rekam medis' : 'Manage doctor access to your records',
      icon: Eye,
      onClick: () => navigate('/access'),
      variant: 'outline' as const
    }
  ];

  if (recordsLoading || accessLoading) {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container p-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('dashboard.welcome', language)}
              </h1>
              <p className="text-muted-foreground">
                {address || 'Guest User'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-card hover:shadow-card-hover transition-smooth">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {language === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
                    onClick={action.onClick}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <action.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {action.description}
                          </p>
                          <Button variant={action.variant} size="sm">
                            {language === 'id' ? 'Buka' : 'Open'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
