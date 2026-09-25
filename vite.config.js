import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages projectサイトは https://<user>.github.io/<repo>/ で公開されるため、
// ビルド時のベースパスを環境変数から取得する。
// ローカル開発時は "/"、GitHub Actions でのビルド時は "/star-one/" を渡す想定。
// ユーザー名やリポジトリ名をコードへ固定しないよう、必ず環境変数経由にする。
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production'
  }
}))
