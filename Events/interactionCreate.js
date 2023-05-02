const { client } = require("../index.js");

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const scommand = client.scommands.get(interaction.commandName);
    if (!scommand) return;
    try {
        await scommand.run(client, interaction)
    } catch(err) {
        if (err) console.log(err);

        await interaction.reply({
            content: "Komutta bir hata var.",
            ephemeral: true
        })
    }
});