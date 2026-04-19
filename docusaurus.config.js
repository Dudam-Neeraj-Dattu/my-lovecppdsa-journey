// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
   title: 'LoveCpp-DSA',
   tagline: 'DSA - The flavour of problem solving',
   favicon: 'img/favicon.png',

   // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
   future: {
      v4: true, // Improve compatibility with the upcoming Docusaurus v4
   },

   // Set the production url of your site here
   url: 'https://dudam-neeraj-dattu.github.io',
   // Set the /<baseUrl>/ pathname under which your site is served
   // For GitHub pages deployment, it is often '/<projectName>/'
   baseUrl: '/my-lovecppdsa-journey/',
   trailingSlash: true,

   // GitHub pages deployment config.
   // If you aren't using GitHub pages, you don't need these.
   organizationName: 'Dudam-Neeraj-Dattu', // Usually your GitHub org/user name.
   projectName: 'my-lovecppdsa-journey', // Usually your repo name.

   onBrokenLinks: 'throw',

   // Even if you don't use internationalization, you can use this field to set
   // useful metadata like html lang. For example, if your site is Chinese, you
   // may want to replace "en" with "zh-Hans".
   i18n: {
      defaultLocale: 'en',
      locales: ['en'],
   },

   presets: [
      [
         'classic',
         /** @type {import('@docusaurus/preset-classic').Options} */
         ({
            docs: {
               sidebarPath: './sidebars.js',
               // Please change this to your repo.
               // Remove this to remove the "edit this page" links.
               editUrl:
                  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            },
            blog: {
               showReadingTime: true,
               feedOptions: {
                  type: ['rss', 'atom'],
                  xslt: true,
               },
               // Please change this to your repo.
               // Remove this to remove the "edit this page" links.
               editUrl:
                  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
               // Useful options to enforce blogging best practices
               onInlineTags: 'warn',
               onInlineAuthors: 'warn',
               onUntruncatedBlogPosts: 'warn',
            },
            theme: {
               customCss: './src/css/custom.css',
            },
         }),
      ],
   ],

   themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
         // Replace with your project's social card
         image: 'img/docusaurus-social-card.jpg',
         colorMode: {
            respectPrefersColorScheme: true,
         },
         navbar: {
            title: 'LoveCpp-DSA',
            logo: {
               alt: 'LoveCpp-DSA Logo',
               src: 'img/logo.png',
            },
            items: [
               {
                  type: 'docSidebar',
                  sidebarId: 'tutorialSidebar',
                  position: 'left',
                  label: 'My Journey',
               },
               { to: 'https://dudam-neeraj-dattu.github.io/Personal-Portfolio/', label: 'My Portfolio', position: 'left' },
               { to: 'https://www.buymeacoffee.com/ilovecppdsa', label: 'Sponsor', position: 'left' },
               {
                  href: 'https://github.com/Dudam-Neeraj-Dattu/my-lovecppdsa-journey',
                  label: 'GitHub',
                  position: 'right',
               },
            ],
         },
         footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} LoveCppDSA. Built with Docusaurus.`,
         },
         prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
         },
      }),
};

export default config;
