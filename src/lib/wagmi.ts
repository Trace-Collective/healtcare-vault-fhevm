import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, polygonAmoy, sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000";

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_WALLETCONNECT_PROJECT_ID is not set. RainbowKit will use a placeholder id; please configure a valid project id for production."
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Healthcare Vault dApp",
  projectId,
  chains: [mainnet, sepolia, polygon, polygonAmoy],
  ssr: false,
});
