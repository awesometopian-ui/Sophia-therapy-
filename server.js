const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Data file
const DATA_FILE = path.join(__dirname, 'data.json');

// Read data from file
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist, return default structure
    return { videos: [], images: [] };
  }
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ==================== VIDEOS API ====================

// GET all videos
app.get('/api/videos', (req, res) => {
  const data = readData();
  res.json(data.videos);
});

// POST new video
app.post('/api/videos', (req, res) => {
  const data = readData();
  const newVideo = {
    id: Date.now() + Math.floor(Math.random() * 10000),
    ...req.body,
    date: new Date().toISOString()
  };
  data.videos.push(newVideo);
  writeData(data);
  res.status(201).json(newVideo);
});

// DELETE video by id
app.delete('/api/videos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  const index = data.videos.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }
  data.videos.splice(index, 1);
  writeData(data);
  res.json({ success: true });
});

// ==================== IMAGES API =====================

// GET all images
app.get('/api/images', (req, res) => {
  const data = readData();
  res.json(data.images || []);
});

// POST new image
app.post('/api/images', (req, res) => {
  const data = readData();
  if (!data.images) data.images = [];
  const newImage = {
    id: Date.now() + Math.floor(Math.random() * 10000),
    ...req.body,
    date: new Date().toISOString()
  };
  data.images.push(newImage);
  writeData(data);
  res.status(201).json(newImage);
});

// DELETE image by id
app.delete('/api/images/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  if (!data.images) return res.status(404).json({ error: 'No images' });
  const index = data.images.findIndex(img => img.id === id);
  if (index === -1) return res.status(404).json({ error: 'Image not found' });
  data.images.splice(index, 1);
  writeData(data);
  res.json({ success: true });
});

// Serve the main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Sophia Therapy backend running on port ${PORT}`);
});
