const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const envContent = `export const environment = {
  baseUrl: '${process.env.BASE_URL}',
  apiKey: '${process.env.MAPBOX_TOKEN}'
};
`;

fs.writeFileSync('./src/environments/environments.ts', envContent);
console.log('environments.ts generado correctamente');
