const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function saveClue(content) {
    if (await prisma.Clue.count() > 0) {
        throw new Error('There is already a clue saved.');
    }

    // Replace the string "\n" with the newline character
    content = content.replace(/\\n/g, '\n');

    return await prisma.Clue.create({
        data: {
            content: content,
        },
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save-message')
        .setDescription('It will save the message that contains a clue.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The message that contains a clue.')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString('input');

        try {
            await saveClue(input);
        } catch (error) {
            await interaction.reply({ content: error.message, ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Clue saved!', ephemeral: true})
            .catch(console.error);
    },
};
