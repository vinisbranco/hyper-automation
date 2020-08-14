const _ = require('lodash')
const admin = require('firebase-admin')
const axios = require('axios')

export default async function viewCreditLimit(agent) {
    const db = admin.firestore();

    console.log(_.split(agent.request_.body.session, "/"));

    await db.collection("processQueue").add({
        sapId: agent.request_.body.queryResult.parameters.sapId,
        processId: "13056",
        conversationId: _.last(_.split(agent.request_.body.session, "/")),
        messageClass: "CreditLimitResponse"
    })

    axios.post(`${process.env.REACT_APP_HAVERSINE_ENDPOINT}/registerJob`, {
        jobName: "newVisionJob",
        jobPayload: {
            processId: "13056"
        }
    }).then((response) => {
        console.log(response);
    }).catch((e) => {
        console.log("ERRO", e);
    })

    await agent.add("Ok, me da um minuto que eu vou no SAP procurar para você.")
}