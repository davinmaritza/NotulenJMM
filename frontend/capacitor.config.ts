import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mpk13.notulenjmm',
  appName: 'NotulenJMM',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    // Permission configurations for Audio & Network
  }
};

export default config;
