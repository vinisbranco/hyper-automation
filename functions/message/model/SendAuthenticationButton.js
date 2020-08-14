import { CardFactory  } from 'botbuilder';

export default class SendAuthenticationButton {
    constructor(payload) {
        this.payload = payload
    }

    render() {
        const heroCard = CardFactory.signinCard(
            'Entrar',
            'https://hyper-automation-auth.vercel.app/',
            'AAAAAAAAAAAAAAA'
        );

        return heroCard;
    }
}