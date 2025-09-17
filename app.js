const express = require("express")

const app = express();

const usertModel = require("./models/user");
const cookieParser = require("cookie-parser");

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/" , (req , res)=>{
    res.render("index")
})


app.get("/register" , async(req , res)=>{
    let {email , password , username , name , age} = req.body
    let user = await usertModel.findOne({email})
    if (user) return res.status(500).send("User Already Registered")
})



const PORT = 3000;

app.listen(PORT , console.log(`Server Started at http://localhost:${PORT}`));
