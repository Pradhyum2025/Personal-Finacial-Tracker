import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Rent', 'Travel', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Other'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
}, {
  timestamps: true,
});

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget; 