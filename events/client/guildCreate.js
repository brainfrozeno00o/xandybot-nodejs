module.exports = {
    name: "guildCreate",
    async execute(guild) {
        console.info(`XandyBot has joined ${guild.name}`);
        // find general channel
        const allChannels = await guild.channels.fetch();
        try {
            const generalChannel = allChannels.filter(channel => channel.name === "general");
            generalChannel ? console.info(`Found the general channel in ${guild.name}`) : console.info(`No general channel found in ${guild.name}`);
        } catch (e) {
            console.error(`Error has occurred: ${e}`);
        }
    }
};