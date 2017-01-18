class Nlu {
    static analyze(sentence, cb) {
        cb(null, {
            entities: null,
            features: null
        });
    }
}

module.exports = Nlu
