import "dotenv/config";
import { Api, Logger, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { LogLevel } from 'telegram/extensions/Logger';

const API_ID = process.env.API_ID || 0;
const API_HASH = process.env.API_HASH || "";
const savedSession = process.env.TELEGRAM_SESSION || "";
const SESSION = new StringSession(savedSession);

let globalTelegramClient: TelegramClient | null = null;
let cachedMessages: Api.Message[] = []; // Store cached messages
// let lastFetchedTime = 0; // Timestamp of last fetch
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const getTelegramClient = async (): Promise<TelegramClient> => {
  if (!globalTelegramClient) {
    globalTelegramClient = new TelegramClient(SESSION, Number(API_ID), API_HASH, {
      connectionRetries: 5,
      useWSS: true,
    });

    await globalTelegramClient.connect();

  }
  return globalTelegramClient;
};

export const getSavedMessages = async (limit: number) => {
  const now = Date.now();

  // Check if cached data is still valid
  if (cachedMessages.length > 0) {
    console.log('Returning cached messages');
    return { origin: 'cache', messages: limit ? cachedMessages.slice(0, limit) : cachedMessages  };
  }

  console.log('Fetching new messages from Telegram...');
  const client = await getTelegramClient();
  const me = await client.getMe();
  cachedMessages = await client.getMessages(me.id);
  client.disconnect();
  
  return { origin: 'telegram', cachedMessages };
};
