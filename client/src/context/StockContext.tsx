import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StockService } from '../services/StockService';

interface StockContextValue {
  tickers: string[];
  loadingTickers: boolean;
  tickersError: string | null;
}

const StockContext = createContext<StockContextValue>({
  tickers: [],
  loadingTickers: true,
  tickersError: null,
});

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [loadingTickers, setLoadingTickers] = useState<boolean>(true);
  const [tickersError, setTickersError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingTickers(true);
    setTickersError(null);
    StockService.getAllTickers()
      .then(list => {
        if (!isMounted) return;
        setTickers(list || []);
        setLoadingTickers(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setTickersError('Failed to fetch stocks');
        setLoadingTickers(false);
      });
    return () => { isMounted = false; };
  }, []);

  const value = useMemo<StockContextValue>(() => ({ tickers, loadingTickers, tickersError }), [tickers, loadingTickers, tickersError]);

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => useContext(StockContext);


