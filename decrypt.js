const crypto = require('crypto');

const decrypt = (encryptedPayload, ivBase64, subMerchantKey) => {
  const BLOCK_SIZE = 16;
  const MERCHANT_KEY = 'yourMerchantKeyHere'; // Ensure this matches the encryption setup

  // Concatenate subMerchantKey and MERCHANT_KEY to create the aesKey
  let aesKey = subMerchantKey + MERCHANT_KEY;

  // Ensure aesKey is 24 characters long
  if (aesKey.length < 24) {
    aesKey = aesKey.padEnd(24, '0');
  } else if (aesKey.length > 24) {
    aesKey = aesKey.substring(0, 24);
  }

  const encryptedBuffer = Buffer.from(encryptedPayload, 'base64');
  console.log('encryptedBuffer => '+encryptedBuffer)
  console.log('ivBase64 => '+ivBase64)
  const iv = Buffer.from(ivBase64, 'base64');

  // Ensure IV is 16 bytes
  if (iv.length !== 16) {
    throw new Error('Invalid IV length. Must be 16 bytes.');
  }
  console.log('iv => '+iv)

  const decipher = crypto.createDecipheriv('aes-192-cbc', aesKey, iv);
  console.log(decipher)
  let decrypted = decipher.update(encryptedBuffer, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Example of decryption
const iv = 'cdduqDe1Udrkvj4MzDZNRA=='
const decryptedText = decrypt('XKZPcYbbroXFZGwCiUpvZGsXAb4RHAzJKAUcUc6E7rY=', iv.toString('base64'), 'yourSubMerchantKeyHere');
console.log("Decrypted:", decryptedText);
