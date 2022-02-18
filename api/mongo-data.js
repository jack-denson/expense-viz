const { MongoClient, ServerApiVersion, ObjectId, ConnectionCheckedInEvent } = require('mongodb');
const credentials = './certs/X509-cert-8723611595316076760.pem';

const client = new MongoClient('mongodb+srv://expenses.kassj.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials,
  serverApi: ServerApiVersion.v1
});

async function connect( coll ) {
  await client.connect();
  const database = client.db("expenses");
  const collection = database.collection( coll );

  return { collection, client }
}


module.exports = connect