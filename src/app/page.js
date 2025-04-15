'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, Edit } from 'lucide-react';
import BudgetManager from '@/components/BudgetManager';
import BudgetInsights from '@/components/BudgetInsights';
import EditTransactionModal from '@/components/EditTransactionModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Image from 'next/image';
import logo from '@/../../public/FinTrackerLogo.png'

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowAddTransaction(false);
        setFormData({
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleTransactionUpdate = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t._id === updatedTransaction._id ? updatedTransaction : t
    ));
  };

  // Prepare data for monthly expenses chart
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).getMonth();
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month: new Date(2024, parseInt(month)).toLocaleString('default', { month: 'short' }),
    amount,
  }));

  // Prepare data for category breakdown
  const categoryData = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
        <Image src={logo} alt='fin-tracker logo' width={60} height={60}/>
          
          
          {/* Add new Transaction btn */}
          <button 
          className='bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center p-[.4rem] rounded bg-indigo-200 hover:bg-indigo-300 cursor-pointer hover:scale-[1.03] delay-50 duration-200 px-2 '
          onClick={() => setShowAddTransaction(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className='hidden sm:inline-flex'>
            Add
            </span>
             Transaction
          </button>
        </div>
     
        {/* Monthly Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                  formatter={(value) => [`₹${value.toFixed(2)}`, 'amount']}
                   />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
       
       {/* Budget insight  */}
        <BudgetInsights transactions={transactions} budgets={budgets} />
        {/* Budget manger */}
        <BudgetManager onBudgetUpdate={fetchBudgets} />
 
        {/* Recent Transactions above md screen size */}
        <div className="mt-8">
          <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            
            <table className="min-w-full w-full divide-y divide-gray-200 md:table hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction?.date && formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹ {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <EditTransactionModal 
                          transaction={transaction} 
                          onUpdate={handleTransactionUpdate} 
                        />
                        <DeleteConfirmationModal
                          transaction={transaction}
                          onDelete={handleDelete}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Recent Transactions below md screen size */}
            <div className='grid md:hidden items-center grid-cols-1 sm:grid-cols-2 gap-2 justify-center  w-full z-30'>
            {transactions.map((transaction) => (
              <div key={transaction._id} className='flex flex-col justify-start w-full h-full border-2 rounded-md gap-1 relative p-2 border-indigo-400 border-[1px] bg-indigo-50 text-sm'>
                <p className='text-gray-700 font-semibold'>
                  <span className='text-gray-500'>Date :&nbsp;</span>
                {transaction?.date && formatDate(transaction.date)}
                </p>
                <p className='text-gray-700 font-semibold'> 
                <span className='text-gray-500'>Description :&nbsp;
                </span>
                {transaction.description}
                </p>
                <p className='text-gray-700 font-semibold'> 
                  <span className='text-gray-500 '>Category :&nbsp;</span> 
                {transaction.category}
                </p>
                <p className='font-semibold text-gray-700 '> 
                <span className='text-gray-500'>Ammount :&nbsp;</span> 
                ₹{transaction.amount.toFixed(2)}
                </p>
                <div className="flex items-center space-x-2 absolute top-2 hover:bg-gray-100 p-1 rounded right-2">
                        <EditTransactionModal 
                          transaction={transaction} 
                          onUpdate={handleTransactionUpdate} 
                        />
                        <DeleteConfirmationModal
                          transaction={transaction}
                          onDelete={handleDelete}
                        />
               </div>
              </div>
            ))}
            </div>
          </div>

        </div>
        
        {/* New transaction input modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full p-3">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl text-indigo-500 w-full text-center font-semibold mb-4">Add Transaction</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                  {/* Description about transaction */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  {/* Category of transaction */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      <option value="Food">Food</option>
                      <option value="Rent">Rent</option>
                      <option value="Travel">Travel</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {/* Data of payment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Date</label>
                    <input
                      type="date"
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                </div>
                {/* Btns */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="reset"
                    className='border-1 border-gray-600 rounded-md bg-gray-100 px-3 py-0 text-gray-900  cursor-pointer hover:bg-gray-300 text-shadow-md delay-20 duration-150'
                    onClick={() => setShowAddTransaction(false)}
                  >
                    Cancel
                  </button>
                  <button 
                  className='border-1 rounded-md bg-indigo-500 px-3 py-2 text-white hover:scale-[1.02] cursor-pointer hover:bg-indigo-600 text-shadow-md delay-20 duration-150'
                  type="submit">Add Transaction</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
