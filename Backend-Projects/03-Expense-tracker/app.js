// app.js

const fs = require('fs');
const path = require('path');

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'expenses.json');

// Helper to load data
function loadExpenses() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Helper to save data
function saveExpenses(expenses) {
  fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
}

function loadExpenses() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }

  const data = fs.readFileSync(dataFilePath, 'utf-8');
  
  // Fix: If file is empty, return an empty array
  if (data.trim() === '') {
    return [];
  }

  return JSON.parse(data);
}


// CLI Arguments
const [,, command, ...args] = process.argv;

if (command === 'add') {
  const [description, amountStr, category] = args;
  const amount = parseFloat(amountStr);

  if (!description || isNaN(amount) || !category) {
    console.log('❌ Invalid input. Usage: node app.js add "Desc" 150 Category');
    process.exit(1);
  }

  const expenses = loadExpenses();

  const newExpense = {
    id: Date.now(),
    description,
    amount,
    date: new Date(),
    category
  };

  expenses.push(newExpense);
  saveExpenses(expenses);

  console.log('✅ Expense added:', newExpense);
}
