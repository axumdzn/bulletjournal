const express = require("express");
const router = express.Router();
const {User, Braindump, Inspiration, Todo, Schedule, Note, Goal, Post_it} = require('../models');

//render login page

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("login");
});

//render sign up page

router.get("/signup", (req, res) => {
    res.render("signup");
});

//render home page

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/dashboard", (req, res) => {
  if(!req.session.user){
    return res.redirect("/login")
};
  res.render("dashboard");
});

router.get("/alldailynotes", (req, res)=> {
  if(!req.session.user){
    return res.redirect("/login")
  };
  res.render("alldailynotes")
})

router.get("/note/:id", (req, res) => {
  if(!req.session.user){
    return res.redirect("/login")
};
Note.findOne({
  where:{
    id: req.params.id,
  },
  include:[User, Braindump, Inspiration, Todo, Schedule, Goal, Post_it]
}).then(noteData=>{
  const hbsNote = noteData.get({plain:true});
  console.log(hbsNote)
  console.log(hbsNote.todos.length)
  res.render("note",hbsNote)
}).catch(err => {
  console.log(err);
  res.status(404).json('no data found!')
})
});

router.get('/day/:num', (req, res) => {
    if(!req.session.user){
      return res.redirect("/login")
    };
    Note.findOne({
        where:{
          day: req.params.num,
          user_id:req.session.user.id
        },
        include:[User, Braindump, Inspiration, Todo, Schedule, Goal, Post_it]
    }).then(noteData=>{
        const hbsNote = noteData.get({plain:true});
        console.log(hbsNote)
        res.render("day",hbsNote)
    }).catch(err => {
        console.log(err);
        res.render("404")
    })
});

module.exports = router;
