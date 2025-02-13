import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
});

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueId = nanoid(10);
    cb(null, `${uniqueId}-${file.originalname}`);
  }
});

// Add file size limit
const maxFileSize = 500 * 1024 * 1024; // 500MB

const upload = multer({ 
  storage,
  limits: {
    fileSize: maxFileSize
  }
});

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const downloadUrl = `${process.env.API_URL}/download/${req.file.filename}`;
  res.json({ downloadUrl });

  // Delete file after 24 hours
  setTimeout(() => {
    const filePath = path.join(uploadsDir, req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }, 24 * 60 * 60 * 1000);
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
});
