const {
    MessageFactory,
} = require('botbuilder');

export default class CreditLimitResponse {
    constructor(payload) {
        this.payload = payload
    }

    render() {
        return MessageFactory.text(`Achei aqui! O limte de crédito do cliente ${this.payload.sapId} é: R$${this.payload.limiteCredito}`)
    }
}