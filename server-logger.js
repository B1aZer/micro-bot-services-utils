require('dotenv').config();
const fs = require('fs');
const LOG_FILES_SEPARATOR = '|||';
const express = require('express');
const app = express();
const port = 3044;
// ERROR HANDLING
const { transporter, mailOptions } = require('./mail.js');
process.on('uncaughtException', err => {
    console.log('There was an uncaught error', err);
    // send mail with defined transport object
    mailOptions.subject = '✖ Logger Server Has Crashed ✖';
    mailOptions.text = JSON.stringify(err);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        process.exit(1);
    });
});

app.use(express.json());

const mapFns = {
    'rare-upcoming': upcomingMap,
    //TODO:
    'twitter-following': upcomingMap,
}

//save?name&data=
// open file
//write
//close file
//cleanup

//get?name&id=recent&limit=5
app.get('/get', (req, res) => {
    const name = req.query.name;
    const id = req.query.id;
    const limit = req.query.limit;
    const order = req.query.order;
    const groupBy = req.query.groupBy;
    const lines = getLinesFor(name, id);
    const items = formatItems(lines, name);
    const orderedItems = orderItems(items, order);
    const limitedItems = splitItems(orderedItems, limit);
    const groupedItems = groupByItems(limitedItems, groupBy)
    res.send(groupedItems);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    cacheRecentLogs();
})

function cacheRecentLogs() {

}

function getLinesFor(name, id) {
    const num = id ?? 'recent';
    const fileNum = num === 'recent' ? 0 : num;
    const command_files = fs.readdirSync(`./out/${name}`).reverse();
    const log = fs.readFileSync(`./out/${name}/${command_files[fileNum]}`, 'utf8');
    return log.split('\n');
}

function formatItems(lines, name) {
    // .map with left null values in array
    const items = lines.flatMap(mapFns[name]);
    return items;
}

function splitItems(items, limit) {
    return items.slice(0, limit);
}

function orderItems(items, order) {
    if (order === 'date')
        return items.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (order)
        return items.sort((a, b) => b[order] - a[order]);
    return items;
}

function groupByItems(limitedItems, groupBy) {
    if (!groupBy)
        return limitedItems;
    const grouped = [];
    while (limitedItems.length > 0) {
        const singleGroup = [];
        for (let i = 0; i < groupBy; i++) {
            singleGroup.push(limitedItems.shift());
        }
        grouped.push(singleGroup);
    }
    return grouped;
}

function upcomingMap(line) {
    if (line?.trim()) {
        return {
            name: line.split(LOG_FILES_SEPARATOR)[0]?.trim(),
            date: line.split(LOG_FILES_SEPARATOR)[1]?.trim(),
            link: line.split(LOG_FILES_SEPARATOR)[2]?.trim(),
            followers_count: line.split(LOG_FILES_SEPARATOR)[3]?.trim(),
        };
    }
    return [];
}