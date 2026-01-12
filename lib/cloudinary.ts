import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'sports-platform',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url || '');
            }
        ).end(buffer);
    });
}

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export function getPublicIdFromUrl(url: string): string | null {
    const match = url.match(/sports-platform\/([^.]+)/);
    return match ? `sports-platform/${match[1]}` : null;
}

export default cloudinary;
