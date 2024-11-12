// global.d.ts

interface TronWebContract {
    campaignCount: () => { call: () => Promise<number> };
    campaigns: (id: number) => { call: () => Promise<any> };
    createCampaign: (
      title: string,
      description: string,
      fundingGoal: number
    ) => { send: ({ from: string }) => Promise<any> };
    donateWithTRX: (campaignId: number) => { send: ({ from: string, callValue: number }) => Promise<any> };
    freezeCampaign: (campaignId: number) => { send: ({ from: string }) => Promise<any> };
  }
  
  interface TronWeb {
    defaultAddress: { base58: string };
    contract: (abi: object[], address: string) => TronWebContract;
    toSun: (amount: number) => number;
    fromSun: (amount: number) => string;
  }
  
  interface Window {
    tronWeb?: TronWeb;
  }
  