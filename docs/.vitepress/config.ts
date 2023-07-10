import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nuxt Module Template",
  description: "A template for creating Nuxt modules",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/getting-started" }
    ],

    sidebar: [
      {
        // text: 'AuthJS',
        items: [
          { text: "Get Started", link: "/getting-started" }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Hebilicious/nuxt-module-template" }
    ]
  }
})
