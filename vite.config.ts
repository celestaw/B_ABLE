import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // ソース外の資料フォルダ。別アプリで開かれてロックされると
      // ファイル監視が EBUSY で落ちて dev サーバごと死ぬので監視対象から外す。
      ignored: ['**/presen/**'],
    },
  },
})
