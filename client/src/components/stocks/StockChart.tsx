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

interface StockChartProps {
  allChartData: StockRow[];
  ticker: string;
}

const StockChart: React.FC<StockChartProps> = ({ allChartData, ticker }) => {
  const reversedChartData = [...allChartData].reverse();
  const chartData = {
    labels: reversedChartData.map(row => row['Date']),
    datasets: [
      {
        label: 'Close Price',
        data: reversedChartData.map(row => {
          const close = row['Close'];
          if (typeof close === 'string') {
            return parseFloat(close.replace(/,/g, ''));
          }
          return null;
        }),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Make chart fill container
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `${ticker.toUpperCase()} Close Price` },
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