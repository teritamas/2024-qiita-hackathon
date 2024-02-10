// 1分の60分の1、つまり1秒ごとにトリガーされるアラームを作成
chrome.alarms.create({
    periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("service-workerのテスト")
    console.log(this)
})