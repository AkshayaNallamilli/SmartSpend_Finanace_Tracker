// ==========================
// MONTH DROPDOWN
// ==========================

const monthFilter =
document.getElementById("monthFilter");

const allTransactions =
JSON.parse(localStorage.getItem("transactions")) || [];

const budgets =
JSON.parse(localStorage.getItem("budgets")) || [];
// Get unique months
const months = [
    ...new Set(
        allTransactions.map(item =>
            item.date.slice(0,7)
        )
    )
];

// If no data, use current month
if(months.length === 0){

    months.push(
        new Date().toISOString().slice(0,7)
    );
}

// Latest month first
months.sort().reverse();

months.forEach(month => {

    const option =
    document.createElement("option");

    option.value = month;

    const date =
    new Date(month + "-01");

    option.textContent =
    date.toLocaleString("default",{
        month:"long",
        year:"numeric"
    });

    monthFilter.appendChild(option);

});

// ==========================
// LOAD DASHBOARD
// ==========================

function loadDashboard(selectedMonth){

    const transactions =
    allTransactions.filter(item =>
        item.date.startsWith(selectedMonth)
    );

    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;

    const withdrawals =
JSON.parse(
    localStorage.getItem("withdrawals")
) || [];

    transactions.forEach(item => {

        if(item.type === "Income")
            totalIncome += Number(item.amount);

        else if(item.type === "Expense")
            totalExpense += Number(item.amount);

        else if(item.type === "Savings")
            totalSavings += Number(item.amount);

    });

    

 let balance =
totalIncome -
totalExpense -
totalSavings;

let savingsReduction = 0;

withdrawals.forEach(item => {

    if(item.month !== selectedMonth)
        return;

    if(item.source === "Balance"){

        balance -= Number(item.amount);

    }

    else if(item.source === "Savings"){

        savingsReduction +=
        Number(item.amount);

    }

    else if(item.source === "Balance + Savings"){

    const totalAvailable =
    balance + totalSavings;

    const shortage =
    Number(item.amount) - totalAvailable;

    savingsReduction =
    totalSavings;

    if(shortage > 0){

        balance = -shortage;

    }else{

        balance = 0;

    }

}

});

totalSavings =
Math.max(
    totalSavings - savingsReduction,
    0
);  






    // Cards

    document.getElementById("income").innerText =
    `₹${totalIncome.toLocaleString()}`;

    document.getElementById("expense").innerText =
    `₹${totalExpense.toLocaleString()}`;

    document.getElementById("savings").innerText =
    `₹${totalSavings.toLocaleString()}`;

    const balanceElement =
document.getElementById("balance");

balanceElement.innerText =
`₹${balance.toLocaleString()}`;

if(balance < 0){

    balanceElement.style.color =
    "#dc2626";

}else{

    balanceElement.style.color =
    "#2563eb";

}

    // Budget

const currentBudget =
budgets.find(
    b => b.month === selectedMonth
);

const budgetAmount =
currentBudget
?
Number(currentBudget.amount)
:
0;

document.getElementById(
"budgetAmount"
).innerText =
`₹${budgetAmount.toLocaleString()}`;

const remaining =
budgetAmount - totalExpense;

if(remaining >= 0){

    document.getElementById(
    "remainingBudget"
    ).innerText =
    `Remaining ₹${remaining.toLocaleString()}`;

}else{

    document.getElementById(
    "remainingBudget"
    ).innerText =
    `Over Budget ₹${Math.abs(remaining).toLocaleString()}`;

}

let percentage = 0;

if(budgetAmount > 0){

    percentage =
    (totalExpense / budgetAmount) * 100;

    if(percentage > 100){

        percentage = 100;

    }

}

document.getElementById(
"budgetProgress"
).style.width =
percentage + "%";

   
    // Recent Transactions

    const table =
    document.getElementById(
        "recentTransactions"
    );

    table.innerHTML = "";

    const latest =
    transactions.slice(-5).reverse();

    latest.forEach(item => {

        let badgeClass = "";

        if(item.type === "Income")
            badgeClass = "income-tag";

        if(item.type === "Expense")
            badgeClass = "expense-tag";

        if(item.type === "Savings")
            badgeClass = "savings-tag";

        const row =
        document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.description}</td>
            <td>₹${Number(item.amount).toLocaleString()}</td>
            <td>
                <span class="tag ${badgeClass}">
                    ${item.type}
                </span>
            </td>
            <td>${item.category}</td>
        `;

        table.appendChild(row);

    });

    // Pie Chart

    let categoryTotals = {};

    transactions.forEach(item => {

        if(item.type === "Expense"){

            if(categoryTotals[item.category]){

                categoryTotals[item.category] +=
                Number(item.amount);

            }else{

                categoryTotals[item.category] =
                Number(item.amount);

            }

        }

    });

    const labels =
    Object.keys(categoryTotals);

    const values =
    Object.values(categoryTotals);

    const ctx =
    document.getElementById("expenseChart");

    if(window.expenseChartInstance){

        window.expenseChartInstance.destroy();

    }

    window.expenseChartInstance =
    new Chart(ctx,{

        type:"doughnut",

        data:{
            labels:labels,

            datasets:[{
                data:values,

                backgroundColor:[
                    "#3b82f6",
                    "#22c55e",
                    "#f97316",
                    "#a855f7",
                    "#ef4444",
                    "#14b8a6",
                    "#eab308"
                ]
            }]
        },

        options:{
            responsive:true,

            plugins:{
                legend:{
                    position:"right"
                }
            }
        }

    });

}

// ==========================
// MONTH CHANGE
// ==========================

monthFilter.addEventListener(
"change",
() => {

    loadDashboard(
        monthFilter.value
    );

});

// Initial Load

loadDashboard(
    monthFilter.value
);