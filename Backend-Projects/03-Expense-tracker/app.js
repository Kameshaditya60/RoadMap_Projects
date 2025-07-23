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
console.log("args:", args);

    
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

}  else if (command === 'list') {
  const expenses = loadExpenses();

  if (expenses.length === 0) {
    console.log('📭 No expenses found.');
    process.exit(0);
  }

  console.log(`📋 Total Expenses: ${expenses.length}`);
  expenses.forEach(exp => {
    const formattedDate = new Date(exp.date).toLocaleDateString();
    console.log(`📅 ${formattedDate} | 💬 ${exp.description} | 💰 ₹${exp.amount} | 🏷️ ${exp.category}`);
  });

} else if (command === 'filter') {
    console.log("args:", args);
  const filterType = args[0];
  const filterValue = args[1];
  console.log("Filter Type:", filterType);
  console.log("Filter Value:", filterValue);

  if (!filterType || !filterValue) {
    console.log("❌ Usage: node app.js filter <category|date> <value>");
    process.exit(1);
  }

  const expenses = loadExpenses();

  let filtered = [];

  if (filterType === 'category') {
    filtered = expenses.filter(exp => exp.category.toLowerCase() === filterValue.toLowerCase());
  } else if (filterType === 'date') {
    filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date).toISOString().split('T')[0];
      return expDate === filterValue;
    });
  } else {
    console.log("❌ Invalid filter type. Use 'category' or 'date'");
    process.exit(1);
  }

  if (filtered.length === 0) {
    console.log("📭 No matching expenses found.");
  } else {
    filtered.forEach(exp => {
      const formattedDate = new Date(exp.date).toLocaleDateString();
      console.log(`📅 ${formattedDate} | 💬 ${exp.description} | 💰 ₹${exp.amount} | 🏷️ ${exp.category}`);
    });
  }
} else if (command === 'remove') {
  const idToRemove = parseInt(args[0]);

  if (isNaN(idToRemove)) {
    console.log("❌ Usage: node app.js remove <expense_id>");
    process.exit(1);
  }

  const expenses = loadExpenses();
  const updatedExpenses = expenses.filter(exp => exp.id !== idToRemove);

  if (expenses.length === updatedExpenses.length) {
    console.log(`❌ Expense with ID ${idToRemove} not found.`);
  } else {
    saveExpenses(updatedExpenses);
    console.log(`✅ Expense with ID ${idToRemove} has been removed.`);
  }
}  else if (command === 'summary') {
  const expenses = loadExpenses();

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  console.log(`💸 Total Expenses: ₹${total}`);

  const categorySummary = {};
  expenses.forEach(exp => {
    if (!categorySummary[exp.category]) {
      categorySummary[exp.category] = 0;
    }
    categorySummary[exp.category] += exp.amount;
  });

  console.log("📊 Breakdown by Category:");
  for (const category in categorySummary) {
    console.log(`- ${category}: ₹${categorySummary[category]}`);
  }
}

