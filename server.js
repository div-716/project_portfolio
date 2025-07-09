import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the data directory exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact form endpoint
app.post('/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create contact entry
    const contactEntry = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      ip_address: req.ip || req.connection.remoteAddress
    };
    
    // Load existing messages
    const messagesFile = 'data/messages.json';
    let messages = [];
    
    if (fs.existsSync(messagesFile)) {
      try {
        const data = fs.readFileSync(messagesFile, 'utf8');
        messages = JSON.parse(data);
      } catch (error) {
        console.error('Error reading messages file:', error);
        messages = [];
      }
    }
    
    // Add new message
    messages.push(contactEntry);
    
    // Save messages
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    
    // Also save to a text file for easy reading
    const textEntry = `
--- New Message (${contactEntry.timestamp}) ---
Name: ${contactEntry.name}
Email: ${contactEntry.email}
Message: ${contactEntry.message}
IP: ${contactEntry.ip_address}
${'-'.repeat(50)}
`;
    
    fs.appendFileSync('data/messages.txt', textEntry);
    
    res.json({ message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoint to view all messages
app.get('/messages', (req, res) => {
  try {
    const messagesFile = 'data/messages.json';
    
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      const messages = JSON.parse(data);
      res.json(messages);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});