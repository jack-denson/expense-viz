const { Client } = require('@notionhq/client');
const fs         = require('fs');

// Parse out credentials and database ID
const NOTION_KEY = fs.readFileSync("./notion-token.txt", "UTF8");
const notionPages = JSON.parse(fs.readFileSync("./notion-pages.json", "UTF8"));
const NOTION_DB = notionPages.expenseDB

// Init Notion client
const notion = new Client({auth: NOTION_KEY});

async function getData(databaseId, ftr){
    const response = await notion.databases.query({
      database_id: databaseId
    });
    return response;
}

function getWeek(date){
    let lastSunday = new Date(date);
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay() % 7);

    return lastSunday.toLocaleDateString()
}

function formatResults(result){

    let results = result.results
    results = results.map(x => x.properties)
    results = results.map(function(x){
        res = {}
        res["created_time"] = x.Date.created_time
        res["Category"] = x.Category.multi_select[0].name
        res["Cost"] = x.Cost.number
        res["Name"] = x.Name.title.map(x => x.plain_text)[0]
        return res
    })
    return results
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

async function runQuery(){
    response = await getData(NOTION_DB, {})
    return binWeeks(formatResults(response))
}


module.exports = {
    runQuery
}