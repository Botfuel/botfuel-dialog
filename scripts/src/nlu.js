class Nlu {
    static analyze(sentence) {
        return new Promise((resolve, reject) => {
            resolve({
                entities: null,
                features: null
            });
        });
    }
}

module.exports = Nlu
