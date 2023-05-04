import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, mainnet, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  safeWallet
} from '@rainbow-me/rainbowkit/wallets';
import { SigningComponent } from "@/components/SigningComponent";

const { chains, provider } = configureChains(
  [mainnet,goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const _connectors = connectorsForWallets([
  {
    groupName: 'For testing',
    wallets: [
      //injectedWallet({ chains }),
      safeWallet({ chains })
//      rainbowWallet({ projectId, chains }),
//      walletConnectWallet({ projectId, chains }),
    ],
  },
]);


const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    ...connectors(), ..._connectors()
  ],
  provider
});

export default function IndexPage() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div
         
        >
          <ConnectButton />
        </div>
        
        <SigningComponent />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}