const express = require("express"); 
const { request } = require("http");
const mysql = require("mysql");
const session = require('express-session');



const app = express();
app.use(express.json());

app.use(session({
    secret: 'example',
    cookie: {maxAge: 300000},
    saveUninitialized: true // needed because we have a login system
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
const PORT = 5000;


app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});


const db = mysql.createConnection({ // we are creating the connection to our pokemon database 
    host: "localhost",
    user: "root",
    password: "",
    database: "finance"
});

app.get("/signUp", (request, response) =>{

    let newUser ={
        name: request.query.name,
        email: request.query.email,
        password: request.query.password,

    };

    let sql = "INSERT INTO clients SET ?";

    let query = db.query(sql, newUser, (err) =>{
        if (err) {
            console.log("There was an error inserting the new user into the database"); 
        }else{
            response.redirect("/dashboard.html");
        }
    })
})

app.post("/logIn", (request, response) =>{

  
    let email = request.body.email;
    let password = request.body.password; 
    
    
    let sql = `SELECT userID, email, password, nightMode FROM clients WHERE email = ? AND password = ? `;

    let query = db.query(sql,[email, password] , (err, result) =>{
       
        if(err){
            console.log("There was an error communicating with the database")
        }else{
            if(result.length > 0){
                let nightMode = result[0].nightMode;
                console.log(nightMode);

                let userID = result[0].userID
                request.session.userID = userID;

                request.session.email = email; // here we are setting uo the email for the current session to later on be used in the program,
                request.session.password = password; // like nightmode. 
                response.json({ success: true, redirect: "/dashboard.html" });
            }else{
               
                response.json({ success: false, message: "Invalid email or password" });

            }
        }
    });
});


app.post('/update-theme', (request, response)=>{

    let userPassword = request.session.password;
    let userEmail = request.session.email;
    let darkMode = request.body.darkMode; 

    let sql = "UPDATE clients SET nightMode = ? WHERE email = ? AND password = ?";


    let query = db.query(sql, [darkMode, userEmail, userPassword], (err, result) =>{
        if (err){
            console.log("There was an error inserting the nightmode value in the db");
            response.json({ message: "Internal Server Error" });
        }else{
            response.json({ message: "Theme updated successfully" });
            console.log("The theme was updated sucessfully");
        }
    });
});



app.get('/get-theme', (request, response) => {
    
        let sql = "SELECT nightMode, name FROM clients WHERE email = ? AND password = ?";
        db.query(sql, [request.session.email, request.session.password], (err, result) => {
            if (err) {
                console.error(err);
                response.json({ success: false });
            } else {
                response.json({ success: true, nightMode: result[0].nightMode, name: result[0].name });
            }
        });
});

app.post('/expenseForm', (request, response) =>{

    let newExpenseEntry = {
        userID: request.session.userID,
        type: request.body.incomeExpense,
        amount: request.body.amount,
        title: request.body.title,
        date: request.body.date,
    }

    let sql = "INSERT INTO expense SET ?";

    let query = db.query(sql, newExpenseEntry, (err, result) =>{

        if(err){
            console.log(err);
            response.json({ success: false, message: 'Error inserting data' }); 
        }else{
            
            console.log(result.insertId);
            response.json({success: true, expenseId: result.insertId}); 
        }
    })
})

// this will deal with deleting the row when the delete button is pushed. 

app.delete('/deleteExpense/:expenseId', (request, response) =>{

    let expenseID = request.params.expenseId; 

    let sql = "DELETE FROM expense WHERE expenseID = ?"; 

    let query = db.query(sql, expenseID, (err, result) =>{
        if(err){ console.log(' failed to delete');
            response.json({success: false});
        }else{ console.log(' delete' + expenseID);
            response.json({success: true});
        }
    });
});

// this is to repopulate the table after logging back in. 

app.get('/getExpenses', (request, response) =>{
   
   let userId = request.session.userID;

   let sql = "SELECT * FROM expense WHERE userID = ?";

   let query = db.query(sql, userId, (err, result) =>{
    if(err){
       
        response.json({success: false});
    }else{
        
        response.json({success: true, expenses: result});
    }
   });
});

//Handling the informartion update for the client personal info 

app.post('/personalInfoUpdate', (request, response) => {

    let userId = request.session.userID;

    let name = request.body.newName;
    let email = request.body.newEmail;
    let password = request.body.newPassword;

    let sql = "UPDATE clients SET name = ?, email = ?, password = ? WHERE userID = ?";

    let query = db.query(sql, [name, email, password, userId], (err, results) => {
        if (err) {
            console.error('Error updating user info:', err);
            response.json({ success: false});
        } else {
            response.json({ success: true });
        }
    });
});

app.post('/goalInfoUpdate', (request, response) =>{
    let userID = request.session.userID; 
    let goal = request.body.newGoal; 
    let budget = request.body.newBudget; 

    let sql = "UPDATE clients SET goal = ?, budget = ? WHERE userID = ? ";

    let query = db.query(sql, [goal, budget, userID], (err) =>{
        if (err){
            response.json({success: false});
        }else{
            response.json({success: true}); 
        }
    });
});

// to retrive the anaylitics for the dashboard

app.get('/Analytics', (request, response) =>{

    
    let userID = request.session.userID; 

    let sql = "SELECT amount, type, date FROM expense WHERE userID = ?"; 

    let query = db.query(sql, userID, (err, result) =>{
        if (err){
            response.json({success: false});
        }else{
            response.json({success: true, expenses: result})
        }
    });
});
// will deal with posting the bill data from the bill form 
app.post('/billData', (request, response) =>{
    let bill = {
        userID: request.session.userID,
        periodicity: request.body.periodicity,
        billName: request.body.billName,
        amount: request.body.amount,
        date: request.body.date,
    };

    console.log(bill);
    let sql = "INSERT INTO bills SET ?";

    let query = db.query(sql, bill, (err, result) =>{
        if(err){
            console.log(err);
            response.json({success: false});
        }else{
            console.log('added the bill');
            response.json({success: true, billID: result.insertId});
        }
    });
});
//will deal with retrieving the bill data and displaying it in the appropriate bill table 
app.get('/Bills', (request, response) =>{

    let userID = request.session.userID;

    let sql = "SELECT periodicity, billID, billName, amount, date FROM bills WHERE userID = ?";

    let query = db.query(sql, userID, (err, result) =>{
        if(err){
            console.log("Error taking information from database for re-population of the bills table");
            response.json({success: false});
        }else{
            response.json({success: true, bills: result});
        }
    });
});

app.delete('/deleteBillMonthly/:billID', (request, response) =>{

    let billID = request.params.billID; 

    let sql = "DELETE FROM bills WHERE billID = ?"; 

    let query = db.query(sql, billID, (err, result) =>{
        if(err){ console.log(' failed to delete');
            response.json({success: false});
        }else{ console.log(' delete' + billID);
            response.json({success: true});
        }
    });
});

app.delete('/deleteBillBiWeekly/:billID', (request, response) =>{

    let billID = request.params.billID; 

    let sql = "DELETE FROM bills WHERE billID = ?"; 

    let query = db.query(sql, billID, (err, result) =>{
        if(err){ console.log(' failed to delete');
            response.json({success: false});
        }else{ console.log(' delete' + billID);
            response.json({success: true});
        }
    });
});

app.get('/billsAmountPayed' , (request, response) =>{
    
    let userID = request.session.userID;

    let sql = "SELECT amount, date FROM bills WHERE userID = ?"; 
    
    let query = db.query(sql, userID, (err, result) =>{
        if(err){
            console.log('There was an error retrieving the bill data for the dashboard analytics');
            response.json({success: false});
        }else{
            console.log(result[0]);
            response.json({success: true, bills: result});
        }
    })
})
app.listen(PORT, (req, res) =>{
    console.log(`Server running on port ${PORT}`);
});