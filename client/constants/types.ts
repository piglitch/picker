export interface UserApp {
  appId: string;
  appName: string;
  appUrl: string;
  storageUsed: string;
  storageLimit: string;
  plan: string;
}

export interface AppDetails {
  userApps: UserApp[];
}

export interface cdnFile {
  id: number,
  
}