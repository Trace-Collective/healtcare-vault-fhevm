import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { t } from "@/lib/i18n";

const Settings = () => {
  const { theme, language, toggleTheme, setLanguage } = useUIStore();
  const { address } = useAuthStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container max-w-3xl p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('settings.title', language)}
              </h1>
              <p className="text-muted-foreground">
                {language === 'id'
                  ? 'Kelola preferensi aplikasi Anda'
                  : 'Manage your application preferences'}
              </p>
            </div>

            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profile', language)}</CardTitle>
                <CardDescription>
                  {language === 'id'
                    ? 'Informasi akun Anda'
                    : 'Your account information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>{language === 'id' ? 'Alamat Wallet' : 'Wallet Address'}</Label>
                  <code className="block text-sm bg-muted p-3 rounded">
                    {address || language === 'id' ? 'Tidak terhubung' : 'Not connected'}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Tampilan' : 'Appearance'}</CardTitle>
                <CardDescription>
                  {language === 'id'
                    ? 'Atur tema dan bahasa aplikasi'
                    : 'Customize the app theme and language'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">{t('settings.theme', language)}</Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'light' ? t('settings.light', language) : t('settings.dark', language)}
                    </p>
                  </div>
                  <Switch
                    id="theme"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.language', language)}</Label>
                  <Select value={language} onValueChange={(value: 'id' | 'en') => setLanguage(value)}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'id' ? 'Tentang' : 'About'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'id'
                    ? 'Confidential Health Record dApp adalah aplikasi demo untuk manajemen rekam medis terenkripsi menggunakan teknologi FHEVM (Fully Homomorphic Encryption Virtual Machine).'
                    : 'Confidential Health Record dApp is a demo application for encrypted health record management using FHEVM (Fully Homomorphic Encryption Virtual Machine) technology.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id'
                    ? '⚠️ Ini adalah aplikasi demo dengan enkripsi placeholder. Untuk produksi, gunakan implementasi FHE sesungguhnya dengan Zama FHEVM SDK.'
                    : '⚠️ This is a demo app with placeholder encryption. For production, use actual FHE implementation with Zama FHEVM SDK.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
