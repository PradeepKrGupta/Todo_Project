// General Template....for express and nodejs
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");
const app = express();
const PORT = process.env.PORT || 3030;
const _ = require("lodash");

// We can use this to select the item from the body of html file.
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');


// Making connection of mongoose with mongodb database
mongoose.connect("mongodb://127.0.0.1:27017/todolist", {useNewUrlParser : true});

// Now creating the schema for the todolist
const ItemSchema = new mongoose.Schema({
    name:String
});

// Now creating the model for the schema usually the name is in captial and first argument is in singular and second argument is schema name 
const MongoItem = mongoose.model("MongoItem", ItemSchema);






// Now creating the documents 
const item1 = new MongoItem({
    name:"welcome to your todolist"
});
const item2 = new MongoItem({
    name:"Hit the + button to add a new item"
});
const item3 = new MongoItem({
    name:"<-- hit this to delete an item"
});





// Creating an itemArray and stored the items inside it.
const itemArray = [item1, item2, item3];

async function getItems(){

    const MongoItems = await MongoItem.find({});
    return MongoItems;
  
  }
  



app.get("/", function(req, res){

    let day = date.getDay();
    // we need to find the element inside the terminal
    getItems().then(function(mongoitems){
        res.render("list", {listTitle : day, newlistItems: mongoitems});
    });
    
});






// creating listSchema
const listSchema = {
    name:String,
    items:[ItemSchema]
};
const List = mongoose.model("List", listSchema);


app.get("/:customeListName",function(req, res){
    // _.capitalize is a lodash functionality and we use it to capitalize the first letter of the string.
    const customeListName = _.capitalize(req.params.customeListName);
    // creating findone method to find weather the new collections is already existed or not.
    List.findOne({ name: customeListName })
    .then(foundlist => {
        if (!foundlist) {
            // create a new list
            const list = new List({
                name: customeListName,
                items:itemArray
            });
            list.save();
            res.redirect("/"+customeListName);
        } else {
            res.render("list", {listTitle : foundlist.name, newlistItems: foundlist.items});
        }
    })
    .catch(err => {
        console.error(err);
    });
});



// function to add the item on the listitem on database.
app.post("/", function(req, res){
    const itemName = req.body.newItem;
    // Here we are finding the collections list
    const listName = req.body.list;
    // here we create document and we add it to database
    const item = new MongoItem({
        name:itemName
    });
    let day = date.getDay();
    if(listName === day){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}).then(foundlist=>{
            foundlist.items.push(item);
            foundlist.save();
            res.redirect("/"+listName);
        });
    }
});




// function to delete the item on 
app.post("/delete", function(req, res){
    const item_id= req.body.deleteCheckbox;
    const listName = req.body.listName;
    // using deleteOne function to delete the item and again redirected to home route.
    let day = date.getDay();
    if(listName===day){
        MongoItem.deleteOne({_id:item_id}).exec().then(()=>{
            console.log("Item Deleted!");
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:item_id}}}).then(foundlist=>{
            if(foundlist){
                res.redirect("/"+listName);
            }
        });
    }
    
});





app.get("/about", function(req, res){
    res.render("about");
});

app.listen(PORT, function(){
    console.log(`server started on port ${PORT}`);
});







