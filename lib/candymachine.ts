import {
	generateSigner,
	PublicKey,
	transactionBuilder,
	Umi,
	percentAmount,
	some,
	createGenericFileFromBrowserFile,
	sol,
} from "@metaplex-foundation/umi";
import {
	addConfigLines,
	CandyMachine,
	create,
	Creator,
	fetchCandyGuard,
	mintV2,
} from "@metaplex-foundation/mpl-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
	createNft,
	TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

interface MintCmProps {
	umi: Umi;
	candyMachine: CandyMachine;
	collectionNftPublicKey: PublicKey;
	collectionNftUpdateAuthority: PublicKey;
}
export async function mintNft(props: MintCmProps) {
	const {
		umi,
		candyMachine,
		collectionNftPublicKey,
		collectionNftUpdateAuthority,
	} = props;
	console.log(
		candyMachine,
		collectionNftPublicKey,
		collectionNftUpdateAuthority,
		"hello"
	);
	const nftMint = generateSigner(umi);
	try {
		await transactionBuilder()
			.add(setComputeUnitLimit(umi, { units: 800_000 }))
			.add(
				mintV2(umi, {
					candyMachine: candyMachine.publicKey,
					nftMint,
					payer: umi.identity,
					collectionMint: collectionNftPublicKey,
					collectionUpdateAuthority: collectionNftUpdateAuthority,
					tokenStandard: candyMachine.tokenStandard,
				})
			)
			.sendAndConfirm(umi);
		//Note that the mintV2 instruction takes care of creating the Mint and Token accounts for us by default and will set the NFT owner to the minter.
	} catch (error) {
		console.log(error);
	}
}

interface CreateCollectionNftProps {
	umi: Umi;
	name: string;
	uri: string;
	sellerFeeBasisPoint: number;
}

export function createCollectionNft(props: CreateCollectionNftProps) {
	const { umi, name, uri, sellerFeeBasisPoint } = props;
	const collectionMint = generateSigner(umi);
	const createCollectionNftTx = createNft(umi, {
		mint: collectionMint,
		authority: umi.identity,
		name,
		uri,
		sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoint, 2),
		isCollection: true,
	});
	return { createCollectionNftTx, collectionMint };
}

interface CreateCandyMachineProps {
	umi: Umi;
	sellerFeeBasisPoint: number;
	isCollection: boolean;
	collectionMintPubKey: PublicKey;
	tokenStandard: TokenStandard;
	totalItems: number;
	creators: Creator[];
	config?: {
		prefixName?: string;
		nameLength?: number;
		prefixUri?: string;
		uriLength?: number;
		isSequential?: boolean;
	};
}

export async function createCandyMachine(props: CreateCandyMachineProps) {
	const {
		umi,
		sellerFeeBasisPoint,
		isCollection,
		collectionMintPubKey,
		tokenStandard,
		totalItems,
		creators,
		config,
	} = props;
	const candyMachine = generateSigner(umi);
	const Tx = await create(umi, {
		candyMachine,
		collectionMint: collectionMintPubKey,
		collectionUpdateAuthority: umi.identity,
		tokenStandard,
		sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoint, 2), // 9.99%
		itemsAvailable: totalItems,
		creators,
		guards: {
			solPayment: some({
				lamports: sol(1.5),
				destination: umi.identity.publicKey,
			}),
		},
		configLineSettings: some({
			prefixName: config?.prefixName || "",
			nameLength: config?.nameLength || 32,
			prefixUri: config?.prefixName || "",
			uriLength: config?.uriLength || 200,
			isSequential: config?.isSequential || false,
		}),
	});

	return { Tx, candyMachine };

	//to get candymachine's items : candyMachine = await fetchCandyAMchine(umi, candyMachineAddress);
	// candyGuard = await fetchCandyGuard(umi,candyMachine.mintAuthority)
}

interface UploadJsonFileProps {
	image: File[]; //the browser always takes file input in an array
	umi: Umi;
	name: string;
	description: string;
}
export const uploadJsonFile = async (props: UploadJsonFileProps) => {
	const { image, umi, name, description } = props;
	//use irys uploader in umi provider
	const file = await createGenericFileFromBrowserFile(image[0]);
	const [fileUri] = await umi.uploader.upload([file]);

	const jsonUri = await umi.uploader.uploadJson({
		name,
		description,
		image: fileUri,
	});
	console.log("uploaded assets", fileUri);

	return { jsonUri, fileUri };
};

export interface CandyMachineItem {
	name: string;
	uri: string;
}

interface AddItemsToCandyMachineWithUriProps {
	umi: Umi;
	candyMachine: CandyMachine;
	index?: number;
	configLines: CandyMachineItem[];
}

export const addItemsToCandyMachineWithUri = async (
	props: AddItemsToCandyMachineWithUriProps
) => {
	const { umi, candyMachine, index, configLines } = props;
	console.log(umi.rpc.getEndpoint());

	const { signature, result } = await addConfigLines(umi, {
		candyMachine: candyMachine.publicKey,
		index: index ? index : candyMachine.itemsLoaded,
		configLines,
	}).sendAndConfirm(umi);

	return { signature, result };
};

interface AddItemsToCandyMachineProps {
	items: number;
	umi: Umi;
	candyMachine: CandyMachine;
	index?: number;
	configLines: CandyMachineItem[];
}

export const addItemsToCandyMachine = async (
	props: AddItemsToCandyMachineProps
) => {
	const { umi, candyMachine, index, configLines } = props;
	const { signature, result } = await addConfigLines(umi, {
		candyMachine: candyMachine.publicKey,
		index: index ? index : candyMachine.itemsLoaded,
		configLines,
	}).sendAndConfirm(umi);

	return { signature, result };
};
