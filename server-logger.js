require('dotenv').config();
const fs = require('fs');
const LOG_FILES_SEPARATOR = '|||';
const express = require('express');
const app = express();
const port = 3044;
const dirPath = `${__dirname}/out`;
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
    'twitter-following': trendingMap,
    'prominent-whitelists': whitelistsMap,
}

//save?name&data=
// open file
//write
//close file
//cleanup

//get?name&ids=recent&limit=5
app.get('/get', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).json({ status: `no`, err: `no name` });
    }
    const id = req.query.id;
    const ids = req.query.ids;
    const limit = req.query.limit;
    const order = req.query.order;
    const groupBy = req.query.groupBy;
    const threshold = req.query.thresh;
    const notIn = req.query.notIn;
    const notInIds = req.query.notInIds;
    const filterParams = { threshold, notIn, notInIds };
    const lines = getLinesFor(name, id, ids);
    const items = formatItems(lines, name);
    const uniqueItems = [...new Set(items)];
    const filteredItems = filterItems(uniqueItems, filterParams);
    const orderedItems = orderItems(filteredItems, order);
    const limitedItems = splitItems(orderedItems, limit);
    const groupedItems = groupByItems(limitedItems, groupBy)
    res.send(groupedItems);
});

app.post('/save', (req, res) => {
    const dir = req.body.dir ?? 'temp';
    const filename = req.body.filename ?? new Date().toISOString();
    let data = req.body.data;
    if (!data) {
        return res.status(400).json({ status: `no`, err: `no data` });
    }
    // string
    data = "" + data
    // with newline
    if (!data.endsWith('\n')) {
        data += '\n';
    }
    if (!fs.existsSync(`${dirPath}/${dir}`)) {
        fs.mkdirSync(`${dirPath}/${dir}`);
    }
    const writeStream = fs.createWriteStream(`${dirPath}/${dir}/${filename}.log`, {
        flags: 'a'
    });
    console.log(`Savind ${data} to ${filename}`);
    writeStream.write(data);
    writeStream.end();
    res.json({ status: `ok` });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    cacheRecentLogs();
})

function cacheRecentLogs() {

}

function getLinesFor(name, id = 'recent', ids = []) {
    const fileNum = id === 'recent' ? 0 : num;
    const command_files = fs.readdirSync(`./out/${name}`).reverse();
    let log;
    if (ids.length) {
        const logs = [];
        for (const id of ids) {
            if (fs.existsSync(`./out/${name}/${command_files[id]}`))
                logs.push(fs.readFileSync(`./out/${name}/${command_files[id]}`, 'utf8'));
        }
        log = logs.join('');
    } else {
        log = fs.readFileSync(`./out/${name}/${command_files[fileNum]}`, 'utf8');
    }
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
        return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (order === 'random') {
        shuffleArray(items);
        return items;
    }
    // desc order
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
            const singleItem = limitedItems.shift();
            singleItem && singleGroup.push(singleItem);
        }
        grouped.push(singleGroup);
    }
    return grouped;
}

function filterItems(items, filterParams) {
    // skip blanks
    items = items.filter(el => el.name);
    if (filterParams.threshold)
        items = items.filter(el => +el.followers_count >= filterParams.threshold);
    if (filterParams.notIn) {
        if (filterParams.notInIds) {
            notInLines = getLinesFor(filterParams.notIn, undefined, filterParams.notInIds);
            console.log(notInLines);
            items = items.filter(el => notInLines.indexOf(el.handle) === -1);
        } else {
            notInLines = getLinesFor(filterParams.notIn);
            console.log(notInLines);
            items = items.filter(el => notInLines.indexOf(el.handle) === -1);
        }
    }
    return items;
}

function upcomingMap(line) {
    if (line?.trim()) {
        return {
            handle: line.split(LOG_FILES_SEPARATOR)[2]?.trim()
                ? `@${line.split(LOG_FILES_SEPARATOR)[2]?.trim().split('/')[line.split(LOG_FILES_SEPARATOR)[2]?.trim().split('/').length - 1]}`
                : '',
            name: line.split(LOG_FILES_SEPARATOR)[0]?.trim(),
            date: line.split(LOG_FILES_SEPARATOR)[1]?.trim(),
            link: line.split(LOG_FILES_SEPARATOR)[2]?.trim(),
            followers_count: line.split(LOG_FILES_SEPARATOR)[3]?.trim(),
        };
    }
    return [];
}

function trendingMap(line) {
    if (line?.trim()) {
        return {
            handle: `@${line.split(LOG_FILES_SEPARATOR)[0]?.trim()}`,
            name: line.split(LOG_FILES_SEPARATOR)[0]?.trim(),
            date: line.split(LOG_FILES_SEPARATOR)[1]?.trim(),
            followers_count: line.split(LOG_FILES_SEPARATOR)[2]?.trim(),
        };
    }
    return [];
}

function whitelistsMap(line) {
    if (line?.trim()) {
        return {
            handle: line.split(LOG_FILES_SEPARATOR)[1]?.trim()
                ? `@${line.split(LOG_FILES_SEPARATOR)[1]?.trim().split('/')[line.split(LOG_FILES_SEPARATOR)[1]?.trim().split('/').length - 1]}`
                : '',
            name: line.split(LOG_FILES_SEPARATOR)[0]?.trim(),
            link: line.split(LOG_FILES_SEPARATOR)[1]?.trim(),
            date: line.split(LOG_FILES_SEPARATOR)[2]?.trim(),
            followers_count: line.split(LOG_FILES_SEPARATOR)[3]?.trim(),
        };
    }
    return [];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}