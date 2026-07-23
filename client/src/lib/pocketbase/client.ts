import PocketBase from 'pocketbase'

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(pocketbaseUrl)

// We check if pocketbase is active by verifying the URL is explicitly set or checking connection
export const isPocketBaseConfigured = Boolean(
  import.meta.env.VITE_POCKETBASE_URL
)
