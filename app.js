const express = require("express")

const app = express();

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const postModel = require("./models/post")

const userModel = require("./models/user");

const cookieParser = require("cookie-parser");

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/" , (req , res)=>{
    res.render("index")
})

app.get("/login" , (req , res)=>{
    res.render("login")
})

app.get("/logout" , (req , res)=>{
    res.cookie("token" , "")
    res.redirect("/login") 
})


// app.post("/register" , async(req , res)=>{
//     let {email , password , username , name , age} = req.body
//     let user = await userModel.findOne({email})
//     if (user) return res.status(500).send("User Already Registered")

//     bcrypt.genSalt(10 , async (err , salt)=>{
//         let user = await bcrypt.hash(password , salt , (err , hash)=>{
//             usertModel.create({
//                 username, 
//                 email,
//                 age,
//                 name,
//                 password : hash
//             })
            
//         })
//     })
    
//     let token = jwt.sign({email : email , userid : user._id} , "shhhh");
//     res.cookie("token" , token);
//     res.send("registered")
// })

app.post("/register", async (req, res) => {
  try {
    let { email, password, username, name, age } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).send("User Already Registered");

    // hash password properly
    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      age,
      name,
      password: hash,
    });

    // create token
    let token = jwt.sign({ email: newUser.email, userid: newUser._id }, "shhhh");

    // set cookie BEFORE sending response
    res.cookie("token", token);
    res.send("registered");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Internal Server Error");
  }
});


// app.post("/login" , async(req , res)=>{

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Invalid Email or Password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Invalid Email or Password");

    // create token
    let token = jwt.sign({ email: user.email, userid: user._id }, "shhhh");

    // set cookie BEFORE response
    res.cookie("token", token);
    res.send("Logged In");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  }
});


//     let {email , password} = req.body
//     let user = await userModel.findOne({email})
//     if (!user) return res.status(500).send("Something Went Wrong!")

//         bcrypt.compare(password , user.password , (err , result)=>{
//             if(result) {res.status(200).send("Logged In")
//                 let token = jwt.sign({email : email , userid : user._id} , "shhhh");
//                 res.cookie("token" , token);}
//                 else(res.redirect("/Login"))
//         })
// })


//     let token = jwt.sign({email : email , userid : newUser._id} , "shhhh");
//     res.cookie("token" , token);
//     res.send("registered")
// })



// app.post("/register", async (req, res) => {
//   try {
//     let { email, password, username, name, age } = req.body;

//     // check if user already exists
//     let existingUser = await usertModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("User Already Registered");
//     }

//     // hash password (await keeps it in sync)
//     const hash = await bcrypt.hash(password, 10);

//     // create new user
//     const newUser = await usertModel.create({
//       username,
//       email,
//       age,
//       name,
//       password: hash,
//     });

//     // create JWT token
//     let token = jwt.sign(
//       { email: newUser.email, userid: newUser._id },
//       "shhhh"
//     );

//     // set cookie
//     res.cookie("token", token);

//     // ✅ now send response
//     return res.send("registered");
//   } catch (err) {
//     console.error("Register error:", err);
//     return res.status(500).send("Internal Server Error");
//   }
// });

//middleware for login information

// function isLoggedIn(req , res , next){
//     if (req.cookie.token === "" ) res.send("You must be Logged In")
//         else{
//             let data = jwt.verify(req.cookie.token , "shhhh")
//             req.user = data;
//         }
//     next();
//     }

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.send("You must be Logged In");

  try {
    let data = jwt.verify(token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.send("Invalid Token");
  }
}

function isLoggedOut(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.send("You must be Logged In");

  try {
    let data = jwt.verify(token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.send("Invalid Token");
  }
}



const PORT = 3000;

app.listen(PORT , console.log(`Server Started at http://localhost:${PORT}`));
