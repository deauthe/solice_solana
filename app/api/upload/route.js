import cloudinary from "@/lib/cloudinary";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { image } = req.body;

		try {
			// Upload image to Cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image, {
				folder: "your-folder-name", // optional: specify a folder in your Cloudinary account
			});

			res.status(200).json({ url: uploadResponse.secure_url });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Image upload failed" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
