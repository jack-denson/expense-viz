const { MongoClient, ServerApiVersion } = require('mongodb');


if( process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const password = process.env.MONGO_PW
const username = process.env.MONGO_UN

const uri = `mongodb+srv://expenses-app:${ password }@expenses.kassj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});


async function connect( coll ) {
  await client.connect();
  const database = client.db("expenses");
  const collection = database.collection( coll );

  return { collection, client }
}


module.exports = connect