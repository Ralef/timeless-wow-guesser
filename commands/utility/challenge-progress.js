const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { AsciiTable3 } = require('ascii-table3');


const prisma = new PrismaClient();

async function getAllChallengers() {
    return await prisma.Challenger.findMany({
        orderBy: {
            joinedAt: 'asc',
        },
    });
}

function getDateDifferenceInMinutesUTC(date1, date2) {
    return Math.abs(date1 - date2) / 1000 / 60;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge-progress')
        .setDescription('Get list of current participants and their progress.'),
    async execute(interaction) {
        let asciiTable3 = new AsciiTable3();
        asciiTable3.setHeading('ID', 'Name', 'Time In Challenge', 'Joined at');
        let challengers = await getAllChallengers();
        challengers.forEach(challenger => {
            asciiTable3.addRow(
                challenger.id,
                challenger.name,
                getDateDifferenceInMinutesUTC((new Date()).getTime(), (new Date(challenger.joinedAt)).getTime()) + ' minutes',
                new Date(challenger.joinedAt),
            );
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
