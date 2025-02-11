import { uploadToStorage } from './firebase';

export const generateShareableLink = async (zipBlob: Blob): Promise<string> => {
  try {
    const downloadUrl = await uploadToStorage(zipBlob);
    return downloadUrl;
  } catch (error) {
    console.error('Error generating shareable link:', error);
    throw new Error('Failed to generate shareable link');
  }
}; 