
document.getElementById('loginForm').addEventListener('submit', function(event) { // simple event listener that executes the function(event)
    
    event.preventDefault(); // this will prevent the default behavior of the submit button, which would reload the page. 

    var formData = new FormData(this); // here we are getting the information from the form 
    var object = {};                   // here we are assigning a key value pair to the data retrieved 
    formData.forEach(function(value, key) {
        object[key] = value;
    });

    fetch('/logIn', { // here the form data is being sent to the server using the fetch API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    }) // This is done before the server, it sends this info to the server. 


    .then(response => response.json())
    .then(data => {
        if (data.success) {  //  in the server we assigned the value fo the success variable to true, thus if it is true do this ... 
            console.log('Redirect to:', data.redirect);
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



