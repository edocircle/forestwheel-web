/**
 * Cloudinary Connection Test Script
 * Run: node apps/api/test-cloudinary.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Fallback to local
dotenv.config({ path: path.resolve(__dirname, '.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('');
console.log('=== Cloudinary Connection Test ===');
console.log('');
console.log('1. Checking environment variables...');
console.log(`   CLOUDINARY_CLOUD_NAME: ${cloudName ? `✅ "${cloudName}"` : '❌ NOT SET'}`);
console.log(`   CLOUDINARY_API_KEY:    ${apiKey ? `✅ "${apiKey}"` : '❌ NOT SET'}`);
console.log(`   CLOUDINARY_API_SECRET: ${apiSecret ? `✅ "${apiSecret.substring(0, 5)}..."` : '❌ NOT SET'}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.log('\n❌ Missing credentials! Please check your .env file.');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

console.log('\n2. Testing API connection (cloudinary.api.ping)...');

try {
  const result = await cloudinary.api.ping();
  console.log(`   ✅ Connection successful! Response: ${JSON.stringify(result)}`);
} catch (err) {
  console.log(`   ❌ Connection FAILED!`);
  console.log(`   Error: ${err.message}`);
  if (err.error) console.log(`   Details: ${JSON.stringify(err.error)}`);
  console.log('\n   Possible causes:');
  console.log('   - Wrong Cloud Name (check Cloudinary Dashboard)');
  console.log('   - Wrong API Key or Secret (regenerate from Dashboard)');
  console.log('   - Network/firewall issue');
  process.exit(1);
}

console.log('\n3. Testing image upload (small test image)...');

try {
  // Upload a tiny 1x1 pixel PNG as a test
  const testDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  const uploadResult = await cloudinary.uploader.upload(testDataUri, {
    folder: 'forestwheel/test',
    public_id: `test-upload-${Date.now()}`,
  });

  console.log(`   ✅ Upload successful!`);
  console.log(`   URL: ${uploadResult.secure_url}`);
  console.log(`   Public ID: ${uploadResult.public_id}`);

  // Clean up test image
  await cloudinary.uploader.destroy(uploadResult.public_id);
  console.log(`   🧹 Test image cleaned up.`);
} catch (err) {
  console.log(`   ❌ Upload FAILED!`);
  console.log(`   Error: ${err.message}`);
  if (err.http_code) console.log(`   HTTP Code: ${err.http_code}`);
  process.exit(1);
}

console.log('\n=== ✅ All tests passed! Cloudinary is fully connected. ===');
console.log('');
process.exit(0);
