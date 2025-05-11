/**
 * Client-side utility for uploading images to Cloudinary via the API
 */

import { getAuth } from 'firebase/auth';

/**
 * Upload a file to Cloudinary through our API route
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} The upload result containing secure URL and public ID
 */
export async function uploadFileToCloudinary(file) {
  console.log('uploadFileToCloudinary called with file:', file);
  
  if (!file) {
    console.error('No file provided to uploadFileToCloudinary');
    throw new Error('No file provided');
  }

  try {
    // For debugging - provide local file preview if API is not set up
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_CLOUDINARY_API === 'true') {
      console.log('DEVELOPMENT MODE: Returning local URL instead of uploading to Cloudinary');
      const url = URL.createObjectURL(file);
      return {
        url,
        publicId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        width: 500,
        height: 500,
        format: file.type.split('/')[1] || 'jpeg'
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Get auth token if user is logged in
    const auth = getAuth();
    if (auth.currentUser) {
      console.log('Getting auth token for user:', auth.currentUser.uid);
      const token = await auth.currentUser.getIdToken();
      formData.append('authToken', token);
    } else {
      console.warn('No authenticated user found for upload');
    }
    
    console.log('Uploading file to /api/upload');
    
    // Upload to our API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error('Upload response not OK:', response.status, response.statusText);
      const errorData = await response.json().catch(e => ({ error: 'Failed to parse error response' }));
      console.error('Error data:', errorData);
      throw new Error(errorData.error || `Failed to upload image: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Upload successful, response:', data);
    
    return {
      url: data.url,
      publicId: data.publicId,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('Error in uploadFileToCloudinary:', error);
    
    // Fallback for development/testing to avoid blocking the UI
    if (process.env.NODE_ENV === 'development') {
      console.warn('DEVELOPMENT FALLBACK: Returning local URL after API error');
      const url = URL.createObjectURL(file);
      return {
        url,
        publicId: `local_error_${Date.now()}`,
        width: 500,
        height: 500,
        format: file.type.split('/')[1] || 'jpeg'
      };
    }
    
    throw error;
  }
}

/**
 * Delete an image from Cloudinary through our API route
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} The delete result
 */
export async function deleteFileFromCloudinary(publicId) {
  console.log('deleteFileFromCloudinary called with publicId:', publicId);
  
  if (!publicId) {
    console.error('No publicId provided to deleteFileFromCloudinary');
    throw new Error('No publicId provided');
  }

  // Skip API call for local images
  if (publicId.startsWith('local_')) {
    console.log('Skipping API call for local image:', publicId);
    return { result: 'ok', local: true };
  }

  try {
    console.log('Sending delete request to /api/upload');
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      console.error('Delete response not OK:', response.status, response.statusText);
      const errorData = await response.json().catch(e => ({ error: 'Failed to parse error response' }));
      console.error('Error data:', errorData);
      throw new Error(errorData.error || `Failed to delete image: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Delete successful, response:', data);
    return data;
  } catch (error) {
    console.error('Error in deleteFileFromCloudinary:', error);
    
    // Fallback for development/testing
    if (process.env.NODE_ENV === 'development') {
      console.warn('DEVELOPMENT FALLBACK: Returning success after delete API error');
      return { result: 'ok', local: true };
    }
    
    throw error;
  }
} 