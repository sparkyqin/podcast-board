import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pod-bg': '#FDFCF9', 
        'pod-text-main': '#1E293B',
        'pod-accent': '#4F46E5', 
        'trend-up': '#10B981', 
        'trend-down': '#EF4444', 
      },
      boxShadow: {
        'pod-card': '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
};
export default config;