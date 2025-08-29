import { defineConfig } from '@playwright/test';

const config=({
  testDir: './tests',
  timeout: 40 * 6000,
  expect: {
    timeout: 6*20000,
  },
  reporter: [['html'],['allure-playwright']],
  use: {
    browserName: 'chromium',
    headless : true,
    screenshot : 'only-on-failure',
    trace: 'retain-on-failure'
    
  },
});

module.exports=config


