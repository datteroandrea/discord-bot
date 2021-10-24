const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES]
});

const settings = {
    prefix: '!',
    token: process.env.token
};

const { Player, RepeatMode } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false, // This options are optional.
});
// You can define the Player as *client.player* to easly access it.
client.player = player;

client.on("ready", () => {
    console.log("I am ready to Play!");
});

var loop = RepeatMode.DISABLED; // RepeatMode.SONG to repeat the current song, 

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(command === 'play') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        message.reply("🎵**Now playing**: "+args.join(' '));
        let song = await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'playlist') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'skip') {
        guildQueue.skip();
    }

    if(command === 'stop') {
        guildQueue.stop();
    }

    if(command === 'loop') {
        var msg = "";
        if(loop == RepeatMode.DISABLED) {
            loop = RepeatMode.SONG;
            msg = "🎵 **Toggled Loop**";
        } else {
            loop = RepeatMode.DISABLED;
            msg = "🎵 **Disabled Loop**";
        }
        guildQueue.setRepeatMode(loop); // or 1 instead of RepeatMode.SONG
        message.reply(msg);
    }

    if(command === 'loopQueue') {
        var msg = "";
        if(loop == RepeatMode.DISABLED) {
            loop = RepeatMode.QUEUE;
            msg = "🎵 **Toggled Queue Loop**";
        } else {
            loop = RepeatMode.DISABLED;
            msg = "🎵 **Disabled Queue Loop**";
        }
        guildQueue.setRepeatMode(loop); // or 1 instead of RepeatMode.SONG
        message.reply(msg);
    }

    if(command === 'setVolume') {
        guildQueue.setVolume(parseInt(args[0]));
    }

    if(command === 'seek') {
        guildQueue.seek(parseInt(args[0]) * 1000);
    }

    if(command === 'clearQueue') {
        guildQueue.clearQueue();
    }

    if(command === 'shuffle') {
        guildQueue.shuffle();
    }

    if(command === 'getQueue') {
        console.log(guildQueue);
    }

    if(command === 'getVolume') {
        console.log(guildQueue.volume)
    }

    if(command === 'nowPlaying') {
        console.log(`Now playing: ${guildQueue.nowPlaying}`);
    }

    if(command === 'pause') {
        guildQueue.setPaused(true);
    }

    if(command === 'resume') {
        guildQueue.setPaused(false);
    }

    if(command === 'remove') {
        guildQueue.remove(parseInt(args[0]));
    }

    if(command === 'createProgressBar') {
        const ProgressBar = guildQueue.createProgressBar();
        
        // [======>              ][00:35/2:20]
        console.log(ProgressBar.prettier);
    }
});

client.login(settings.token);