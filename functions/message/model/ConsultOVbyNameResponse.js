const {
    MessageFactory,
} = require('botbuilder');

export default class ConsultOVbyNameResponse {
    constructor(payload) {
        this.payload = payload
    }

    render() {
        return MessageFactory.text(`Achei aqui! As OVs do cliente ${this.payload.name} são: ${this.payload.OVs.map((ov)=>{ov})}`)
    }
}