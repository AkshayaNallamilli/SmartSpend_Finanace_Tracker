let savingsGoals =
JSON.parse(localStorage.getItem("savingsGoals")) || [];

const transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let editGoalId = null;

const goalForm =
document.getElementById("goalForm");

const monthFilter =
document.getElementById("monthFilter");

goalForm.addEventListener("submit", function(e){

    e.preventDefault();

    const goalName =
    document.getElementById("goalName").value;

    const targetAmount =
    document.getElementById("goalAmount").value;

    if(editGoalId){

        savingsGoals =
        savingsGoals.map(goal => {

            if(goal.id === editGoalId){

                return {

                    ...goal,
                    goalName,
                    targetAmount

                };

            }

            return goal;

        });

        editGoalId = null;

    }else{

        savingsGoals.push({

            id: Date.now(),

            goalName,

            targetAmount

        });

    }

    localStorage.setItem(
        "savingsGoals",
        JSON.stringify(savingsGoals)
    );

    renderGoals();

    goalForm.reset();

});

function loadMonthFilter(){

    const months = [];

    transactions.forEach(item => {

        if(item.type === "Savings"){

            const month =
            item.date.slice(0,7);

            if(!months.includes(month)){

                months.push(month);

            }

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

function renderGoals(){

    const container =
    document.getElementById(
    "goalsContainer"
    );

    container.innerHTML = "";

   let totalSavings = 0;

const selectedMonth =
monthFilter.value;

transactions.forEach(item => {

    if(item.type !== "Savings")
        return;

    if(
        selectedMonth !== "All" &&
        !item.date.startsWith(selectedMonth)
    ){
        return;
    }

    totalSavings +=
    Number(item.amount);

});

    savingsGoals.forEach(goal => {

        let percentage =
        (totalSavings /
        Number(goal.targetAmount))
        * 100;

        if(percentage > 100)
        percentage = 100;

        container.innerHTML += `

        <div class="goal-card">

            <h2>${goal.goalName}</h2>

            <br>

            <h3>
            Saved ₹${totalSavings.toLocaleString()}
            </h3>

            <br>

            <h3>
            Target ₹${Number(
            goal.targetAmount
            ).toLocaleString()}
            </h3>

            <br>

            <div class="goal-progress">

                <div
                class="goal-progress-bar"
                style="width:${percentage}%">
                </div>

            </div>

            <br>

            <h3>
            ${percentage.toFixed(1)}%
            Completed
            </h3>

            <br>

            <button
            class="edit-btn"
            onclick="editGoal(${goal.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteGoal(${goal.id})">

            Delete

            </button>

        </div>

        <br>

        `;

    });

}

function editGoal(id){

    const goal =
    savingsGoals.find(
    g => g.id === id
    );

    document.getElementById(
    "goalName"
    ).value =
    goal.goalName;

    document.getElementById(
    "goalAmount"
    ).value =
    goal.targetAmount;

    editGoalId = id;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

function deleteGoal(id){

    if(!confirm(
    "Delete this goal?"
    )) return;

    savingsGoals =
    savingsGoals.filter(
    goal => goal.id !== id
    );

    localStorage.setItem(
        "savingsGoals",
        JSON.stringify(savingsGoals)
    );

    renderGoals();

}

monthFilter.addEventListener(
"change",
function(){

    renderGoals();

});

loadMonthFilter();
renderGoals();