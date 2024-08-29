"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Rings } from "react-loading-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useUmi } from "@/providers/useUmi";
import { useRouter } from "next/navigation";

import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
	addItemsToCandyMachine,
	createCandyMachine,
	createCollectionNft,
	uploadJsonFile,
} from "@/lib/candymachine";
import {
	CandyMachineItem,
	Creator,
	fetchCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { validatePubkey } from "@/lib/form";
import { PublicKey } from "@metaplex-foundation/umi";
import Image from "next/image";
import { addCandyMachine } from "@/app/actions/candymachineActions";

export interface CreateFormValues {
	artistDisplayName: string;
	audioFile: File;
	collectionNftImage: File;
	sellerFeeBasisPoints: number;
	collectionName: string;
	totalItems: number;
}
interface CandyMachineDetails {
	publicKey: PublicKey;
	authority: PublicKey;
	collectionMint: PublicKey;
	totalItems: CandyMachineItem[];
	loadedItems: number;
}
interface CollectionNftDetails {
	collectionMint: PublicKey;
	collectionJsonUri: string;
	image: string;
	audioUri: string;
}

const CreateCandyMachineForm = () => {
	// Initialize the form
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
		getValues,
	} = useForm<CreateFormValues>({
		defaultValues: {
			sellerFeeBasisPoints: 5,
			collectionName: "tea",
			totalItems: 2,
		},
	});

	const umi = useUmi();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingMessage, setLoadingMessage] = useState<string>();
	const [CmId, setCmId] = useState<PublicKey>();
	const [CMDetails, setCMDetails] = useState<CandyMachineDetails>();
	const [collectionNFt, setCollecitonNft] = useState<CollectionNftDetails>();
	const toast = useToast();
	const router = useRouter();

	const createCandyMachineHandler = async () => {
		const {
			collectionNftImage,
			audioFile,
			collectionName,
			artistDisplayName,
			sellerFeeBasisPoints,
			totalItems,
		} = getValues();
		setLoading(true);
		console.log(collectionNftImage);

		try {
			const {
				jsonUri: collectionJsonUri,
				audioUri,
				fileUri,
			} = await uploadJsonFile({
				//@ts-ignore
				audioFile,
				description: "this is #1",
				//@ts-ignore
				image: collectionNftImage,
				name: "my nFt",
				umi,
			});
			console.log(collectionJsonUri);

			const { createCollectionNftTx, collectionMint } = createCollectionNft({
				name: getValues("collectionName"),
				sellerFeeBasisPoint: sellerFeeBasisPoints,
				umi,
				uri: collectionJsonUri,
			});

			setCollecitonNft({
				collectionMint: collectionMint.publicKey,
				collectionJsonUri,
				image: fileUri,
				audioUri,
			});

			const creator: Creator = {
				address: umi.identity.publicKey,
				percentageShare: 100,
				verified: true,
			};
			setLoadingMessage("creating candy machine and setting collection nfts");
			const { Tx: createCandyMachineTx, candyMachine } =
				await createCandyMachine({
					collectionMintPubKey: collectionMint.publicKey,
					creators: [creator],
					isCollection: true,
					sellerFeeBasisPoint: sellerFeeBasisPoints,
					tokenStandard: TokenStandard.NonFungible,
					totalItems: totalItems,
					umi,
				});

			const { result, signature } = await createCollectionNftTx
				.add(createCandyMachineTx)
				.sendAndConfirm(umi);

			console.log(result, signature, candyMachine);
			setCmId(candyMachine.publicKey);
			setLoadingMessage("registering candy machine off-chain");
			//storing details off-chain
			if (!candyMachine.publicKey)
				throw new Error("could not get candy machine's address");
			try {
				addCandyMachine({
					address: candyMachine.publicKey!,
					artistName: artistDisplayName,
					machineName: collectionName,
					wallet: umi.identity.publicKey,
				});
			} catch (error) {
				toast.toast({
					title: "failed at registering candymachine off-chain ",
				});
			}

			try {
				setLoadingMessage("fetching candyMachine")
				const fetchedCandyMachine = await fetchCandyMachine(umi,candyMachine.publicKey)
				addItemsToCandyMachine({
					candyMachine,
					configLines:
				})
			} catch (error) {
				
			}
			toast.toast({
				title: "successfully made candymachine at address: ",
				description: candyMachine.publicKey.toString(),
			});

			try {
			} catch (error) {}
		} catch (error) {
			setLoading(false);
			console.log(error);
			toast.toast({
				title: "failed at creating candymachine",
			});
			alert(error);
			return;
		}

		setLoading(false);
	};

	useEffect(() => {
		if (!CmId) return;
		if (validatePubkey(CmId || "")) {
			const candyMachine = fetchCandyMachine(umi, CmId);
			candyMachine.then((c) => {
				setCMDetails({
					authority: c.authority,
					collectionMint: c.collectionMint,
					totalItems: c.items,
					loadedItems: c.itemsLoaded,
					publicKey: c.publicKey,
				});
			});
		}
	}, [CmId, umi]);

	return (
		<form
			onSubmit={handleSubmit(createCandyMachineHandler)}
			className="space-y-4"
		>
			<div>
				<Label htmlFor="ArtistDisplayName">Artist Display Name</Label>
				<Input
					{...register("artistDisplayName", { required: true })}
					id="ArtistDisplayName"
				/>
				{errors.artistDisplayName && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="collectionName">Collection Name</Label>
				<Input {...register("collectionName", { required: true })} id="name" />
				{errors.collectionName && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="sellerFeeBasisPoints">seller Fee Basis Points</Label>
				<Input
					{...register("sellerFeeBasisPoints", { required: true })}
					id="uri"
					type="number"
				/>
				{errors.sellerFeeBasisPoints && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="totalItems">Total Items</Label>
				<Input {...register("totalItems", { required: true })} id="owner" />
				{errors.totalItems && <span>This field is required</span>}
			</div>
			{/* Conditionally render fields based on the collection type */}
			<div>
				<Label htmlFor="audioFile">Audio File</Label>
				<Input
					{...register("audioFile", { required: true })}
					id="audioFile"
					type="file"
					className="file:bg-primary file:px-2 file:rounded-full file:text-center file:hover:cursor-pointer file:hover:scale-105 file:transition-all file:duration-300"
				/>
				{errors.audioFile && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="">collectionNftImage</Label>
				<Input
					{...register("collectionNftImage", { required: true })}
					id="collectionNftImage"
					type="file"
					className="file:bg-primary file:px-2 file:rounded-full file:text-center file:hover:cursor-pointer file:hover:scale-105 file:transition-all file:duration-300"
				/>
				{errors.collectionNftImage && <span>This field is required</span>}
			</div>
			<div className="flex flex-row gap-5 items-center ">
				<Button
					type="submit"
					className=" bg-blue-500 text-white py-2 px-4 rounded"
					disabled={!isValid || loading}
				>
					Create Candy Machine
				</Button>
				<div className="flex flex-row gap-10">
					{loading && <Rings />}
					{loadingMessage && loadingMessage}
				</div>
			</div>{" "}
			<div className="grid grid-cols-1 lg:grid-cols-2  gap-3">
				{CMDetails && (
					<div className="flex flex-col gap-5">
						<span className="text-2xl font-bold text-secondary">
							Candy Machine Details
						</span>
						<div className="flex flex-col">
							<span className="text-primary font-semibold">Public Key</span>
							<div
								className="btn btn-outline btn-ghost"
								onClick={() => {
									router.push(
										`https://explorer.solana.com/address/${CMDetails.publicKey}?cluster=devnet`
									);
								}}
							>
								{CMDetails.publicKey}
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-primary font-semibold">Authority</span>
							<div className="btn btn-outline btn-ghost">
								{CMDetails.authority}
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-primary font-semibold">
								Collection Nft minted address
							</span>
							<div className="btn btn-outline btn-ghost">
								{CMDetails.collectionMint}
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-primary font-semibold">Loaded Items</span>
							<div className="btn btn-outline btn-ghost">
								{CMDetails.loadedItems}
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-primary font-semibold">Total Items</span>
							<div className="btn btn-outline btn-ghost">
								{CMDetails.totalItems.length}
							</div>
						</div>
					</div>
				)}
				{collectionNFt && (
					<div className="flex flex-col gap-5 ">
						<span className="text-2xl font-bold text-secondary">
							Collection NFT Details
						</span>
						<div className="flex flex-col ">
							<span className="font-semibold text-primary ">Public Key</span>
							<div
								className="btn btn-outline btn-ghost"
								onClick={() => {
									router.push(
										`https://explorer.solana.com/address/${collectionNFt.collectionMint}?cluster=devnet`
									);
								}}
							>
								{collectionNFt.collectionMint}
							</div>
						</div>
						<div className="flex flex-col ">
							<span className="font-semibold text-primary ">
								collectionJsonUri
							</span>
							<div className="btn btn-outline btn-ghost">
								{collectionNFt.collectionJsonUri}
							</div>
						</div>
						<div className="flex flex-col ">
							<span className="font-semibold text-primary ">Image Uri</span>
							<div className="btn btn-outline btn-ghost">
								{collectionNFt.image}
							</div>
						</div>
						<div className="flex flex-col ">
							<span className="font-semibold text-primary ">Audio Uri</span>
							<div className="btn btn-outline btn-ghost">
								{collectionNFt.audioUri}
							</div>
						</div>
					</div>
				)}
			</div>
		</form>
	);
};

export default CreateCandyMachineForm;
