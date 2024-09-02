"use client";

import { addItemsToCandyMachine, uploadJsonFile } from "@/lib/candymachine";
import { useUmi } from "@/providers/useUmi";
import { fetchCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Rings } from "react-loading-icons";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import { title } from "process";

interface AddItemsFormProps {
	CmPubKey?: PublicKey;
}
interface AddItemFormValues {
	cmPubkey: string;
	name: string;
	description: string;
	image: File;
}

export default function AddItemsForm({ CmPubKey }: AddItemsFormProps) {
	// Initialize the form
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
		getValues,
	} = useForm<AddItemFormValues>({
		defaultValues: {
			name: "My NFT #2",
			description: "This Is My Nft Part 2",
			cmPubkey: CmPubKey ? CmPubKey : "",
		},
	});

	const umi = useUmi();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingMessage, setLoadingMessage] = useState<string>();
	const { toast } = useToast();
	const router = useRouter();

	const addItemHandler = async () => {
		try {
			setLoading(true);
			let { cmPubkey, description, image, name } = getValues();
			setLoadingMessage("fetching candyMachine");

			const fetchedCandyMachine = await fetchCandyMachine(
				umi,
				publicKey(cmPubkey)
			);
			setLoadingMessage(
				`adding items, candy machine length:${fetchedCandyMachine.items.length}`
			);

			const { jsonUri } = await uploadJsonFile({
				description,
				//@ts-ignore
				image: image,
				name,
				umi,
			});

			await addItemsToCandyMachine({
				candyMachine: fetchedCandyMachine,
				configLines: [
					{
						name: name,
						uri: jsonUri,
					},
				],
				items: 1,
				umi,
				index: fetchedCandyMachine.itemsLoaded,
			});
			toast({
				title: "succesfully initiated transaction",
			});
			setLoadingMessage("");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setLoadingMessage("");
			toast({
				title: "failed to add the item",
			});
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit(addItemHandler)} className="space-y-4">
			<h1 className="text-2xl text-left font-extrabold uppercase tracking-tight">
				Add Items to Collection
			</h1>
			<p className="opacity-60 pr-20 text-xs">
				If you wish to keep similar metadata for all nfts in your candy machine,
				just run the below transaction as many times as the limit of your
				candymachine Items. Elsewise, you can upload multiple images maybe for
				the reason that you want to be able to distinguish each one to see if
				the person actually owns the license
			</p>
			<div>
				<Label htmlFor="cmPubkey">Candy Machine Public Key</Label>
				<Input {...register("cmPubkey", { required: true })} id="cmPubkey" />
				{errors.cmPubkey && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="description">Description</Label>
				<Input {...register("description", { required: true })} id="name" />
				{errors.description && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="image">Image</Label>
				<Input
					{...register("image", { required: true })}
					id="image"
					type="file"
					className="file:bg-primary file:px-2 file:rounded-full file:text-center file:hover:cursor-pointer file:hover:scale-105 file:transition-all file:duration-300"
				/>
				{errors.image && <span>This field is required</span>}
			</div>
			<div>
				<Label htmlFor="name">Name</Label>
				<Input {...register("name", { required: true })} id="owner" />
				{errors.name && <span>This field is required</span>}
			</div>
			<div className="flex flex-row gap-5 items-center ">
				<Button
					type="submit"
					className=" bg-blue-500 text-white py-2 px-4 rounded"
					disabled={!isValid || loading}
				>
					Add Item
				</Button>
				<div className="flex flex-row gap-10 items-center">
					{loading && <Rings />}
					{loadingMessage && (
						<span className="text-sm opacity-70">{loadingMessage} ...</span>
					)}{" "}
				</div>
			</div>{" "}
		</form>
	);
}
