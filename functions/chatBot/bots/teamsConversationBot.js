const {
    MessageFactory,
    TeamsActivityHandler,
    TurnContext,
    TeamsInfo,
} = require('botbuilder');
const {
    SessionsClient,
} = require('dialogflow')

const admin = require('firebase-admin')

class TeamsConversationBot extends TeamsActivityHandler {
    constructor(conversationState, userState) {
        super(conversationState, userState);
        this.onMessage(async (context, next) => {
            const db = admin.firestore();

            const conversationId = context._activity.conversation.id || "foo"
            var member = await TeamsInfo.getMember(context, context.activity.from.id);
            const conversationReference = await TurnContext.getConversationReference(context.activity);
            conversationReference.user = member;
            
            await db.collection("conversationsReference").doc(conversationId).set({
                conversationReference: conversationReference,
                conversationId: conversationId,
            })

            console.log(conversationReference);
            const message = context._activity.text.trim().toLocaleLowerCase()
            console.log(context._activity);

            const queryInput = {
                "text": {
                    "text": message,
                    "languageCode": "pt-BR"
                }
            }

            const sessionClient = new SessionsClient({
                credentials: {
                    "type": process.env.DIALOGFLOW_SERVICE_ACCOUNT_TYPE,
                    "project_id": process.env.DIALOGFLOW_SERVICE_ACCOUNT_PROJECT_ID,
                    "private_key_id": process.env.DIALOGFLOW_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
                    "private_key": process.env.DIALOGFLOW_SERVICE_ACCOUNT_PRIVATE_KEY,
                    "client_email": process.env.DIALOGFLOW_SERVICE_ACCOUNT_CLIENT_EMAIL,
                    "client_id": process.env.DIALOGFLOW_SERVICE_ACCOUNT_CLIENT_ID,
                    "auth_uri": process.env.DIALOGFLOW_SERVICE_ACCOUNT_AUTH_URI,
                    "token_uri": process.env.DIALOGFLOW_SERVICE_ACCOUNT_TOKEN_URI,
                    "auth_provider_x509_cert_url": process.env.DIALOGFLOW_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
                    "client_x509_cert_url": process.env.DIALOGFLOW_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
                }
            })

            const session = sessionClient.sessionPath('chat-bot-4f265', conversationId);

            const responses = await sessionClient.detectIntent({
                session,
                queryInput,
            });

            const result = responses[0].queryResult;

            await context.sendActivity(MessageFactory.text(result.fulfillmentText));
            await next();
        });

    }

}

export { TeamsConversationBot };