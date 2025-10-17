import { Shield, Lock, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/store/uiStore";
import { t } from "@/lib/i18n";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { MedicalScene } from "@/components/3d/MedicalScene";
import { motion } from "framer-motion";
import { useRef } from "react";
import { FhevmSteps } from "@/components/sections/FhevmSteps";

const Landing = () => {
  const { language } = useUIStore();
  const featuresRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: Lock,
      title: t("landing.features.privacy.title", language),
      description: t("landing.features.privacy.desc", language),
    },
    {
      icon: Shield,
      title: t("landing.features.control.title", language),
      description: t("landing.features.control.desc", language),
    },
    {
      icon: Database,
      title: t("landing.features.blockchain.title", language),
      description: t("landing.features.blockchain.desc", language),
    },
  ];

  return (
    <div className="min-h-screen">
      <LandingHeader />

      {/* Hero Section with 3D Scene */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-primary opacity-5" />

        <div className="container relative px-4 py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground"
              >
                <Lock className="h-4 w-4" />
                <span>Powered by Zama FHEVM</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Encrypted Health Records with FHE
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-muted-foreground sm:text-xl"
              >
                Manage your health data securely using fully homomorphic
                encryption on blockchain
              </motion.p>
            </motion.div>

            {/* Right Column - 3D Medical Scene */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative"
            >
              <MedicalScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 lg:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl space-y-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold">What is FHE?</h2>
              <p className="text-lg text-muted-foreground">
                Fully Homomorphic Encryption (FHE) lets applications compute directly on encrypted data.
                Your health information stays private from edge to chain — even while smart contracts process it.
              </p>
            </motion.div>

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
                      <h3 className="mb-2 text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <FhevmSteps />
    </div>
  );
};

export default Landing;
