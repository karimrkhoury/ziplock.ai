const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.S3_REGION
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

module.exports.handler = async (event) => {
  console.log('Starting cleanup process...', { event });
  try {
    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/'
    });
    
    const { Contents } = await s3Client.send(listCommand);
    console.log('Found objects:', Contents?.length || 0);
    if (!Contents || Contents.length === 0) return;

    // Find objects older than 24 hours
    const now = new Date();
    const objectsToDelete = Contents.filter(obj => {
      const age = now.getTime() - obj.LastModified.getTime();
      console.log('Object age (hours):', age / (60 * 60 * 1000), obj.Key);
      return age > ONE_DAY_MS;
    });

    console.log('Objects to delete:', objectsToDelete.length);
    if (objectsToDelete.length === 0) return;

    // Delete old objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete.map(obj => ({ Key: obj.Key }))
      }
    });

    const deleteResult = await s3Client.send(deleteCommand);
    
    console.log('Cleanup completed:', {
      deleted: objectsToDelete.length,
      result: deleteResult
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Cleaned up ${objectsToDelete.length} files`,
        deletedFiles: objectsToDelete.map(obj => obj.Key)
      })
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}; 