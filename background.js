document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("api-key");
    const saveSettingsButton = document.getElementById("save-settings");

    saveSettingsButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value;
        saveApiKey(apiKey);
    });

    async function saveApiKey(apiKey) {
        try {
            await browser.storage.local.set({ 'apiKey': apiKey });
            console.log('APIキーが正常に保存されました。');
        } catch (error) {
            console.error('APIキーが保存されませんでした。:', error);
        }
    }
    async function getApiKey() {
        try {
            const result = await browser.storage.local.get('apiKey');
            return result.apiKey;
        } catch (error) {
            console.error('APIキーを参照することが出来ませんでした。:', error);
            return null;
        }
    }
    async function sendMessageToMisskey() {
        const apiKey = await getApiKey();
        if (!apiKey) {
            console.error('APIまだセットされてないわ。ちょっと用意してきてほしい');
            return;
        }

        let range = "public";
        let strings = "ﾋﾟｷﾞﾓﾝｺﾞ";

        let data = {
            i: apiKey,
            visibility: range,
            text: strings,
        };
        const str = JSON.stringify(data);
        buttonstatus('sending');
        try {
            const response = await fetch("https://misskey.systems/api/notes/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: str,
            });
            if (!response.ok) {
                console.error('レスポンスエラー');
                buttonstatus('送信を中断します');
            } else {
                console.log('送信します。');
                buttonstatus('送信完了');
            }
            response.text();
        } catch (e) {
            console.error('不明なエラーが発生しました。' + e);
            buttonstatus('送信を中断します。');
        }

        setTimeout(() => buttonstatus('default'), 3000);
    }

    browser.runtime.onMessage.addListener(async function (message) {
        if (message.action === "openMisskeyPostWindow") {
            console.log("Misskeyに投稿する準備が整いました。");
            await sendMessageToMisskey();
        }
    });
});
