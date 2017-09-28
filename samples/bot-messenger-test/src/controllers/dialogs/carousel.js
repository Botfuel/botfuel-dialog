const sdk2 = require('@botfuel/bot-sdk2');

/**
 * Carousel class.
 */
class Carousel extends sdk2.Dialog {
  static card(title, buttons, image) {
    return {
      title,
      image_url: image,
      buttons,
    };
  }

  static button(type, text, value) {
    return {
      type,
      text,
      value,
    };
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object} messageEntities
   */
  async execute(id, responses, messageEntities) {
    console.log('Carousel.execute', responses, messageEntities);
    if (messageEntities.length === 0) {
      await this.cardsMessage(id, responses, [
        Carousel.card(
          'Chat',
          [
            Carousel.button('link', 'Details', 'https://fr.wikipedia.org/wiki/Chat'),
            Carousel.button('postback', 'Choose', {
              dialog: { label: 'carousel' },
              entities: [{ dim: 'carousel', value: 'Chat' }],
            }),
          ],
          'http://jolabistouille.j.o.pic.centerblog.net/45777f7a.png',
        ),
        Carousel.card(
          'Chien',
          [
            Carousel.button('link', 'Details', 'https://fr.wikipedia.org/wiki/Chien'),
            Carousel.button('postback', 'Choose', {
              dialog: { label: 'carousel' },
              entities: [{ dim: 'carousel', value: 'Chien' }],
            }),
          ],
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL78uXhJd52V70KjG4cpV_1LTPu3v6BkWIiFV7X0pNc-hBD5jp',
        ),
        Carousel.card(
          'Oiseau',
          [
            Carousel.button('link', 'Details', 'https://fr.wikipedia.org/wiki/Oiseau'),
            Carousel.button('postback', 'Choose', {
              dialog: { label: 'carousel' },
              entities: [{ dim: 'carousel', value: 'Oiseau' }],
            }),
          ],
          'http://jardinage.lemonde.fr/images/dossiers/2017-04/roge-gorge-2-173215.jpg',
        ),
      ]);
    } else {
      this.textMessage(id, responses, 'carousel_confirm', messageEntities[0]);
    }
    return true;
  }
}

module.exports = Carousel;
