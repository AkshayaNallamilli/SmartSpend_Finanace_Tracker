# 💰 SmartSpend - Personal Finance Tracker

SmartSpend is a modern personal finance management web application that helps users track income, expenses, savings, budgets, and emergency withdrawals in an organized and visual way.

## 🚀 Features

### 📊 Dashboard
- Month-wise financial overview
- Total Income
- Total Expenses
- Total Savings
- Current Balance
- Monthly Budget Summary
- Expense Distribution Chart
- Recent Transactions

### 💵 Transactions
- Add Income, Expense, and Savings transactions
- Edit transactions
- Delete transactions
- Month-wise filtering
- Type-wise filtering
- Transaction history management

### 📅 Monthly Budget Planner
- Create monthly budgets
- Edit and delete budgets
- Budget usage tracking
- Remaining budget calculation
- Budget progress visualization
- Over-budget detection

### 🏦 Savings Tracker
- Create multiple savings goals
- Set target amounts
- Edit and delete goals
- Progress tracking
- Month-wise savings filter

### 🚨 Emergency Withdrawal Module
- Record emergency withdrawals
- Automatically determine withdrawal source:
  - Balance
  - Savings
  - Balance + Savings
- Withdrawal history
- Month-wise filtering
- Edit and delete withdrawals
- Withdrawal statistics summary

### 📈 Data Visualization
- Interactive expense chart using Chart.js
- Category-wise expense distribution

### 💾 Local Storage Support
- No database required
- Data persists in browser storage
- Fast and lightweight

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- Font Awesome
- Browser Local Storage

---

## 📂 Project Structure

```
SmartSpend/
│
├── index.html
├── transactions.html
├── budget.html
├── savings.html
├── emergency.html
├── tips.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── dashboard.js
│   ├── transactions.js
│   ├── budget.js
│   ├── savings.js
│   ├── emergency.js
│   └── tips.js
│
└── README.md
```

---

## 🎯 How It Works

### Balance Formula

```
Balance = Income - Expenses - Savings
```

### Emergency Withdrawal Logic

1. Withdraw from available Balance first.
2. If Balance is insufficient, use Savings.
3. If both are exhausted, the Dashboard reflects a negative Balance.
4. Savings never become negative; once fully utilized, any additional withdrawal amount contributes to the negative Balance.
---

## ✨ Future Enhancements

- User Authentication
- Cloud Data Backup
- Export Reports (PDF/Excel)
- Dark Mode
- Recurring Transactions
- Financial Insights using AI
- Savings Goal Contributions
- Notifications & Reminders

---

## 📸 Screenshots

- Dashboard
  
  <img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/2a4d0aa7-cf27-46d2-978d-eb9a72f3c34a" />

- Transactions
<img width="1918" height="901" alt="image" src="https://github.com/user-attachments/assets/84d638c3-7392-485b-b476-c5ddd54fb20b" />

- Budget Planner
<img width="1918" height="898" alt="image" src="https://github.com/user-attachments/assets/21958617-6345-4062-926e-5071e14c4968" />

- Savings Tracker
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/327f7139-319a-4178-85f8-20787a963667" />

- Emergency Withdrawal Module

  <img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/7c781fb7-a9dc-43ed-9fe1-78031e5d8cd3" />




---

## 👨‍💻 Author

**Akshaya Nallamilli**

B.Tech CSE Student | Web Development Enthusiast

Built as a personal finance management project using HTML, CSS, and JavaScript.

---
## 📄 License

This project is developed for educational and portfolio purposes only.

---

## ⭐ Project Highlights

- Professional dashboard UI
- Month-wise financial tracking
- Budget management system
- Savings goal tracking
- Emergency withdrawal management
- Fully responsive design
- Local storage based persistence

---
## ⭐ Support

If you found this project useful, please consider giving it a star!

---
