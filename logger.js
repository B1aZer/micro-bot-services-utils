require('dotenv').config();
const fs = require('fs');

module.exports = class Logger {
    constructor(name) {
        if (!fs.existsSync(`/home/hipi/Sites/GooDee/_utils/out/${name}`)) {
            fs.mkdirSync(`/home/hipi/Sites/GooDee/_utils/out/${name}`);
        }
        this.logger = fs.createWriteStream(`/home/hipi/Sites/GooDee/_utils/out/${name}/${(new Date().toJSON())}.log`, {
            flags: 'a'
        });
    }
    write(obj) {
        let keys = Object.keys(obj)
        keys.forEach((key, i) => {
            obj[key] && this.logger.write((obj[key]).toString().trim())
            if (i < keys.length - 1) {
                this.logger.write(` ${process.env.LOG_FILES_SEPARATOR} `)
            }
        });
        keys.length && this.logger.write('\n')

    }
    finish() {
        this.logger.end();
    }
}

