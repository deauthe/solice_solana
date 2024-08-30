import Discover from "@/components/Discover/Discover";
import Hero from "@/components/Hero/Hero";
import Image from "next/image";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<Hero />
			<div className="p-24 w-full ">
				<Discover />
			</div>
		</main>
	);
}
