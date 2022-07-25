// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nango Docs',
  tagline: 'Documentation for the Nango framework',
  url: 'https://docs.nango.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/nango-favicon.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nangohq', // Usually your GitHub org/user name.
  projectName: 'nango', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nangohq/nango/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.8,
        },
        gtag: {
          trackingID: 'G-CSQ5BJJXCR',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{
        name: 'keywords',
        content: 'nango, documentation, native integrations, integrations framework, integrations, customer-facing integrations, open-source framework, open-source, nango docs, nango documentation'
      }, {
        name: 'description',
        content: 'The documentation for the native integrations framework Nango'
      }],
      navbar: {
        title: 'Nango Docs',
        logo: {
          alt: 'Nango Docs',
          src: 'img/nango-favicon.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Docs',
          },
          {
            label: 'Community Slack',
            href: 'https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA',
            position: 'left',
          },
          {
            href: 'https://github.com/nangohq/nango',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Intro to Nango',
                to: '/',
              },
              {
                label: 'Quickstart 🚀',
                to: '/quickstart',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/nangohq',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Nango Blog',
                href: 'https://www.nango.dev/blog',
              },
              {
                label: 'Nango Website',
                href: 'https://www.nango.dev/blog',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nango`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
