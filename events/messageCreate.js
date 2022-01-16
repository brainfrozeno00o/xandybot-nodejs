const dotenv = require("dotenv");

dotenv.config();

const blitzId = process.env.KRAZY_ID;
const blitzTimeout = parseInt(process.env.KRAZY_TIMEOUT) * 1000;
let isReady = true;

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.id === blitzId && isReady) {
            try {
                await message.channel.send(`HOY <@${message.author.id}>`);
                console.info("Successfully sent the callout...");
                isReady = false;
                setTimeout(() => {
                    isReady = true;
                    console.info("Done waiting and ready to send the callout again");
                }, blitzTimeout);
            } catch (e) {
                console.error(`An error has occurred while sending a message: ${e}`);
            }
        }
    }
};