const _ = require('lodash')
const admin = require('firebase-admin')
const axios = require('axios')

export default async function consultOVbyName(agent) {
    const db = admin.firestore();

    console.log(_.split(agent.request_.body.session, "/"));

    await db.collection("processQueue").add({
        name: agent.request_.body.queryResult.parameters.person,
        processId: "13056", //TODO trocar pelo processId do script correto no NewVision
        conversationId: _.last(_.split(agent.request_.body.session, "/")),
        messageClass: "ConsultOVbyNameResponse"
    })

    axios.post(`${process.env.REACT_APP_HAVERSINE_ENDPOINT}/registerJob`, {
        jobName: "newVisionJob",
        jobPayload: {
            processId: "13056" //TODO trocar pelo processId do script correto no NewVision
        }
    }).then((response) => {
        console.log(response);
    }).catch((e) => {
        console.log("ERRO", e);
    })

    await agent.add("Ok, me da um minuto que eu vou no SAP procurar as Ordens de Venda do "+agent.request_.body.queryResult.parameters.person+".")
}