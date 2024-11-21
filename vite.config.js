import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    base: '/',
    plugins: [
      vue(),
      vueDevTools(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /%VITE_APP_KAKAO_MAP_API_KEY%/g,
            env.VITE_APP_KAKAO_MAP_API_KEY
          )
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})