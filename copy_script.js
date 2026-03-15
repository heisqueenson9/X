const fs = require('fs');
fs.mkdirSync('src/app/api/turnitin', { recursive: true });
fs.copyFileSync('src/app/api/plagiarism/route.ts', 'src/app/api/turnitin/route.ts');
fs.mkdirSync('src/app/api/payment-upload', { recursive: true });
fs.copyFileSync('src/app/api/payment/upload/route.ts', 'src/app/api/payment-upload/route.ts');
fs.mkdirSync('src/app/api/payment-status', { recursive: true });
fs.copyFileSync('src/app/api/payment/status/[id]/route.ts', 'src/app/api/payment-status/route.ts');
