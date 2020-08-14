import _ from 'lodash';
import admin from 'firebase-admin';
import axios from 'axios';

export default async function consultOVbyNumber(agent) {
    const db = admin.firestore();

    console.log("Chegou aqui")
    //console.log(agent.request_)
    await db.collection("processQueue").add({
        OVid: agent.request_.body.queryResult.parameters["number-sequence"],
        processId: "3616", 
        conversationId: _.last(_.split(agent.request_.body.session, "/")),
        messageClass: "ConsultOVbyNumberResponse"
    })

    axios.post(`${process.env.REACT_APP_HAVERSINE_ENDPOINT}/registerJob`, {
        jobName: "newVisionJob",
        jobPayload: {
            processId: "3616" 
        }
    }).then((response) => {
        console.log("ERRO post Redis: " + response);
    }).catch((e) => {
        console.log("ERRO", e);
    });
    
    await agent.add("Ok, me da um minuto que eu vou no SAP procurar a Ordem de Venda "+agent.request_.body.queryResult.parameters["number-sequence"]+".")
}