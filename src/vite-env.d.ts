/// <reference types="vite/client" />

// Typed access to the project's custom env vars via import.meta.env.
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_GOOGLE_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
