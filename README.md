# Personal Finance Tracker

A full-stack web application for tracking personal finances with data visualization capabilities.

## Features

### Stage 1: Basic Transaction Tracking
- Create, edit, and delete transactions
- List view of all transactions
- Monthly expenses bar chart
- Basic form validation

### Stage 2: Categories
- Categorized transactions
- Expense breakdown by category (pie chart)
- Dashboard with:
  - Total expenses
  - Category breakdown
  - Recent transactions

### Stage 3: Budgeting
- Set monthly budgets per category
- Compare budget vs actual spending
- Budget insights and alerts

## Tech Stack

- Next.js (App Router)
- React
- JavaScript
- Tailwind CSS with shadcn/ui components
- Recharts for data visualization
- MongoDB (using Mongoose)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Add your MongoDB connection string as an environment variable
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
