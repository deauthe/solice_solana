"use client";
import NftCard, { NftCardProps } from "../NftCard/NftCard";

export interface GalleryProps {
	nfts: NftCardProps[];
}

export default function Gallery(props: GalleryProps) {
	const { nfts } = props;
	console.log(typeof nfts[0].action);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
			{nfts.map((nft) => (
				<div key={nft.id}>
					<NftCard {...nft} />
				</div>
			))}
		</div>
	);
}
