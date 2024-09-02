"use client";
import NftCard, { NftCardProps } from "../NftCard/NftCard";

export interface GalleryProps {
	nfts: NftCardProps[];
}

export default function Gallery(props: GalleryProps) {
	const { nfts } = props;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
			{nfts.map((nft, index) => (
				<div key={index}>
					<NftCard key={index} {...nft} />
				</div>
			))}
		</div>
	);
}
