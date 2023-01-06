// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'introduction',
    'quickstart', 
    {
      type: 'category',
      label: 'Use Nango',
      items: [
        {
          id: 'nango-sync/core-concepts',
          type: 'doc',
          label: 'Core concepts'
        },
        {
          type: 'category',
          label: 'Create Syncs',
          items: [
            {
              id: 'nango-sync/sync-all-options',
              type: 'doc',
              label: 'All Options'
            },
            {
              id: 'nango-sync/sync-modes',
              type: 'doc',
              label: 'Modes'
            },
            {
              id: 'nango-sync/sync-schedule',
              type: 'doc',
              label: 'Scheduling'
            },
            {
              id: 'nango-sync/sync-metadata',
              type: 'doc',
              label: 'Metadata'
            },
            {
              id: 'nango-sync/sync-pagination',
              type: 'doc',
              label: 'Pagination'
            },
            {
              id: 'nango-sync/sync-auth',
              type: 'doc',
              label: 'Authentication'
            },
          ]
        },
        {
          id: 'nango-sync/manage-syncs',
          type: 'doc',
          label: 'Manage Syncs'
        },
        {
          id: 'nango-sync/sync-notifications',
          type: 'doc',
          label: 'Sync Notifications'
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
    {
      type: 'category',
      label: 'Deploy Nango Open Source',
      link: {
        type: 'generated-index',
        title: 'Deploy Nango Open Source',
        description: 'Nango is easy to self-host on a single machine using Docker. Here are tutorials (<5mins each) to deploy Nango in various environments:',
        slug: '/category/deploy-nango-open-source'
      },
      items: [
        {
          id: 'nango-deploy/local',
          type: 'doc',
          label: 'On your local machine'
        },
        {
          id: 'nango-deploy/aws',
          type: 'doc',
          label: 'On AWS'
        },
        {
          id: 'nango-deploy/gcp',
          type: 'doc',
          label: 'On GCP'
        },
        {
          id: 'nango-deploy/digital-ocean',
          type: 'doc',
          label: 'On Digital Ocean'
        },
      ]
    },
    'cloud',
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
    {
      type: 'category',
      label: 'Deploying Pizzly',
      items: [
        {
          id: 'pizzly/pizzly-security',
          type: 'doc',
          label: 'Securing Your Instance'
        },
        {
          id: 'pizzly/pizzly-storage',
          type: 'doc',
          label: 'Storage & Logs'
        },
        {
          id: 'pizzly/pizzly-configuration',
          type: 'doc',
          label: 'Other Configuration'
        },
        {
          id: 'pizzly/pizzly-cli',
          type: 'doc',
          label: 'CLI'
        }
      ]
    },
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
