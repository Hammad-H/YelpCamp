var mongoose = require("mongoose");
var CampGround = require("./models/campgrounds");
var Comment = require("./models/comment");
var data = [
  {
    name: "Margalla Hills",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/16/51/09/79/margalla-hills-is-the.jpg",
    description: "bla bla bla"
  },
  {
    name: "Fairy Meadows",
    image: "https://trek.pk/wp-content/uploads/2016/05/fairy-meadows-trek.jpg",
    description: "bla bla bla"
  },
  {
    name: "Hunza",
    image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/2e/86/f6/hunza-panorama-hotel.jpg",
    description: "bla bla bla"
  },
]
function seedDB() {
  //remove all campgrounds
  CampGround.remove({}, function(err){
    if(err){
      console.log(err);
    }
    else {
      console.log("removed campgrounds");
    }
    //create campgrounds
    data.forEach(function(seed){
      CampGround.create(seed, function(err, campground){
        if(err){
          console.log(err);
        }
        else {
          console.log("added campground");
          //create a comment
          Comment.create({
            text: "This place is great but I wish there was internet",
            author: "Homer"
          }, function(err, comment){
            if(err) {
              console.log(err);
            }
            else {
              campground.comments.push(comment);
              campground.save();
              console.log("comment added");
           }
          });
        }
      })
    });
  });


}

module.exports = seedDB;
