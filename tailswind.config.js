// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 既にある内容に合わせてOK
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp', 'tailwindcss-textshadow'), // ← これを追加
  ],
}
