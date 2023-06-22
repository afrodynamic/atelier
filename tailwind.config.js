export default {
  content: ['./client/src/**/*.{html,js,jsx,ts,tsx}'],
  plugins: [require('tailwindcss'), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#0099FF',
          secondary: '#1247B0',
          accent: '#ffffff',
          neutral: '#181818',
          'base-100': '#001337',
          info: '#41c7b9',
          success: '#00B103',
          warning: '#dbb32d',
          error: '#FF7E76',
          'base-content': '#ffffff',
        },
      },
    ],
  },
};
