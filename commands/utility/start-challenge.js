const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getChallenger(id) {
    return await prisma.Challenger.findUnique({
        where: {
            id: id,
        },
    });
}

async function saveChallenger(id, name) {
    return await prisma.Challenger.create({
        data: {
            id: id,
            name: name,
        },
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-challenge')
        .setDescription('It will start timer and give you first clue for the challenge.'),
    async execute(interaction) {
        let user = interaction.user;
        let userRecord = await getChallenger(user.id);

        if (userRecord) {
            await interaction.reply('_You have already started the challenge!_ Check your DMs for the first clue. Good luck!');
            return;
        }

        let savedMessage = 'That is the message that contains a clue.';
        let currentDate = new Date();
        await interaction.user.send(savedMessage + ' Debug: date is ' + currentDate.toISOString() + ' and user is ' + user.tag)
            .then(message => {
                console.log(`Sent message: '${message.content}' to ${user.tag}`);
                saveChallenger(user.id, user.tag);
            })
            .catch(console.error);
        await interaction.reply('Welcome to the challenge! Check your DMs for the first clue. Good luck!');
    },
};
