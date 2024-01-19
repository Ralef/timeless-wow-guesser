const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { AsciiTable3 } = require('ascii-table3');
const _ = require("lodash");
const moment = require('moment');


const prisma = new PrismaClient();

async function getAllChallengers() {
    return await prisma.Challenger.findMany({
        orderBy: {
            joinedAt: 'asc',
        },
    });
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
                _.round(moment.duration(moment().diff(challenger.joinedAt)).asMinutes(), 2) + ' minutes',
                moment(challenger.joinedAt).utc().format('YYYY-MM-DD HH:mm:ss'),
            );
        });
        let user = interaction.user;
        await user.send('Here is the list of current participants and their progress on ' + new Date() + ':\n' +
            '```\n' + asciiTable3.toString() + '\n```')
            .catch(console.error);
        await interaction.reply({ content: 'List is sent to your DMs.', ephemeral: true })
            .catch(console.error);
    },
};
