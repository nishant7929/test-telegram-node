import "dotenv/config";
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import fs from 'fs/promises';

const API_ID = process.env.API_ID || 0;
const API_HASH = process.env.API_HASH || "";
const savedSession = process.env.TELEGRAM_SESSION || "";
const SESSION = new StringSession(savedSession);
const CACHE_FILE = 'cached_messages.json';

let globalTelegramClient: TelegramClient | null = null;

const readCache = async (): Promise<Api.Message[]> => {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeCache = async (messages: Api.Message[]) => {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing cache:", error);
  }
};

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
  const cachedMessages = await readCache();
  if (cachedMessages.length > 0) {
    console.log('Returning cached messages');
    return { origin: 'cache', messages: limit ? cachedMessages.slice(0, limit) : cachedMessages };
  }

  console.log('Fetching new messages from Telegram...');
  const client = await getTelegramClient();
  const me = await client.getMe();
  const newMessages = await client.getMessages(me.id);
  await writeCache(newMessages);
  client.disconnect();

  return { origin: 'telegram', messages: limit ? newMessages.slice(0, limit) : newMessages };
};