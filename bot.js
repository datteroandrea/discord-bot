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
    leaveOnEmpty: true, // This options are optional.
    leaveOnEnd: false,
    deafenOnJoin: true
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
        message.reply("🎵 **Added to the queue**: "+args.join(' '));
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
        if(loop != RepeatMode.SONG) {
            loop = RepeatMode.SONG;
            msg = "🎵 **Toggled Loop**";
        } else {
            loop = RepeatMode.DISABLED;
            msg = "🎵 **Disabled Loop**";
        }
        guildQueue.setRepeatMode(loop); // or 1 instead of RepeatMode.SONG
        message.reply(msg);
    }

    if(command === 'loopq') {
        var msg = "";
        if(loop != RepeatMode.QUEUE) {
            loop = RepeatMode.QUEUE;
            msg = "🎵 **Toggled Queue Loop**";
        } else {
            loop = RepeatMode.DISABLED;
            msg = "🎵 **Disabled Queue Loop**";
        }
        guildQueue.setRepeatMode(loop); // or 1 instead of RepeatMode.SONG
        message.reply(msg);
    }

    if(command === 'clear') {
        guildQueue.clearQueue();
    }

    if(command === 'shuffle') {
        guildQueue.shuffle();
    }

    if(command === 'queue') {
        message.channel.send('🎵 **Now Playing**: '+guildQueue);
    }

    if(command === 'song') {
        message.channel.send('🎵 **Now Playing**: '+guildQueue.nowPlaying);
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

    if(command === 'join') {
        let queue = client.player.createQueue(message.guild.id);
        if(message.member.voice.channel != null)
            await queue.join(message.member.voice.channel);
    }

    if(command === 'help') {
        message.reply(
            `+clear\t\tclears the queue\n+help\t\tshows the commands\n+join\t\tjoins the channel of the user\n+loop\t\tloops the current song\n+loopq\t\tloops the queue\n+pause\t\tpauses the song\n+play <song>\t\tplays the song with the given name\n+playlist <playlist>\t\tplays the playlist with the given name (not working)\n+queue\t\tshows the queue\n+remove <index>\t\tremoves a song from the queue\n+resume\t\tresumes the song\n+skip\t\tskips to the next song\n+shuffle\t\tshuffles the queue\n+song\t\tprints the name of the song playing now\n+stop\t\tstops singing\n`
        );
    }
});

client.login(settings.token);

/*



*/