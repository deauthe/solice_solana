"use client";
import { useAudioPlayer } from "react-use-audio-player";

import { useEffect } from "react";
export interface NftCardProps {
	id: string;
	imageUrl?: string;
	title: string;
	artist: string;
	action: () => void;
}
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { Button } from "../ui/button";
export default function NftCard(props: NftCardProps) {
	const { imageUrl, title, action } = props;
	console.log(typeof action);

	return (
		<div className="card card-bordered bg-black shadow-xl">
			<figure className="min-h-96 ">
				{imageUrl ? (
					<img src={imageUrl} alt="Album" className="h-full object-cover " />
				) : (
					<div className="bg-black h-full w-20"></div>
				)}
			</figure>
			<div className="card-body">
				<h2 className="card-title uppercase font-bold">{title}</h2>

				<div className="card-actions justify-start flex flex-col">
					<Button className="btn btn-primary" onClick={action}>
						License For Use
					</Button>
				</div>
			</div>
		</div>
	);
}
