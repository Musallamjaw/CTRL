/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-img': "url('./src/assets/images/6a60863f-851e-4026-a8a5-218b429fe327.jpg')",
        'ticket-bg': "url('./src/assets/images/bg3.jpg')",
      },
      colors: {
        'base-color': '#000650',
        "dark-blue": "#000650",
      },
    },
    screens: {
      'mobile': '320px',
      'xmobile': '350px',
      '2xmobile': '520px',
      'md': '640px',
      '2md': '820px',
      'slg': '950px',
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  plugins: [
    flowbitePlugin,
    function ({ addVariant }) {
      addVariant('button-group', '&.button-group:hover .button-child');
    },
  ],
}
