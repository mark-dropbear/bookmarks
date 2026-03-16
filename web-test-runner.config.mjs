import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'src/**/*.test.js',
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '2000',
    },
  },
};
