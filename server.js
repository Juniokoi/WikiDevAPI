import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";

// Server configuration
const app = express();
const port = 3000;

// express & ejs setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
});

// Create a schema for our data
const Article = mongoose.model("Article", {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Set up the route for all the articles 👌
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      err ? console.error(err) : res.send({ articles: articles });
    });
  })
  .post((req, res) => {
    const article = new Article(req.body);
    article.save((err) => {
      err ? console.error(err) : res.send({ article: article });
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      err
        ? console.error(err)
        : res.send({ message: "All the articles are deleted" });
    });
  });
//

// Set up the route for a single article ✨
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      err ? console.error(err) : res.send({ article: article });
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { content: req.body.content } },
      {},
      (err) => {
        err ? console.error(err) : res.send({ message: "Article updated" });
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      err ? console.error(err) : res.send({ message: "Article deleted" });
    });
  });
//

// set up the route for the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
