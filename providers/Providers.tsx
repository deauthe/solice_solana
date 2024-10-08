"use client";

import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { UmiProvider } from "./UmiProvider";
import { EnvProvider } from "./EnvProvider";
import { Env } from "./useEnv";

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const queryEnv = searchParams.get("env");
	const [client] = useState(new QueryClient());
	const [env, setEnv] = useState<Env>(
		queryEnv === "devnet" || queryEnv === "mainnet" ? queryEnv : "devnet"
	);
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
		[]
	);

	const doSetEnv = (e: Env) => {
		const params = new URLSearchParams(window.location.search);
		params.set("env", e);

		setEnv(e);
		router.push(`${pathname}?${params.toString()}`);
		console.log("changed env to ", e);
	};

	useEffect(() => {
		if (env === "devnet" && queryEnv !== "devnet") {
			doSetEnv("devnet");
		}
	}, []);

	const endpoint = useMemo(() => {
		switch (env) {
			case "mainnet":
				return process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
			case "localhost":
				return "http://localhost:8899";
			case "devnet":
				return process.env.NEXT_PUBLIC_DEVNET_RPC_URL;
			default:
				return process.env.NEXT_PUBLIC_DEVNET_RPC_URL;
		}
	}, [env]);

	return (
		<EnvProvider env={env!}>
			<ConnectionProvider endpoint={endpoint!}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<UmiProvider>
							<QueryClientProvider client={client}>
								<ReactQueryStreamedHydration>
									<Toaster />
									<Suspense>
										<Header env={env} setEnv={doSetEnv} />
									</Suspense>
									{children}
								</ReactQueryStreamedHydration>
							</QueryClientProvider>
						</UmiProvider>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</EnvProvider>
	);
}
