import * as functions from 'firebase-functions'
import cors from 'cors';
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState  } from 'botbuilder';

import { TeamsConversationBot } from './bots/teamsConversationBot';

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('Eu to meio lotada de coisa agora e não consigo te responder agora, pode tentar mais tarde? Obg');
};

// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();

// Create conversation and user state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Instantiate our bot
const bot = new TeamsConversationBot(conversationState, userState);

export default functions.runWith({
    memory: "2GB"
}).https.onRequest((req, res) => {

    let corsFn = cors();

    corsFn(req, res, () => {
        // Listening for activity on this micro-service
        adapter.processActivity(req, res, async (context) => {
            await bot.run(context);

            // Return HTTP
            res.send();
        });
        
    })

});

export { userState, memoryStorage };