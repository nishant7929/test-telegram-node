import express from 'express';
import { getSavedMessages } from './telegramClient';

const app = express();
const port = 5050;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/saved-messages', async (req, res) => {
  try {
    const messages = await getSavedMessages();
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching saved messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching saved messages' });
  }
});

// Start server and ensure Telegram client is connected
app.listen(port, async () => {
  try {
    await getSavedMessages(); // Ensure Telegram client is connected at startup
    console.log(`Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error('Error connecting to Telegram client:', error);
  }
});
