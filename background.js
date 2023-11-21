browser.runtime.onMessage.addListener(function (message) {
    if (message.action === "triggerMisskeyPost") {
        // ここでMisskeyにデータを送信する処理を呼び出す
        sendMessageToMisskey();
    }
});

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

    console.log('Sending message to Misskey...');

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
        } else {
            console.log('送信しました。');
        }

        await response.text();
    } catch (e) {
        console.error('エラーが発生しました。' + e);
    }
}

async function getApiKey() {
    try {
        const result = await browser.storage.local.get('apiKey');
        return result.apiKey;
    } catch (error) {
        console.error('APIキーを参照することができませんでした。:', error);
        return null;
    }
}
