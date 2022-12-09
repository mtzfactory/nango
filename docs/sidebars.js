/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    'introduction',
    'quickstart', 
    {
      type: 'category',
      label: 'Using Nango Sync',
      items: [
        {
          id: 'nango-sync/core-concepts',
          type: 'doc',
          label: 'Core concepts'
        },
        {
          id: 'nango-sync/managing-syncs',
          type: 'doc',
          label: 'Creating & managing Syncs'
        },
        {
          id: 'nango-sync/schema-mappings',
          type: 'doc',
          label: 'Schema mappings'
        },
        {
          id: 'nango-sync/db-config',
          type: 'doc',
          label: 'DB Configuration'
        },
        {
          id: 'nango-sync/observability',
          type: 'doc',
          label: 'Observability'
        }
      ]
    },
    {
      id: 'real-world-examples',
      type: 'doc',
      label: 'Examples'
    },
    'production-deployment',
    {
      id: 'architecture',
      type: 'doc',
      label: 'Architecture & Vision'
    },
    {
      id: 'license-faq',
      type: 'doc',
      label: 'License FAQ & Pricing'
    },
    'contributing'
  ],
  pizzly: [
    'pizzly/introduction',
    'pizzly/getting-started',
    'pizzly/contribute-api',
    'pizzly/migration'
  ]

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;
