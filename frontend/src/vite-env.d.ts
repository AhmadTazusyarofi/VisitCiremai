/// <reference types="vite/client" />

/** Variabel dari frontend/.env — lihat .env.example dan src/lib/config.ts. */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_PROXY_TARGET?: string;
  readonly VITE_SITE_NAME?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_OG_IMAGE?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_ADDRESS?: string;
  readonly VITE_MAP_QUERY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
