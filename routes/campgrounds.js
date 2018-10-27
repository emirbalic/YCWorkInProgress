var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - SHOW ALL ITEMS
router.get('/', function(req, res){
   Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log("smg went wrroong");
       } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
       }
   });
});

//CREATE - Adds new item to the DB
router.post('/', middleware.isLoggedIn, function(req, res){
    //res.send('you hit the postroute');
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, price:price, image:image, description:description, author:author};
    //create a new campground and save to db
    Campground.create(newCampground, function(err, allCampgrounds){
        if(err){
            console.log("IFFFF THE EERRRR" + err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//NEW - SHOW FORM TO ADD A NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
   res.render('campgrounds/new') 
});

//SHOW - SHOWS MORE INFO/DETAIL VIEW OF A SINGLE ITEM
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }   else {

            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(err, foundCampground){
                    res.render("campgrounds/edit", {campground:foundCampground});
    });
   
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id); //or updatedCampground._id
       }
   });
});

//DESTROY CAMPGROUND 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

//middleware




module.exports = router;