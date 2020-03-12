const paypal = require('@paypal/checkout-server-sdk');


function client() {
    return new paypal.core.PayPalHttpClient(environment());
}


function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';

    return new paypal.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

module.exports = client