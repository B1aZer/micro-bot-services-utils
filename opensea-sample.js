module.exports = {
    headersGenerator: function* headersGenerator() {
        let i = 0;
        const headers = [
            {
                headers: {
                    "X-API-KEY": ""
                }
            },
            {
                headers: {
                    "X-API-KEY": ""
                }
            },
            {}
        ]
        while (true) {
            yield headers[i%headers.length];
            i++;
        }
    }
}