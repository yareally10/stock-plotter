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

export interface InvestmentStep {
  date: string;
  stockPrice: number;
  sharesOwned: number;
  investmentValue: number;
  totalReturn: number;
  returnPercentage: number;
}

export interface InvestmentProjection {
  ticker: string;
  initialInvestment: number;
  duration: number;
  startDate: string;
  endDate: string;
  finalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  steps: InvestmentStep[];
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

  async getStockPriceData(ticker: string, durationMonths?: number): Promise<StockRow[]> {
    const url = durationMonths 
      ? `${API_URL}/stocks/${ticker}/prices?durationMonths=${durationMonths}`
      : `${API_URL}/stocks/${ticker}/prices`;
    const res = await fetch(url);
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
  },

  async calculateInvestmentProjection(
    ticker: string, 
    initialInvestment: number, 
    duration: number
  ): Promise<InvestmentProjection> {
    // Validate inputs
    if (initialInvestment <= 0) {
      throw new Error('Initial investment must be greater than 0');
    }
    if (![1, 3, 5].includes(duration)) {
      throw new Error('Duration must be 1, 3, or 5 years');
    }

    // Convert years to months and get historical stock data
    const durationMonths = duration * 12;
    const stockData = await this.getStockPriceData(ticker, durationMonths);
    
    if (stockData.length === 0) {
      throw new Error(`No historical data available for ${ticker}`);
    }

    // Sort data by date (oldest first)
    const sortedData = stockData.sort((a, b) => 
      new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    // Calculate the target end date based on duration
    const startDate = new Date(sortedData[0].Date);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + duration);

    // Filter data to only include entries within the duration period
    const filteredData = sortedData.filter(row => {
      const rowDate = new Date(row.Date);
      return rowDate >= startDate && rowDate <= endDate;
    });

    if (filteredData.length === 0) {
      throw new Error(`Insufficient data for ${duration} year projection`);
    }

    // Calculate investment projection
    const steps: InvestmentStep[] = [];
    let sharesOwned = 0;
    const initialPrice = parseFloat(filteredData[0].Close);

    // Calculate initial shares purchased
    sharesOwned = initialInvestment / initialPrice;

    // Calculate investment value at each data point
    filteredData.forEach((row, index) => {
      const currentPrice = parseFloat(row.Close);
      const investmentValue = sharesOwned * currentPrice;
      const totalReturn = investmentValue - initialInvestment;
      const returnPercentage = (totalReturn / initialInvestment) * 100;

      steps.push({
        date: row.Date,
        stockPrice: currentPrice,
        sharesOwned: sharesOwned,
        investmentValue: investmentValue,
        totalReturn: totalReturn,
        returnPercentage: returnPercentage
      });
    });

    // Get final values
    const finalStep = steps[steps.length - 1];
    const finalValue = finalStep.investmentValue;
    const totalReturn = finalStep.totalReturn;
    const totalReturnPercentage = finalStep.returnPercentage;

    return {
      ticker,
      initialInvestment,
      duration,
      startDate: filteredData[0].Date,
      endDate: filteredData[filteredData.length - 1].Date,
      finalValue,
      totalReturn,
      totalReturnPercentage,
      steps
    };
  }
}; 