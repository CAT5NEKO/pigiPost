document.addEventListener("DOMContentLoaded", function () {
    console.log("popup.jsでDOMContentLoadedが発火しました.");

    document.getElementById("postToMisskey").addEventListener("click", function () {
        console.log("popup.jsでAﾋﾟｷﾞﾓﾝｺﾞ発動ボタンがクリックされました.");
        browser.runtime.sendMessage({ action: "triggerMisskeyPost" })
            .then(response => {
                console.log("Misskeyにデータを送信するメッセージを送信しました。");
            })
            .catch(error => {
                console.error("メッセージの送信をしくじりました。:", error);
            });
    });

    const apiKeyInput = document.getElementById("api-key");
    const saveSettingsButton = document.getElementById("save-settings");

    saveSettingsButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value;
        saveApiKey(apiKey);
    });

    async function saveApiKey(apiKey) {
        try {
            await browser.storage.local.set({ 'apiKey': apiKey });
            console.log('APIキーを保存しました。');
        } catch (error) {
            console.error('APIキーの保存にしくじりました。:', error);
        }
    }
});
