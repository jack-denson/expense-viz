const express    = require('express');
const {runQuery} = require('./notion-data')

const app = express();

app.get('/', (req, res) => {
    res.json({
        abc: 'defg'
    });
});

app.get('/specs', (req, res) => {
  const specs = fs.readdirSync("viz-specs")
  let specList = []
  for(let spec of specs){
      specList.append(JSON.parse(fs.readFileSync("viz-specs/" + spec + ".json", "UTF8")))
  }

  res.json(specList)
})

app.get('/data', async (req, res) => {
  const data = await runQuery()
  res.json(data)
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});