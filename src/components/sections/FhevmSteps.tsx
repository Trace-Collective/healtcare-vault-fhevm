import { motion } from "framer-motion";

const steps = [
  {
    title: "Encrypt (Client Side)",
    text: "User data is encrypted on the device before it ever touches the blockchain.",
    icon: "🔐",
  },
  {
    title: "Compute (Smart Contract)",
    text: "The FHEVM smart contract computes on ciphertext without ever decrypting it.",
    icon: "⚡",
  },
  {
    title: "Gateway (Decryption Request)",
    text: "The contract submits a decryption request to the Gateway using an encrypted handle.",
    icon: "⚙️",
  },
  {
    title: "Decrypt (Authorized User)",
    text: "The Gateway returns plaintext results solely to the identities allowed to read them.",
    icon: "👤",
  },
  {
    title: "Privacy Guaranteed",
    text: "No one else — not even the blockchain — can access your sensitive information.",
    icon: "🛡️",
  },
];

export const FhevmSteps = () => {
  return (
    <section className="bg-[#0D0E11] px-6 py-24 text-[#E6FFFA]">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-4xl font-bold text-[#00FFD1] sm:text-5xl"
        >
          How FHEVM Works
        </motion.h2>

        <div className="flex w-full flex-col gap-10">
          {steps.map((step, index) => {
            const iconBase =
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#112126] text-2xl text-[#00FFD1] ring-1 ring-[#00FFD1]/40 shadow-[0_0_20px_rgba(0,255,209,0.45)]";
            const iconEnhancements = [
              index === 0 ? " shadow-[0_0_30px_rgba(0,255,209,0.55)]" : "",
              index === 2 ? " animate-pulse" : "",
              index === 4 ? " shadow-[0_0_35px_rgba(0,255,209,0.6)]" : "",
            ].join("");
            const iconClassName = `${iconBase}${iconEnhancements}`;

            const iconNode =
              index === 3 ? (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className={iconClassName}
                  aria-hidden
                >
                  {step.icon}
                </motion.div>
              ) : (
                <div className={iconClassName} aria-hidden>
                  {step.icon}
                </div>
              );

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
                className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white/5 px-6 py-8 text-left shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:flex-row sm:items-start"
              >
                <span className="absolute -left-4 top-1/2 hidden h-10 w-[2px] -translate-y-1/2 bg-gradient-to-b from-[#00FFD1] to-transparent sm:block" />
                {iconNode}
                <div className="sm:pl-6">
                  <h3 className="text-2xl font-semibold text-[#00FFD1]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-lg leading-relaxed text-[#B7FFF1]">
                    {step.text}
                  </p>
                  {index === 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.6 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="mt-6 h-[2px] w-32 origin-left bg-gradient-to-r from-[#00FFD1]/90 via-[#00C9FF]/40 to-transparent"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: steps.length * 0.15 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl text-center text-2xl font-semibold text-[#00FFD1]"
        >
          <span className="block text-3xl font-bold tracking-wide text-[#00FFD1] drop-shadow-[0_0_15px_rgba(0,255,209,0.45)]">
            Compute on Encrypted Data — Powered by ZAMA
          </span>
        </motion.p>
      </div>
    </section>
  );
};

export default FhevmSteps;
