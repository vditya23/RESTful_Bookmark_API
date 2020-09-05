//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

const Schema = mongoose.Schema;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bookmarkDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const tagSchema = new Schema({
  Title: {
    type: String,
    unique: true
  },
  Time_created: Number,
  Time_updated: Number
});

const Tag = mongoose.model("Tag", tagSchema);

const bookmarkSchema = new Schema({
  Link: {
    type: String,
    unique: true
  },
  Title: String,
  Time_created: Number,
  Time_updated: Number,
  Publisher: String,
  Tags: [String]
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

const date = Date.now();

////////////////////////////////////Requests targetting all articles/////////////////

app.route("/tag")

  .get(function(req, res) {
    Tag.find(function(err, foundTags) {
      if (!err) {
        res.send(foundTags);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newTag = new Tag({
      Title: req.body.title,
      Time_created: date,
      Time_updated: date
    });
    newTag.save(function(err) {
      if (!err) {
        res.send("Successfully added a new tag.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Tag.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all tags.");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////// Bookmark Route ////////////////////////////

app.route("/bookmark")

  .get(function(req, res) {
    Bookmark.find(function(err, foundBookmark) {
      if (!err) {
        res.send(foundBookmark);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newBookmark = new Bookmark({
      Link: req.body.link,
      Title: req.body.title,
      Time_created: date,
      Time_updated: date,
      Publisher: req.body.publisher,
      Tags: req.body.tag
    });
    newBookmark.save(function(err) {
      if (!err) {
        res.send("Successfully added a new bookmark.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Bookmark.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all bookmarks.");
      } else {
        res.send(err);
      }
    });
  });


//////////////////////////////////Request targetting a specific tag/////////////////////

app.route("/tag/:tagId")

  .get(function(req, res) {

    Tag.findOne({
      _id: req.params.tagId
    }, function(err, foundTag) {
      if (foundTag) {
        res.send(foundTag);
      } else {
        res.send("No tags matching that id was found.");
      }
    });
  })


  .delete(function(req, res) {
    Tag.deleteOne({
        _id: req.params.tagId
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the tag.");
        } else {
          res.send(err);
        }
      }
    );
  });

///////////////////////////// Request targetting a specific Bookmark ////////////////////

app.route("/bookmark/:bookmarkId")

  .get(function(req, res) {

    Bookmark.findOne({
      _id: req.params.bookmarkId
    }, function(err, foundBookmark) {
      if (foundBookmark) {
        res.send(foundBookmark);
      } else {
        res.send("No Bookmark matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Bookmark.update({
        _id: req.params.bookmarkId
      }, {
        Link: req.body.link,
        Title: req.body.title,
        Time_updated: date,
        Publisher: req.body.publisher,
        Tags: req.body.tag
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated Bookmark.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res) {
    Bookmark.update({
        _id: req.params.bookmarkId
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated Bookmark.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {
    Bookmark.deleteOne({
        _id: req.params.bookmarkId
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the Bookmark.");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
