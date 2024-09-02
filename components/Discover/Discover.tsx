"use client";
import { fetchAllCandyMachinesFromDb } from "@/actions/candymachineActions";
import TrackGallery from "../Gallery/Gallery";
import {
	CandyMachine,
	fetchAllCandyMachine,
	fetchCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { useEffect, useState } from "react";
import { useUmi } from "@/providers/useUmi";
import { PublicKey } from "@metaplex-foundation/umi";
import { NftCardProps } from "../NftCard/NftCard";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { mintNft } from "@/lib/candymachine";
import { ThreeDots } from "react-loading-icons";
export default function Discover() {
	const [nfts, setNfts] = useState<NftCardProps[]>();
	const umi = useUmi();
	const fetchCandyMachines = async () => {
		const candyMachines = await fetchAllCandyMachinesFromDb();
		// Fetch the candy machine and their associated NFT metadata in parallel
		const nfts: (NftCardProps | null)[] = await Promise.all(
			candyMachines.map(async (cm, i) => {
				// Fetch the candy machine details
				const fetchedCandyMachine = await fetchCandyMachine(
					umi,
					cm.address as PublicKey
				);

				const collectionMint = fetchedCandyMachine.collectionMint;
				if (!collectionMint) return null;

				// Fetch the digital asset (NFT) associated with the collection mint
				const collectionNft = await fetchDigitalAsset(umi, collectionMint);

				// Return the NFT information
				return {
					candyMachine: fetchedCandyMachine,
					title: cm.machineName,
					artist: cm.artistName,
					collectionNft: collectionNft,
				} as NftCardProps;
			})
		);

		// Filter out any null results and update the state
		setNfts(nfts.filter((nft): nft is NftCardProps => nft !== null));
	};

	useEffect(() => {
		fetchCandyMachines();
	}, []);

	return (
		<div className="w-full h-full p-4 ">
			<h1 className="text-4xl font-extrabold mb-10 tracking-tight text-center text-primary">
				Get licenses
			</h1>
			{!nfts || nfts.length == 0 ? (
				<ThreeDots className="mx-auto my-20" />
			) : (
				<TrackGallery nfts={nfts!} />
			)}
		</div>
	);
}
