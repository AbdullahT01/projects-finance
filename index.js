

const themeToggler = document.querySelector(".theme-toggler");
const sideBtns = document.querySelectorAll(".sideBTN");

themeToggler.addEventListener("click", ()=>{
    console.log("reached theme0 json");
    const isDarkMode = document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

    fetch ('/update-theme', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({darkMode: isDarkMode}) // now the variable isDarkMode can be passed to the server as darkMode
    })  
    .then(response => response.json())
    .then(data => console.log(data.message)) 
    .catch(error => console.error('Error:', error));

});



// this is a function to loop through all the sideBTNS and remove the 'active' class. 
function removeActiveClasses() {
    sideBtns.forEach(button => { 
        button.classList.remove('active');
    });
}

// this is to loop through the array of sideBTNs and add an even listener to all of them. 
sideBtns.forEach(btn => { 
    btn.addEventListener('click', function() {
        removeActiveClasses();
        this.classList.add('active'); // 'this' refers to the clicked button
    });
});




// this is to retrieve the nighMode value and toggle the theme accordingly 
// event listener had to be used because multiple onload functions dont work
window.addEventListener('load', function() {
    
    fetch('/get-theme', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.success) {
            setNightMode(data.nightMode);
            document.getElementById("mainProgramName").innerHTML = data.name; 
        }
    })
    .catch(error => console.error('Error:', error));
});

function setNightMode(nightMode) { // this function is to handle toggling. 
    if (nightMode === 1) {
        document.body.classList.add('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    } else {
        document.body.classList.remove('dark-theme-variables');
    }
}

