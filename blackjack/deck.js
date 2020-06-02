class Deck {
  constructor(cards) {
		this.deck = Object.assign([], cards);
	}
	joinDecks(n) {
		let newDeck = Object.assign([], this.deck);
		if (n > 1 ) {
			for (let i = 1; i < n; i++){
				newDeck = newDeck.concat(this.deck);
			}
		}
		return this.newDeck = newDeck;
	}
	mixDeck(){
		this.mixedDeck = Object.assign([], this.newDeck);
		return this.mixedDeck.sort((a,b) => (Math.random() - 0.5));
	}
	dealCard(){
		this.card = this.mixedDeck[0];
		this.mixedDeck.splice(0,1);
		return this.card;
	}
}

module.exports = Deck;