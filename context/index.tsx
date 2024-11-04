import { QueryClient } from "@tanstack/react-query";
import { PUB_WALLET_CONNECT_PROJECT_ID } from "@/constants";
import { config } from "@/context/Web3Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { type ReactNode } from "react";
import { WagmiProvider, deserialize, serialize, type State } from "wagmi";
import { AlertProvider } from "./Alerts";
import { OdsModulesProvider } from "@aragon/ods";
import { customModulesCopy, odsCoreProviderValues } from "@/components/ods-customizations";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { hashFn } from "@wagmi/core/query";
import { If } from "@/components/if";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 10, // 10 minutes
      queryKeyHashFn: hashFn,
      staleTime: 2_000 * 60, // 2 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createAsyncStoragePersister({
  serialize,
  storage: AsyncStorage,
  deserialize,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: PUB_WALLET_CONNECT_PROJECT_ID,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional
  themeMode: "light",
  allWallets: "SHOW",
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1",
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
  ],
});

export function RootContextProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <OdsModulesProvider
          wagmiConfig={config}
          queryClient={queryClient}
          wagmiInitialState={initialState}
          coreProviderValues={odsCoreProviderValues}
          values={{ copy: customModulesCopy }}
        >
          <AlertProvider>{children}</AlertProvider>
        </OdsModulesProvider>
        <If val={process.env.NODE_ENV} is="development">
          <ReactQueryDevtools initialIsOpen={false} />
        </If>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}
