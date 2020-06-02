var fs = require('fs');

class File {
  constructor(content) {
    this.content = content;
	}
	openFile() {
		
		fs.open('gameResult.txt', 'w', function (err, file) {
			if (err) throw err;
		});
	}

	updateContent(content) {
		this.content = content;
		this.updateFile();
	}
	
	updateFile() {
		const content = this.content;
		fs.writeFile('gameResult.txt', content, function (err) {
			if (err) throw err;
		});
	}
	
	readFile(channel) {
		fs.readFile('gameResult.txt', function (err, content) {
			if (err) throw err;
			channel.send("Results:\n" +content.toString());
		});
		 
	}
}
  
module.exports = File;