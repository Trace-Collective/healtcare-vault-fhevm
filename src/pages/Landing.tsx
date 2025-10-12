import { useNavigate } from "react-router-dom";
import { Shield, Lock, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { t } from "@/lib/i18n";
import { WalletButton } from "@/components/layout/WalletButton";
import { MedicalScene } from "@/components/3d/MedicalScene";
import { motion } from "framer-motion";
import { useRef } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { language } = useUIStore();
  const { isConnected } = useAuthStore();
  const featuresRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: Lock,
      title: t('landing.features.privacy.title', language),
      description: t('landing.features.privacy.desc', language)
    },
    {
      icon: Shield,
      title: t('landing.features.control.title', language),
      description: t('landing.features.control.desc', language)
    },
    {
      icon: Database,
      title: t('landing.features.blockchain.title', language),
      description: t('landing.features.blockchain.desc', language)
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Scene */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        
        <div className="container relative px-4 py-12 lg:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground"
            >
              <Lock className="h-4 w-4" />
              <span>Powered by FHEVM</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t('landing.title', language)}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-10 text-lg text-muted-foreground sm:text-xl"
            >
              {t('landing.subtitle', language)}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              {!isConnected ? (
                <WalletButton />
              ) : (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="gap-2"
                >
                  {t('landing.openDashboard', language)}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Medical Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative"
        >
          <MedicalScene />
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 lg:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid gap-8 md:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card className="shadow-card hover:shadow-card-hover transition-smooth h-full">
                    <CardContent className="p-6">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                      >
                        <feature.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FHE Explainer Section */}
      <section className="bg-muted/30 py-20">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 text-3xl font-bold"
            >
              What is FHE?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8"
            >
              {language === 'id' 
                ? 'Fully Homomorphic Encryption (FHE) memungkinkan komputasi pada data terenkripsi tanpa perlu mendekripsinya terlebih dahulu. Ini berarti data kesehatan Anda tetap privat bahkan saat diproses di blockchain.'
                : 'Fully Homomorphic Encryption (FHE) allows computation on encrypted data without decrypting it first. This means your health data remains private even when processed on the blockchain.'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg bg-accent/50 p-6 mb-4"
                  >
                    <p className="text-sm font-medium text-accent-foreground">
                      ⚠️ {t('records.demoMode', language)}
                    </p>
                  </motion.div>
                  <p className="text-muted-foreground text-sm">
                    {language === 'id'
                      ? 'Aplikasi ini menggunakan enkripsi placeholder untuk demo. Implementasi FHE sesungguhnya akan menggunakan Zama FHEVM SDK.'
                      : 'This app uses placeholder encryption for demo purposes. Actual FHE implementation will use Zama FHEVM SDK.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
