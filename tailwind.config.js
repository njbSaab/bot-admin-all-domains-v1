/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Укажите пути к файлам вашего проекта
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // Подключение DaisyUI
  ],
  daisyui: {
    themes: ["light"], // Указываем тему DaisyUI
  },
};
