const express      = require('express');
const {runQuery}   = require('./notion-data')
const cors         = require('cors');
const fs           = require('fs');
const dotenv       = require('dotenv');
const jwt          = require('jsonwebtoken')
const bodyParser   = require('body-parser')
const connect      = require('./mongo-data');
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

function generateAccessToken(username, id) {
  return jwt.sign({ username, id }, process.env.TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

    if (err){
      return res.sendStatus(403)
    }

    req.user = user

    next()
  })
}

function getWeek(date){
  let lastSunday = new Date(date);
  lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay() % 7);

  return lastSunday.toLocaleDateString()
}

function binWeeks(flat) {
  let binned = {}
  for(let expense of flat) {
    const lsun = getWeek(expense['created_time'])

    if(binned[lsun]) {
      binned[lsun].push(expense)
    }
    else {
      binned[lsun] = [expense]
    }
  }
  return binned
}

app.post('/login', async (req, res) => {

  const { username, password } = req.body;
  const { collection } = await connect( 'users' );


  const users = await collection.find ({ username }).toArray();

  if( !users.length ) {
    return res.sendStatus( 403 );
  }

  const user = users[0]
  const pwValid = await bcrypt.compare(password, user.password);
  if( !pwValid ) {
    res.sendStatus(403)
  }
  else {
    const token = generateAccessToken( user.username, user._id );
    res.cookie('token', token, { httpOnly: true });
    res.json({ token });
  }

});

app.get('/user', authenticateToken, (req, res) => {
    res.json(req.user)
});
const cors_policy = cors({origin: 'http://localhost:8080' })

app.get('/specs', authenticateToken, cors_policy, (req, res) => {
  const specs = fs.readdirSync("viz-specs")
  let specList = []
  for(let spec of specs){
      specList.push(JSON.parse(fs.readFileSync("viz-specs/" + spec, "UTF8")))
  }

  res.json(specList)
})

app.get('/data', authenticateToken, cors_policy , async (req, res) => {
  const { collection: expenses } = await connect( 'expenses' );

  console.log(req.user.id)
  const data = await expenses.find({ user: new ObjectId(req.user.id)}).toArray();
  res.send(binWeeks(data))
})


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});