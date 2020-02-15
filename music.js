const ytdl = require('ytdl-core');
var finder = require('discord-youtube-api');
finder = new finder('YOUR-TOKEN');
var isPlaying=false;
var dispatcher;
var connection;

async function getVideo(title){
    let video = await finder.searchVideos(""+title);
    return video;
}

async function play(song,connection){
    dispatcher = await connection.playStream(ytdl(song, {filter: 'audioonly'}));
    dispatcher.on('end', function () {isPlaying=false;});
}

async function stop(){
    connection.disconnect();
}

async function startPlayer(message, title){
    if(!isPlaying) {
        stop();
    }
    connection = await message.member.voiceChannel.join();
    let video = await getVideo(title);
    play(video.url,connection);
}



module.exports.startPlayer = startPlayer;
module.exports.stop = stop;
