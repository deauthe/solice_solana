"use client";
import { useAudioPlayer } from "react-use-audio-player";
import { IconCopy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
export interface NftCardProps {
	candyMachine: CandyMachine;
	description: string;
	imageUrl?: string;
	title: string;
	artist: string;
	action: () => Promise<
		| {
				nft: DigitalAsset;
				signature: Uint8Array;
		  }
		| undefined
	>;
}
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { useToast } from "../ui/use-toast";
import {
	CandyMachine,
	safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { useUmi } from "@/providers/useUmi";
import { unwrapSome } from "@metaplex-foundation/umi";
import CopyToClipboard from "react-copy-to-clipboard";
import Rings from "react-loading-icons/dist/esm/components/rings";
export default function NftCard(props: NftCardProps) {
	const { toast } = useToast();
	const { imageUrl, title, action, description, artist, candyMachine } = props;
	const [loading, setLoading] = useState<boolean>();
	const [image, setImage] = useState<string>();
	const [remainingItems, setRemItems] = useState<number>(0);
	const umi = useUmi();
	const fetchImage = async () => {
		setLoading(true);
		try {
			let response = await fetch(imageUrl!);
			response = await response.json();
			console.log("response", response);
			//@ts-ignore
			setImage(response.image);
			const candyGuard = await safeFetchCandyGuard(
				umi,
				candyMachine.mintAuthority
			);
			setRemItems(
				candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed)
			);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}

		setLoading(false);
	};
	useEffect(() => {
		fetchImage();
	}, [imageUrl]);

	const handleMint = async () => {
		setLoading(true);
		if (!action) {
			toast({
				title: "Failed to mint",
				description: `check wallet balance
				validate that you're not minting from the account that is the owner authority of the candymachine`,
			});
			setLoading(false);
			return;
		} else {
			console.log("reached here");

			try {
				const mint = await action();
				if (mint) {
					toast({
						title: `nft minted, mint address : ${mint.nft.publicKey}`,
						description: `transaction signature : ${mint.signature}`,
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="card card-bordered bg-black shadow-xl duration-200 transition-transform">
			<figure className="min-h-96 ">
				{imageUrl ? (
					<img src={image} alt="Album" className="h-full object-cover " />
				) : (
					<div className="bg-black h-full w-20"></div>
				)}
			</figure>
			<div className="card-body">
				<div className="flex flex-row justify-between">
					<h2 className="card-title uppercase font-bold">{title}</h2>
					<CopyToClipboard text={candyMachine.publicKey}>
						<button className="btn btn-ghost ">
							<IconCopy />
						</button>
					</CopyToClipboard>
				</div>
				<p className="text-xs opacity-60">{artist}</p>
				<p className="text-xs opacity-50">remaining items : {remainingItems}</p>
				<p>{description}</p>
				<div className="card-actions justify-start flex flex-col">
					<Button
						className="btn btn-primary"
						onClick={handleMint}
						disabled={loading}
					>
						License For Use
					</Button>
				</div>
				{loading && <Rings className="mx-auto my-5" />}
			</div>
		</div>
	);
}
