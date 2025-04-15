'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function BudgetManager({ onBudgetUpdate }) {
  const [budgets, setBudgets] = useState([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      const data = await response.json();
      setBudgets(data);
      // Call the parent's callback to update the insights
      if (onBudgetUpdate) {
        onBudgetUpdate();
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowAddBudget(false);
        setFormData({
          category: '',
          amount: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
        fetchBudgets();
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchBudgets();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-xl font-semibold">Budget Management</h2>
        <button
        className='bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center p-[.4rem] rounded bg-yellow-200 hover:bg-yellow-300 cursor-pointer hover:scale-[1.03] delay-50 duration-200 px-2'
         onClick={() => setShowAddBudget(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className='hidden sm:inline-flex'>
            Add
            </span>
          Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <div key={budget._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{budget.category}</h3>
                <p className="text-gray-600">
                  {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-2xl font-bold mt-2">₹ {budget.amount.toFixed(2)}</p>
              </div>

              <button
                onClick={() => handleDelete(budget._id)}
                className="text-red-500 hover:text-red-700 cursor-pointer "
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl text-yellow-500 text-center  font-semibold mb-4">Add Budget</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Month</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Year</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  border-1 border-indigo-300 outline-0"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="reset"
                  className="border-1 border-gray-600 rounded-md bg-gray-100 px-3 py-2 text-gray-900  cursor-pointer hover:bg-gray-300 text-shadow-md delay-20 duration-150"
                  onClick={() => setShowAddBudget(false)}
                >
                  Cancel
                </button>
                <button
                 type="submit"
                 className='border-0 font-semibold rounded-md bg-yellow-400 px-3 py-2 text-gray-600 hover:scale-[1.02] cursor-pointer hover:bg-yellow-500 text-shadow-md delay-20 duration-150'
                 >Add Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 