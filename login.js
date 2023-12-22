const signUp = document.querySelector(".sign-up");
const logIn = document.querySelector(".log-in");
const signUpBAlt = document.querySelector(".toggle-right");
const LogInBAlt = document.querySelector(".toggle-left");

const signUpBtn = document.getElementById("register");
const logInBtn = document.getElementById("login");

signUpBtn.addEventListener('click', () =>{
    signUp.style.left = "0%";
    logIn.style.left = "-50%";  

    signUpBAlt.style.left = "50%"
    LogInBAlt.style.left = "0%"
});

logInBtn.addEventListener('click', () =>{
    signUp.style.left = "-50%";
    logIn.style.left = "0%"; 

    signUpBAlt.style.left = "0%"
    LogInBAlt.style.left = "50%"
});


