const loadFunctions = require('firebase-function-tools')
const admin = require('firebase-admin')
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE
});

admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
        "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
        "token_uri": process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
    })
})

loadFunctions(__dirname, exports)