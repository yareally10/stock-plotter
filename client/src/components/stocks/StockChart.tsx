import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import { StockChartData } from '../../services/StockService';
import { normalizeStocksDataDatesAscending } from '../../services/util';

interface StockChartProps {
  stocksData: StockChartData[];
  title?: string;
}

const StockChart: React.FC<StockChartProps> = ({ stocksData, title }) => {
  // Define colors for different stocks
  const colors = [
    'rgba(75,192,192,1)',
    'rgba(255,99,132,1)',
    'rgba(54,162,235,1)',
    'rgba(255,206,86,1)',
    'rgba(153,102,255,1)',
  ];

  const backgroundColorColors = [
    'rgba(75,192,192,0.2)',
    'rgba(255,99,132,0.2)',
    'rgba(54,162,235,0.2)',
    'rgba(255,206,86,0.2)',
    'rgba(153,102,255,0.2)',
  ];

  // Ensure each stock's data is in ascending date order (oldest -> newest)
  const normalizedStocksData = normalizeStocksDataDatesAscending(stocksData);

  const datasets = normalizedStocksData.map((stock, index) => {
    return {
      label: `${stock.ticker.toUpperCase()} Close Price`,
      data: stock.data.map(row => {
        const close = row['Close'];
        if (typeof close === 'string') {
          return parseFloat(close.replace(/,/g, ''));
        }
        return null;
      }),
      borderColor: colors[index % colors.length],
      backgroundColor: backgroundColorColors[index % backgroundColorColors.length],
      tension: 0.1,
    };
  });

  // Helper to format date labels for readability
  const formatDateLabel = (dateStr: string): string => {
    // YYYY-MM -> MMM YYYY (render in UTC to avoid TZ month shift)
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [y, m] = dateStr.split('-').map(Number);
      const date = new Date(Date.UTC(y, (m || 1) - 1, 1));
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    // Try generic date parsing (render in UTC)
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    }
    return dateStr;
  };

  // Use the first stock's dates as labels (assuming all stocks have the same date range)
  const labelsRaw = normalizedStocksData.length > 0 ? normalizedStocksData[0].data.map(row => row['Date']) : [];
  const labels = labelsRaw.map(formatDateLabel);

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { 
        display: false
      },
    },
    scales: {
      x: { 
        title: { display: true, text: 'Date', font: { weight: 700 } },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: Math.min(12, labels.length || 12),
          font: {
            size: 12
          }
        }
      },
      y: { title: { display: true, text: 'Price', font: { weight: 700 } } },
    },
  };

  return (
    <div
      style={{
        margin: '24px auto',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: 300,
        boxSizing: 'border-box',
      }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart; 