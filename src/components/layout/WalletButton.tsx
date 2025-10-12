import { ConnectButton } from "@rainbow-me/rainbowkit";

export const WalletButton = () => {
  return (
    <ConnectButton
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "full",
      }}
      chainStatus="icon"
      showBalance={false}
    />
  );
};
