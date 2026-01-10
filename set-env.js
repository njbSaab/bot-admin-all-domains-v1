const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

// Загружаем переменные из файла .env
dotenv.config();

const targetPath = path.join(__dirname, "src/environments/environment.prod.ts");

const envConfigFile = `export const environment = {
  production: true,
  auth: {
    email: '${process.env.AUTH_EMAIL}',
    password: '${process.env.AUTH_PASSWORD}',
    apiUrl: '${process.env.AUTH_API_URL}',
    baseUrl: '${process.env.AUTH_BASE_URL}',
  }
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Файл окружения сгенерирован: ${targetPath}`);
  }
});
