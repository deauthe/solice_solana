"use client";
import { useAudioPlayer } from "react-use-audio-player";
import { IconCopy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
export interface NftCardProps {
	candyMachine: CandyMachine;
	description: string;
	collectionNft: DigitalAsset;
	imageUrl?: string;
	title: string;
	artist: string;
}
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { useToast } from "../ui/use-toast";
import {
	CandyGuard,
	CandyMachine,
	safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { useUmi } from "@/providers/useUmi";
import { unwrapSome } from "@metaplex-foundation/umi";
import CopyToClipboard from "react-copy-to-clipboard";
import Rings from "react-loading-icons/dist/esm/components/rings";
import { mintNft } from "@/lib/candymachine";
export default function NftCard(props: NftCardProps) {
	const { toast } = useToast();
	const { imageUrl, title, description, artist, candyMachine, collectionNft } =
		props;
	const [loading, setLoading] = useState<boolean>();
	const [image, setImage] = useState<string>();
	const [remainingItems, setRemItems] = useState<number>(0);
	const [candyGuard, setGuard] = useState<CandyGuard>();
	const umi = useUmi();
	const fetchImage = async () => {
		setLoading(true);
		try {
			let response = await fetch(imageUrl!);
			response = await response.json();
			console.log("response", response);
			//@ts-ignore
			setImage(response.image);
			// const candyGuard = await safeFetchCandyGuard(
			// 	umi,
			// 	candyMachine.mintAuthority
			// );
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
		if (remainingItems <= 0) {
			toast({
				title: "no more licenses for this are availble",
			});
		}

		console.log("reached here");

		try {
			const mint = await mintNft({
				candyMachine: candyMachine,
				collectionNftPublicKey: collectionNft.metadata.mint,
				collectionNftUpdateAuthority: collectionNft.metadata.updateAuthority,
				umi,
			});
			console.log("reached past minting");

			if (mint) {
				toast({
					title: `nft minted, mint address : ${mint.nft.publicKey}`,
					description: `transaction signature : ${mint.signature}`,
				});
			}
		} catch (error) {
			console.log(error);
			toast({
				title: `nft mint failed`,
				description: `check wallet balance
					validate that you're not minting from the account that is the owner authority of the candymachine`,
			});
		} finally {
			setLoading(false);
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
					<div className="">
						<CopyToClipboard text={candyMachine.publicKey}>
							<button className="btn btn-ghost ">
								cm <IconCopy />
							</button>
						</CopyToClipboard>
						<CopyToClipboard text={candyGuard?.publicKey || "undefined"}>
							<button className="btn btn-ghost ">
								guard: <IconCopy />
							</button>
						</CopyToClipboard>
					</div>
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
