



// Helper function to delete Cloudinary file
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error(`Failed to delete Cloudinary resource: ${err.message}`);
    }
};