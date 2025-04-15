'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

const EditTransactionModal = ({ transaction, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        onUpdate(updatedTransaction);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <>
      <button
        variant="ghost"
        size="icon"
        onClick={() => setShowModal(true)}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-indigo-500  text-center mb-4">Edit Transaction Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  text-gray-800 border-1 border-indigo-300 outline-0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  text-gray-800 border-1 border-indigo-300 outline-0"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  text-gray-800 border-1 border-indigo-300 outline-0"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
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
                  <label className="block text-sm font-semibold text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-indigo-500 py-1 px-3 text-md  text-gray-800 border-1 border-indigo-300 outline-0"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="reset"
                 className='border-1 border-gray-600 rounded-md bg-gray-100 px-3 py-0 text-gray-900  cursor-pointer hover:bg-gray-300 text-shadow-md delay-20 duration-150'
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                className='border-1 rounded-md bg-indigo-500 px-3 py-2 text-white hover:scale-[1.02] cursor-pointer hover:bg-indigo-600 text-shadow-md delay-20 duration-150'
                 type="submit">Update Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTransactionModal; 