module.exports = {
    headersGenerator: function* headersGenerator() {
        let i = 0;
        const headers = [
            {
                headers: {
                    "X-API-KEY": "b9ab6f08fe5e408fb9c61f1fb4dabf60"
                }
            },
            {
                headers: {
                    "X-API-KEY": "0f4cecba10aa45c49abdd314286d7c8a"
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