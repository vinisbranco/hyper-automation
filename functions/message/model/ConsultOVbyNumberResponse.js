const {
    MessageFactory,
} = require('botbuilder');

export default class ConsultOVbyNumberResponse {
    constructor(payload) {
        this.payload = payload
    }

    render() {
        return MessageFactory.text(`Achei aqui! A OV de número ${this.payload.OVid}`)// tem as seguintes informações ( Costumer Code:${this.payload.costumerCode}, Nome do Cliente:${this.payload.clientName}, Quantidade: ${this.payload.qntd}, Total liquido:${this.payload.totalLiquido}, Total Final:${this.payload.totalFinal}, Condição de Pagamento:${this.payload.condicaoPagamento}`)
    }
}