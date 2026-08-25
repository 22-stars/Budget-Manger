# Personal Budget Manager

A minimalistic, modern, and interactive personal budget management web application built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Monthly Budget Tracking** - Set and track your monthly budget with visual progress indicators
- 💰 **Category Management** - Create custom spending categories with individual budget limits
- 📝 **Expense Tracking** - Add, edit, and delete expenses with detailed information
- 📅 **Month Navigation** - Easily switch between months to view historical data
- 🎨 **Light/Dark Theme** - Toggle between light and dark modes with persistent preferences
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Visual Budget Indicators**:
  - 🟢 Normal (< 75% used)
  - 🟡 Warning (75-100% used)
  - 🔴 Over Budget (> 100% used)
- 🔍 **Filter & Sort** - Filter expenses by category and sort by date or amount
- 💾 **Local Storage** - Data persists locally in your browser

## Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: localStorage (easily extensible to API/database)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/budget-management-system.git
cd budget-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
budget-management-system/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── MonthSelector.tsx
│   │   ├── Summary.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── CategoryList.tsx
│   │   ├── ExpenseItem.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── Modal.tsx
│   │   ├── BudgetModal.tsx
│   │   ├── CategoryModal.tsx
│   │   └── ExpenseModal.tsx
│   ├── context/             # React Context providers
│   │   ├── BudgetContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/            # Data access layer
│   │   └── budgetStore.ts
│   ├── types/               # TypeScript interfaces
│   │   └── budget.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## Usage

### Setting Monthly Budget

1. Click the edit icon (✏️) next to "Total Budget" in the summary section
2. Enter your desired monthly budget
3. Click "Save"

### Managing Categories

- **Add Category**: Click "Add Category" button, enter name and budget limit
- **Edit Category**: Click the edit icon (✏️) on any category card
- **Delete Category**: Click the trash icon (🗑️) on any category card

### Managing Expenses

- **Add Expense**: Click "Add Expense" button or the "Add Expense" button on a category card
- **Edit Expense**: Click the edit icon (✏️) on any expense item
- **Delete Expense**: Click the trash icon (🗑️) on any expense item
- **Filter**: Use the category dropdown to filter expenses
- **Sort**: Click "Date" or "Amount" buttons to sort expenses

### Switching Months

Use the left (‹) and right (›) arrows to navigate between months. Each month maintains its own budget, categories, and expenses.

## Future Enhancements

Potential features for future versions:

- 📈 Charts and visualizations
- 💳 Income tracking
- 🔄 Recurring expenses/income
- 🎯 Savings goals
- 📊 Monthly/yearly comparisons
- 📤 Export to CSV/Excel
- ☁️ Cloud sync
- 🔐 User authentication
- 🌍 Multiple currencies
- 📱 Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Demo Data

The application comes with seed data for August 2026 to help you get started:

- Monthly Budget: ₹60,000
- Pre-configured categories: Food, Transportation, Shopping, Bills, Entertainment, Savings, Other
- Sample expenses across different categories

You can modify or delete this demo data at any time.

## Author

Built with ❤️ using React, TypeScript, and Tailwind CSS

---

**Note**: This application stores data locally in your browser. Clear browser data will reset the application.
