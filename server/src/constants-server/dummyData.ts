export const dummyData = {
  userApps: [
    {
      appId: '1',
      appName: 'My First CDN App',
      plan: 'Free',
      region: 'us-east-1',
      storageUsed: '576MB',
      storageLimit: '1GB',
      appUrl: 'https://xyz.com',
      assets: [
        {
          assetId: '101',
          fileName: 'image1.png',
          fileSize: '2MB',
          fileUrl: 'https://cdn.example.com/user1/image1.png',
        },
        {
          assetId: '102',
          fileName: 'banner.jpg',
          fileSize: '5MB',
          fileUrl: 'https://cdn.example.com/user1/banner.jpg',
        },
      ],
    },
    {
      appId: '2',
      appName: 'Pro Photo Storage',
      plan: 'Pro',
      region: 'eu-west-1',
      storageUsed: '5GB',
      storageLimit: '10GB',
      appUrl: 'https://abc.com',
      assets: [
        {
          assetId: '103',
          fileName: 'photo1.jpeg',
          fileSize: '3MB',
          fileUrl: 'https://cdn.example.com/user2/photo1.jpeg',
        },
        {
          assetId: '104',
          fileName: 'photo2.jpeg',
          fileSize: '7MB',
          fileUrl: 'https://cdn.example.com/user2/photo2.jpeg',
        },
      ],
    },
  ],
  plans: [
    {
      planId: 'free',
      name: 'Free',
      storageLimit: '1GB',
      fileSizeLimit: '5MB',
      bandwidthLimit: '10GB/month',
      price: '0',
    },
    {
      planId: 'pro',
      name: 'Pro',
      storageLimit: '10GB',
      fileSizeLimit: '100MB',
      bandwidthLimit: '100GB/month',
      price: '$10/month',
    },
    {
      planId: 'enterprise',
      name: 'Enterprise',
      storageLimit: 'Unlimited',
      fileSizeLimit: 'Unlimited',
      bandwidthLimit: 'Unlimited',
      price: 'Contact Sales',
    },
  ],
  regions: [
    {
      value: 'us-east-1',
      label: 'US East (N. Virginia)',
    },
    {
      value: 'us-west-2',
      label: 'US West (Oregon)',
    },
    {
      value: 'eu-west-1',
      label: 'Europe (Ireland)',
    },
    {
      value: 'ap-south-1',
      label: 'Asia Pacific (Mumbai)',
    },
  ],
};
