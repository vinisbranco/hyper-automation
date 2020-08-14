import * as functions from 'firebase-functions';

import viewCreditLimit from './webHooks/viewCreditLimit';
import consultOVbyName from './webHooks/consultOVbyName';
import consultOVbyNumber from './webHooks/consultOVbyNumber';
import authenticate from './webHooks/authenticate';

import { WebhookClient } from 'dialogflow-fulfillment';

export default functions.runWith({
    memory: "2GB"
}).https.onRequest((req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    let intentMap = new Map();
    /*
    Map trought intents to handle the webhook
    Register here the hooks for intent fullfilments
    */
    intentMap.set('viewCreditLimit', viewCreditLimit);
    intentMap.set('consultOVbyName', consultOVbyName);
    intentMap.set('consultOVbyNumber', consultOVbyNumber);
    intentMap.set('consultOVbyNameDirectly', consultOVbyName);
    intentMap.set('consultOVbyNumberDirectly', consultOVbyNumber);
    intentMap.set('authenticate', authenticate);
    
    try {
        agent.handleRequest(intentMap);
    } catch(e) {
        console.log("ERROR HANDLE REQUEST " + e)
    }
});