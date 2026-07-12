import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a memory buffer stream directly to Cloudinary.
 * @param {Buffer} fileBuffer 
 * @param {String} folder 
 * @returns {Promise<{url: String, publicId: String}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'mhatre_traders') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image asset from Cloudinary.
 * @param {String} publicId 
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error.message);
    throw error;
  }
};
