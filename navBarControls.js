const main = document.querySelector(".main");
const right = document.querySelector(".right");
const incAndExp = document.querySelector(".incAndExp");
const accountManagmentTab = document.querySelector(".accountManagmentGlobal");
const upcomingBills = document.querySelector(".calender");

const IncomeAndExpenseBtn = document.getElementById("sideBTN-Income&Expense");
const dashboardBtn = document.getElementById("sideBTN-Dashboard");
const AccountManagementBtn = document.getElementById("AccountManagementBtn");
const upcomingBillsBtn = document.getElementById("upcomingBillsBtn");

dashboardBtn.addEventListener('click', () => {
    main.classList.remove('blanker');
    right.classList.remove('blanker');
    incAndExp.classList.add('blanker');
    upcomingBills.classList.add('blanker');
    accountManagmentTab.classList.add('blanker');
});

IncomeAndExpenseBtn.addEventListener('click', () => {
    main.classList.add('blanker');
    right.classList.add('blanker');
    accountManagmentTab.classList.add('blanker');
    upcomingBills.classList.add('blanker');
    incAndExp.classList.remove('blanker');
});


AccountManagementBtn.addEventListener('click', () =>{
    main.classList.add('blanker');
    right.classList.add('blanker');
    incAndExp.classList.add('blanker');
    upcomingBills.classList.add('blanker');
    accountManagmentTab.classList.remove('blanker');
});

upcomingBillsBtn.addEventListener('click', () =>{
    main.classList.add('blanker');
    right.classList.add('blanker');
    incAndExp.classList.add('blanker');
    accountManagmentTab.classList.add('blanker');
    upcomingBills.classList.remove('blanker');
});


