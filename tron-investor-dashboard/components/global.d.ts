// global.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

interface TronWebContract {
    campaignCount: () => { call: () => Promise<number> };
    campaigns: (id: number) => { call: () => Promise<Campaign> };
    createCampaign: (
      title: string,
      description: string,
      fundingGoal: number
    ) => { send: ({ from: string }) => Promise<TransactionReceipt> };
    donateWithTRX: (
      campaignId: number
    ) => { send: ({ from: string; callValue: number }) => Promise<TransactionReceipt> };
    freezeCampaign: (
      campaignId: number
    ) => { send: ({ from: string }) => Promise<TransactionReceipt> };
  }
  
  interface Campaign {
    creator: string;
    title: string;
    description: string;
    fundingGoal: number;
    totalDonationsTRX: number;
    totalDonationsUSD: number;
    funded: boolean;
    frozen: boolean;
  }
  
  interface TransactionReceipt {
    // Define properties of a typical transaction receipt if needed.
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
  