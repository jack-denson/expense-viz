const express      = require('express');
const cors         = require('cors');
const fs           = require('fs');
const dotenv       = require('dotenv');
const jwt          = require('jsonwebtoken')
const bodyParser   = require('body-parser')
const connect      = require('./mongo-data');
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongodb')
const bcrypt       = require('bcrypt');
const staticRender = require('./visualizeStatic');
const preprocess   = require('./preprocess');


// This file needs to be split up


// get config vars
dotenv.config();

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


// These two should go in utils file

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



// Log in with username, password, return access token
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

// Get the user associated with with token
app.get('/user', authenticateToken, (req, res) => {
    res.json(req.user)
});
const cors_policy = cors({origin: 'http://localhost:8080' })

// Get all visualization specs
app.get('/specs', authenticateToken, cors_policy, (req, res) => {

  // Having specs in filesystem and not database is dumb and slow, need to fix this
  const specs = fs.readdirSync("viz-specs")
  let specList = []
  for(let spec of specs){
      specList.push(JSON.parse(fs.readFileSync("viz-specs/" + spec, "UTF8")))
  }

  res.json(specList)
})


// Get all data associated with user
app.get('/data', authenticateToken, cors_policy , async (req, res) => {
  const { collection: expenses } = await connect( 'expenses' );

  const data = await expenses.find({ user: new ObjectId(req.user.id)}).toArray();
  res.send(binWeeks(data))
});


// Delete individual expense
app.delete('/delete-expense', authenticateToken, cors_policy , async (req, res) => {
  const { collection: expenses } = await connect( 'expenses' );
  try {

    await expenses.deleteOne( {
      _id: new ObjectId(req.body._id),
      user: new ObjectId(req.user.id)
    } );

    return res.sendStatus(200);

  } catch( err ) {
    console.log( err );
    return res.sendStatus(400);
  }
});

// Add single expense
app.post('/add-expense', authenticateToken, cors_policy, async (req, res) => {
  const { collection: expenses } = await connect( 'expenses' );


  try {
    const newDoc = {
      ...req.body,
      Cost: Number(req.body.Cost),
      created_time: new Date().toISOString(),
      user: new ObjectId(req.user.id)
    }
    
    const { insertedId } = await expenses.insertOne( newDoc );

    

    return res.json({ ...newDoc, _id: insertedId });
  } catch( err ) {
    console.log( err );
    return res.sendStatus(400);
  }

})


// Get single static viz
app.get('/viz/:visualization', authenticateToken, cors_policy, async (req, res) => {


  let spec;
  try {
    spec = JSON.parse(fs.readFileSync("viz-specs/" + req.params.visualization + '.json', "UTF8"));
  }
  catch(err) {
    return res.sendStatus(400);
  }

  const { collection: expenses } = await connect( 'expenses' );
  const data = await expenses.find({ user: new ObjectId(req.user.id)}).toArray();

  const binned = binWeeks(data)

  const preprocessed = preprocess[spec.preprocessor](binned, new Date())

  const svg = await staticRender(preprocessed, spec.schema);

  res.setHeader('content-type', 'image/svg+xml');
  res.send(svg);
})








// Run backend
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});