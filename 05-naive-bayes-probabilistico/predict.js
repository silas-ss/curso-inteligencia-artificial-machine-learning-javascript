const naiveBayes = require('./naive-bayes')

const bayes = new naiveBayes()
bayes.loadModel()

const result = bayes.predict('bom')
console.log(result)