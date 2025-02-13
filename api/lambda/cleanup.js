import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const handler = async (event) => {
  try {
    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/'
    });
    
    const { Contents } = await s3Client.send(listCommand);
    if (!Contents || Contents.length === 0) return;

    // Find objects older than 24 hours
    const now = new Date();
    const objectsToDelete = Contents.filter(obj => {
      const age = now.getTime() - obj.LastModified.getTime();
      return age > ONE_DAY_MS;
    });

    if (objectsToDelete.length === 0) return;

    // Delete old objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete.map(obj => ({ Key: obj.Key }))
      }
    });

    await s3Client.send(deleteCommand);
    
    console.log(`Cleaned up ${objectsToDelete.length} files`);
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}; 