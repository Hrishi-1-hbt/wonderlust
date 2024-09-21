const express = require("express");
const router = express(); // Keep this as it is
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const port = 3030;

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(async (req, res) => { 
    try {
        let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    

    const registeredUser = await User.register(newUser, password); 
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!"); // Corrected "Wellcome" to "Welcome"
        res.redirect("/listings");
    })
   
        
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

});

router.post("/login",
     saveRedirectUrl , 
     passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: true // This should be a comment, not a forward slash
}), 
async (req, res) => {
    req.flash("success", "Welcome to wanderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are logged Out");
        res.redirect("/listings");
    })
})


router.listen(port, () => {
    console.log(`app is listening on port ${port}`); // Corrected the message
});

module.exports = router;
