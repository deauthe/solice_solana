"use client";
import { fetchAllCandyMachinesFromDb } from "@/app/actions/candymachineActions";
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
		console.log(candyMachines.length);

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
				const action = async () => {
					const mint = await mintNft({
						candyMachine: fetchedCandyMachine,
						collectionNftPublicKey: collectionNft.metadata.mint,
						collectionNftUpdateAuthority:
							collectionNft.metadata.updateAuthority,
						umi,
					});
					console.log("reached past minting");

					if (mint) {
						const nft = mint.nft;
						const signature = mint.signature;
						return { nft, signature };
					} else {
						return;
					}
				};

				// Return the NFT information
				return {
					candyMachine: fetchedCandyMachine,
					description: collectionNft.metadata.symbol,
					title: cm.machineName,
					artist: cm.artistName,
					imageUrl: imageUri,
					action,
				} as NftCardProps;
			})
		);
		console.log("discover :", nfts);

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
