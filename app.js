const express = require("express")

const app = express();

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const postModel = require("./models/post")

const usertModel = require("./models/user");

const cookieParser = require("cookie-parser");

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/" , (req , res)=>{
    res.render("index")
})


app.post("/register" , async(req , res)=>{
    let {email , password , username , name , age} = req.body
    let user = await userModel.findOne({email})
    if (user) return res.status(500).send("User Already Registered")

    bcrypt.genSalt(10 , async (err , salt)=>{
        let newUser = await bcrypt.hash(password , salt , (err , hash)=>{
            usertModel.create({
                username, 
                email,
                age,
                name,
                password : hash
            })
            
        })
    })
    
    let token = jwt.sign({email : email , userid : newUser._id} , "shhhh");
    res.cookie("token" , token);
    res.send("registered")
})



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




const PORT = 3000;

app.listen(PORT , console.log(`Server Started at http://localhost:${PORT}`));
