import axios from 'axios';

export const getTronPriceData = async (): Promise<any> => {
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