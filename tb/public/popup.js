import { decrypt } from "./crypt";
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#save")?.addEventListener('click', () => {
        console.log('save button clicked');
        chrome.runtime.sendMessage({
            action: "save"
        });
    });
    document.querySelector("#decrypt")?.addEventListener("click", () => {
        const output = document.querySelector("#output");
        if (!output) {
            console.log("Output element not found");
            return;
        }
        const input = document.querySelector("#input");
        console.log("input", input?.value);
        const dec = decrypt(input?.value);
        output.value = dec;
    });
});
