import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase config here
  storageBucket: 'ziplock-ai.appspot.com'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadToStorage = async (blob: Blob): Promise<string> => {
  const fileId = crypto.randomUUID();
  const storageRef = ref(storage, `zips/${fileId}`);
  
  // Upload encrypted zip
  await uploadBytes(storageRef, blob);
  
  // Get download URL
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}; 