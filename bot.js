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
        const rod = bot.guilds.get('359925003359354890');
        const daily = rod.channels.find('name', 'daily-passage');
        var passageNum = Math.floor(Math.random() * 6);
        var bookNum = Math.floor(Math.random() * 7);
        book = [
            //Christian
            nt = {
                name: "New Testament (KJV):",
                icon: "https://is3-ssl.mzstatic.com/image/thumb/Purple128/v4/18/e0/c7/18e0c7e2-be8b-4d14-149c-c195d8409e32/source/512x512bb.jpg",
                colour: 0x9cb9f3,
                passage: {
                    passageName: ["John 3:16", "Matthew 6:9-13", "John 14:6", "Luke 11:9-10", "Ephesians 2:8"],
                    passageText: ["For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
                                  "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors.  And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.",
                                  "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
                                  "And I say unto you, Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you. For every one that asketh receiveth; and he that seeketh findeth; and to him that knocketh it shall be opened.",
                                  "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:"
                               ]
                    },
                channels: "<#455111068499312653>, <#455111343415230474>, <#455111412965179402> or <#455111030314369024>"
            },
            //Muslim
            quran = {
                name: "Holy Qur'an:",
                icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU4wAqX_pIY_MmjU_3O_zIKQ_Moz0z1O4-NGWY7fvr0sovnNgF",
                colour: 0x3f9447,
                passage: {
                    passageName: ["Qur'an 2:154", "Qur'an 3:31", "Quran 3:101", "Qur'an 55:60", "Qur'an 64:11"],
                    passageText: ["O you who believe, seek help through patience and prayer. Surely, Allah is with those who are patient.",
                                  "Say, [O Muhammad, to mankind]: If ye love Allah, follow me; Allah will love you and forgive you your sins. Allah is Forgiving, Merciful.",
                                  "And whoever holds firmly to Allah has [indeed] been guided to a straight path.",
                                  "Is there any reward for good other than good?",
                                  "No disaster strikes except by permission of Allah . And whoever believes in Allah – He will guide his heart. And Allah is Knowing of all things."
                               ]
                    },
                channels: "<#455141658410090498>, <#455111412965179402> or <#455111030314369024>"
            },
            //Secular
            secular = {
                name: "Secular Quotes:",
                icon: "https://cdn.discordapp.com/attachments/403781034568712195/491379729019174935/unknown.png",
                colour: 0xabffb4,
                passage : {
                    passageName: ["Janet Asimov said:", "A. C. Grayling said:", "Jay Laudig said:", "Dan Barker said:", "David Smalley said:"],
                    passageText: ["There is joy in the search for knowledge about the universe in all its manifestations.",
                                  "It doesn’t have to be the Grand Canyon, it could be a city street, it could be the face of another human being. Everything is full of wonder.",
                                  "Reason must be tirelessly promoted, not because it will change minds already made, but because there is a constant supply of unmade minds.",
                                  "There is joy in rationality [and] happiness. Freethought is thrilling and fulfilling--absolutely essential to mental health and happiness.",
                                  "Be someone's guardian angel now."
                                ]
                },
                channels: "<#455111095321886721> or <#455111030314369024>"
            },
            //Hindu
            vedas = {
                name: "The Vedas:",
                icon: "data:image/jpeg;base64,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",
                colour: 0xe78810,
                passage : {
                    passageName: ["Bhagavad Gita 4:11", "Bhagavad Gita 8:6", "Bhagavad Gita 8:15", "Bhagavad Gita 8:16", "Bhagavad Gita 18:58"],
                    passageText: ["Howsoever men try to worship Me, so do I welcome them. By whatever path they travel, it leads to Me at last.",
                                  "Whatever state of being one remembers when he quits his body, O son of Kunti, that state he will attain without fail.",
                                  "Coming thus unto Me, these great souls go no more to the misery and death of earthly life, for they have gained perfection.",
                                  "The worlds, with the whole realm of creation, come and go; but, O Arjuna, whoso comes to Me, for him there is nor rebirth.",
                                  "If you become conscious of Me, you will pass over all the obstacles of conditional life by My grace. If, however you do not work in such consciousness but act through false ego, not hearing Me, you will be lost."]
                },
                channels: ""
            },
            /*//Buddhist
            dhammapada = {
                name: "Dhammapada:",
                icon: "",
                colour: 0xe8ec3d,
                passage : {
                    passageName: [],
                    passageText: []
                },
                channels: ""
            },*/
            /*//Daoist
            dao_de_ching = {
                name: "Dao De Ching:",
                icon: "",
                colour: 0x33e0e2,
                passage : {
                    passageName: [],
                    passageText: []
                },
                channels: ""
            },*/
            //LDS
            bom = {
                name: "Book of Mormon:",
                icon: "",
                colour: 0xcf9b17,
                passage : {
                    passageName: [/*"1 Nephi 3:7",*/ "2 Nephi 2:25", /*"2 Nephi 2:27",*/ /*"2 Nephi 25:23, 26",*/ "2 Nephi 26:33", /*"2 Nephi 28:7–9", "2 Nephi 31:19-20", "2 Nephi 32:8–9", "Mosiah 2:17", "Mosiah 3:19", "Mosiah 4:30",*/ "Alma 32:21", /*"Alma 37:35", "Alma 39:9",*/ "Helaman 5:12", /*"3 Nephi 12:48", "3 Nephi 18:15, 20-21", "Ether 12:6", "Ether 12:27",*/ "Moroni 7:45-47"/*, "Moroni 45, 47-48", "Moroni 10:4-5*/"],
                    passageText: ["Wherefore, men are free according to the flesh; and all things are given them which are expedient unto man. And they are free to choose liberty and eternal life, through the great Mediator of all men, or to choose captivity and death, according to the captivity and power of the devil; for he seeketh that all men might be miserable like unto himself.",
                                  "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness; and he denieth none that come unto him, black and white, bond and free, male and female; and he remembereth the heathen; and all are alike unto God, both Jew and Gentile.",
                                  "And now as I said concerning faith—faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true.",
                                  "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, yea, his shafts in the whirlwind, yea, when all his hail and his mighty storm shall beat upon you, it shall have no power over you to drag you down to the gulf of misery and endless wo, because of the rock upon which ye are built, which is a sure foundation, a foundation whereon if men build they cannot fall.",
                                  /*"Therefore I would that ye should be perfect even as I, or your Father who is in heaven is perfect.",*/
                                  /*"And now, I, Moroni, would speak somewhat concerning these things; I would show unto the world that faith is things which are hoped for and not seen; wherefore, dispute not because ye see not, for ye receive no witness until after the trial of your faith.",*/
                                  /*"And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them.",*/
                                  /*"And what is it that ye shall hope for? Behold I say unto you that ye shall have hope through the atonement of Christ and the power of his resurrection, to be raised unto life eternal, and this because of your faith in him according to the promise.",*/
                                  "And charity suffereth long, and is kind, and envieth not, and is not puffed up, seeketh not her own, is not easily provoked, thinketh no evil, and rejoiceth not in iniquity but rejoiceth in the truth, beareth all things, believeth all things, hopeth all things, endureth all things. Wherefore, my beloved brethren, if ye have not charity, ye are nothing, for charity never faileth. Wherefore, cleave unto charity, which is the greatest of all, for all things must fail—But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him."]

                },
                channels: "<#455111343415230474> or <#455111030314369024>"
            },
            /*d_c = {
                name: "Doctrine and Covenants:",
                icon: "",
                colour: 0xcf9b17,
                passage : {
                    passageName: ["Doctrine and Covenants 1:37-38", "Doctrine and Covenants 6:36", "Doctrine and Covenants 8:2–3", "Doctrine and Covenants 13:1", "Doctrine and Covenants 18:10–11", "Doctrine and Covenants 18:15-16", "Doctrine and Covenants 19:16–19", "Doctrine and Covenants 21:4–6", "Doctrine and Covenants 29:10–11", "Doctrine and Covenants 42:11", "Doctrine and Covenants 49:15–17", "Doctrine and Covenants 58:42–43", "Doctrine and Covenants 64:9–11", "Doctrine and Covenants 6:22–24", "Doctrine and Covenants 82:10", "Doctrine and Covenants 84:20–22", "Doctrine and Covenants 88:118", "Doctrine and Covenants 89:18–21", "Doctrine and Covenants 107:8", "Doctrine and Covenants 121:36, 41–42", "Doctrine and Covenants 130:22–23", "Doctrine and Covenants 131:1–4", "Doctrine and Covenants 135:3"],
                    passageText: ["Search these commandments, for they are true and faithful, and the prophecies and promises which are in them shall all be fulfilled. What I the Lord have spoken, I have spoken, and I excuse not myself; and though the heavens and the earth pass away, my word shall not pass away, but shall all be fulfilled, whether by mine own voice or by the voice of my servants, it is the same.",
                                  "Look unto me in every thought; doubt not, fear not."]
                },
                channels: "<#455111343415230474> or <#455111030314369024>"
            },*/
            /*pgp = {
                name: "Pearl of Great Price:",
                icon: "",
                colour: 0xcf9b17,
                passage : {
                    passageName: ["Moses 1:39", "Moses 7:18"],
                    passageText: ["For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man.",
                                  "And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness;"]
                },
                channels: "<#455111343415230474> or <#455111030314369024>"
            },*/
            /*//Jewish
            bible = {
                name: "Hebrew Bible (Old Testament):",
                icon: "",
                colour: 0x1fbae4,
                passage : {
                    passageName: [],
                    passageText: []
                },
                channels: "<#455111365363892235>, <#455111068499312653>, <#455111343415230474>, <#455111412965179402> or <#455111030314369024>"
            },*/
            //Bahá'í
            bahai = {
                name: "Bahá'í Quotes:",
                icon: "https://cdn.discordapp.com/attachments/346962600212561920/450831669855780894/Thing.png",
                colour: 0xd67ccc,
                passage: {
                    passageName: ["Bahá’u’lláh said:", "Abdu’l-Bahá said:", "Abdu’l-Bahá said:", "Bahá’u’lláh said:", "Bahá’u’lláh said:"],
                    passageText: ["The Great Being saith: Regard man as a mine rich in gems of inestimable value. Education can, alone, cause it to reveal its treasures, and enable mankind to benefit therefrom.",
                                  "Love and fellowship are absolutely needful to win the good-pleasure of God which is the goal of all human attainment. We must be united. This underlying reality is the love of humanity. For God is one and humanity is one, and the only creed of the prophets is love and unity.",
                                  "While the children are yet in their infancy feed them from the breast of heavenly grace, foster them in the cradle of all excellence, rear them in the embrace of bounty. Give them the advantage of every useful kind of knowledge. Let them share in every new and rare and wondrous craft and art. Bring them up to work and strive, and accustom them to hardship.",
                                  "Beware lest thou appropriate unto thyself the things of the world and the riches thereof. Leave them unto such as desire them, and cleave unto that which hath been enjoined upon thee by Him Who is the Lord of creation.",
                                  "Know that thy true adornment consisteth in the love of God and in thy detachment from all save Him, and not in the luxuries thou dost possess. Abandon them unto those who seek after them and turn unto God"
                                ]
                },
                channels: "<#455111412965179402> or <#455111030314369024>"
            }
        ];
            daily.send({embed: {
                author: {
                    name: book[bookNum].name,
                    icon_url: book[bookNum].icon
                },
                color: book[bookNum].colour,
                fields: [
                { name: book[bookNum].passage.passageName[passageNum], value: book[bookNum].passage.passageText[passageNum], inline: true},
                ]
            }
        });
            daily.send(`<@&608701696629145601> feel free to discuss today's passage in ${book[bookNum].channels} 😄\nIf you don't wish to receive a ping for Daily Passages, simply type, \`.iamn Daily Passage\` in #bots.`);
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
