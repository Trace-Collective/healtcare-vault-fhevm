import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Shield, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'nav.dashboard', href: '/dashboard', icon: Home },
  { name: 'nav.records', href: '/records', icon: FileText },
  { name: 'nav.access', href: '/access', icon: Shield },
  { name: 'nav.settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, language } = useUIStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-card transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href} onClick={() => {
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t(item.name, language)}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
