//Defines bot/prefix and languages used.
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const schedule = require('node-schedule-tz');
const bot = new Discord.Client();
const prefix = ".";

bot.on('ready', () => {
    bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: `commands. Try ".help"`,
            type: 2
        }
    });
});

//Message Commands ReligionBot can proform.
bot.on("message", (message) => {
    //Help message. Useful for new users.
    if (message.content == prefix + "help") {
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
    if (message.content == prefix + "religions") {
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
    if (message.content == prefix + "denominations") {
        message.channel.send({embed: {
            title: "Assignable Roles:\n\n",
            color: 0xF1DA75,
            fields: [
            { name: "Christian (1):", value: "Catholic\nOrthodox\nAnglican\nBaptist\nLutheran\nMethodist", inline: true},
            { name: "Christian (2):", value: "Reformed\nLatter-Day Saint\nJehovah's Witness\nMessianic Jew\nCongregational", inline: true},
            { name: "Muslim:", value: "Sunni\nShia\nSufi\nAhmadiyya\nQuranist", inline: true},
            { name: "Irreligious:", value: "Atheist\nAgnostic\nIgnostic", inline: true},
            { name: "Hindu:", value: "Vaishnavi\nShaivi", inline: true},
            { name: "Buddhist:", value: "Theravada\nMahayana\nVajrayana", inline: true},
            { name: "Jew:", value: "Orthodox Jew\nConservative Jew\nReformed Jew\nReconstructionist Jew\n\nContact a moderator if there is a role you think should be added.", inline: true}
            ]
          }
        });
    }
    if (message.content.startsWith(prefix + "iam")) {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = message.guild.roles.find("name", message.content.slice(5, message.content.length));
        message.member.addRole(role).then(() => {
            message.reply(`Successfully added \`${message.content.slice(5, message.content.length)}\``);
            logs.send({embed: {
                title: "User added role:\n\n",
                color: 0x66ba67,
                fields: [
                    { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                    { name: "Role:", value: role.name, inline: true},
                ]
                }
            });
            }).catch(err => {
            if (!message.content.startsWith(prefix + "iamn")) {
                message.reply(`I was unable to add \`${message.content.slice(5, message.content.length)}\` role. Please make sure that role exists and that you have permission to add it.`);
            }
        });
    }
    if (message.content == prefix + "done" && message.channel.name == 'unverified' && message.member.roles.size > 2) {
        const general = message.member.guild.channels.find('name', 'general');
        const unverified = message.guild.roles.find("name", "Unverified");
        message.member.removeRole(unverified).then(() => {
            general.send(`Welcome, ${message.member.user}!\nIf you'd like to add roles type \`.religions\` or \`.denominations\` in <#455112761769459723>.`);
        });
    }
    if (message.content.startsWith(prefix + "iamn")) {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = message.guild.roles.find("name", message.content.slice(6, message.content.length));
        message.member.removeRole(role).then(() => {
            message.reply(`Successfully removed \`${message.content.slice(5, message.content.length)}\``);
            logs.send({embed: {
                title: "User removed role:\n\n",
                color: 0xaa3333,
                fields: [
                    { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                    { name: "Role:", value: role.name, inline: true},
                ]
                }
            });
            }).catch(err => {
            if (!message.content.startsWith(prefix + "iamnot")) {
                message.reply(`I was unable to remove \`${message.content.slice(6, message.content.length)}\` role. Please make sure that role exists and that you have permission to remove it.`);
            }
        });
    }
    if (message.content.startsWith(prefix + "iamnot")) {
        const logs = message.member.guild.channels.find('name', 'role-log');
        let role = message.guild.roles.find("name", message.content.slice(8, message.content.length));
        message.member.removeRole(role).then(() => {
            message.reply(`Successfully removed \`${message.content.slice(7, message.content.length)}\``);
            logs.send({embed: {
                title: "User removed role:\n\n",
                color: 0xaa3333,
                fields: [
                    { name: "Username:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.id}`, inline: true},
                    { name: "Role:", value: role.name, inline: true},
                ]
                }
            });
            }).catch(err => {
            message.reply(`I was unable to remove \`${message.content.slice(8, message.content.length)}\` role. Please make sure that role exists and that you have permission to remove it.`);
        });
    }
    if (message.content.startsWith(prefix + 'suggest')) {
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
        }
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("👍")
            const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === '421725581952942081'
            message.awaitReactions(filter, { time: 35000 })
            .then(sentEmbed.react("👎"))
        })
    }
    if (message.content.startsWith(prefix + "wiki")) {
        const query = message.content.slice(6, message.content.length).replace(/ /g, "_");
        message.channel.send(`https://en.wikipedia.org/wiki/${query}`);
    }
    //Moderation commands
    if (message.content.startsWith(prefix + 'delete')) {
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
            const logs = message.member.guild.channels.find('name', 'delete-log');
            message.delete(100).then(() => {
            message.channel.bulkDelete(message.content.slice(8, message.content.length)).then(() => {
            message.reply(`Successfully deleted \`${message.content.slice(8, message.content.length)}\` messages`).then(msg => msg.delete(3000));
            logs.send({embed: {
                title: "Deleted Messages:\n\n",
                color: 0x5a5a5a,
                fields: [
                    { name: "Deleted By:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.user.id}`, inline: true},
                    { name: "Messages Deleted:", value: `${message.content.slice(8, message.content.length)}`, inline: true}
                ]
                }
            });
            })}).catch(err => {
            message.reply(`I was unable to delete \`${message.content.slice(8, message.content.length)}\` messages. \`${err}\``);
        });
      }
    if (message.content.startsWith(prefix + "ar")) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = message.guild.roles.find("name", message.content.slice(8 + user.id.length, message.content.length));
                const member = message.guild.member(user);
                if (member) {
                    member.addRole(role).then(() => {
                    message.reply(`Successfully added \`${message.content.slice(8 + user.id.length, message.content.length)}\` to ${member.user.username}.`);
                    logs.send({embed: {
                        title: "User was given role:\n\n",
                        color: 0x66ba67,
                        fields: [
                           { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                           { name: "Role:", value: role.name, inline: true},
                        ]
                    }
                });
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
    if (message.content.startsWith(prefix + "rr")) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = message.guild.roles.find("name", message.content.slice(8 + user.id.length, message.content.length));
                const member = message.guild.member(user);
                if (member) {
                    member.removeRole(role).then(() => {
                    message.reply(`Successfully removed \`${message.content.slice(8 + user.id.length, message.content.length)}\` from ${member.user.username}.`);
                    logs.send({embed: {
                        title: "User had role removed:\n\n",
                        color: 0xaa3333,
                        fields: [
                           { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                           { name: "Role:", value: role.name, inline: true},
                        ]
                    }
                });
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
    if (message.content.startsWith(prefix + 'unmute')) {
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
                logs.send({embed: {
                    title: "User unmuted:\n\n",
                    color: 0x5a5a5a,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
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
    if (message.content.startsWith(prefix + 'mute')) {
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
                logs.send({embed: {
                    title: "User muted:\n\n",
                    color: 0x5a5a5a,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
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
    if (message.content.startsWith(prefix + 'inspect')) {
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
                timeout.send(`${user} you have been placed in Timeout for \`${message.content.slice(13 + user.id.length, message.content.length)}\` you are going to have to speak with a moderator about your behavior before you will be able to chat anywhere else.`)
                if (message.content.slice(13 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(13 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User put in timeout:\n\n",
                    color: 0xe5e5e5,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
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
    var j = schedule.scheduleJob({hour: 16, minute: 00}, function() {
        const rod = bot.guilds.get('359925003359354890')
        const daily = rod.channels.find('name', 'daily-passage')
        var passageNum = Math.floor(Math.random() * 6);
        var bookNum = Math.floor(Math.random() * 6);
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
            /*//Hindu
            vedas = {
                name: "The Vedas:",
                icon: "",
                colour: 0xe78810,
                passage : {
                    passageName: [],
                    passageText: []
                },
                channels: ""
            },*/
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
                    passageName: ["1 Nephi 3:7", "2 Nephi 2:25", "2 Nephi 2:27", "2 Nephi 25:23, 26", "2 Nephi 26:33", "2 Nephi 28:7–9", "2 Nephi 31:19-20", "2 Nephi 32:8–9", "Mosiah 2:17", "Mosiah 3:19", "Mosiah 4:30", "Alma 32:21", "Alma 37:35", "Alma 39:9", "Helaman 5:12", "3 Nephi 12:48", "3 Nephi 18:15, 20-21", "Ether 12:6", "Ether 12:27", "Moroni 7:41", "Moroni 45, 47-48", "Moroni 10:4-5"],
                    passageText: ["Wherefore, men are free according to the flesh; and all things are given them which are expedient unto man. And they are free to choose liberty and eternal life, through the great Mediator of all men, or to choose captivity and death, according to the captivity and power of the devil; for he seeketh that all men might be miserable like unto himself.",
                                  "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness; and he denieth none that come unto him, black and white, bond and free, male and female; and he remembereth the heathen; and all are alike unto God, both Jew and Gentile.",
                                  "And now as I said concerning faith—faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true.",
                                  "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, yea, his shafts in the whirlwind, yea, when all his hail and his mighty storm shall beat upon you, it shall have no power over you to drag you down to the gulf of misery and endless wo, because of the rock upon which ye are built, which is a sure foundation, a foundation whereon if men build they cannot fall.",
                                  /*"Therefore I would that ye should be perfect even as I, or your Father who is in heaven is perfect.",*/
                                  /*"And now, I, Moroni, would speak somewhat concerning these things; I would show unto the world that faith is things which are hoped for and not seen; wherefore, dispute not because ye see not, for ye receive no witness until after the trial of your faith.",*/
                                  /*"And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them.",*/
                                  /*"And what is it that ye shall hope for? Behold I say unto you that ye shall have hope through the atonement of Christ and the power of his resurrection, to be raised unto life eternal, and this because of your faith in him according to the promise.",*/
                                  "And charity suffereth long, and is kind, and envieth not, and is not puffed up, seeketh not her own, is not easily provoked, thinketh no evil, and rejoiceth not in iniquity but rejoiceth in the truth, beareth all things, believeth all things, hopeth all things, endureth all things. But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him. Wherefore, my beloved brethren, pray unto the Father with all the energy of heart, that ye may be filled with this love, which he hath bestowed upon all who are true followers of his Son, Jesus Christ; that ye may become the sons of God; that when he shall appear we shall be like him, for we shall see him as he is; that we may have this hope; that we may be purified even as he is pure. Amen."]

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
        })
            daily.send(`@Daily Passage feel free to discuss today's passage in ${book[bookNum].channels} 😄\nIf you don't wish to receive a ping for Daily Passages, simply type, \`.iamn Daily Passage\``)
      });
});

bot.on('guildMemberAdd', member => {
    const unverified = member.guild.channels.find('name', 'unverified');
    const logs = member.guild.channels.find('name', 'join-log')

    if (!unverified) return;
    unverified.send(`Welcome ${member} to **Religious Online Discussions**! We are a server dedicated to Interfaith cooperation to study religion and other philosophies to bring us closer to any Power we believe in whether that be one God, many gods, no god, etc.\nTo get yourself started please type \`.religions\` to check out the roles we have and do \`.iam [role]\` to add a role to yourself (the role assignment is case sensitive. All religions are proper nouns \`.iam Muslim\` will work, but not \`.iam muslim\`). Once you have at least one role use \`.done\`.\nContact a staff member if you need assistance and enjoy your time here.`);
    member.addRole(member.guild.roles.find("name", "Unverified"))
    member.addRole(member.guild.roles.find("name", "Daily Passage"))
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
  });
bot.on('guildMemberRemove', member => {
    const logs = member.guild.channels.find('name', 'join-log')
    logs.send({embed: {
        title: "User left:\n\n",
        color: 0xaa3333,
        fields: [
            { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
            { name: "Left server:", value: `${member.removedAt}`, inline: true},
        ]
        }
    });
});

//Bot login Token.
bot.login(process.env.BOT_TOKEN);
