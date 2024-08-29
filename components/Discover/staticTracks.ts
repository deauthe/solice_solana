"use client";
import { NftCardProps } from "@/components/NftCard/NftCard";

export const staticTracks: NftCardProps[] = [
	{
		title: "Track 1",
		artist: "Artist 1",

		action: () => {},

		description: "This is a description of the track",
		id: "1",
		imageUrl: "https://via.placeholder.com/900",
	},
	{
		title: "Track 2",
		artist: "Deauth",
		action: () => {},

		description: "This is a description of the track",
		id: "2",
		imageUrl: "https://via.placeholder.com/900",
	},
];
