class Player {
  constructor() {
    this.hand = [];
    this.sum = 0;
	}
	
  addCardToHand(card) {
    this.hand.push(card);
    this.sum += card.value;	
    }
}
  
  module.exports = Player;