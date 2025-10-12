import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WalletButton = () => {
  const { address, isConnected, connect, disconnect } = useAuthStore();
  const { language } = useUIStore();

  const handleConnect = () => {
    // Demo wallet connection
    const demoAddress = "0x" + Math.random().toString(16).slice(2, 10) + "...5678";
    connect(demoAddress);
    toast.success(language === 'id' ? 'Wallet terhubung' : 'Wallet connected');
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info(language === 'id' ? 'Wallet terputus' : 'Wallet disconnected');
  };

  const shortenAddress = (addr: string) => {
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} className="gap-2">
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">{t('landing.connectWallet', language)}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{shortenAddress(address || '')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          navigator.clipboard.writeText(address || '');
          toast.success(language === 'id' ? 'Alamat disalin' : 'Address copied');
        }}>
          {language === 'id' ? 'Salin Alamat' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          {language === 'id' ? 'Putuskan' : 'Disconnect'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
