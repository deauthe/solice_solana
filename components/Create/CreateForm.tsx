"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import {
	generateSigner,
	publicKey,
	transactionBuilder,
} from "@metaplex-foundation/umi";
import {
	createCollection,
	create,
	CollectionV1,
	fetchCollectionV1,
	OracleInitInfoArgs,
} from "@metaplex-foundation/mpl-core";
import { useUmi } from "@/providers/useUmi";

export interface CreateFormValues {
	collection: "None" | "New" | "Existing";
	name: string;
	uri: string;
	owner: string;
	collectionName: string;
	collectionUri: string;
	collectionAddress: string;
}
import { base58 } from "@metaplex-foundation/umi/serializers";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

const CreateForm = () => {
	// Initialize the form
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
		getValues,
	} = useForm<CreateFormValues>();
	const [metadataPreview, setMetadataPreview] = useState<any>(null);
	const [collectionPreview, setCollectionPreview] = useState<any>(null);
	const umi = useUmi();
	const { toast } = useToast();

	// Handle form submission
	const onSubmit: SubmitHandler<CreateFormValues> = (data) => {
		console.log("Form Data:", data);
		// Handle form submission logic here
	};
	// Watch the collection type to conditionally render fields
	const collectionType = watch("collection");

	const { uri, collection, collectionUri } = getValues();

	useEffect(() => {
		if (uri) {
			try {
				// eslint-disable-next-line no-new
				new URL(uri);
				const doIt = async () => {
					const j = await (await fetch(uri)).json();
					setMetadataPreview(j);
				};
				doIt();
			} catch (e) {
				setMetadataPreview(null);
			}
		}
	}, [uri, setMetadataPreview]);

	useEffect(() => {
		if (collectionUri) {
			try {
				// eslint-disable-next-line no-new
				new URL(collectionUri);
				const doIt = async () => {
					const j = await (await fetch(collectionUri)).json();
					setCollectionPreview(j);
				};
				doIt();
			} catch (e) {
				setCollectionPreview(null);
			}
		}
	}, [collectionUri, setCollectionPreview]);

	const handleCreate = useCallback(async () => {
		try {
			const { name, collectionName } = getValues();
			const collectionSigner = generateSigner(umi);
			let txBuilder = transactionBuilder();
			let collectionPartial: Partial<CollectionV1> = {
				publicKey: collectionSigner.publicKey,
			};
			if (collection === "New") {
				txBuilder = txBuilder.add(
					createCollection(umi, {
						name: collectionName,
						uri: collectionUri,
						collection: collectionSigner,
						//TODO: add plugins
					})
				);
				// create a collection with the right plugin configuration to derive any extra accounts
				// collectionPartial.oracles = cPlugins
				// 	.filter((p) => p.type === "Oracle")
				// 	.map((p) => {
				// 		const o = p as OracleInitInfoArgs;
				// 		return {
				// 			...o,
				// 			type: "Oracle",
				// 			authority: { type: "None" },
				// 			resultsOffset: o.resultsOffset || {
				// 				type: "Anchor",
				// 			},
				// 		};
				// 	});
			} else if (collection === "Existing") {
				collectionPartial = await fetchCollectionV1(
					umi,
					publicKey(getValues("collectionAddress"))
				);
			}

			const assetAddress = generateSigner(umi);
			txBuilder = txBuilder.add(
				create(umi, {
					name,
					uri,
					collection:
						collection === "None"
							? undefined
							: (collectionPartial as CollectionV1),
					asset: assetAddress,
					owner: getValues("owner") ? publicKey(getValues("owner")) : undefined,
					//TODO: add plugins
				})
			);

			const res = await txBuilder.sendAndConfirm(umi);
			const sig = base58.deserialize(res.signature)[0];

			console.log(sig);
			toast({
				title: "Asset created",
				description: `Transaction: ${sig}`,
			});
		} catch (e) {
			toast({
				title: "some error occured",
				description: String(e),
			});
		}
	}, [umi]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="flex flex-col gap-2 ">
				<Label htmlFor="collection">Collection Type</Label>
				<select
					{...register("collection", { required: true })}
					id="collection"
					className="select select-ghost select-bordered max-w-44"
				>
					<option value="None">None</option>
					<option value="New">New</option>
					<option value="Existing">Existing</option>
				</select>
				{errors.collection && (
					<span className="text-xs text-warning bg-black">
						This field is required
					</span>
				)}
			</div>

			<div>
				<Label htmlFor="name">Name</Label>
				<Input {...register("name", { required: true })} id="name" />
				{errors.name && <span>This field is required</span>}
			</div>

			<div>
				<Label htmlFor="uri">URI</Label>
				<Input {...register("uri", { required: true })} id="uri" />
				{errors.uri && <span>This field is required</span>}
			</div>

			<div>
				<Label htmlFor="owner">Owner</Label>
				<Input {...register("owner", { required: true })} id="owner" />
				{errors.owner && <span>This field is required</span>}
			</div>

			{/* Conditionally render fields based on the collection type */}
			{collectionType === "New" && (
				<>
					<div>
						<Label htmlFor="collectionName">Collection Name</Label>
						<Input
							{...register("collectionName", { required: true })}
							id="collectionName"
						/>
						{errors.collectionName && <span>This field is required</span>}
					</div>

					<div>
						<Label htmlFor="collectionUri">Collection URI</Label>
						<Input
							{...register("collectionUri", { required: true })}
							id="collectionUri"
						/>
						{errors.collectionUri && <span>This field is required</span>}
					</div>
				</>
			)}

			{collectionType === "Existing" && (
				<div>
					<Label htmlFor="collectionAddress">Collection Address</Label>
					<Input
						{...register("collectionAddress", { required: true })}
						id="collectionAddress"
					/>
					{errors.collectionAddress && <span>This field is required</span>}
				</div>
			)}

			<Button
				type="submit"
				className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
				disabled={!isValid}
				onClick={handleCreate}
			>
				Create Asset
			</Button>
		</form>
	);
};

export default CreateForm;
