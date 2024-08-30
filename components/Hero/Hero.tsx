import Link from "next/link";
import React from "react";

const Hero = () => {
	return (
		<div
			className="hero min-h-screen"
			style={{
				backgroundImage: "url(/hero.jpg)",
			}}
		>
			<div className="hero-overlay bg-opacity-60"></div>
			<div className="hero-content  text-center bg-primary bg-opacity-60 p-10 rounded-lg text-white">
				<div className="max-w-md">
					<h1 className="mb-5 text-4xl font-extrabold tracking-tighter uppercase text-nowrap">
						Welcome to Solice
					</h1>
					<p className="mb-5 px-20">
						Buy Standard, Usage or Creative Common license for artwork
					</p>
					<p className="mb-5 opacity-40 text-sm">Coming soon for Music</p>
					<div className="flex flex-row gap-5 mx-auto w-fit">
						<Link href={"/create"} className="btn btn-secondary rounded-full ">
							Create
						</Link>
						<Link href={"/#buy"} className="btn btn-accent rounded-full">
							Buy
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
