import React from 'react';
import Table from '../core/Table';
import { InvestmentProjection } from '../../services/StockService';

interface InvestmentTableViewProps {
  projections: InvestmentProjection[];
}

const InvestmentTableView: React.FC<InvestmentTableViewProps> = ({ projections }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="space-y-4">
      {projections.map((projection, index) => (
        <div key={projection.ticker} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{projection.ticker.toUpperCase()}</h3>
            <span className="text-sm text-gray-500">
              {projection.startDate} to {projection.endDate}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Initial Investment</p>
              <p className="font-bold">{formatCurrency(projection.initialInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Final Value</p>
              <p className="font-bold">{formatCurrency(projection.finalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Return</p>
              <p className={`font-bold ${projection.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(projection.totalReturn)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return %</p>
              <p className={`font-bold ${projection.totalReturnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(projection.totalReturnPercentage)}
              </p>
            </div>
          </div>

          {/* Investment Timeline using existing Table component */}
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Investment Timeline</h4>
            <div className="overflow-y-auto">
              <Table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Shares</th>
                    <th>Value</th>
                    <th>Return %</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.steps.map((step, stepIndex) => (
                    <tr key={stepIndex}>
                      <td>{new Date(step.date).toLocaleDateString()}</td>
                      <td>{formatCurrency(step.stockPrice)}</td>
                      <td>{step.sharesOwned.toFixed(4)}</td>
                      <td>{formatCurrency(step.investmentValue)}</td>
                      <td className={step.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentage(step.returnPercentage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentTableView;
