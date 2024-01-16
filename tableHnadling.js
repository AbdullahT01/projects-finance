
document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Capturing form data directly when the form is being submitted
    var incomeExpense = document.getElementById('incomeExpense').value;
    var title = document.getElementById('title').value;
    var amount = document.getElementById('amount').value;
    var date = document.getElementById('date').value;

    console.log(incomeExpense);
    // Creating the object to be sent to the server
    var formData = {
        incomeExpense: incomeExpense,
        title: title,
        amount: amount,
        date: date
    };

    fetch('/expenseForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // so that the server can read the data.
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            var newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${incomeExpense}</td>
                <td>${title}</td>
                <td>${amount}</td>
                <td>${date}</td>
                <td><button class="deleteBtn" data-id="${data.expenseId}">Delete</button></td>
            `;
            document.querySelector('.recentFlow tbody').appendChild(newRow);
            document.getElementById('expenseForm').reset();
            console.log("Expense added successfully.");
        } else {
            console.error("Failed to add expense:", data.message);
        }
    })
    .catch(error => {
        console.error("Error submitting expense:", error);
    });
});










// This section will handle the deletion of the row in the database when the user presses the delete button. 


document.querySelector('.recentFlow tbody').addEventListener('click' , function(event){
   
    if(event.target.classList.contains('deleteBtn')){
        const expenseId = event.target.getAttribute('data-id');
    

    fetch(`/deleteExpense/${expenseId}`, {
        method: 'DELETE'
    })

    .then(response => response.json())
    .then(data =>{
        if(data.success){
            event.target.closest('tr').remove();
        }else {
            alert('Failed to delete expense.');
        }
    })

    .catch(error => {
        alert('Error deleting expense.');
        
    });

  }

});
// when the program is loaded, the tables will be repopulated by checking the database and putting the values inside the table. 
window.onload = function() {
    fetch('/getExpenses')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Sort expenses by expenseID in descending order
            data.expenses.sort((a, b) => b.expenseID - a.expenseID);

            data.expenses.forEach(expense => {
                var newRow = document.createElement('tr');
                var newRowDash = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${expense.title}</td>
                    <td>${expense.amount}$</td>
                    <td>${expense.type}</td>
                    <td>${expense.date.split('T')[0]}</td> 
                    <td><button class="deleteBtn" data-id="${expense.expenseID}">Delete</button></td>
                `;
                // This section will deal with the table in the dashBoard 
                newRowDash.innerHTML = `
                <td>${expense.title}</td>
                <td>${expense.amount}$</td>
                <td>${expense.type}</td>
                <td>${expense.date.split('T')[0]}</td> 
                
            `;

                document.querySelector('.recentFlow tbody').appendChild(newRow);
                document.querySelector('.recent-cashFlow tbody').appendChild(newRowDash);
            });
        } else {
            console.error("Failed to load expenses:", data.message);
        }
    })
    .catch(error => {
        console.error("Error loading expenses:", error);
    });
};

// this section deals with populating the dashboard analytics
window.addEventListener('load', () =>{

   console.log('reached the analytics');

    fetch('/Analytics', {
        method: "GET",
    })

    .then(response => response.json())
    .then(data =>{
        if (data.success){

            const currentDate = new Date();
            const currentDay = currentDate.getDay(); 
            const currentMonth = currentDate.getMonth(); 
            const currentYear = currentDate.getFullYear();

            // here we are going to filter out the data, based on the current month and based on wheter it is an income or an expense
            let filteredExpenses = data.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expense.type === 'Expense' && expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            });


            let filteredIncomes = data.expenses.filter(income => {
                const incomeDate = new Date(income.date);
                return income.type === 'Income' && incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
            });

            let totalExpenses = filteredExpenses.reduce((total, expense) => { // expense is the current element being processed.
                return total + expense.amount; // expense.amount because based from the sql statement, we have a bunch of objects with only the parameter
                // amount. 
            }, 0); // Initialize total as 0

            let totalIncome = filteredIncomes.reduce((total, income) => { // expense is the current element being processed.
                return total + income.amount; // expense.amount because based from the sql statement, we have a bunch of objects with only the parameter
                // amount. 
            }, 0); // Initialize total as 0


            console.log('Total Expenses:', totalExpenses);
            document.getElementById('totalExpenses').innerHTML = totalExpenses + '$';
            document.getElementById('totalIncomes').innerHTML = totalIncome + '$';
           
            // this section is to change the percentages and the progression circle for expenses and incomes
            let totalAmount = totalExpenses + totalIncome; 
            let expensePercentage = ((totalExpenses / totalAmount) * 100).toFixed(1) + '%';
            let incomePercentage = ((totalIncome / totalAmount) * 100).toFixed(1) + '%';

            document.getElementById('incomePercentage').innerHTML = incomePercentage;
            document.getElementById('expensePercentage').innerHTML = expensePercentage;

            updateCircleRatiosIncExp(totalExpenses, totalIncome);

            // this section will deal with the savings analytics for the month 
            let savings = totalIncome - totalExpenses; 
            document.getElementById('monthsSavings').innerHTML = (totalIncome - totalExpenses).toFixed(1) + '$'; 
            

          // to change the color if there is a deficit 
          if(savings < 0){
            document.querySelector('.monthSavingsPercentage').classList.remove('success');
            document.querySelector('.monthSavingsPercentage').classList.add('danger');
          }

           // for the day we need to refilter the data. 

           let filteredExpensesDay = data.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expense.type === 'Expense' && expenseDate.getDay() === currentDay && expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            });


          let filteredIncomesDay = data.expenses.filter(income => {
            const incomeDate = new Date(income.date);
            return income.type === 'Income' && incomeDate.getDay() === currentDay && incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
          });

          let totalExpensesDay = filteredExpensesDay.reduce((total, expense) => { 
            return total + expense.amount;}, 0); 

          let totalIncomeDay = filteredIncomesDay.reduce((total, income) => { 
            return total + income.amount; }, 0); 

          let savingsDay = totalIncomeDay - totalExpensesDay; 
            document.getElementById('daySavings').innerHTML = (totalIncomeDay - totalExpensesDay).toFixed(1) + '$'; 
           

          // to change the color if there is a deficit 
          if(savingsDay < 0){
            document.querySelector('.daySavingsPercentage').classList.remove('success');
            document.querySelector('.daySavingsPercentage').classList.add('danger');
          }
         //Same concept for the year 

         let filteredExpensesYear = data.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expense.type === 'Expense' && expenseDate.getFullYear() === currentYear;
            });


          let filteredIncomesYear = data.expenses.filter(income => {
            const incomeDate = new Date(income.date);
            return income.type === 'Income' && incomeDate.getFullYear() === currentYear;
          });

          let totalExpensesYear = filteredExpensesYear.reduce((total, expense) => { 
            return total + expense.amount;}, 0); 

          let totalIncomeYear = filteredIncomesYear.reduce((total, income) => { 
            return total + income.amount; }, 0); 

          let savingsYear = totalIncomeYear - totalExpensesYear;
        
            document.getElementById('yearSavings').innerHTML = (totalIncomeYear - totalExpensesYear).toFixed(1) + '$'; 
           
          // to change the color if there is a deficit 
          if(savingsYear < 0){
            document.querySelector('.yearSavingsPercentage').classList.remove('success');
            document.querySelector('.yearSavingsPercentage').classList.add('danger');
          }

        }
    })
    .catch(error => console.error('Error:', error));
});

// this is a function to calculate the circle percentages

function updateCircleRatiosIncExp(totalExpenses, totalIncome) {
    const totalAmount = totalExpenses + totalIncome || 1; 

    const expensePercentage = totalExpenses / totalAmount;
    const incomePercentage = totalIncome / totalAmount;

    const circumference = 226.2; // As defined in CSS

    const incomeCircle = document.querySelector('main .insights .income svg circle');
    const expenseCircle = document.querySelector('main .insights .expenses svg circle');
   

    

    expenseCircle.style.strokeDashoffset = circumference * (1 - expensePercentage);
    
    incomeCircle.style.strokeDashoffset = circumference * (1 - incomePercentage);
    console.log(`Income Circle Dashoffset: ${circumference * (1 - incomePercentage)}`);
    console.log(`Income Circle Dashoffset: ${circumference * (1 - expensePercentage)}`);
}


function ratioPercentageIncExp (totalExpense, totalIncome){
    const fullCircle = 100; 

    const totalAmount = totalExpense + totalIncome; 

    const expensePercentage = (totalExpenses / totalAmount) * fullCircle;
    const incomePercentage = (totalIncome / totalAmount) * fullCircle;
    
    return expensePercentage, incomePercentage; 
}


// load the information for the bill section 
window.addEventListener('load', ()=>{
    console.log('reached the bills table');

    fetch('/Bills', {
        method: "GET",
    })
    .then(response => response.json())
    .then(data=>{
        if(data.success){

            let filteredBillsBiWeekly = data.bills.filter(bill => {
                return bill.periodicity === 'bi-Weekly';
            });

            let filteredBillMonthly = data.bills.filter(bill => {
                return bill.periodicity === 'monthly';
            });

            filteredBillsBiWeekly.forEach(bill => {
                var newRow = document.createElement('tr');
               
                newRow.innerHTML = `
                    <td>${bill.billName}</td>
                    <td>${bill.date.split('T')[0]}</td>
                    <td>${bill.amount}$</td>
                    <td><button class="deleteBtn" data-id="${bill.billID}">Delete</button></td>
                `;
                document.querySelector('.recentFlowBiWeeklyBill tbody').appendChild(newRow);
            });

            filteredBillMonthly.forEach(bill => {
                var newRow = document.createElement('tr');
               console.log('adding monhtly bill table handling');
                newRow.innerHTML = `
                    <td>${bill.billName}</td>
                    <td>${bill.date.split('T')[0]}</td>
                    <td>${bill.amount}$</td>
                    <td><button class="deleteBtn" data-id="${bill.billID}">Delete</button></td>
                `;
                document.querySelector('.recentFlowMonthlyBill tbody').appendChild(newRow);
            });
        }
    })
})

// will handle the deltion of bills for the monthly bill section 
document.querySelector('.recentFlowMonthlyBill tbody').addEventListener('click' , function(event){
   
    if(event.target.classList.contains('deleteBtn')){
        const billID = event.target.getAttribute('data-id');
    

    fetch(`/deleteBillMonthly/${billID}`, {
        method: 'DELETE'
    })

    .then(response => response.json())
    .then(data =>{
        if(data.success){
            event.target.closest('tr').remove();
        }else {
            alert('Failed to delete bill.');
        }
    })

    .catch(error => {
        alert('Error deleting bill.');
        
    });
  }
});

// will handle the deltion of bills for the Bi-Weekly bill section 
document.querySelector('.recentFlowBiWeeklyBill tbody').addEventListener('click' , function(event){
   
    if(event.target.classList.contains('deleteBtn')){
        const billID = event.target.getAttribute('data-id');
    

    fetch(`/deleteBillBiWeekly/${billID}`, {
        method: 'DELETE'
    })

    .then(response => response.json())
    .then(data =>{
        if(data.success){
            event.target.closest('tr').remove();
        }else {
            alert('Failed to delete bill.');
        }
    })

    .catch(error => {
        alert('Error deleting bill.');
        
    });
  }
});

window.addEventListener('load', ()=>{
    fetch('/billsAmountPayed', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data =>{
        if(data.success){
            // to retreive the total bill amount
            let totalBills = data.bills.reduce((total, bill) => {
                return total + bill.amount; 
            }, 0);

            

            let totalPaidBills = data.bills.reduce((total, bill) =>{
                let billDate = new Date(bill.date.split('T')[0]);
                let today = new Date(); 

                today.setHours(0, 0, 0, 0); // setting today to the start of the day    

                if(billDate < today){
                    return total + parseFloat(bill.amount);
                }

                return total; 
            }, 0);

            let percentageOfBillsPayed = ((totalPaidBills/totalBills) * 100).toFixed(1);
            
            document.getElementById('totalBillsPaid').innerText = totalPaidBills;
            document.getElementById('percentageOfBillsPayed').innerText = percentageOfBillsPayed + '%';

           
            let radius = 36; // Assuming the radius of your circle is 36
            let circumference = 2 * Math.PI * radius;


            let offset = circumference - (percentageOfBillsPayed / 100) * circumference;

            

            // Set the stroke-dasharray and stroke-dashoffset of the circle
            document.querySelector('.insights .bills svg circle').style.strokeDasharray = `${circumference}`;
            document.querySelector('.insights .bills svg circle').style.strokeDashoffset = `${offset}`;

        }else{
            console.log('Bills could not be processed for displaying in dashboard analytics');
        }
        
    })

    .catch(error => {
        console.error('Error:', error);
        alert('error inserting bill in dashboard');
        
    });
})