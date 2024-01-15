const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-challenge')
        .setDescription('It will start timer and give you first clue for the challenge.'),
    async execute(interaction) {
        let savedMessage = 'That is the message that contains a clue.';
        let user = interaction.user;
        let currentDate = new Date();
        await interaction.user.send(savedMessage + ' Debug: date is ' + currentDate.toISOString() + ' and user is ' + user.tag)
            .then(message => console.log(`Sent message: '${message.content}' to ${user.tag}`))
            .catch(console.error);
        await interaction.reply('You have started the challenge! Check your DMs for the first clue. Good luck!');
    },
};
