import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cp } from 'node:fs/promises'
import { resolve } from 'node:path'

const copyPhpFiles = () => ({
  name: 'copy-php-api-files',
  async closeBundle() {
    const projectRoot = process.cwd()
    const distDirectory = resolve(projectRoot, 'dist')

    await cp(resolve(projectRoot, 'src/api'), resolve(distDirectory, 'api'), {
      recursive: true,
    })
    await cp(resolve(projectRoot, 'src/DB'), resolve(distDirectory, 'DB'), {
      recursive: true,
    })
  },
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyPhpFiles(),
  ],
})
