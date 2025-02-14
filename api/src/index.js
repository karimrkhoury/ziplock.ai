import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { 
  S3Client, 
  PutObjectCommand,
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS with specific origin
app.use(cors({
  origin: ['https://ziplock.me', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add at the top after imports
console.log('API Starting with config:', {
  port: process.env.PORT,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET_NAME,
  hasAccessKey: !!process.env.S3_ACCESS_KEY,
  hasSecretKey: !!process.env.S3_SECRET_KEY
});

// Update the upload endpoint with better error handling
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('No file in request');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log('Uploading file:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    const fileId = nanoid(10);
    const key = `uploads/${fileId}/${req.file.originalname}`;

    // Upload to S3
    console.log('Uploading to S3:', { bucket: BUCKET_NAME, key });
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    // Generate URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    
    const downloadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 24 * 60 * 60
    });

    console.log('Upload successful, returning URL:', downloadUrl);
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle file downloads
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);
});

// Add error handling for large files
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    }
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('S3 Region:', process.env.S3_REGION);
  console.log('S3 Bucket:', process.env.S3_BUCKET_NAME);
});
