const fs = require('fs');

const file = 'src/app/(dashboard)/technicians/technicians-client.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Ganti default import menjadi named import
  content = content.replace(
    "import DataTable from '@/components/data-display/data-table';",
    "import { DataTable } from '@/components/data-display/data-table';"
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Fixed import in technicians-client.tsx');
} else {
  console.log('❌ File not found!');
}