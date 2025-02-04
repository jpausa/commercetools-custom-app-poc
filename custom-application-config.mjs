import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Custom App Channels',
  entryPointUriPath,
  cloudIdentifier: 'gcp-us',
  env: {
    development: {
      initialProjectKey: 'mirion-app-sandbox',
    },
    production: {
      applicationId: 'cm6i46mom000fyc01ypydydog',
      url: 'https://test-ct-custom-app.vercel.app',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'List Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'add-users-to-bus',
      defaultLabel: 'Associate users to BU',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'prices-upload-form',
      defaultLabel: 'Create users',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'create-bus',
      defaultLabel: 'Create BUs',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    }
  ],
};

export default config;
