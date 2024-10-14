import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'next.social.com',
  appName: 'Next',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "clientId": "564987887798-7041k8coh25u4v5alre4me27knhfueuq.apps.googleusercontent.com",
      "serverId": "564987887798-7041k8coh25u4v5alre4me27knhfueuq.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
