import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/installation', 'getting-started/configuration', 'getting-started/quickstart', 'getting-started/deployment'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/mcp-integration',
        'guides/analytics-dashboard',
        'guides/oauth-setup',
        'guides/database-migrations',
        'guides/security',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/trpc-routes', 'api/mcp-tools', 'api/database-schema'],
    },
    {
      type: 'category',
      label: 'Community',
      items: ['community/contributing', 'community/code-of-conduct', 'community/changelog'],
    },
  ],
};

export default sidebars;
