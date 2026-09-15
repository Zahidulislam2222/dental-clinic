import { defineConfig } from '@playwright/test';
import settings from './config/tooling.json' with { type: 'json' };
export default defineConfig({
  testDir:'./tests/browser', timeout:settings.browserTimeoutMs,
  fullyParallel:false, workers:1, reporter:'list',
  use:{baseURL:process.env.TEST_BASE_URL || `http://${settings.host}:${settings.previewPort}`, headless:true, reducedMotion:'reduce'},
});
