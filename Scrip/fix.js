   const fs = require('fs');
   const file = 'setup-final.js';
   let content = fs.readFileSync(file, 'utf8');
   content = content.replace("writeFile('src/app/(auth)/login/page.tsx`, `'use client';", "writeFile('src/app/(auth)/login/page.tsx', `'use client';");
   fs.writeFileSync(file, content);
   console.log('✅ File setup-final.js sudah diperbaiki!');