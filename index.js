// import express
const express = require('express');
// import JWT tokens
const jwt = require('jsonwebtoken');
// start listening on port 3000
const app = express();
const port = 4000;

let dbUsers = [
    {
      username : "ain",
      password : "1234",
      name : "Ainsuhana",
      email : "ain@gmail.com"
    },
    {
      username : "han",
      password : "5678",
      name : "hannie",
      email : "han@gmail.com"
    },
    {
      username : "hyunjin",
      password : "2468",
      name : "Hyunjinie",
      email : "hyun@gmail.com"
    }
  ]

  //enable json parsing
app.use(express.json());

app.get('/hello', verifytoken, (req, res) => {
    console.log(req.user);
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send(req.body);
});

app.post('/login', (req, res) => {
    let data = req.body
    
    const user=login(data.username, data.password);
    /*res.send(
        login(
            data.username,
            data.password
        )
    );*/
    res.send(generatetoken(user))
  });

app.post('/register', (req, res) => {
    let data = req.body
    res.send(
        register(
            data.username,
            data.password,
            data.name,
            data.email
        )
    );
});

app.listen(port, () => {
    console.log('example app listening on port ${port}')
});

function login(username, password){
      console.log("Someone try to login with ", username, password) //apa yg user akan masukkan
      let matched = dbUsers.find(element => 
          element.username == username  
      )// find element
      if(matched) {
          if (matched.password == password){
              return matched
          } else {
              return "Password not matched"
          }
      } else {
          return "Username not found"
      }
  }


function register(newusername, newpassword, newname, newemail){
    dbUsers.find(element => {
        console.log(element) 
      })//check if username exists
    dbUsers.push({
          username : newusername,
          password : newpassword,
          name : newname,
          email : newemail
      })
      return "New acc has been created"
}

//to generate JWT tokens
function generatetoken(userprofile){
  return jwt.sign({
    //data: 'foobar',
    userprofile,
  }, 'secret', 
  { expiresIn: 60 * 60 });
}

// to verify jwt token
function verifytoken(req, res, next){
  let header = req.headers.authorization
  console.log(header)

  let token = header.split(" ")[1]


  jwt.verify(token, 'secret', function(err, decoded) {
    // // bar
    if(err){
      res.send("Invalid Token")
    }

    req.user = decoded
    next()
  });
}