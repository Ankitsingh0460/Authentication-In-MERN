const express = require("express");
const urlRoute = require("./routes/url")
const { connectToMongoDb } = require("./connect")
const URL = require("./models/url")
const cookieParser = require("cookie-parser");
const path = require("path");
const staticRouter = require("./routes/staticRoute");
const userRouter = require("./routes/user")
const { restrictToLoginUser } = require("./middleware/auth")


const app = express();
const Port = 8001;

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectToMongoDb("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Database Connected"))

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));




app.use("/url", restrictToLoginUser, urlRoute)
app.use("/", staticRouter);
app.use("/user", userRouter)




app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(Port, () => console.log(`Server Started ${Port}`))