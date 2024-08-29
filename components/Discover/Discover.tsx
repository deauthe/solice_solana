"use client";
import { fetchAllCandyMachinesFromDb } from "@/app/actions/candymachineActions";
import TrackGallery from "../Gallery/Gallery";
import { staticTracks } from "./staticTracks";
import {
	CandyMachine,
	fetchAllCandyMachine,
	fetchCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { useEffect, useState } from "react";
import { useUmi } from "@/providers/useUmi";
import { validatePubkey } from "@/lib/form";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import { NftCardProps } from "../NftCard/NftCard";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { mintNft } from "@/lib/candymachine";

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

				// Get the image URI from the metadata
				const imageUri = collectionNft.metadata.uri;

				const action = () => {
					console.log("somethings running");

					mintNft({
						candyMachine: fetchedCandyMachine,
						collectionNftPublicKey: collectionNft.metadata.mint,
						collectionNftUpdateAuthority:
							collectionNft.metadata.updateAuthority,
						umi,
					});
				};
				console.log("from", typeof action);

				// Return the NFT information
				return {
					title: cm.machineName,
					artist: cm.artistName,
					imageUrl: imageUri,
					action,
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
			{!nfts || nfts.length == 0 ? (
				<TrackGallery nfts={staticTracks} />
			) : (
				<TrackGallery nfts={nfts!} />
			)}
		</div>
	);
}
