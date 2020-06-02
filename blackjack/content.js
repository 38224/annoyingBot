
class Content {
  constructor(stats) {
    this.stats = stats;
	}
	updateStats(stats){
		this.stats.rounds = stats.rounds;
		this.stats.excesses = stats.excesses;
		this.stats.blackjacks = stats.blackjacks;
		if (stats.rounds > 0) {
			this.stats.winrate = stats.wins / stats.rounds * 100;
			this.stats.winrate = Math.round((this.stats.winrate*100)/100);
			this.stats.drawrate = stats.draws / stats.rounds * 100;
			this.stats.drawrate = Math.round((this.stats.drawrate*100)/100);
			this.stats.looserate = stats.looses / stats.rounds * 100;
			this.stats.looserate = Math.round((this.stats.looserate*100)/100)
		}
	}
	createString(){
		let string = `You have played ${this.stats.rounds} rounds:
		\nWin rate: ${this.stats.winrate}% | You end with draw ${this.stats.drawrate}% | You had: ${this.stats.excesses} excesses | You had: ${this.stats.blackjacks} BlackJacks`
		return string;
  }
}
  
module.exports = Content;