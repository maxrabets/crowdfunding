const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const camapignsRouter = require("./routes/campaignsRouter");
const usersRouter = require("./routes/usersRouter");
const cors = require('cors');
const sequelize = require("./config/sequelize");
const Category = require("./models/Category");
const Campaign = require("./models/Campaign");
const ReactionType = require("./models/ReactionType");
require("./models/associations");
require('dotenv').config();

var port = process.env.PORT || 8080;

if(process.env.NODE_ENV !== "production") {
  app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
  }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
 
app.use("/api/campaigns", camapignsRouter);
app.use("/api/users", usersRouter);

// app.use(express.static(`${__dirname}/frontend/build`));
// app.get('*', (req, res) => {
//   res.sendFile(`${__dirname}/frontend/build/index.html`);
// });  


if(process.env.NODE_ENV === "production") {
  app.use(express.static(`${__dirname}/frontend/build`));
  app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/frontend/build/index.html`);
  });  
}

sequelize.sync({force: false }).then(async (result)=>{
  Campaign.addFullTextIndex();
  await Category.findOrCreate({where: {name: "IT"}});
  await Category.findOrCreate({where: {name: "Education"}});
  await Category.findOrCreate({where: {name: "Fashion"}});
  await Category.findOrCreate({where: {name: "Medicine"}});

  await ReactionType.findOrCreate({where: {name: "like"}});
  await ReactionType.findOrCreate({where: {name: "dislike"}});

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch(err => console.log(err));