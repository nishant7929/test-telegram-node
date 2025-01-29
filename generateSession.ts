import "dotenv/config";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline";

const API_ID = process.env.API_ID || 0;
const API_HASH = process.env.API_HASH || "";
const session = new StringSession(""); // This will be filled after login

const client = new TelegramClient(session, Number(API_ID), API_HASH, {
  connectionRetries: 5,
  useWSS: true,
});

(async () => {
  await client.start({
    phoneNumber: async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      return new Promise((resolve) => {
        rl.question("Please enter your phone number: ", (answer) => {
          rl.close();
          resolve(answer);
        });
      });
    },
    password: async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      return new Promise((resolve) => {
        rl.question("Please enter your password: ", (answer) => {
          rl.close();
          resolve(answer);
        });
      });
    },
    phoneCode: async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      return new Promise((resolve) => {
        rl.question("Please enter the code you received: ", (answer) => {
          rl.close();
          resolve(answer);
        });
      });
    },
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");
  console.log("Your session string is:", client.session.save()); // Save this string to your .env file
})();