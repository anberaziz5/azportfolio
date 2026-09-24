declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_KEY: string;
      GROQ_API_KEY: string;
      GEMINI_API_KEY?: string;
      GOOGLE_GENERATIVE_AI_API_KEY?: string;
      JINA_API_KEY: string;
      RESEND_API_KEY: string;
      RESEND_FROM_EMAIL?: string;
      NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
      NEXT_PUBLIC_SANITY_DATASET?: string;
      NEXT_PUBLIC_SANITY_API_VERSION?: string;
      MONGODB_URI?: string;
    }
  }
}

export {};
