module.exports = {
    pickRandom(array, rnd) {
        return array[Math.floor(rnd * array.length)];
    },
    removeAndReturnRandom(array, rnd) {
        const randomEl = module.exports.pickRandom(array, rnd);
        const indexOfRemEl = array.indexOf(randomEl);
        const removedElArr = array.splice(indexOfRemEl, indexOfRemEl + 1);
        return removedElArr[0] ?? '';
    },
    randomIntFromInterval(min, max, rnd) { // min and max included 
        return rnd * (max - min + 1) + min;
    }
}