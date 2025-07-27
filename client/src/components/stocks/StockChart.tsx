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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockRow {
  [key: string]: string;
}

interface StockData {
  ticker: string;
  data: StockRow[];
}

interface StockChartProps {
  stocksData: StockData[];
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

  const datasets = stocksData.map((stock, index) => {
    const reversedData = [...stock.data].reverse();
    return {
      label: `${stock.ticker.toUpperCase()} Close Price`,
      data: reversedData.map(row => {
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

  // Use the first stock's dates as labels (assuming all stocks have the same date range)
  const labels = stocksData.length > 0 ? [...stocksData[0].data].reverse().map(row => row['Date']) : [];

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { 
        display: true, 
        text: title || (stocksData.length === 1 ? `${stocksData[0].ticker.toUpperCase()} Close Price` : 'Stock Comparison')
      },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price' } },
    },
  };

  return (
    <div
      style={{
        margin: '24px auto',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: 400,
        boxSizing: 'border-box',
      }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart; 