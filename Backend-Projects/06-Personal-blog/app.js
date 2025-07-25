const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");

//   home route/
app.get("/", (req, res) => {
  const articlesDir = path.join(__dirname, "articles");
  const files = fs.readdirSync(articlesDir);
  
  const articles = files.map(file => {
    const content = fs.readFileSync(path.join(articlesDir, file));
    return JSON.parse(content);
  });


  // Sort latest first
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render("home", { articles });
});

// single Article page  route
app.get("/article/:id", (req, res) => {
  const articlePath = path.join(__dirname, "articles", `${req.params.id}.json`);

  if (fs.existsSync(articlePath)) {
    const article = JSON.parse(fs.readFileSync(articlePath));
    res.render("article", { article });
  } else {
    res.status(404).send("Article not found");
  }
});

// GET: Login Form
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST: Handle login form
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials (for demo)
  if (username === "admin" && password === "password123") {
    req.session.user = "admin";
    res.redirect("/admin");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

function requireLogin(req, res, next) {
  if (req.session.user === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
}

//   admin route
app.get("/admin", requireLogin, (req, res) => {
  // Dashboard code will go here
});


// logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Admin dashboard route
app.get("/admin", requireLogin, (req, res) => {
  const articlesDir = path.join(__dirname, "articles");
  const files = fs.readdirSync(articlesDir);

  const articles = files.map(file => {
    const content = fs.readFileSync(path.join(articlesDir, file));
    return JSON.parse(content);
  });

  res.render("admin", { articles });
});

// GET: Show Add Article form
app.get("/admin/add", requireLogin, (req, res) => {
  res.render("add", { error: null });
});

// POST: Handle form submission
app.post("/admin/add", requireLogin, (req, res) => {
  const { title, content, date } = req.body;

  if (!title || !content || !date) {
    return res.render("add", { error: "All fields are required." });
  }

  const id = Date.now().toString(); // unique ID based on timestamp
  const article = { id, title, content, date };

  const filePath = path.join(__dirname, "articles", `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2));

  res.redirect("/admin");
});

// GET: Show Edit Form
app.get("/admin/edit/:id", requireLogin, (req, res) => {
  const articlePath = path.join(__dirname, "articles", `${req.params.id}.json`);

  if (!fs.existsSync(articlePath)) {
    return res.status(404).send("Article not found");
  }

  const data = fs.readFileSync(articlePath);
  const article = JSON.parse(data);

  res.render("edit", { article, error: null });
});

// POST: Handle Edit Submission
app.post("/admin/edit/:id", requireLogin, (req, res) => {
  const { title, content, date } = req.body;

  if (!title || !content || !date) {
    const article = { id: req.params.id, title, content, date };
    return res.render("edit", { article, error: "All fields are required." });
  }

  const updatedArticle = {
    id: req.params.id,
    title,
    content,
    date
  };

  const articlePath = path.join(__dirname, "articles", `${req.params.id}.json`);
  fs.writeFileSync(articlePath, JSON.stringify(updatedArticle, null, 2))
});

// GET: Delete article by ID
app.get("/admin/delete/:id", requireLogin, (req, res) => {
  const filePath = path.join(__dirname, "articles", `${req.params.id}.json`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.redirect("/admin");
});


// Start server
app.listen(3000, () => console.log("Blog running at http://localhost:3000"));
