const themeToggler = document.querySelector(".theme-toggler");
const sideBtns = document.querySelectorAll(".sideBTN");

themeToggler.addEventListener('click' , () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
   
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



const main = document.querySelector(".main");
const IncomeAndExpenseBtn = document.getElementById("sideBTN-Income&Expense");

IncomeAndExpenseBtn.addEventListener('click', () => {
    main.classList.add('blanker');
});
