// api.ts

import axios from 'axios';

// Define TronData type based on the expected API response structure
export type TronData = {
  market_data: {
    current_price: { usd: number };
    circulating_supply: number;
    total_volume: { usd: number };
    price_change_percentage_24h: number;
  };
  market_cap_rank: number;
};

export const getTronPriceData = async (): Promise<TronData> => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/tron');
    return response.data;
  } catch (error) {
    console.error('Error fetching TRON data:', error);
    throw error;
  }
};

export const getTronHistoricalData = async (days: number) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/tron/market_chart`,
      { params: { vs_currency: 'usd', days } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching TRON historical data:', error);
    throw error;
  }
};
