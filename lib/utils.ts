import { Umi } from "@metaplex-foundation/umi";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export async function getCachedImageUrl(umi: Umi, uri: string) {
	try {
		const [file1] = await umi.downloader.download([uri]);
		const file = file1;
		const blob = new Blob([file.buffer], { type: file.extension! }); // Assuming `file.data` contains the raw data and `file.mimeType` is the MIME type
		const dataURL = await blobToDataURL(blob);
		return dataURL;
	} catch (error) {
		console.error("Error displaying cached image:", error);
	}
}

function blobToDataURL(blob: Blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
