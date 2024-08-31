import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Solice",
	description: "A licensing platform that relies on solana",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Suspense>
					<Providers>{children}</Providers>
				</Suspense>
			</body>
		</html>
	);
}
