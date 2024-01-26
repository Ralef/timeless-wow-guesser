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
        let clue = await prisma.Clue.findFirst();

        if (!clue) {
            await interaction.reply('There is *NO* active challenge in progress. If you think this is a mistake, contact the admins');
            return;
        }

        if (userRecord) {
            await interaction.reply('_You have already started the challenge!_\n' +
                'I\'ll send you the first clue again. If you still have trouble, contact the admins.');
        } else {
            await interaction.reply('Welcome to the challenge! Check your DMs for the first clue. Good luck!');
        }

        await interaction.user.send(clue.content)
            .then(message => {
                if (!userRecord) {
                    saveChallenger(user.id, user.tag);
                }
            })
            .catch(console.error);
    },
};
