let transactions =
    JSON.parse(localStorage.getItem("expenseTransactions")) || [];


// Elements

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const addBtn =
    document.getElementById("addBtn");

const errorMessage =
    document.getElementById("errorMessage");

const transactionList =
    document.getElementById("transactionList");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const balanceElement =
    document.getElementById("balance");

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const clearBtn =
    document.getElementById("clearBtn");

const themeBtn =
    document.getElementById("themeBtn");


// Save data

function saveTransactions() {

    localStorage.setItem(
        "expenseTransactions",
        JSON.stringify(transactions)
    );

}


// Add transaction

addBtn.addEventListener("click", addTransaction);


function addTransaction() {

    const description =
        descriptionInput.value.trim();

    const amount =
        parseFloat(amountInput.value);

    const type =
        typeInput.value;

    const category =
        categoryInput.value;

    const date =
        dateInput.value;


    if (description === "") {

        errorMessage.textContent =
            "Please enter a description.";

        return;

    }


    if (isNaN(amount) || amount <= 0) {

        errorMessage.textContent =
            "Please enter a valid amount.";

        return;

    }


    if (date === "") {

        errorMessage.textContent =
            "Please select a date.";

        return;

    }


    errorMessage.textContent = "";


    const transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        type: type,

        category: category,

        date: date

    };


    transactions.push(transaction);


    saveTransactions();


    descriptionInput.value = "";

    amountInput.value = "";

    dateInput.value = "";


    renderTransactions();

}


// Render transactions

function renderTransactions() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    transactionList.innerHTML = "";


    const filteredTransactions =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return matchesSearch &&
                matchesType &&
                matchesCategory;

        });


    if (filteredTransactions.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTransactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const item =
                document.createElement("div");


            item.className =
                `transaction-item ${transaction.type}`;


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const icon =
                transaction.type === "income"
                    ? "fa-arrow-down"
                    : "fa-arrow-up";


            item.innerHTML = `

                <div class="transaction-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>


                <div class="transaction-content">

                    <div class="transaction-title">

                        ${escapeHTML(
                            transaction.description
                        )}

                    </div>


                    <div class="transaction-meta">

                        <span class="badge category-badge">

                            ${transaction.category}

                        </span>


                        <span class="badge date-badge">

                            <i class="fa-regular fa-calendar"></i>

                            ${formatDate(
                                transaction.date
                            )}

                        </span>

                    </div>

                </div>


                <div class="transaction-amount">

                    ${sign}₹${transaction.amount.toFixed(2)}

                </div>


                <div class="transaction-actions">

                    <button
                        class="action-btn"
                        onclick="editTransaction(${transaction.id})"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `;


            transactionList.appendChild(item);

        });


    updateSummary();

}


// Update summary

function updateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expenses += transaction.amount;

        }

    });


    const balance =
        income - expenses;


    totalIncomeElement.textContent =
        formatCurrency(income);


    totalExpenseElement.textContent =
        formatCurrency(expenses);


    balanceElement.textContent =
        formatCurrency(balance);

}


// Currency

function formatCurrency(amount) {

    return "₹" + amount.toFixed(2);

}


// Edit transaction

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        return;

    }


    const newDescription =
        prompt(
            "Edit transaction:",
            transaction.description
        );


    if (newDescription === null) {

        return;

    }


    const cleanedDescription =
        newDescription.trim();


    if (cleanedDescription === "") {

        alert("Description cannot be empty.");

        return;

    }


    transaction.description =
        cleanedDescription;


    saveTransactions();

    renderTransactions();

}


// Delete transaction

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    renderTransactions();

}


// Clear all

clearBtn.addEventListener("click", function() {

    if (transactions.length === 0) {

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all transactions?"
        );


    if (!confirmClear) {

        return;

    }


    transactions = [];


    saveTransactions();

    renderTransactions();

});


// Search

searchInput.addEventListener(
    "input",
    renderTransactions
);


// Type filter

typeFilter.addEventListener(
    "change",
    renderTransactions
);


// Category filter

categoryFilter.addEventListener(
    "change",
    renderTransactions
);


// Dark mode

themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "expenseDarkMode",
        isDark
    );


    themeBtn.innerHTML = isDark

        ? '<i class="fa-solid fa-sun"></i>'

        : '<i class="fa-solid fa-moon"></i>';

});


// Load dark mode

if (
    localStorage.getItem(
        "expenseDarkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


// Format date

function formatDate(date) {

    const parts =
        date.split("-");


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// Prevent HTML injection

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Initial render

renderTransactions();