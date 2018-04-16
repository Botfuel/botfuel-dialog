const { SampleAbstractModuleView } = require('botfuel-module-sample');

class ConcreteView extends SampleAbstractModuleView {
  getTextsConcrete() {
    return ['Extending a view defined in a module...'];
  }
}

module.exports = ConcreteView;
