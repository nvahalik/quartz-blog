import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Nick's Blog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "nickvahalik.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Domine",
        body: "Quicksand",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f8fafc", // Soft off-white
          lightgray: "#e2e8f0", // Light blue-gray
          gray: "#94a3b8", // Medium blue-gray
          darkgray: "#334155", // Dark blue-gray
          dark: "#1e293b", // Deep navy
          secondary: "#1e40af", // Royal blue
          tertiary: "#3b82f6", // Bright blue
          highlight: "rgba(59, 130, 246, 0.15)",
          textHighlight: "#dbeafe88",
        },
        darkMode: {
          light: "#0f172a", // Deep navy background
          lightgray: "#1e293b", // Navy-gray
          gray: "#475569", // Medium slate
          darkgray: "#cbd5e1", // Light blue-gray text
          dark: "#f1f5f9", // Almost white text
          secondary: "#60a5fa", // Sky blue
          tertiary: "#3b82f6", // Bright blue
          highlight: "rgba(59, 130, 246, 0.15)",
          textHighlight: "#1e3a8a88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      // Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
