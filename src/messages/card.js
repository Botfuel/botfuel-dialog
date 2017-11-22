/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Part = require('./part');

/**
 * A card part.
 */
class Card extends Part {
  /**
   * @constructor
   * @param {String} title - the title
   * @param {String} imageUrl - the image url
   * @param {Object[]} buttons - an array of buttons
   */
  constructor(title, imageUrl, buttons) {
    super();
    // TODO : this is very Messenger specific, let's generalize it!
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons;
  }

  // eslint-disable-next-line require-jsdoc
  toJson() {
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.buttons.map(button => button.toJson()),
    };
  }
}

module.exports = Card;
