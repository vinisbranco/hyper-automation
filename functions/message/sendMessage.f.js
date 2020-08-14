import * as functions from 'firebase-functions'
import CreditLimitResponse from './model/CreditLimitResponse'
import ConsultOVbyNameResponse from './model/ConsultOVbyNameResponse'
import ConsultOVbyNumberResponse from './model/ConsultOVbyNumberResponse'
import SendAuthenticationButton from './model/SendAuthenticationButton';

import admin from 'firebase-admin';

const {
    BotFrameworkAdapter,
    TurnContext,
} = require('botbuilder');

const BotConnector = require("botframework-connector");
const { MicrosoftAppCredentials } = require('botframework-connector');

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

new BotConnector.MicrosoftAppCredentials(
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD
);
BotConnector.MicrosoftAppCredentials.trustServiceUrl(
    process.env.MICROSOFT_BOT_SERVICE_URL
);

// TODO: Put this logic in a class getter or a autoloader such thing and remove queueReference
const classes = new Map()
classes.set("CreditLimitResponse", CreditLimitResponse);
classes.set("ConsultOVbyNameResponse", ConsultOVbyNameResponse);
classes.set("ConsultOVbyNumberResponse", ConsultOVbyNumberResponse);
classes.set("SendAuthenticationButton", SendAuthenticationButton);

export default functions.runWith({
    memory: "2GB"
}).https.onRequest(async (req, res) => {

    const db = admin.firestore();

    let queueQuery = await db.collection('processQueue').where("conversationId", "==", req.body.conversationId)
    queueQuery.get().then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete();
        });
    })
    console.log("AQUIII")
    let address = {
        channelId: 'msteams',
        conversation: {
            id: req.body.conversationId
        },
        bot: {
            id: process.env.MICROSOFT_APP_ID,
            name: "Luna"
        },
        serviceUrl: process.env.MICROSOFT_BOT_SERVICE_URL,
    }
    let conversationReference = {};
    await db.collection("conversationsReference").doc(req.body.conversationId).get().then(snapshot => {

        console.log(snapshot.data())
        conversationReference = snapshot.data().conversationReference;
    });
    // conversationReference.serviceUrl = process.env.MICROSOFT_BOT_SERVICE_URL;   
    console.log("CONVERSATION REFERENCE")
    console.log(conversationReference);
    const messageClass = classes.get(req.body.messageClass)
    const model = new messageClass(req.body.payload);

    try {
        MicrosoftAppCredentials.trustServiceUrl(process.env.MICROSOFT_BOT_SERVICE_URL);
        await adapter.createConversation(conversationReference,
            async (t1) => {
                const conversationReference2 = TurnContext.getConversationReference(t1.activity);
                await t1.adapter.continueConversation(conversationReference2, async (t2) => {

                    await t2.sendActivity(model.render());

                }).then((r) => {
                    console.log("continue")
                    console.log(r)
                    res.status(200).send({
                        status: "OK"
                    })
                }).catch((e) => {
                    console.log(e);
                    res.send("ERRO " + e)
                });
            });
    } catch (err) {
        console.error(err);
    }

})