import CryptoJS from "crypto-js";
export function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    return btoa(String.fromCharCode(...bytes));
}
export function decodeBase64(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
}
const secretKey = '0123456789abcdef0123456789abcdef'; // 32 characters (256-bit)
export function encrypt(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}
export function decrypt(encryptedText) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
