module.exports = {
    pickRandom(array, rnd) {
        return array[Math.floor(rnd * array.length)];
    },
    removeAndReturnRandom(array, rnd) {
        const randomEl = module.exports.pickRandom(array, rnd);
        const indexOfRemEl = array.indexOf(randomEl);
        const removedElArr = array.splice(indexOfRemEl, indexOfRemEl + 1);
        return removedElArr[0];
    }
}