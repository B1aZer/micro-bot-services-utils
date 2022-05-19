require('dotenv').config();
const fs = require('fs');

module.exports = class Logger {
    constructor(name) {
        this.filename = new Date().toJSON();
        this.name = name;
        if (!fs.existsSync(`/home/hipi/Sites/GooDee/_utils/out/${name}`)) {
            fs.mkdirSync(`/home/hipi/Sites/GooDee/_utils/out/${name}`);
        }
        this.logger = fs.createWriteStream(`/home/hipi/Sites/GooDee/_utils/out/${this.name}/${this.filename}.log`, {
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
    rm() {
        const data = fs.readFileSync(`/home/hipi/Sites/GooDee/_utils/out/${this.name}/${this.filename}.log`)
        if (!data.length) {
            fs.unlinkSync(`/home/hipi/Sites/GooDee/_utils/out/${this.name}/${this.filename}.log`)
        }
    }
    finish() {
        this.logger.end();
        this.rm();
    }
}

