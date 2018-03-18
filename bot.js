//Defines bot/prefix and languages used.
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const prefix = ">";

bot.on("message", (message) => {
    //Help message. Useful for new users.
    if (message.content == prefix + "help") {
        let embed = new Discord.RichEmbed();
        embed.setColor("#f8ffb2");
        embed.setTitle("My commands are as follows:\n\n");
        embed.setDescription("**General commands:**\n" + prefix + "help *Displays this message.*\n\n**ALL COMMANDS AS OF VERSION 0.0.5**");
        message.channel.send({ embed });
    }
    var timeUntil22_54 = ~~(new Date().getTime() / (24*60*60*1000) + 
(new Date().getTime() % (24*60*60*1000) > + 59700000) /* dis boi over here adds 24 hours if the time already passed*/
 + 59700000);
    setTimeout(function(){
    function doThis(){
        if (d.getHours() == 22 && d.getMinutes() == 54) {
            console.log(d);
            client.channels.find("id", "390360891528445961").send(`<@&390363444857012226> today we are reading something-something`);
            client.channels.find("id", "391052829831462913").send(`<@&391051443672711168> today we are reading something-something`);
            client.channels.find("id", "390359294115053581").send(`<@&390363313869029387> today we are reading something-something`);
        }
    }
    doThis();
    setInterval(doThis, 60*1000);
}, timeUntil22_54);
});

//Bot login Token.
bot.login("TOKEN");
