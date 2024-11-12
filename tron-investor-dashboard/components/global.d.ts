// global.d.ts

interface TronWebContract {
    call: () => Promise<any>;
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
  