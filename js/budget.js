// ==========================
// LOAD DATA
// ==========================

let budgets =
JSON.parse(localStorage.getItem("budgets")) || [];

let editingIndex = -1;

const transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

// ==========================
// ELEMENTS
// ==========================

const budgetForm =
document.getElementById("budgetForm");

const budgetTable =
document.getElementById("budgetTable");

const displayBudget =
document.getElementById("displayBudget");

const spentAmount =
document.getElementById("spentAmount");

const remainingAmount =
document.getElementById("remainingAmount");

const budgetProgressBar =
document.getElementById("budgetProgressBar");

const overviewMonth =
document.getElementById("overviewMonth");

// ==========================
// SAVE BUDGETS
// ==========================

function saveBudgets() {

    localStorage.setItem(
        "budgets",
        JSON.stringify(budgets)
    );

}

function loadMonthDropdown(){

    overviewMonth.innerHTML = "";

    budgets.forEach(item => {

        const option =
        document.createElement("option");

        option.value =
        item.month;

        const date =
        new Date(item.month + "-01");

        option.textContent =
        date.toLocaleString("default",{
            month:"long",
            year:"numeric"
        });

        overviewMonth.appendChild(option);

    });

}

// ==========================
// CURRENT MONTH
// ==========================

function getCurrentMonth() {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2,"0");

    return `${year}-${month}`;

}

// ==========================
// CURRENT MONTH EXPENSE
// ==========================

function getCurrentMonthExpense() {

    const currentMonth =
    getCurrentMonth();

    let expense = 0;

    transactions.forEach(transaction => {

        if(
            transaction.type === "Expense" &&
            transaction.date.startsWith(currentMonth)
        ){

            expense +=
            Number(transaction.amount);

        }

    });

    return expense;

}

// ==========================
// UPDATE SUMMARY
// ==========================

function updateSummary(selectedMonth = null){

    if(!selectedMonth){

        selectedMonth =
        overviewMonth.value ||
        getCurrentMonth();

    }

    const budget =
    budgets.find(
        b => b.month === selectedMonth
    );

    const budgetAmount =
    budget
    ?
    Number(budget.amount)
    :
    0;

    let expenses = 0;

    transactions.forEach(transaction => {

        if(
            transaction.type === "Expense" &&
            transaction.date.startsWith(selectedMonth)
        ){

            expenses +=
            Number(transaction.amount);

        }

    });

    const remaining =
    budgetAmount - expenses;

    displayBudget.innerText =
    `₹${budgetAmount.toLocaleString()}`;

    spentAmount.innerText =
    `Spent: ₹${expenses.toLocaleString()}`;

    remainingAmount.innerText =
    `Remaining: ₹${remaining.toLocaleString()}`;

    let percentage = 0;

    if(budgetAmount > 0){

        percentage =
        (expenses / budgetAmount) * 100;

        if(percentage > 100){
            percentage = 100;
        }

    }

    budgetProgressBar.style.width =
    percentage + "%";

}

// ==========================
// RENDER BUDGET HISTORY
// ==========================

function renderBudgetTable() {

    budgetTable.innerHTML = "";

    if(budgets.length === 0){

        budgetTable.innerHTML = `
        <tr>
            <td colspan="6"
            style="
            text-align:center;
            padding:20px;
            color:gray;">
            No Budget Records Found
            </td>
        </tr>
        `;

        return;
    }

    budgets.forEach((item,index) => {

        let spent = 0;

        transactions.forEach(transaction => {

            if(
                transaction.type === "Expense" &&
                transaction.date.startsWith(item.month)
            ){

                spent +=
                Number(transaction.amount);

            }

        });

        const remaining =
        Number(item.amount) - spent;

        const status =
        remaining >= 0
        ?
        "✅ Good"
        :
        "❌ Over Budget";

        const row =
        document.createElement("tr");

        row.innerHTML = `

        <td>${item.month}</td>

        <td>
        ₹${Number(item.amount)
        .toLocaleString()}
        </td>

        <td>
        ₹${spent.toLocaleString()}
        </td>

        <td>
        ₹${remaining.toLocaleString()}
        </td>

        <td>
        ${status}
        </td>

        <td>

            <button
            class="edit-btn"
            onclick="editBudget(${index})">

            ✏ Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteBudget(${index})">

            🗑 Delete

            </button>

        </td>

        `;

        budgetTable.appendChild(row);

    });

}

// ==========================
// EDIT BUDGET
// ==========================

function editBudget(index){

    const item =
    budgets[index];

    document.getElementById(
    "budgetMonth"
    ).value =
    item.month;

    document.getElementById(
    "budgetAmountInput"
    ).value =
    item.amount;

    editingIndex = index;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ==========================
// DELETE BUDGET
// ==========================

function deleteBudget(index){

    const confirmDelete =
    confirm(
    "Delete this budget?"
    );

    if(confirmDelete){

        budgets.splice(index,1);

        saveBudgets();

        renderBudgetTable();

        updateSummary();

    }

}

// ==========================
// SAVE / UPDATE
// ==========================

budgetForm.addEventListener(
"submit",
function(e){

    e.preventDefault();

    const month =
    document.getElementById(
    "budgetMonth"
    ).value;

    const amount =
    document.getElementById(
    "budgetAmountInput"
    ).value;

    if(editingIndex >= 0){

        budgets[editingIndex] = {

            month,
            amount

        };

        editingIndex = -1;

    }else{

        const existingBudget =
        budgets.findIndex(
            item => item.month === month
        );

        if(existingBudget >= 0){

            budgets[existingBudget].amount =
            amount;

        }else{

            budgets.push({

                month,
                amount

            });

        }

    }

    saveBudgets();

    renderBudgetTable();

    updateSummary();

    budgetForm.reset();

    alert(
    "Budget Saved Successfully!"
    );

});

overviewMonth.addEventListener(
"change",
function(){

    updateSummary(
        this.value
    );

});

// ==========================
// INITIAL LOAD
// ==========================

renderBudgetTable();
loadMonthDropdown();

if(budgets.length > 0){

    overviewMonth.value =
    budgets[budgets.length - 1].month;

}
updateSummary();