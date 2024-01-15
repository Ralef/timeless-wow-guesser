const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { AsciiTable3 } = require('ascii-table3');


const prisma = new PrismaClient();

async function getAllChallengers(id, name) {
    return await prisma.Challenger.findMany();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge-progress')
        .setDescription('Get list of current participants and their progress.'),
    async execute(interaction) {
        let asciiTable3 = new AsciiTable3();
        asciiTable3.setHeading('ID', 'Name', 'Joined at');
        let challengers = await getAllChallengers();
        challengers.forEach(challenger => {
            asciiTable3.addRow(challenger.id, challenger.name, new Date(challenger.joinedAt));
        });
        let user = interaction.user;
        await user.send('Here is the list of current participants and their progress on ' + new Date() + ':\n```\n' + asciiTable3.toString() + '\n```')
            .then(message => {
                console.log(`Sent message: '${message.content}' to ${user.tag}`);
            })
            .catch(console.error);
        await interaction.reply('');
    },
};
