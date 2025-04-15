'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BudgetInsights({ transactions, budgets }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    calculateInsights();
  }, [transactions, budgets]);

  const calculateInsights = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Filter budgets for current month and year
    const currentBudgets = budgets.filter(
      budget => budget.month === currentMonth && budget.year === currentYear
    );

    // Calculate total spending per category for current month
    const monthlySpending = transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() + 1 === currentMonth && transactionDate.getFullYear() === currentYear) {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    // Calculate insights
    const insightsData = currentBudgets.map(budget => {
      const spent = monthlySpending[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
      const message = getStatusMessage({ percentage, remaining });

      return {
        id: budget._id,
        category: budget.category,
        budget: budget.amount,
        spent,
        remaining,
        percentage,
        status,
        message,
        month: budget.month,
        year: budget.year
      };
    });

    setInsights(insightsData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'over':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'good':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusMessage = ({ percentage, remaining }) => {
    if (percentage > 100) { 
      return <p>You have overspent by &#8377;
        <span>
        {Math.abs(remaining).toFixed(2)}
        </span>
        </p>
    } else if (percentage > 80) {
      return <p>You have used &#8377;
        <span>
        {percentage.toFixed(0)}
        </span>
        of your budget
        </p>
     
    } else {
      return <p>You have &#8377;
        <span>
        {remaining.toFixed(2)}
        </span>
        &nbsp;
         remaining
        </p>
      
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Budget Insight</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">Budget vs Actual Spending</h3>
          <div className="h-80">
            {insights.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insights}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toFixed(2)}`, '']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="budget" 
                    fill="#8884d8" 
                    name="Budget"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="spent" 
                    fill="#82ca9d" 
                    name="Spent"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>No budget data available for the current month</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Status Cards */}
        <div>
          <h3 className="text-lg font-medium mb-4">Budget Status</h3>
          {insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`border rounded-lg p-4 ${
                    insight.status === 'over' ? 'bg-red-50 border-red-200' :
                    insight.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{insight.category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.status === 'over' ? 'bg-red-100 text-red-800' :
                      insight.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.status === 'over' ? 'Over Budget' :
                       insight.status === 'warning' ? 'Warning' :
                       'On Track'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{"₹"+ insight.budget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">{"₹" +insight.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{ insight.remaining < 0?'overSpending':'Remaining'}:</span>
                      <span className={`font-medium ${
                        insight.remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {"₹"+ Math.abs(insight.remaining).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          insight.status === 'over' ? 'bg-red-500' :
                          insight.status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (insight.spent / insight.budget) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-2">{insight.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p>No budget data available for the current month</p>
              <p className="text-sm mt-2">Add budgets to see insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 