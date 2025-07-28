/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || '';

export interface StockRow {
  [key: string]: string;
}

export interface StockSummary {
  ticker: string;
  startDate: string | null;
  endDate: string | null;
  priceChange: number | null;
  startPrice: number | null;
  endPrice: number | null;
  changePercentage: number | null;
  loading: boolean;
  error?: string;
}

export interface StockChartData {
  ticker: string;
  data: StockRow[];
}

export const StockService = {
  async getAllTickers(): Promise<string[]> {
    const res = await fetch(`${API_URL}/stocks`);
    const json = await res.json();
    return json.stocks || [];
  },

  async getStockSummary(ticker: string): Promise<StockSummary> {
    const res = await fetch(`${API_URL}/stocks/${ticker}/prices`);
    const json = await res.json();
    return {
      ticker,
      startDate: json.startDate || null,
      endDate: json.endDate || null,
      priceChange: typeof json.priceChange === 'number' ? json.priceChange : null,
      startPrice: typeof json.startPrice === 'number' ? json.startPrice : null,
      endPrice: typeof json.endPrice === 'number' ? json.endPrice : null,
      changePercentage: typeof json.changePercentage === 'number' ? json.changePercentage : null,
      loading: false,
    };
  },

  async getStockChartData(ticker: string): Promise<StockRow[]> {
    const res = await fetch(`${API_URL}/stocks/${ticker}/prices`);
    const json = await res.json();
    return (json.prices || []).map((row: any) => ({
      Date: row.date,
      Close: row.close
    }));
  },

  async getPaginatedStockData(ticker: string, page = 1): Promise<{ data: StockRow[]; totalPages: number; }> {
    const res = await fetch(`${API_URL}/stocks/${ticker}?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch stock data');
    const json = await res.json();
    return {
      data: json.data || [],
      totalPages: json.totalPages || 1
    };
  }
}; 