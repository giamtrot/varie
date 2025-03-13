import { decrypt } from "./crypt";

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#save")?.addEventListener('click', () => {
        console.log('save button clicked');
        chrome.runtime.sendMessage({
            action: "save"
        });
    });

    document.querySelector("#decrypt")?.addEventListener("click", () => {
        const output = document.querySelector("#output") as HTMLTextAreaElement
        if (!output) {
            console.log("Output element not found");
            return
        }
        const input = document.querySelector("#input") as HTMLTextAreaElement
        console.log("input", input?.value);
        const dec = decrypt(input?.value as string);
        output.value = dec;
    })

});
