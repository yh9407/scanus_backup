const crypto = require('crypto');

const CRYPTO = require("crypto");
const ALG_CIPHER = "aes-256-gcm";
const ENCODING_IN = "utf8";
const ENCODING_OUT = "base64";
const BUFFER_SIZE = 16;
const KEY = Buffer.from("blocksblock", ENCODING_IN);
let key = crypto.createHash('sha256').update(String(KEY)).digest('base64').substr(0, 32);
const encrypt = async function encrypt(data) {
    const iv = Buffer.from(crypto.randomBytes(BUFFER_SIZE));
    const cipher = crypto.createCipheriv(ALG_CIPHER, key, iv);
    let enc = cipher.update(data, ENCODING_IN, ENCODING_OUT);
    enc += cipher.final(ENCODING_OUT);
    const ENCRYPTED = Object.freeze({
        authTag: cipher.getAuthTag(),
        data: Buffer.from(enc, ENCODING_OUT),
        iv: iv
    });
    return ENCRYPTED;
};

const decrypt = async function decrypt(authTag, data, iv) {
    const decipher = crypto.createDecipheriv(ALG_CIPHER, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(data, ENCODING_OUT, ENCODING_IN);
    decrypted += decipher.final(ENCODING_IN);
    return decrypted;
};

module.exports = {encrypt, decrypt};
