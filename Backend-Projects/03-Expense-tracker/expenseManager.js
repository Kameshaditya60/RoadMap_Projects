const fs = require('fs');
const path = './expenses.json';
const { v4: uuidv4 } = require('crypto');

function readExpenses() {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function writeExpenses(expenses) {
    fs.writeFileSync(path, JSON.stringify(expenses, null, 2));
}

function addExpense(description, amount, category) {
    if (!description || isNaN(amount) || amount <= 0 ) {
        console.log("❌ Invalid input. Amount Should be a positive number.");
        return;
    }

    const newExpense = {
        id : uuidv4().slice(0,6), 
        description,
        amount,
        category: category || 'Uncategorized',
        date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    }
    const expenses = readExpenses();
    expenses.push(newExpense);
    writeExpenses(expenses);
    console.log(`✅ Expense added: ${newExpense.description} - $${newExpense.amount} (${newExpense.category})`);
}

module.exports = { addExpense };