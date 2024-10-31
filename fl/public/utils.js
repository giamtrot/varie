var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EXT_ID } from "./content";
export function log(...msg) {
    const date = new Date();
    const logMsg = [EXT_ID, " - ", date.toLocaleDateString(), date.toLocaleTimeString(), " - ", ...msg];
    console.log(...logMsg);
}
export function openTab(url) {
    return __awaiter(this, void 0, void 0, function* () {
        window.postMessage({ action: "openTab", data: { url: url } }, "*");
    });
}
export function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return null;
}
export function initLocalStorage(key, initValue) {
    if (!getLocalStorage(key)) {
        setLocalStorage(key, initValue);
    }
}
