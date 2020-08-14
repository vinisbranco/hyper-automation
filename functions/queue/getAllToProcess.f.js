import * as functions from 'firebase-functions'
import {
    toXML
} from 'jstoxml';

const admin = require('firebase-admin')

export default functions.runWith({
    memory: "2GB"
}).https.onRequest(async (req, res) => {

    let queueRequests = []

    let db = admin.firestore();
    await db.collection('processQueue').get().then(snapshot => {
        snapshot.forEach((doc) => {
            queueRequests.push({
                request: {                   
                    ...doc.data(),
                    queueId: doc.id,
                    process: Date.now(),
                }
            });
        })
        return;
    })


    let queue = {
        root: queueRequests
    }

    if (req.query.output == "xml") {
        res.status(200).set("Content-Type", "text/xml; charset=utf8").send(
            "<?xml version='1.0' encoding='UTF-8'?>" + toXML(queue)
        )
    } else {
        res.status(200).send(queue)
    }

})