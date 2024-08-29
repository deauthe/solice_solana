import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Env } from "@/providers/useEnv";
import Link from "next/link";

export function Header({
	env,
	setEnv,
}: {
	env: string;
	setEnv: (env: Env) => void;
}) {
	return (
		<div className="flex flex-row w-full justify-between items-center p-2 max-h-20 bg-black">
			<Link className="uppercase font-bold tracking-tight text-3xl" href="/">
				SOLICe
			</Link>
			<div className="flex flex-row gap-5 h-full">
				<WalletMultiButton />
				<Link href={"/create"} className="btn btn-accent">
					Create
				</Link>
				<select
					className="select select-bordered select-ghost"
					name="\"
					id=""
					defaultValue={"devnet"}
					onChange={(e) => setEnv(e.target.value as Env)}
				>
					<option value="devnet">Devnet</option>
					<option value="mainnet">Mainnet</option>
					<option value="localhost">Localhost</option>
				</select>
			</div>
		</div>
	);
}
