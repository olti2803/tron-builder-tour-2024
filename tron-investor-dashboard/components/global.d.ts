// global.d.ts

interface Window {
    tronWeb?: {
      defaultAddress: { base58: string };
      contract: (abi: any[], address: string) => Promise<any>;
      toSun: (amount: number) => number;
      fromSun: (amount: number) => number;
    };
  }
  