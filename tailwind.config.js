/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sbaggrom: ['SBAggroM'],
        sbaggrol: ['SbAggroL'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
