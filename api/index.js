const express    = require('express');
const {runQuery} = require('./notion-data')
const cors = require('cors');

const app = express();


app.get('/', (req, res) => {
    res.json({
        abc: 'defg'
    });
});
const cors_policy = cors({origin: 'http://localhost:8080' })

app.get('/specs', cors_policy, (req, res) => {
  const specs = fs.readdirSync("viz-specs")
  let specList = []
  for(let spec of specs){
      specList.append(JSON.parse(fs.readFileSync("viz-specs/" + spec + ".json", "UTF8")))
  }

  res.json(specList)
})
app.get('/data', cors_policy , async (req, res) => {
  const data = await runQuery()
  res.send(data)
})


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});