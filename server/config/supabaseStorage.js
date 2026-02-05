const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET;

if (!supabaseUrl || !supabaseServiceRoleKey || !bucketName) {
  throw new Error("Supabase URL, Service Role Key, and Storage Bucket name must be provided in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Uploads an image buffer to Supabase Storage.
 * @param {Buffer} fileBuffer - The image file buffer.
 * @param {string} fileName - The desired filename for the uploaded file.
 * @param {string} mimeType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
const uploadImage = async (fileBuffer, fileName, mimeType) => {
  try {
    console.log('Uploading image to Supabase:', { fileName, mimeType, fileSize: fileBuffer.length });
    
    // Construct a unique path for the image to avoid overwrites
    const filePath = `public/${fileName}`;

    const { data, error } = await supabase.storage // data: Contains successful upload metadata
      .from(bucketName) // Identifies the specific storage bucket in Supabase where the file will be stored
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600', // Cache for 1 hour
        upsert: false, // Do not overwrite if a file with the same name somehow exists
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error);
      throw new Error(`Failed to upload image to Supabase: ${error.message}`);
    }

    console.log('Image uploaded successfully to Supabase:', data);

// Get the public URL for the uploaded file
    const { data: publicData, error: publicError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (publicError || !publicData?.publicUrl) {
      console.error('Supabase Storage Public URL Error:', publicError || 'publicUrl is undefined');
      // Attempt to clean up the uploaded file if we can't get its public URL
      await supabase.storage.from(bucketName).remove([filePath]);
      throw new Error(`Failed to get public URL from Supabase: ${publicError?.message || 'publicUrl is undefined'}`);
    }
    
    console.log('Public URL generated:', publicData.publicUrl);
    return publicData.publicUrl; // Return the URL string directly
  } catch (error) {
    console.error('Upload Image Function Error:', error);
    throw error;
  }
};

/**
 * Deletes an image from Supabase Storage using its public URL.
 * @param {string} imageUrl - The full public URL of the image to delete.
 */
const deleteImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes(supabaseUrl)) {
    console.warn(`Invalid or non-Supabase imageUrl provided for deletion: ${imageUrl}`);
    return;
  }

  try {
    console.log('Deleting image from Supabase:', imageUrl);
    
    // Extract the path from the full public URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    
    // Expected path segments: ['', 'storage', 'v1', 'object', 'public', BUCKET_NAME, ...filePath]
    if (pathSegments.length < 7 || pathSegments[4] !== 'public' || pathSegments[5] !== bucketName) {
        console.error(`Could not parse Supabase imageUrl to get path for deletion: ${imageUrl}`);
        return;
    }
    const filePathToDelete = pathSegments.slice(6).join('/'); // Joins everything after the bucket name

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePathToDelete]);

    if (error) {
      console.error(`Supabase Storage Deletion Error for ${filePathToDelete}:`, error);
      // Depending on requirements, you might want to throw this error
      // For now, we'll just log it, as the main recipe operation might have succeeded.
    } else {
      console.log(`Successfully deleted ${filePathToDelete} from Supabase Storage.`);
    }
  } catch (err) {
    console.error('Error parsing imageUrl for Supabase deletion:', err);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};