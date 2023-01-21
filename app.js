require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")

const link = process.env.LINK

mongoose.connect(link, { useNewUrlParser: true })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const itemSchema = {
    name: String
}

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
    name: "welcome to your todo list"
})
const item2 = new Item({
    name: "hit the + button"
})

const item3 = new Item({
    name: "here you go"
})

const defaultItem = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
}


const List = mongoose.mongoose.model("List", listSchema);



app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {

        if (foundItems.length == 0) {
            Item.insertMany(defaultItem, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfull save defalut item to database");
                }
            })
            res.redirect("/")

        } else {
            let day = date.getDate();
            res.render("list", { listTitle: day, newListItems: foundItems })

        }



    })


})

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }, function(err, foundItems) {
        if (!err) {
            if (!foundItems) {
                const list = new List({
                    name: customListName,
                    items: defaultItem
                })
                list.save();
                res.redirect("/")

            } else {
                res.render("list", { listTitle: customListName, newListItems: foundItems.items })
            }
        }
    })


})



app.post("/", function(req, res) {
    let itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    })
    item.save()


    console.log("hey i am " + req.body.list)

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        res.redirect("/");
    }

})

app.post("/delete", function(req, res) {

    const checkedItemId = req.body.checkBox;
    console.log(typeof(checkedItemId));
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log("successfully delteted checked itrem");
            res.redirect("/")
        } else {
            console.log(err);
        }
    })

})

app.get("/work", function(req, res) {

    res.render("list", { listTitle: "Work List", newListItems: workItems })
})

app.get("/about", function(req, res) {
    res.render("about");
})

const port = process.env.PORT

app.listen(port || 3000, function() {
    console.log("server running at port " + port);
})