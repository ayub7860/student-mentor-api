const crypto = require('crypto');

const encrypt = (text, aesKey, iv) => {
  const cipher = crypto.createCipheriv('aes-192-cbc', aesKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

// Example of encryption
const text = "Hello, world! Anil";
const subMerchantKey = 'yourSubMerchantKeyHere'; // Replace with actual subMerchantKey
const MERCHANT_KEY = 'yourMerchantKeyHere'; // Replace with actual MERCHANT_KEY

let aesKey = subMerchantKey + MERCHANT_KEY;
if (aesKey.length < 24) {
  aesKey = aesKey.padEnd(24, '0');
} else if (aesKey.length > 24) {
  aesKey = aesKey.substring(0, 24);
}
const iv = crypto.randomBytes(16);
const encryptedText = encrypt(text, aesKey, iv);

console.log("Encrypted:", encryptedText);
console.log("IV:", iv.toString('base64'));
