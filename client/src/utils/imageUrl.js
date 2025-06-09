// client/src/utils/imageUrl.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Constructs the full URL for an image hosted on the backend.
 * @param {string} imagePath - The path of the image from the database (e.g., /images/my-avatar.jpg).
 * @returns {string} The full, absolute URL to the image.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Return a default image or an empty string if no path is provided
    return "https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749432192/default_profile_avatar_lvdgfa.svg"; 
  }
  // If the path already starts with http, it's likely an external URL (e.g., from a Google account)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Otherwise, construct the full URL
  return `${API_URL}${imagePath}`;
};