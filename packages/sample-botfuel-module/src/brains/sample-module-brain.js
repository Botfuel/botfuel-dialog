const { MemoryBrain } = require('botfuel-dialog');

class SampleModuleBrain extends MemoryBrain {
  constructor(config) {
    super(config);
    this.secretSauce = config.brain.brainSecretSauce;
  }
}

module.exports = SampleModuleBrain;
