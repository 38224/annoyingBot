const card = require('./cards');
const Deck = require('./deck');
const Dealer = require('./dealer');
const Player = require('./player');
const readline = require('readline');
const readlineSync = require('readline-sync');
const File = require('./fileWork');
const Content = require('./content');
const chalk = require('chalk');

const Game = function(chan) {
	const channel = chan;
	const deck = new Deck(card);
	const dealer = new Dealer();
	const player = new Player();
	let round = 1;
	let cardRemains;
	let dealerTake;
	let playerTake;
	let shouldTakeCards;
	let shouldPlay = true;
	let roundResult;
	const stats = {
		blackjacks: 0,
		excesses: 0,
		wins: 0,
		draws: 0,
		looses: 0,
		rounds: 0,
		winrate: 0,
		drawrate: 0,
		looserate: 0
  };
	const content = new Content(stats);
	const file = new File();

	const init = function(){
		file.openFile();
		file.updateContent(content.createString());
		const rl = readline.createInterface({
			input: process.stdin,
      output: process.stdout,
    });
    rl.question('Size of your deck? (1 deck, 2 deck etc.)\r\n', function(answer) {
			createDeck(answer);
			startGame();
			rl.close();
    });
	};

	const createDeck = function(n) {
		deck.joinDecks(n);
		deck.mixDeck();
		cardRemains = deck.mixedDeck.length;
	};

	const startGame = function() {
		while (cardRemains > 3) {
			if (shouldPlay) {
				playRound();
				checkWinner();
				showResult(roundResult);
				content.updateStats(stats);
				file.updateContent(content.createString());
			}
		}
		showStats();
	};

	const playRound = function() {
		shouldPlay = false;
		dealer.hand = [];
		dealer.showHand = [];
		player.hand = [];
		dealer.sum = 0;
		player.sum = 0;
		dealerTake = true;
		playerTake = true;
		shouldTakeCards = true;
		showMessage(`Round ${round}`);
		startRound();
    while (shouldTakeCards) { takeCards(); }
		round++;
		stats.rounds++;
		shouldPlay = !shouldPlay;
	};

  const startRound = function() {
		dealer.addCardToHand(deck.dealCard());
		player.addCardToHand(deck.dealCard());
		dealer.addCardToHand(deck.dealCard());
		player.addCardToHand(deck.dealCard());
		cardRemains -= 4;
		showHand('dealer');
		showHand('player');
	};

  const dealerTakeCard = function() {
    if (dealer.sum <= 17) {
			dealer.addCardToHand(deck.dealCard());
			showMessage('Dealer take card.');
			cardRemains--;
		} else { 
			showMessage('Dealer do not take card.');
			dealerTake = !dealerTake;
		}
	};
	
  const playerTakeCard = function() {
		if ((playerTake) && (player.sum < 21)) {
			if (readlineSync.keyInYN('Do you want one more card?')) {
				player.addCardToHand(deck.dealCard());
				cardRemains--;
				showHand('dealer');
				showHand('player');
			} else { 
				playerTake = !playerTake;
			}
    } else { playerTake = false; }
	};

  const takeCards = function () {
		if ((dealerTake || playerTake) && (cardRemains > 1)) {
			dealerTakeCard();
			playerTakeCard();
		} else {
			shouldTakeCards = !shouldTakeCards;
			showHand('dealer');
			showHand('player');
		}
  };

  const showHand = function(playerRole) {
		let string = '';
		let suit;
    switch (playerRole) {
			case 'dealer':
				suit = colorSuit(dealer.showHand[0].suit);
				string = `Dealer's hand:\r\n	[${dealer.showHand[0].rank} ${suit}]`;
				for (let i = 1; i < dealer.showHand.length; i++) {
          			string += '\r\n Card';
				}
				showMessage(string);
				break;
			case 'player':
        string = 'Player\'s hand:\r\n';
				for (let i = 0; i < player.hand.length; i++) {
					suit = colorSuit(player.hand[i].suit);
          string += `	[${player.hand[i].rank} ${suit}] (${player.hand[i].value}) \r\n`;
				}
				showMessage(string);
				break;
		}	
	};

  const showResultHand = function() {
		let string = '';
    string = 'Dealer\'s hand:\r\n';
				for (let i = 0; i < dealer.hand.length; i++) {
      string += `	[${dealer.hand[i].value} ${dealer.hand[i].suit}] \r\n`;
				}
				showMessage(string);
	};

  const checkWinner = function() {
		if (dealer.sum === player.sum) {
			if (player.sum <= 21) {
				stats.draws++;
        roundResult = 'd';
        return roundResult;
			}
		}
		if (player.sum === 21) {
			stats.blackjacks++;
			stats.wins++;
      roundResult = 'w';
      return roundResult;
		}
		if ((player.sum < 21)) {
			if ((player.sum > dealer.sum) && (dealer.sum <= 21)) {
				stats.wins++;
        roundResult = 'w';
        return roundResult;
			}
			if (dealer.sum > 21) {
				stats.wins++;
        roundResult = 'w';
        return roundResult;
			}
		}
		if (player.sum > 21) {
			stats.excesses++;
			stats.looses++;
	  } else { stats.looses++ }
    roundResult = 'l';
    return roundResult;
	};

	const showResult = function(result) {
		showMessage('The result hands are: \r\n');
		showResultHand();
		showHand('player');
		switch (result) {
			case 'd':
				showMessage('DRAW \r\n');
				break;
			case 'w':
				showMessage('CONGRATUATIONS!You are WINNER \r\n');
				break;
			case 'l':
				showMessage('Sorry, you loose this round \r\n');
				break;
		}
	};

  const showStats = function () {
		if (readlineSync.keyInYN('Do you want to see your statistics?')) {
			file.readFile(channel);
		} else { 
			showMessage('You can find stats in gameResult.txt');
		}
	};

	const showMessage = function (msg) {
		setTimeout(function(){ channel.send(msg); }, 500);
	};
	
	const colorSuit = function(suit) {
		switch(suit) {
			case '\u2665':
			case '\u2666':
				return chalk.red(suit);
			default:
			return suit;
		}
	}
	return {
		init: init
  };
};

module.exports = Game;
