import _ from 'lodash';
import admin from 'firebase-admin';
import axios from 'axios';

import { userState, memoryStorage } from '../../chatBot/gateway.f.js';

export default async function authenticate(agent) {
    const db = admin.firestore();

    console.log(_.split(agent.request_.body.session, "/"));

    await db.collection("processQueue").add({
        conversationId: _.last(_.split(agent.request_.body.session, "/")),
        messageClass: "SendAuthenticationButton"
    });

    // await axios.post(`${process.env.REACT_APP_HAVERSINE_ENDPOINT}/registerJob`, {
    //     jobName: "newVisionJob",
    //     jobPayload: {
    //         processId: "13056"
    //     }
    // }).then((response) => {
    //     console.log(response);
    // }).catch((e) => {
    //     console.log("ERRO", e);
    // })

    console.log({ userState, memoryStorage });

    await axios.post('https://us-central1-chat-bot-4f265.cloudfunctions.net/messageSendMessage', {
        conversationId: _.last(_.split(agent.request_.body.session, "/")),
        messageClass: 'SendAuthenticationButton',
        payload: {}
    });

    await agent.add('Hello :D');

    // await agent.add(heroCard);

    
}