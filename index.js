const {Client,Attachment} = require('discord.js')
const bot = new Client();
const ytdl = require("ytdl-core");
 
const Game = require('./blackjack/game');
 
const token = 'NzE3MDk4ODkwMjg4OTU1NTM1.XtVYdA.dXAedQbyo6PhDTkaipshBrIyy38';

const PREFIX = "\\";

var servers = {};
var version = "1.0.0";

bot.on("ready", () =>{
	console.log("O BOTE ESTÁ ONLAINE, na bersão " + version);
})

bot.on('message',message => {
		if(message.content.charAt(0) != PREFIX)return;
		let args = message.content.substring(PREFIX.length).split(" ");
		var messageOwner = message.member.user.tag;
		messageOwner = messageOwner.substring(0,messageOwner.indexOf("#"));

		switch(args[0]){
			case 'p':
			case 'play':

				function play(connection,message){
					var server = servers[message.guild.id];
					
					server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

					server.queue.shift();

					server.dispatcher.on("end",function(){
						if(server.queue[0]){
							play(connection,message);
						}else{
							connection.disconnect();
						}
					});
				}
				if(!args[1]){
					message.channel.send(messageOwner+", TENS DE PASSAR O CÓDIGO PALHAÇO!...");
					return;
				}
				if(!message.member.voice.channel){
					message.channel.send(messageOwner +" SEU PARBALHÃO, TENS DE ESTAR NUMA SALA DE FALARI!...");
					return;
				}
				if(!servers[message.guild.id]) servers[message.guild.id] = {
					queue: []
				}

				var server = servers[message.guild.id];

				server.queue.push(args[1]);

				if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
					play(connection,message);
				})
			break;
			case 's':
			case 'skip':
				var server = servers[message.guild.id];
				if(server.dispatcher) server.dispatcher.end();
					message.channel.send(messageOwner +" - A ULTRAPASSARE A CANTIGA ANTERIORI...");
			break;
			case 'stop':
				var server = servers[message.guild.id];
				if(message.guild.voiceConnection){
					message.channel.send(messageOwner + ", TENS DE PASSAR O CÓDIGO PALHAÇO!...");
					for(var i = server.queue.length -1; i >=0; i--){
						server.queue.splice(i,1);
					}
					server.dispatcher.end();
					message.channel.send("BOU BAZAR...FICÁÁÁÁÁÁSTE!...")
				}
				if(message.guild.connection) message.guild.voiceConnection.disconnect();
			break;
			case 'r':
			case 'roll':
				if(!args[1]){
					message.channel.send(messageOwner + ", METE UM NUMARO!...");
					return;
				}
				var value= parseInt(args[1])
				value = Math.floor(value);
				
				var roll = Math.round(Math.random() * (value - 1) + 1);
				message.channel.send(messageOwner + ": ---> " + roll + " <----");
				if(roll == 1){
					setTimeout(function(){ message.channel.send("PARDESTE "+ messageOwner +" !!!!! LUL."); }, 500);
				}
			
				if(message.guild.connection) message.guild.voiceConnection.disconnect();
			break;
			case 'bj':
			case 'blackj':
				message.channel.send(messageOwner + " vai jogari backjack...");
				const game = new Game(message.channel);
				game.init();
			break;
		}
	
});

 
bot.login(token);
