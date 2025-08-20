import { StockChartData } from './StockService';

export function normalizeStocksDataDatesAscending(stocksData: StockChartData[]): StockChartData[] {
  return stocksData.map(stock => {
    const dataCopy = [...stock.data];
    if (dataCopy.length >= 2) {
      const firstDate = new Date(dataCopy[0]['Date']).getTime();
      const lastDate = new Date(dataCopy[dataCopy.length - 1]['Date']).getTime();
      if (!Number.isNaN(firstDate) && !Number.isNaN(lastDate) && firstDate > lastDate) {
        dataCopy.reverse();
      }
    }
    return { ...stock, data: dataCopy };
  });
}


