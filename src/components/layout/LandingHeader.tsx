import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Healthcare Vault</span>
        </div>

        {/* Go To App Button */}
        <Button 
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="gap-2"
        >
          Go To App
        </Button>
      </div>
    </motion.header>
  );
};
