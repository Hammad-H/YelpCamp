var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose")
var CampGround = require("./models/campgrounds")
var Comment = require("./models/comment")
var seedDB = require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true})



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	CampGround.find({}, function(err, allCampgrounds) {
		if(err){
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds})
		}
	})
});

app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});


app.post("/campgrounds", function(req,res) {
	var name = req.body.name;
	var image = req.body.image;
	var dsc = req.body.description;
	var newCampGround = {name: name, image: image, description: dsc};
	CampGround.create(newCampGround, function(err, newlyCreated) {
		if(err) {
			consol.log(err);
		}
		else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/:id", function(req, res) {
	CampGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}else {
			res.render("campgrounds/show", {campground: foundCampground});
		}

	});
});

//========================
// COMMENTS ROUTES
//========================

app.get("/campgrounds/:id/comments/new", function(req, res){
		CampGround.findById(req.params.id, function(err, campground){
			if(err) {
				console.log(err);
			}
			else {
				res.render("comments/new", {campground: campground});
			}
		});
});

app.post("/campgrounds/:id/comments", function(req, res){
	CampGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campground");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id)
				}
			})
		}
	})
});

app.listen(3000, function() {
	console.log("The YelpCamp Server has started!");
});
