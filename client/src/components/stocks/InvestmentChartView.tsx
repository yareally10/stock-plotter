import React from 'react';
import StockChart from './StockChart';
import { InvestmentProjection } from '../../services/StockService';

interface InvestmentChartViewProps {
  projections: InvestmentProjection[];
}

const InvestmentChartView: React.FC<InvestmentChartViewProps> = ({ projections }) => {
  // Chart data for investment projections - updated to work with StockChart component
  const getChartData = () => {
    if (projections.length === 0) return [];

    return projections.map(projection => ({
      ticker: projection.ticker,
      data: projection.steps
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending (oldest to newest)
        .map(step => ({
          Date: new Date(step.date).toLocaleDateString(),
          Close: step.investmentValue.toString()
        }))
    }));
  };

  const chartData = getChartData();
  
  if (chartData.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available for chart</div>;
  }

  return (
    <StockChart 
      stocksData={chartData} 
      title="Investment Value Over Time"
    />
  );
};

export default InvestmentChartView;
