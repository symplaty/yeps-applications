function getSiteInfo() {
    var site = {};
    site.url = document.URL;
    site.title = document.title;
    return site;
}
console.log("content.js is running");
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    //console.log(message);

    if (message.text == "onclick") {
        var site = getSiteInfo();
        console.log(site);
    } else if (message.text == "opentab") {
        console.log("-----")
        console.log(message.url);
        window.open(message.url);

    }
}