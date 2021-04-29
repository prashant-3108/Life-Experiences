"use strict";

// Express App (Routes)
const express = require("express");
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(express.static(path.join(__dirname + "/uploads")));

// Minimization
const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");
const { stringify } = require("querystring");
const { json } = require("express");
const { RSA_NO_PADDING } = require("constants");
const mysql = require("mysql2/promise");
const { type } = require("os");

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Send Style, do not change
app.get("/style.css", function (req, res) {
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname + "/public/style.css"));
});

// Send obfuscated JS, do not change
app.get("/index.js", function (req, res) {
  fs.readFile(
    path.join(__dirname + "/public/index.js"),
    "utf8",
    function (err, contents) {
      const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {
        compact: true,
        controlFlowFlattening: true,
      });
      res.contentType("application/javascript");
      res.send(minimizedContents._obfuscatedCode);
    }
  );
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(portNum);
console.log("Running app at localhost: " + portNum);


//******************** My code goes here ********************//



let dbConf = {
  host: 'localhost',
  user: 'Prashant_Jangid',
  password: 'PrashantJangid@123',
  database: 'SECRETS'
};

var connection;

app.get("/open", async function (req, res) {

  fs.readFile('database.json', (e, data) => {
    if (e) throw e;
    let read_db_info = JSON.parse(data);
    
    dbConf.host = read_db_info.host;
    dbConf.user = read_db_info.user;
    dbConf.password = read_db_info.password;
    dbConf.database = read_db_info.database;
    
  });

  try {
    // create the connection
    connection = await mysql.createConnection(dbConf)
  } catch (e) {
    console.log("Query error: " + e);
    res.status(400).send({ message: "Coudn't Connect to Database." });
  }

  let query = "CREATE TABLE IF NOT EXISTS Users ( UserID INT AUTO_INCREMENT, name VARCHAR(60) NOT NULL , email VARCHAR(256) NOT NULL , password VARCHAR(256) NOT NULL , PRIMARY KEY(UserID));";

  try {
    await connection.execute(query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  query = "CREATE TABLE IF NOT EXISTS Info ( secret_id INT AUTO_INCREMENT , secret VARCHAR(256) , UserID INT NOT NULL ,PRIMARY KEY(secret_id), FOREIGN KEY(UserID) REFERENCES FILE(UserID) ON DELETE CASCADE);";

  try {
    await connection.execute(query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


})

app.post("/signin", async function (req, res) {
  var name = req.body.name;
  var username = req.body.username;
  var confirm = req.body.confirm;
  var password = req.body.pass;

  if (password.length < 8) {
    return res.status(400).send({ message: "Too Short Password!" });

  }

  if (confirm != password) {
    return res.status(400).send({ message: "Paswords Don't Match. Please Try Again." });
  }

  let existsquery =
    "SELECT COUNT(email) AS count FROM Users WHERE email = '" +
    username +
    "';";

  let already_exit;

  try {
    already_exit = await connection.execute(existsquery);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  let y = JSON.stringify(already_exit[0]);
  let result = JSON.parse(y);

  if (result[0].count > 0) {
    return res.status(400).send({ message: "This email address exits Try a different one." });
  }

  // drop to table and send for login

  let insert_query = "INSERT INTO Users  (name, email, password) VALUES('" +
    name +
    "' , '" +
    username +
    "' , '" +
    password +
    "');";

  try {
    await connection.execute(insert_query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  return res.send({ message: " Successfully Signed in. Please Login To Access." })

});

app.post("/login", async function (req, res) {

  var username = req.body.username;
  var password = req.body.pass;

  let existsquery =
    "SELECT password FROM Users WHERE email = '" +
    username +
    "';";



  let store_password;
  try {
    let temp = await connection.execute(existsquery);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    store_password = z[0].password;
    // console.log(rows1);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  if (store_password != password) {
    return res.status(400).send({ message: "Invalid Password! Please Try again." });
  }

  let userid_query =
    "SELECT UserID FROM Users WHERE email = '" +
    username +
    "';";

  let userID;

  try {
    let temp = await connection.execute(userid_query);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    userID = z[0].UserID;
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  // console.log(userID);

  var user_experiences = [];

  let xperience_query =
    "SELECT secret FROM Info WHERE UserID = " +
    userID +
    " ORDER BY secret_id ASC;";


  try {
    let temp = await connection.execute(xperience_query);
    // console.log(temp);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    if (z != undefined) {
      for (let i in z) {
        user_experiences.push(z[i].secret);
      }
    }
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


  let login_message = "Successfully Logged In. Click OK to continue.";

  user_experiences.push(userID);
  user_experiences.push(login_message);

  return res.send(user_experiences);

});


app.post("/add_exp", async function (req, res) {
  var experience = req.body.exp;
  var id = req.body.user_id;

  let existsquery =
    "SELECT COUNT(email) AS count FROM Users WHERE UserID =" +
    id +
    ";";

  let already_exit;

  try {
    already_exit = await connection.execute(existsquery);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  let y = JSON.stringify(already_exit[0]);
  let result = JSON.parse(y);

  if (result[0].count == 0) {
    return res.status(400).send({ message: "Enter a Valid User Id. Please try again.!" });
  }



  existsquery =
    "SELECT COUNT(secret) AS count FROM Info WHERE UserID =" +
    id +
    ";";

  try {
    already_exit = await connection.execute(existsquery);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  y = JSON.stringify(already_exit[0]);
  result = JSON.parse(y);


  let insert_query = "INSERT INTO Info  (secret, UserID) VALUES('" +
    experience +
    "' , " +
    id +
    ");";


  try {
    await connection.execute(insert_query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Couldn't add the Experience. Try Again!" });
  }

  let send_count = { count: result[0].count };
  return res.send(send_count);

});


app.post("/del_exp", async function (req, res) {
  var exp_id = req.body.exp_id;
  var user_id = req.body.userid;

  let existsquery =
    "SELECT COUNT(email) AS count FROM Users WHERE UserID =" +
    user_id +
    ";";

  let already_exit;

  try {
    already_exit = await connection.execute(existsquery);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  let y = JSON.stringify(already_exit[0]);
  let result = JSON.parse(y);

  if (result[0].count == 0) {
    return res.status(400).send({ message: "Enter a Valid User Id. Please try again.!" });
  }




  let xperience_query =
    "SELECT secret_id FROM Info WHERE UserID = " +
    user_id +
    ";";

  let del_secret_id = -1;

  let user_experiences = [];

  try {
    let temp = await connection.execute(xperience_query);
    // console.log(temp);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    if (z != undefined) {
      for (var i = 0; i < z.length; i++) {
        if (i + 1 == exp_id) {
          del_secret_id = z[i].secret_id;
          break;
        }
      }
    }
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


  if (del_secret_id == -1) {
    return res.status(400).send({ message: "Enter a Valid Experience number or user ID.!" });
  }

  let del_query =
    "DELETE FROM Info WHERE secret_id = " +
    del_secret_id +
    " AND UserId = " + user_id + ";";

  try {
    await connection.execute(del_query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Couldn't Delete the Experience. Try Again!" });
  }



  let updated_query =
    "SELECT secret FROM Info WHERE UserID = " +
    user_id +
    " ORDER BY secret_id ASC;";


  try {
    let temp = await connection.execute(updated_query);
    // console.log(temp);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    if (z != undefined) {
      for (let i in z) {
        user_experiences.push(z[i].secret);
      }
    }
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


  let del_message = "Successfully Deleted the Experience. Click OK to continue.";

  user_experiences.push(del_message);

  return res.send(user_experiences);

});


app.post("/update_exp", async function (req, res) {

  var exp_id = req.body.exp_id;
  var user_id = req.body.userid;
  var updated_exp = req.body.updated;


  let existsquery =
    "SELECT COUNT(email) AS count FROM Users WHERE UserID =" +
    user_id +
    ";";

  let already_exit;

  try {
    already_exit = await connection.execute(existsquery);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }

  let y = JSON.stringify(already_exit[0]);
  let result = JSON.parse(y);

  if (result[0].count == 0) {
    return res.status(400).send({ message: "Enter a Valid User Id. Please try again.!" });
  }



  let xperience_query =
    "SELECT secret_id FROM Info WHERE UserID = " +
    user_id +
    ";";

  let update_secret_id = -1;

  let user_experiences = [];

  try {
    let temp = await connection.execute(xperience_query);
    // console.log(temp);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    if (z != undefined) {
      for (var i = 0; i < z.length; i++) {
        if (i + 1 == exp_id) {
          update_secret_id = z[i].secret_id;
          break;
        }
      }
    }
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


  if (update_secret_id == -1) {
    return res.status(400).send({ message: "Enter a Valid Experience number or user ID.!" });
  }

  let upd_query =
    "UPDATE Info SET secret='" + updated_exp + "' WHERE secret_id = " +
    update_secret_id +
    " AND UserId = " + user_id + ";";

  try {
    await connection.execute(upd_query);
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Couldn't Delete the Experience. Try Again!" });
  }

  let updated_query =
    "SELECT secret FROM Info WHERE UserID = " +
    user_id +
    " ORDER BY secret_id ASC;";


  try {
    let temp = await connection.execute(updated_query);
    // console.log(temp);
    let y = JSON.stringify(temp[0]);
    let z = JSON.parse(y);
    if (z != undefined) {
      for (let i in z) {
        user_experiences.push(z[i].secret);
      }
    }
  } catch (e) {
    console.log("Query error: " + e);
    return res.status(400).send({ message: "Error Occured Please try again.!" });
  }


  let del_message = "Successfully Edited the Experience. Click OK to continue.";

  user_experiences.push(del_message);

  return res.send(user_experiences);

});



app.post("/logout", async function (req, res) {

  if (connection && connection.end) {
    connection.end();
    res.send({ message: "Logged Out Successfully." });
  } else {
    res.send({ message: "Connection abrupted. Login Again" });
  }

});




