//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
var _ = require('lodash');
const ejs = require("ejs");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useUnifiedTopology:true,useNewUrlParser:true});
  
const workSchema =new mongoose.Schema ({
  task:String
});

const ListSchema = new mongoose.Schema({
  name:String,
  items:[workSchema]
})

const Item = mongoose.model('Item',workSchema);//defaultList
const List = mongoose.model('List',ListSchema);//customList


const item_1 = new Item({
 task:"Lunch"
});
 
const item_2 = new Item({
  task:"Practice"
 });

 const item_3 = new Item({
  task:"Homework"
 });
 

const workItems = [],items= [],result= [],newArray=[];
 
  
 const defaultlist = [item_1,item_2,item_3];
 var home;
 
 

app.get("/", function(req, res) {
  

    
const day = date.getDate();
 Item.find({},function(err,result){
  if(result.length === 0){
    Item.insertMany(defaultlist,function(err){
   if(err)
   console.log(err);
   else
   console.log("Suceeded");
   res.redirect("/");
  });

  }else
  res.render("list", {listTitle: "Today", newListItems: result});

   
 });
 
  
});

app.get("/:topic",function(req,res){
  const heading = req.params.topic;
//   if(heading == home)
//  res.redirect("/");
//  const searchHeading= _.lowerCase(customList.findOne({ name: 'heading'}));
//  if(searchHeading){
//    res.redirect("/"+heading);
//  }else{ const heading =  _.lowerCase(req.params.topic);

//  const page = new customList({
//    name:heading,
//    item:defaultlist
//   });

customList.findOne({name : heading}, function(err,foundList){
 if(!err){
   if(!foundList){
     const foundListItem = new customList({
      name:heading,
      items:defaultlist
     });
     foundListItem.save();
     res.redirect("/"+heading);
   }else
   res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
 }
  
});


 

});

app.post("/delete",function(req,res){
  
  const checkboxId = req.body.checkbox;
  const anotherHeading = _.capitalize(req.body.listName);
    if(anotherHeading == "Today"){
      Item.findByIdAndRemove(checkboxId,function(err){
        if (!err) {
          console.log("Successfully removed");
          res.redirect("/");
         }
      });
    }else{
      customList.findByIdAndUpdate({name: anotherHeading}, {$pull: {items: {_id: checkboxId}}}, function(err, foundList){
        if (!err) {
          res.redirect("/"+anotherHeading);
        }
      });
      // customList.find({name: anotherHeading},function(err,foundList){
      //   if(err)
      //   console.log(err);
      //   else{
      //     console.log(checkboxId);
      //     foundList.items.deleteOne({ _id: checkboxId},function (err) {
      //        if(err)
      //        console.log(err);
      //     });
      //   }
      //   foundList.save();
      // });
     
      // res.redirect("/"+ anotherHeading);
      
    }
});
 
app.post("/", function(req, res){
 
  const newName = req.body.newItem;
  const listName =req.body.list;
  
    const item = new Item({
      task:newName
    });
    if(listName == "Today"){
    item.save();
    res.redirect("/");
    }else{
      customList.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
      });
    }

});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

//  Item.insertMany(array,function(err){
//    if(err)
//    console.log(err);
//   else
//   console.log("Suceeded");
//    });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});


