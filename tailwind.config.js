/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 아이디어 타입별 색상
        idea: {
          movie: '#EF4444',
          drama: '#EC4899',
          animation: '#F59E0B',
          book: '#3B82F6',
          essay: '#06B6D4',
          poem: '#14B8A6',
          'famous-quote': '#8B5CF6',
          proverb: '#4F46E5',
          academic: '#10B981',
          web: '#14B8A6',
        },
      },
    },
  },
  plugins: [],
}
