// =========================
// LOCAL STORAGE
// =========================

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let editIndex = -1;

// =========================
// ELEMENTS
// =========================

const form =
document.getElementById("transactionForm");

const table =
document.getElementById("transactionTable");

const monthFilter =
document.getElementById("monthFilter");

const typeFilter =
document.getElementById("typeFilter");

// =========================
// SAVE TO LOCAL STORAGE
// =========================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// =========================
// LOAD MONTH DROPDOWN
// =========================

function loadMonthFilter(){

    const months = [];

    transactions.forEach(item => {

        const date =
        new Date(item.date);

        const monthYear =
        date.toLocaleString("default",{
            month:"long",
            year:"numeric"
        });

        if(!months.includes(monthYear)){
            months.push(monthYear);
        }

    });

    monthFilter.innerHTML = "";

    months.forEach(month => {

        const option =
        document.createElement("option");

        option.value = month;

        option.textContent = month;

        monthFilter.appendChild(option);

    });

}

// =========================
// RENDER TABLE
// =========================

function renderTransactions() {

    table.innerHTML = "";

    if(transactions.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="6"
            style="
            text-align:center;
            padding:25px;
            color:gray;">
            No Transactions Found
            </td>
        </tr>
        `;

        return;
    }

    transactions.sort((a,b)=>
        new Date(b.date) - new Date(a.date)
    );

    const grouped = {};

    transactions.forEach(item => {

        const date =
        new Date(item.date);

        const monthYear =
        date.toLocaleString("default",{
            month:"long",
            year:"numeric"
        });

        if(!grouped[monthYear]){
            grouped[monthYear] = [];
        }

        grouped[monthYear].push(item);

    });

    const selectedMonth =
    monthFilter.value;

    if(!grouped[selectedMonth]){
        return;
    }

    const month =
    selectedMonth;

    let income = 0;
    let expense = 0;
    let savings = 0;

   grouped[month]
.filter(item => {

    if(typeFilter.value === "All"){
        return true;
    }

    return item.type === typeFilter.value;

})
.forEach(item => {

        if(item.type === "Income"){
            income += Number(item.amount);
        }

        if(item.type === "Expense"){
            expense += Number(item.amount);
        }

        if(item.type === "Savings"){
            savings += Number(item.amount);
        }

    });

    // Month Header

    const monthRow =
    document.createElement("tr");

    monthRow.innerHTML = `
    <td colspan="6"
    style="
    background:#2f5fe3;
    color:white;
    font-size:20px;
    font-weight:bold;
    padding:15px;">
    📅 ${month}
    </td>
    `;

    table.appendChild(monthRow);

    // Summary

    const summaryRow =
    document.createElement("tr");

    summaryRow.innerHTML = `
    <td colspan="6"
    style="
    background:#f5f7fb;
    padding:15px;
    font-weight:600;">

    💰 Income:
    ₹${income.toLocaleString()}

    &nbsp;&nbsp;&nbsp;|

    &nbsp;&nbsp;&nbsp;

    💸 Expense:
    ₹${expense.toLocaleString()}

    &nbsp;&nbsp;&nbsp;|

    &nbsp;&nbsp;&nbsp;

    🏦 Savings:
    ₹${savings.toLocaleString()}

    </td>
    `;

    table.appendChild(summaryRow);

    grouped[month]
.filter(item => {

    if(typeFilter.value === "All"){
        return true;
    }

    return item.type === typeFilter.value;

})
.forEach(item => {

        const originalIndex =
        transactions.indexOf(item);

        let badgeClass = "";

        if(item.type === "Income"){
            badgeClass = "income-tag";
        }

        if(item.type === "Expense"){
            badgeClass = "expense-tag";
        }

        if(item.type === "Savings"){
            badgeClass = "savings-tag";
        }

        const row =
        document.createElement("tr");

        row.innerHTML = `

        <td>${item.date}</td>

        <td>${item.description}</td>

        <td>
        ₹${Number(item.amount)
        .toLocaleString()}
        </td>

        <td>
            <span class="tag ${badgeClass}">
                ${item.type}
            </span>
        </td>

        <td>${item.category}</td>

        <td>

            <button
            class="edit-btn"
            onclick="editTransaction(${originalIndex})">

            ✏️ Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteTransaction(${originalIndex})">

            🗑 Delete

            </button>

        </td>

        `;

        table.appendChild(row);

    });

}

// =========================
// ADD / UPDATE
// =========================

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const transaction = {

        date:
        document.getElementById("date").value,

        description:
        document.getElementById("description").value,

        amount:
        document.getElementById("amount").value,

        type:
        document.getElementById("type").value,

        category:
        document.getElementById("category").value

    };

    if(editIndex === -1){

        transactions.push(transaction);

    }else{

        transactions[editIndex] = transaction;

        editIndex = -1;

    }

    saveTransactions();

    loadMonthFilter();

    renderTransactions();

    form.reset();

});

// =========================
// DELETE
// =========================

function deleteTransaction(index){

    const confirmDelete =
    confirm(
    "Are you sure you want to delete this transaction?"
    );

    if(confirmDelete){

        transactions.splice(index,1);

        saveTransactions();

        loadMonthFilter();

        renderTransactions();

    }

}

// =========================
// EDIT
// =========================

function editTransaction(index){

    const item =
    transactions[index];

    document.getElementById("date").value =
    item.date;

    document.getElementById("description").value =
    item.description;

    document.getElementById("amount").value =
    item.amount;

    document.getElementById("type").value =
    item.type;

    document.getElementById("category").value =
    item.category;

    editIndex = index;

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

}

// =========================
// MONTH FILTER
// =========================

monthFilter.addEventListener(
"change",
function(){

    renderTransactions();

});
typeFilter.addEventListener(
"change",
function(){

    renderTransactions();

});
// =========================
// INITIAL LOAD
// =========================

loadMonthFilter();

renderTransactions();