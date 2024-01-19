const {
    SlashCommandBuilder
} = require('discord.js');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-challenge')
        .setDescription('Remove a challenge, clue, all participants and their progress.'),
    async execute(interaction) {
        await prisma.Challenger.deleteMany();
        await prisma.Clue.deleteMany();

        await interaction.reply('Challenge, clue, all participants and their progress are removed!')
            .catch(console.error);
    },
};
