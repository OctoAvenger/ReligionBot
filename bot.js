//Defines bot/prefix and languages used.
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const prefix = ".";
const embedColour = "#F1DA75";

//Messages and commands that MormonBot can proform.
bot.on("message", (message) => {
    //Help message. Useful for new users.
    if (message.content == prefix + "help") {
            let embed = new Discord.RichEmbed();
            embed.setColor("#F1DA75");
            embed.setTitle("My commands are as follows:\n\n");
            embed.setDescription("**General commands:**\n" + prefix + "help *Displays this message.*\n\n**ALL COMMANDS AS OF VERSION 0.0.1**");
            message.channel.send({ embed });
    }
        if (message.content == prefix + "religions") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Abrahamic:", value: "Christian\nMuslim\nJewish\nBahá'í", inline: true},
            { name: "Eastern:", value: "Hindu\nBuddhist\nTaoist\nConfucian\nSikhi", inline: true},
            { name: "Other:", value: "Unitarian Universalist\nIrreligious\nPagan\nDeist\nGnostic\nPanentheist\nOther\n\n**For denomination roles do .[religion] e.g. .christian to see Christian denominations.**\n\nThe current religions with availiable denominations are: **Christian, Muslim, Irreligious, Hindu, Buddhist and Jewish**\n\nContact a moderator if there is a role you think should be added.", inline: true}
            ]
          }
        });
    }
    if (message.content == prefix + "christian") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Cathodox:", value: "Catholic\nOrthodox\nAnglican", inline: true},
            { name: "Protestant:", value: "Baptist\nLutheran\nMethodist\nReformed", inline: true},
            { name: "Restorationist:", value: "LDS (Mormon)\nJehovah's Witness", inline: true},
            { name: "Other:", value: "Messianic Jew\nCongregational\n\nContact a moderator if there is a role you think should be added.", inline: true},
            ]
          }
        });
    }
    if (message.content == prefix + "muslim") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Muslim:", value: "Sunni\nShia\nKharijite\nSufi\n\nContact a moderator if there is a role you think should be added.", inline: true},
        ]
      }
    });
}
    if (message.content == prefix + "irreligious") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Irreligious:", value: "Atheist\nAgnostic\nIgnostic\n\nContact a moderator if there is a role you think should be added.", inline: true}
        ]
      }
    });
}
    if (message.content == prefix + "hindu") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Hindu:", value: "Vaishnavi\nShaivi\n\nContact a moderator if there is a role you think should be added.", inline: true}
        ]
    }
    });
}
    if (message.content == prefix + "buddhist") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Buddhist:", value: "Theravada\nMahayana\nVajrayana\n\nContact a moderator if there is a role you think should be added.", inline: true}
        ]
    }
    });
}
    if (message.content == prefix + "jewish") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            fields: [
            { name: "Jewish:", value: "Orthodox\nConservitive\nReformed\nReconstructionist\n\nContact a moderator if there is a role you think should be added.", inline: true}
        ]
    }
    });
}
    
    /*if (new Date().getHours() == '5' && new Date().getMinutes() == '00') {
        console.log("It worked");
                bot.channels.find("id", "390360891528445961").send(`<@&390363444857012226> today we are reading something-something`);
                bot.channels.find("id", "391052829831462913").send(`<@&391051443672711168> today we are reading something-something`);
                bot.channels.find("id", "390359294115053581").send(`<@&390363313869029387> today we are reading something-something`);
    }*/
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', 'member-log');
    if (!channel) return;
    channel.send(`Welcome ${member} to **Religious Online Discussions**! We are a server dedicated to Interfaith cooperation to study religion and other philosophies to bring us closer to any Power we believe in whether that be one God, many gods, no god, etc.\nTo get yourself started please do ".religions" to check out the roles we have and do ".iam [role]" to add the role to yourself.\nContact a staff member if you need assistence and enjoy your time here.`);
  });

console.log("Bot on.")
//Bot login Token.
bot.login("[TOKEN]");
