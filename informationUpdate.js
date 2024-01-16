

document.getElementById("personalInfoUpdate").addEventListener('submit', () =>{

    event.preventDefault();

    console.log("reached json");
    var newName = document.getElementById('newName').value; 
    var newEmail = document.getElementById('newEmail').value;
    var newPassword = document.getElementById('newPassword').value; 

    console.log(newName, newEmail, newPassword);

    var formData = {
        newName: newName,
        newEmail: newEmail,
        newPassword: newPassword,
    };

    
    fetch('/personalInfoUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // so that the server can read the data.
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            alert('information was updated successfully');
        }else{
            alert('information was NOT updated successfully');
        }
    })
});


document.getElementById("updateGoalsUpdate").addEventListener('submit', () =>{
    
    event.preventDefault(); 

    var newGoal = document.getElementById('newGoal').value; 
    var newBudget = document.getElementById('newBudget').value; 

    let formData = {
        newGoal: newGoal,
        newBudget: newBudget,
    };

    

    fetch('/goalInfoUpdate', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    .then(response => response.json())
    .then(data =>{
        if (data.success){
            alert('Your personal goals have been succesfully updated');
        }else{
            alert('Could NOT update personal goals');
        }
    })
})
