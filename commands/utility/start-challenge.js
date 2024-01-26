const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('start-challenge')
    .setDescription('Starts timer and gives the first clue for the challenge.'),
    async execute(interaction) {
        const user = interaction.user;
        const userRecord = await prisma.Challenger.findUnique({ where: { id: user.id } });
        const clue = await prisma.Clue.findFirst();

        if (!clue) {
            return interaction.reply('No active challenge. Contact admins if this is a mistake.');
        }

        if (userRecord) {
            interaction.reply('You have already started the challenge! Check your DMs for the first clue again.');
        } else {
            interaction.reply('Welcome to the challenge! Check your DMs for the first clue. Good luck!');
            prisma.Challenger.create({ data: { id: user.id, name: user.tag } });
        }

        interaction.user.send(clue.content).catch(console.error);
    },
};
