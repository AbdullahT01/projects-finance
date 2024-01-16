document.getElementById('addBill').addEventListener('submit', (event)=> {
    event.preventDefault();

    var periodicity = document.getElementById('billFrequency').value; 
    var billName = document.getElementById('billName').value; 
    var amount = document.getElementById('billAmount').value; 
    var date = document.getElementById('billDate').value; 

    console.log(date);
    var formData = {
        periodicity: periodicity,
        billName: billName,
        amount: amount,
        date: date, 
    }; 

    fetch('/billData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success ){
            if(periodicity === 'bi-Weekly'){
            var newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td>${billName}</td>
            <td>${date}</td>
            <td>${amount}$</td>
            <td><button class="deleteBtn" data-id="${data.billID}">Delete</button></td>
        `;

        document.querySelector('.recentFlowBiWeeklyBill tbody').appendChild(newRow);
        document.getElementById('addBill').reset();
        }
        if(periodicity === 'monthly'){
            var newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td>${billName}</td>
            <td>${date}</td>
            <td>${amount}$</td>
            <td><button class="deleteBtn" data-id="${data.billID}">Delete</button></td>
        `;

        document.querySelector('.recentFlowMonthlyBill tbody').appendChild(newRow);
        document.getElementById('addBill').reset();
        }
    }
       
        else{
            console.error("Failed to add expense:", data.message);
        }
    })
    .catch(error => {
        console.error("Error submitting expense:", error);
    });
});