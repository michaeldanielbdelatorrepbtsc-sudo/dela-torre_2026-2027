import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' //  FIXED NAME

// https://vite.dev
export default defineConfig({
  plugins: [react()],
})
