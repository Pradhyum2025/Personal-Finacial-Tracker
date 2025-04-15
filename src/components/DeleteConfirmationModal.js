'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function DeleteConfirmationModal({ transaction, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(transaction._id);
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <>
      <button
        variant="ghost"
        size="icon"
        onClick={() => setShowModal(true)}
        className="text-red-500 hover:text-red-700 cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl text-red-600  font-bold mb-4 flex  items-center justify-center gap-2"><IoMdInformationCircleOutline className='text-3xl'/>Delete Transaction</h2>
            <p className="text-gray-700 mb-6 w-full text-center text-[1.1rem] font-md">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
               className='border-1 border-gray-600 rounded-md bg-gray-100 px-3 py-0 text-gray-900  cursor-pointer hover:bg-gray-300 text-shadow-md delay-20 duration-150'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className='border-0 font-bold rounded-md bg-red-600 px-3 py-2 text-white hover:scale-[1.02] cursor-pointer hover:bg-red-700  delay-20 duration-150'
                onClick={handleDelete}
              >
                Yes, I am sure
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 