//Defines bot/prefix and languages used.
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const schedule = require('node-schedule-tz');
const bot = new Discord.Client();
const prefix = ".";

bot.on('ready', () => {
    bot.user.setStatus('available');
    bot.user.setPresence({
        game: {
            name: `commands. Try ".help"`,
            type: 2
        }
    });
});

let reference;
let scripture;
let color;
let icon;
let name;
let channels;

function dailyPassage() {
    const rod = bot.guilds.get('359925003359354890'); // Religious Online Discussions
    const suggestions = rod.channels.get('608341500941697025'); // #daily-passage-suggestions
    const daily = rod.channels.get("490195307863212050"); // #daily-passage   
    const chooser = bot.users.get("221285118608801802");

    chooser.send("Please provide the message ID of the Daily Passage Suggestion you have selected!");
    chooser.createDM().then(c => {
        const filter = m => m.author.id != bot.user.id;
        const collector = c.createMessageCollector(filter, {
            time: 30000
        });
        collector.on('collect', m => {
            if (isNaN(m.content)) m.channel.send("That doesn't look like a number, therefore, it won't work.");
            else {
                suggestions.messages.fetch(m.content).then(mes => {
                    if (mes.embeds.length > 0) {
                        switch (mes.author.id) {
                            case "413753566461820928": // HinduBot
                                reference = mes.embeds[0].author.name;
                                scripture = mes.embeds[0].fields[0].value;
                                color = mes.embeds[0].color;
                                icon = "https://cdn.discordapp.com/avatars/413753566461820928/bb6ccc95627f0fb87a7d8b574d8e61a2.png?size=512";
                                name = "The Vedas:";
                                channels = "<#455111126007414795> or <#455111030314369024>"
                                collector.stop();
                                break;
                            case "361033318273384449": // BibleBot
                                reference = mes.embeds[0].author.name;
                                scripture = mes.embeds[0].description;
                                color = mes.embeds[0].color;
                                icon = "https://is3-ssl.mzstatic.com/image/thumb/Purple128/v4/18/e0/c7/18e0c7e2-be8b-4d14-149c-c195d8409e32/source/512x512bb.jpg";
                                name = "New Testament (KJV):";
                                channels = "<#455111068499312653>, <#455111343415230474>, <#455111412965179402> or <#455111030314369024>";
                                collector.stop();
                                break;
                            case "639271772818112564": // LDS-Bot
                                reference = mes.embeds[0].title;
                                scripture = mes.embeds[0].description;
                                color = 0xcf9b17;
                                icon = bot.user.avatarURL();
                                name = "Book of Mormon:";
                                channels = "<#455111343415230474> or <#455111030314369024>"
                                collector.stop();
                                break;
                            case "352815253828141056": // IslamBot
                                reference = mes.embeds[0].author.name + mes.embeds[0].fields[0].name;
                                scripture = mes.embeds[0].fields[0].value;
                                color = mes.embeds[0].color;
                                icon = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU4wAqX_pIY_MmjU_3O_zIKQ_Moz0z1O4-NGWY7fvr0sovnNgF";
                                name = "Holy Qur'an:";
                                channels = "<#455141658410090498>, <#455111412965179402> or <#455111030314369024>"
                                collector.stop();
                                break;
                        }
                    }
                });
            }
        });
        collector.on('end', () => {
            daily.send({
                embed: {
                    author: {
                        name: name,
                        icon_url: icon
                    },
                    color: color,
                    fields: [{
                        name: reference,
                        value: scripture,
                        inline: true
                    }, ]
                }
            });
            daily.send(`<@&608701696629145601> feel free to discuss today's passage in ${channels} 😄\nIf you don't wish to receive a ping for Daily Passages, simply type, \`.iamn Daily Passage\` in #bots.`);
        });
    });
}

//Message Commands ReligionBot can proform.
bot.on("message", (message) => {

    command = message.content.split(" ")[0].substr(1);
    //Help message. Useful for new users.
    if (command === "help") {
        message.channel.send({embed: {
            author: {
                name: `My commands are as follows:`,
                icon_url: bot.user.avatarURL
              },
            color: 0xF1DA75,
            fields: [
            { name: `General Commands:`, value: ".religions - displays all availible religious roles\n.denominations - displays all availible religious denomination roles.\n.iam - `.iam [role]`\n.iamn - `.iamn [role]`\n.suggest - `.suggest [suggestion]`\n.wiki - `.wiki [search]`", inline: true},
            { name: `Moderation Commads:`, value: ".ar - `.ar @[user] [role]`\n.rr - `.rr @[user] [role]`\n.delete - `.delete [number]`\n.mute - `.mute @[user] [reason]`\n.unmute - `.unmute @[user] [reason]`\n.inspect - `.inspect @[user] [reason]`\n.forgive - `.forgive @[user] [reason]`\n.kick - `.kick @[user] [reason]`\n.ban - `.ban @[user] [reason]`", inline: true},
            ]
          }
        });
    }
    if (command === "religions") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            color: 0xF1DA75,
            fields: [
            { name: "Abrahamic:", value: "Christian\nMuslim\nJew\nBahá'í", inline: true},
            { name: "Eastern:", value: "Hindu\nBuddhist\nDaoist\nConfucian\nSikhi", inline: true},
            { name: "Other:", value: "Unitarian Universalist\nIrreligious\nPagan\nGnostic\nPanentheist\nOther\n\n**To see available denomination roles do \`.denominations\`**", inline: true}
            ]
          }
        });
    }
    if (command === "denominations") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            color: 0xF1DA75,
            fields: [
            { name: "Christian (1):", value: "Catholic\nOrthodox\nAnglican\nBaptist\nLutheran\nMethodist", inline: true},
            { name: "Christian (2):", value: "Reformed\nLatter-Day Saint\nJehovah's Witness\nMessianic Jew\nCongregational", inline: true},
            { name: "Muslim:", value: "Sunni\nShia\nSufi\nAhmadiyya\nQuranist", inline: true},
            { name: "Irreligious:", value: "Atheist\nAgnostic\nIgnostic", inline: true},
            { name: "Hindu:", value: "Vaishnavi\nShaivi\nShakti", inline: true},
            { name: "Buddhist:", value: "Theravada\nMahayana\nVajrayana", inline: true},
            { name: "Jew:", value: "Orthodox Jew\nConservative Jew\nReformed Jew\nReconstructionist Jew\n\nContact a moderator if there is a role you think should be added.", inline: true}
            ]
          }
        });
    }
    if (command === 'iam') {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = findRole(message);
        if(role){
            message.member.addRole(role).then(() => {
                message.reply(`Successfully added \`${message.content.slice(5, message.content.length)}\``);
                if(logs){
                    logs.send({embed: {
                            title: "User added role:\n\n",
                            color: 0x66ba67,
                            fields: [
                                { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                                { name: "Role:", value: role.name, inline: true},
                            ]
                        }
                    });
                }
            }).catch(err => {
                if (!message.content.startsWith(prefix + "iamn")) {
                    message.reply(`I was unable to add \`${message.content.slice(5, message.content.length)}\` role. Please make sure that role exists and that you have permission to add it.`);
                }
            });
        } else {
            message.reply(`Could not update role, unable to find: \`${message.content.slice(5, message.content.length)}\``);
            return
        }
    }
    if (command === "done" && message.channel.name === "unverified" && message.member.roles.size > 2) {
        const general = message.member.guild.channels.find('name', 'general');
        const unverified = message.guild.roles.find("name", "Unverified");
        message.member.removeRole(unverified).then(() => {
            general.send(`Welcome, ${message.member.user}!\nIf you'd like to add roles type \`.religions\` or \`.denominations\` in <#455112761769459723>.`);
        });
    }
    if (command === 'iamn') {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = findRole(message);
        if(role) {
            message.member.removeRole(role).then(() => {
                message.reply(`Successfully removed \`${message.content.slice(5, message.content.length)}\``);
                if(logs){
                    logs.send({embed: {
                            title: "User removed role:\n\n",
                            color: 0xaa3333,
                            fields: [
                                { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                                { name: "Role:", value: role.name, inline: true},
                            ]
                        }
                    });
                }
            }).catch(err => {
                if (!message.content.startsWith(prefix + "iamnot")) {
                    message.reply(`I was unable to remove \`${message.content.slice(6, message.content.length)}\` role. Please make sure that role exists and that you have permission to remove it.`);
                }
            });
        } else {
            message.reply(`Could not update role, unable to find: \`${message.content.slice(6, message.content.length)}\``);
            return
        }
    }
    if (command === "iamnot") {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = findRole(message);
        message.member.removeRole(role).then(() => {
            message.reply(`Successfully removed \`${message.content.slice(7, message.content.length)}\``);
            if(logs){
                logs.send({embed: {
                        title: "User removed role:\n\n",
                        color: 0xaa3333,
                        fields: [
                            { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                            { name: "Role:", value: role.name, inline: true},
                        ]
                    }
                });
            }
        }).catch(err => {
            message.reply(`I was unable to remove \`${message.content.slice(8, message.content.length)}\` role. Please make sure that role exists and that you have permission to remove it.`);
        });
    }
    if (command === "suggest") {
        message.delete(1000);
        let embed = {embed: {
            author: {
                name: `${message.member.user.username} | ${message.member.user.username}#${message.member.user.discriminator}`,
                icon_url: message.member.user.avatarURL
              },
            color: 0xF1DA75,
            fields: [
            { name: `Suggestion:`, value: message.content.slice(9, message.content.length), inline: true}
            ]
          }
        };
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("👍");
            const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === '421725581952942081';
            message.awaitReactions(filter, { time: 35000 })
            .then(sentEmbed.react("👎"))
        });
    }
    if (command === "wiki") {
        const query = message.content.slice(6, message.content.length).replace(/ /g, "_");
        message.channel.send(`https://en.wikipedia.org/wiki/${query}`);
    }
    //Moderation commands
    if (command === "dp"){
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
            dailyPassage();
    }
    if (command === "delete") {
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
            const logs = message.member.guild.channels.find('name', 'delete-log');
            message.delete(100).then(() => {
            message.channel.bulkDelete(message.content.slice(8, message.content.length)).then(() => {
            message.reply(`Successfully deleted \`${message.content.slice(8, message.content.length)}\` messages`).then(msg => msg.delete(3000));
            if(logs){
                logs.send({embed: {
                        title: "Deleted Messages:\n\n",
                        color: 0x5a5a5a,
                        fields: [
                            { name: "Deleted By:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.user.id}`, inline: true},
                            { name: "Messages Deleted:", value: `${message.content.slice(8, message.content.length)}`, inline: true}
                        ]
                    }
                });
            }
            })}).catch(err => {
            message.reply(`I was unable to delete \`${message.content.slice(8, message.content.length)}\` messages. \`${err}\``);
        });
      }
    if (command === "ar") {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = findRole(message);
                const member = message.guild.member(user);
                if (member) {
                    member.addRole(role).then(() => {
                    message.reply(`Successfully added \`${message.content.slice(8 + user.id.length, message.content.length)}\` to ${member.user.username}.`);
                    if(logs){
                        logs.send({embed: {
                                title: "User was given role:\n\n",
                                color: 0x66ba67,
                                fields: [
                                    { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                                    { name: "Role:", value: role.name, inline: true},
                                ]
                            }});
                    }
            }).catch(err => {
                message.reply(`I was unable to add \`${message.content.slice(8 + user.id.length, message.content.length)}\` to ${member.user.username}. Please make sure that role exists and that you have permission to add it.`);
            });
            }
            else {
                message.reply('That user doesn\'t exist!');
            }
              } else {
                message.reply('That\'s nice but who do you want to add the role to?');
            }
    }
    if (command === "rr") {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = findRole(message);
                const member = message.guild.member(user);
                if (member) {
                    member.removeRole(role).then(() => {
                    message.reply(`Successfully removed \`${message.content.slice(8 + user.id.length, message.content.length)}\` from ${member.user.username}.`);
                    if(logs){
                        logs.send({embed: {
                                title: "User had role removed:\n\n",
                                color: 0xaa3333,
                                fields: [
                                    { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                                    { name: "Role:", value: role.name, inline: true},
                                ]
                            }});
                    }
            }).catch(err => {
                message.reply(`I was unable to remove \`${message.content.slice(8 + user.id.length, message.content.length)}\` from ${member.user.username}. Please make sure that role exists and that you have permission to remove it.`);
            });
            }
            else {
                message.reply('That user doesn\'t exist!');
            }
              } else {
                message.reply('That\'s nice but who do you want to take the role from?');
            }
    }
    if (command === "unmute") {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                let muted = message.guild.roles.find("name", "Muted");
                member.removeRole(muted).then(() => {
                message.reply(`Successfully unmuted ${user}`);
                if (message.content.slice(11 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(11 + user.id.length, message.content.length);
                }
                if(logs){
                    logs.send({embed: {
                            title: "User unmuted:\n\n",
                            color: 0x5a5a5a,
                            fields: [
                                { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                                { name: "Reason:", value: reason, inline: true},
                            ]
                        }
                    });
                }
                }).catch(err => {
                message.reply('I was unable to unmute the member. `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to unmute?');
    }
    }
    if (command === "mute") {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                let muted = message.guild.roles.find("name", "Muted");
                member.addRole(muted).then(() => {
                message.reply(`Successfully muted ${user}`);
                if (message.content.slice(10 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(10 + user.id.length, message.content.length);
                }
                if(logs){
                    logs.send({embed: {
                            title: "User muted:\n\n",
                            color: 0x5a5a5a,
                            fields: [
                                { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                                { name: "Reason:", value: reason, inline: true},
                            ]
                        }
                    });
                }
                }).catch(err => {
                message.reply('I was unable to mute the member. `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to mute?');
    }
    }
    if (command === "inspect") {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            let timeout = message.guild.channels.find("name", "timeout");
            if (member) {
                let inspect = message.guild.roles.find("name", "Timeout");
                member.addRole(inspect).then(() => {
                message.reply(`Successfully put ${user} into timeout`);
                timeout.send(`${user} you have been placed in Timeout for \`${message.content.slice(13 + user.id.length, message.content.length)}\` you are going to have to speak with a moderator about your behavior before you will be able to chat anywhere else.`);
                if (message.content.slice(13 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(13 + user.id.length, message.content.length);
                }
                if(logs){
                    logs.send({embed: {
                            title: "User put in timeout:\n\n",
                            color: 0xe5e5e5,
                            fields: [
                                { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                                { name: "Reason:", value: reason, inline: true},
                            ]
                        }
                    });
                }
                }).catch(err => {
                message.reply('I was unable to put the member in timeout `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to timeout?');
    }
    }
});

bot.on('ready', () => {
    let j = schedule.scheduleJob({hour: 16, minute: 0}, function() {
        dailyPassage();
    });
});

bot.on('guildMemberAdd', member => {
    const unverified = member.guild.channels.find('name', 'unverified');
    const logs = member.guild.channels.find('name', 'join-log');

    if (!unverified) return;
    unverified.send(`Welcome ${member} to **Religious Online Discussions**! We are a server dedicated to Interfaith cooperation to study religion and other philosophies to bring us closer to any Power we believe in whether that be one God, many gods, no god, etc.\nTo get yourself started please type \`.religions\` to check out the roles we have and do \`.iam [role]\` to add a role to yourself. Once you have at least one role use \`.done\`.\nContact a staff member if you need assistance and enjoy your time here.`);
    member.addRole(member.guild.roles.find("name", "Unverified"));
    member.addRole(member.guild.roles.find("name", "Daily Passage"));
    if(logs){
        logs.send({embed: {
                title: "User joined:\n\n",
                color: 0x66ba67,
                fields: [
                    { name: "Username:", value: `${member.user.username}#${member.user.discriminator}`, inline: true},
                    { name: "Joined server:", value: `${member.joinedAt}`, inline: true},
                    { name: "Joined Discord:", value: `${member.user.createdAt}\n\nUser ID: ${member.id}`, inline: true}
                ]
            }
        });
    }
  });
bot.on('guildMemberRemove', member => {
    const logs = member.guild.channels.find('name', 'join-log');
    if(logs){
        logs.send({embed: {
                title: "User left:\n\n",
                color: 0xaa3333,
                fields: [
                    { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                    { name: "Left server:", value: `${member.removedAt}`, inline: true},
                ]
            }
        });
    }
});

function findRole(message) {
    let splitmessage = message.content.split(" ");
    splitmessage.shift();
    let rolename = splitmessage.join(" ");
    let found = null;

    message.guild.roles.forEach(role => {
        if (role.name) {
            if (role.name.toLowerCase() === rolename.toLowerCase()){
                found = role
            }
        }
    });
    return found
}

//Bot login Token.
bot.login(process.env.BOT_TOKEN);
