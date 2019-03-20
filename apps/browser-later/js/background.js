console.log("background running");
chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab) {
    console.log("button clicked");
    //console.log(tab);
    var msg = {
        text: "onclick"
    }
    chrome.tabs.sendMessage(tab.id, msg);
}

// 获取popup里的元素，必须得是在popup页面打开的情况下才行
// var views = chrome.extension.getViews({type:'popup'});
// if(views.length > 0){
// 	console.log(views);
// }

chrome.contextMenus.create({
    title: "添加到稍后再看",
    onclick: sendTab
});



//发送消息给popup，然后在popup里实现功能
function sendTab() {
    //使用tabs不行，因为接受方必须是活跃的
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    // 	chrome.tabs.sendMessage(tabs[0].id, {text: "addtab", tab: tabs[0]});
    // });

    //在popup打开时可以完成功能
    //chrome.runtime.sendMessage({text: "addtab"})



}