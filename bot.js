const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();
var music = require('./music.js');

client.on('message', function (message) {
    var command = message.content;
    if (command.charAt(0) == '/') {
        command = command.split(" ");
        if (command[0].includes('help')) {
            message.channel.send(
                "Commands:\n\n" +
                "send link to file #to send a file\n\n" +
                "play #to play the songs in the queue\n\n" +
                "stop #to stop playing a song\n\n"
            );

        } else if (command[0].includes("send")) {
            tags=[];
            for(var i=1; i< command.length; i++)
                tags.push(command[i]);
            meme.sendMeme(tags,message);
        }else if (command[0].includes('play')) {
            var title = "";
            for (var i = 1; i < command.length; i++) {
                title += command[i];
                if (i < command.length - 1)
                    title += " ";
            }
            music.startPlayer(message.client, message,title);
        }else if (command[0].includes('stop')) {
            music.stop();
        }
    }

});

client.login(auth.token);
