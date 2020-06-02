const Player = require('./player');

class Dealer extends Player {
  constructor() {
		super();
		this.showHand = [];
	}
	
	addCardToHand(card) {
		this.hand.push(card);
		this.sum += card.value;
		(this.showHand.length == 0) ?
			this.showHand.push(card):
			this.showHand.push('Card');	
	}
}

module.exports = Dealer;