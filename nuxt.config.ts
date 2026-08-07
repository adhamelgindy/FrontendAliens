// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Frontend Aliens — Save Voyager 1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Voyager 1's signal is corrupted. Debug three critical systems before the spacecraft is lost forever.",
        },
      ],
      script: [
        {
          src: 'https://elevenlabs.io/convai-widget/index.js',
          async: true,
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      voyagerToken:    '',
      signalEndpoint:  'https://tracker.voyager.space/signal',
    },
  },

  compatibilityDate: '2024-11-01',

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'elevenlabs-convai',
    },
  },
})
