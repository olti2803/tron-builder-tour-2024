import axios from 'axios';

interface TronMarketData {
  current_price: { usd: number };
  circulating_supply: number;
  total_volume: { usd: number };
}

interface TronData {
  market_data: TronMarketData;
  market_cap_rank: number;
}

export const getTronPriceData = async (): Promise<TronData> => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/tron');
    return response.data;
  } catch (error) {
    console.error('Error fetching TRON data:', error);
    throw error;
  }
};

// Define type for historical data response if needed.
interface HistoricalDataPoint {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const getTronHistoricalData = async (days: number): Promise<HistoricalDataPoint | undefined> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/tron/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching TRON historical data:', error);
  }
};
