// ==========================
// LOCAL STORAGE
// ==========================

let withdrawals =
JSON.parse(localStorage.getItem("withdrawals")) || [];

let editId = null;

// ==========================
// ELEMENTS
// ==========================

const withdrawForm =
document.getElementById("withdrawForm");

const withdrawTable =
document.getElementById("withdrawTable");

const monthFilter =
document.getElementById("monthFilter");

// ==========================
// SAVE
// ==========================

function saveWithdrawals(){

    localStorage.setItem(
        "withdrawals",
        JSON.stringify(withdrawals)
    );

}

// ==========================
// LOAD MONTH FILTER
// ==========================

function loadMonthFilter(){

    monthFilter.innerHTML = `
        <option value="All">
            All Months
        </option>
    `;

    const months = [];

    withdrawals.forEach(item => {

        if(!months.includes(item.month)){

            months.push(item.month);

        }

    });

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

}

// ==========================
// SUMMARY CARDS
// ==========================
function updateSummary(){

    const selectedMonth =
    monthFilter.value;

    const transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

    let totalWithdrawn = 0;
    let count = 0;

    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;

    let savingsUsed = 0;

    // Transactions

    transactions.forEach(item => {

        if(
            selectedMonth !== "All" &&
            !item.date.startsWith(selectedMonth)
        ){
            return;
        }

        if(item.type === "Income")
            totalIncome += Number(item.amount);

        else if(item.type === "Expense")
            totalExpense += Number(item.amount);

        else if(item.type === "Savings")
            totalSavings += Number(item.amount);

    });

    // Withdrawals

    withdrawals.forEach(item => {

        if(
            selectedMonth !== "All" &&
            item.month !== selectedMonth
        ){
            return;
        }

        totalWithdrawn +=
        Number(item.amount);

        count++;

        if(item.source === "Savings"){

            savingsUsed +=
            Number(item.amount);

        }

        else if(
            item.source ===
            "Balance + Savings"
        ){

            const balance =
            totalIncome -
            totalExpense -
            totalSavings;

        const savingsPart =
Math.min(
    totalSavings,
    Number(item.amount) -
    Math.max(balance,0)
);

if(savingsPart > 0){

    savingsUsed +=
    savingsPart;

}    

        }

    });

    const availableSavings =
    Math.max(
        totalSavings - savingsUsed,
        0
    );

    const remainingBalance =
    Math.max(
        totalIncome -
        totalExpense -
        totalSavings -
        (totalWithdrawn - savingsUsed),
        0
    );

    document.getElementById(
    "totalWithdrawn"
    ).innerText =
    `₹${totalWithdrawn.toLocaleString()}`;

    document.getElementById(
    "availableSavings"
    ).innerText =
    `₹${availableSavings.toLocaleString()}`;

    document.getElementById(
    "withdrawCount"
    ).innerText =
    count;

    document.getElementById(
    "savingsUsed"
    ).innerText =
    `₹${savingsUsed.toLocaleString()}`;

    document.getElementById(
    "remainingBalance"
    ).innerText =
    `₹${remainingBalance.toLocaleString()}`;

}
// ==========================
// TABLE
// ==========================

function renderTable(){

    withdrawTable.innerHTML = "";

    const selectedMonth =
    monthFilter.value;

    let filtered =
    withdrawals;

    if(selectedMonth !== "All"){

        filtered =
        withdrawals.filter(item =>
            item.month === selectedMonth
        );

    }

    if(filtered.length === 0){

        withdrawTable.innerHTML = `
        <tr>
            <td colspan="6"
            style="
            text-align:center;
            padding:25px;
            color:gray;">
            No Withdrawal Records
            </td>
        </tr>
        `;

        return;

    }

    filtered.forEach(item => {

        const row =
        document.createElement("tr");

        row.innerHTML = `

        <td>${item.date}</td>

        <td>
        ${
            new Date(item.month + "-01")
            .toLocaleString("default",{
                month:"long",
                year:"numeric"
            })
        }
        </td>

        <td>
        ₹${Number(item.amount)
        .toLocaleString()}
        </td>

        <td>
        ${item.source}
        </td>

        <td>
        ${item.reason}
        </td>

        <td>

            <button
            class="edit-btn"
            onclick="editWithdrawal(${item.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteWithdrawal(${item.id})">

            Delete

            </button>

        </td>

        `;

        withdrawTable.appendChild(row);

    });

}

// ==========================
// EDIT
// ==========================

function editWithdrawal(id){

    const item =
    withdrawals.find(
    w => w.id === id
    );

    document.getElementById(
    "withdrawDate"
    ).value =
    item.date;

    document.getElementById(
    "withdrawAmount"
    ).value =
    item.amount;

    document.getElementById(
    "withdrawReason"
    ).value =
    item.reason;

    editId = id;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ==========================
// DELETE
// ==========================

function deleteWithdrawal(id){

    if(
    !confirm(
    "Delete this withdrawal?"
    )
    ) return;

    withdrawals =
    withdrawals.filter(
    item => item.id !== id
    );

    saveWithdrawals();

    loadMonthFilter();

    renderTable();

    updateSummary();

}

function calculateSource(month, withdrawAmount){

    const transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

    let income = 0;
    let expense = 0;
    let savings = 0;

    transactions.forEach(item => {

        if(!item.date.startsWith(month))
            return;

        if(item.type === "Income")
            income += Number(item.amount);

        if(item.type === "Expense")
            expense += Number(item.amount);

        if(item.type === "Savings")
            savings += Number(item.amount);

    });

    const balance =
    income - expense - savings;

    if(withdrawAmount <= balance){

        return "Balance";

    }

    if(balance <= 0){

        return "Savings";

    }

    return "Balance + Savings";

}


// ==========================
// FORM SUBMIT
// ==========================

withdrawForm.addEventListener(
"submit",
function(e){

    e.preventDefault();

    const date =
    document.getElementById(
    "withdrawDate"
    ).value;

    const amount =
    document.getElementById(
    "withdrawAmount"
    ).value;

    const reason =
    document.getElementById(
    "withdrawReason"
    ).value;

    const month =
    date.slice(0,7);

    const source =
calculateSource(
    month,
    Number(amount)
);

const withdrawal = {

    id:
    editId || Date.now(),

    date,

    month,

    amount,

    reason,

    source

};

    if(editId){

        withdrawals =
        withdrawals.map(item =>

            item.id === editId
            ?
            withdrawal
            :
            item

        );

        editId = null;

    }else{

        withdrawals.push(
        withdrawal
        );

    }

    saveWithdrawals();

    loadMonthFilter();

    renderTable();

    updateSummary();

    withdrawForm.reset();

});

// ==========================
// FILTER
// ==========================

monthFilter.addEventListener(
"change",
function(){

    renderTable();

    updateSummary();

});

// ==========================
// INITIAL LOAD
// ==========================

loadMonthFilter();

renderTable();

updateSummary();