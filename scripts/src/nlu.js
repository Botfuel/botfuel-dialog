class Nlu {
    static analyze(sentence) {
        return new Promise((resolve, reject) => {
            resolve({
                entities: [
                    "entity"
                ],
                features: [
                    "feature"
                ]
            });
        });
    }
}

module.exports = Nlu
