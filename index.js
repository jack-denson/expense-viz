const { Client } = require('@notionhq/client');
fs = require('fs');



//const notion = new Client({ auth: process.env.NOTION_KEY })


// Parse out credentials and database ID
const NOTION_KEY = fs.readFileSync("notion-token.txt", "UTF8");
const notionPages = JSON.parse(fs.readFileSync("notion-pages.json", "UTF8"));
const NOTION_DB = notionPages.expenseDB

// Init Notion client
const notion = new Client({auth: NOTION_KEY});

async function getData(databaseId, ftr){
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: ftr
    });
    return response;
}

function getThisWeek(date=(new Date()).toLocaleDateString()){
    let lastSunday = new Date(date);
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay() % 7);

    let nextSunday = new Date(date);
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) % 7);

    return [lastSunday, nextSunday]
}

function formatResult(result){

    let results = result.results
    results = results.map(x => x.properties)
    results = results.map(function(x){
        res = {}
        res["created_time"] = x.Date.created_time
        res["Category"] = x.Category.multi_select.map(x => x.name)
        res["Cost"] = x.Cost.number
        res["Name"] = x.Name.title.map(x => x.plain_text)[0]
        return res
    })
    console.log(results)
}

// getData(NOTION_DB)

let ss = getThisWeek("12/8/2021")
lsun = ss[0].toISOString()
nsun = ss[1].toISOString()


async function runQuery(){
    queryFilter = 
    {"and": [{
                property: "Date",
                date: {
                after: lsun,
                }
            },
            {
                property: "Date",
                date: {
                before: nsun,
                }
            }]
    }
    
    response = await getData(NOTION_DB, queryFilter)
    formatResult(response)
}

runQuery()