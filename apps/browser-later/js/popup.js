var currentTab = {};
var laterTabs = new Array();
var historyTabs = new Array();

chrome.storage.sync.get(["later_tabs"], function(tabs) {
    if (tabs.later_tabs) {
        laterTabs = tabs.later_tabs;
    }
    showTabs(laterTabs, "tabs-container");
});

chrome.storage.sync.get(["history_tabs"], function(tabs) {
    if (tabs.history_tabs) {
        historyTabs = tabs.history_tabs;
    }
    showTabs(historyTabs, "history-container");
});


getCurrentTab();

function getCurrentTab() {
    var params = {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
        currentTab.id = tabs[0].id;
        currentTab.title = tabs[0].title;
        currentTab.url = tabs[0].url;
        currentTab.clicked = false;
        console.log("popup id" + tabs[0].id);
    }
}



/*chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log(message);

    if (message.text == "addtab") {
        addTab();
    }
}*/




function newLater(tab, parentID) {
    if (!tab) return;

    var tc = document.getElementById(parentID);
    var lict = document.createElement("div")
    var li = document.createElement("li");
    var div = document.createElement("div");
    var button = document.createElement("button");
    var del = document.createElement("img");

    // 设置删除图标样式及鼠标事件
    del.style.display = "block";
    del.width = 24;
    del.src = "img/x.png";
    del.style.float = "right";
    del.onmouseover = function() {
        del.src = "img/x_hover.png";
    }
    del.onmouseout = function() {
        del.src = "img/x.png";
    }
    del.parentID = parentID;
    del.onclick = removeTab;

    // 设置文本样式
    li.innerHTML = tab.title;
    //div.className += "tab-text";

    // 设置列表条目样式以及鼠标事件
    li.className += "tab-text";
    li.title = tab.title;
    li.href = tab.url;
    li.onclick = openTab;
    if (tab.clicked) {
        console.log(li);
        li.style.color = "#63645f";
    }
    var color = li.style.color;
    var background = li.style.background;



    lict.className = "tab-item";
    // 设置鼠标滑过后恢复原来样式
    lict.onmouseover = function() {
        //console.log("hover " + color);
        lict.style.background = background;
    }
    //console.log(tab.clicked);
    lict.insertBefore(li, lict.childNodes[0]);
    lict.insertBefore(del, lict.childNodes[0]);
    //li.append(del);
    tc.insertBefore(lict, tc.childNodes[0]);
}

//清除div节点下的所有子节点
function clearTabs(elmId) {
    var tc = document.getElementById(elmId);
    if (!tc) return;
    while (tc.hasChildNodes()) {
        tc.removeChild(tc.firstChild);
    }
}

function showTabs(tabs, parentID) {
    for (var i = 0; i < tabs.length; i++) {
        newLater(tabs[i], parentID);
    }
}

//判断对象是否已存在
function isAdded(tabs, tab) {
    if (tabs.length == 0) return false;
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url == tab.url) {
            return true;
        }
    }
    if (i == tabs.length) return false;
}

function removeTab() {

    if (this.parentID == "tabs-container") {
        var result = confirm("确定删除该条标签吗?");
        if (result) {
            // 获取删除图标的兄弟节点li的href属性
            var url = this.nextElementSibling.href;
            console.log("url: " + url);
            for (var i = 0; i < laterTabs.length; i++) {
                if (laterTabs[i].url == url) {
                    historyTabs.push(laterTabs[i]);
                    laterTabs.splice(i, 1);
                    break;
                }
            }
            chrome.storage.sync.set({ later_tabs: laterTabs, history_tabs: historyTabs }, function() {
                //console.log("added");
            });
            // 刷新显示Tabs和数据
            clearTabs("tabs-container");
            clearTabs("history-container");
            showTabs(laterTabs, "tabs-container");
            showTabs(historyTabs, "history-container");
            updateData();
        }
    } else if (this.parentID == "history-container") {
        var result = confirm("确定删除该条历史记录吗?");
        if (result) {
            // 获取删除图标的兄弟节点li的href属性
            var url = this.nextElementSibling.href;
            console.log("url: " + url);
            for (var i = 0; i < historyTabs.length; i++) {
                if (historyTabs[i].url == url) {
                    historyTabs.splice(i, 1);
                    break;
                }
            }
            chrome.storage.sync.set({ history_tabs: historyTabs }, function() {
                //console.log("added");
            });
            // 刷新显示Tabs和数据
            //clearTabs("tabs-container");
            clearTabs("history-container");
            //showTabs(laterTabs, "tabs-container");
            showTabs(historyTabs, "history-container");
            updateData();
        }

    }



}

function modifyTab(tabs, tab, newTab) {
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url == tab.url) {
            tabs[i] = newTab;
            break;
        }
    }
}

function findTab(tabs, tab) {
    var index = -1;
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url == tab.url) {
            index = i;
        }
    }
    return index;
}

function findTabByURL(tabs, url) {
    var index = -1;
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url == url) {
            index = i;
        }
    }
    return index;
}

function clearAllTabs() {
    if (laterTabs.length == 0) {
        alert("没有标签可清除");
        return;
    }
    var result = confirm("确定清除所有" + laterTabs.length + "条标签吗？");
    if (result) {
        // chrome.storage.sync.clear(function() {});
        // 将laterTabs数组里的所有对象移到historyTabs中，然后删除
        // 会出现historyTabs还没获得值，而laterTabs就已经被删掉的情况，是异步的缘故吗
        for (var i = laterTabs.length - 1; i >= 0; i--) {
            historyTabs.push(laterTabs[i]);
        }
        //historyTabs = laterTabs;
        //console.log(historyTabs);

        laterTabs.splice(0, laterTabs.length);

        chrome.storage.sync.set({ later_tabs: laterTabs, history_tabs: historyTabs }, function() {
            //console.log("added");
        });
        clearTabs("tabs-container");
        clearTabs("history-container");
        showTabs(historyTabs, "history-container");
        updateData();
    }
}

function addTab() {
    //console.log(currentTab.url.split("://")[0]);
    if (currentTab.url.split("://")[0] != "http" && currentTab.url.split("://")[0] != "https") {
        alert("禁止添加本地网页！");
        return;
    }

    var index = findTab(laterTabs, currentTab);
    if (index == -1) {
        laterTabs.push(currentTab);
        //console.log("have not this tab");
        chrome.storage.sync.set({ later_tabs: laterTabs }, function() {
            //console.log("added");
        });
        // 刷新显示Tabs
        clearTabs("tabs-container");
        showTabs(laterTabs, "tabs-container");
        updateData();
        chrome.storage.sync.get(["later_tabs"], function(tabs) {
            //console.log(tabs);
        });
    } else {
        var tc = document.getElementById("tabs-container");
        console.log(tc.children[tc.childNodes.length - 1 - index]);
        //console.log(index);
        // 高亮显示标签并提示。
        tc.children[tc.childNodes.length - 1 - index].style.background = "rgba(1, 219, 1, 0.5)";
        //tc.children[tc.childNodes.length - 1 - index].style.color = "rgb(13, 19, 20)";
        alert("标签已存在");
    }

}

function openTab() {

    // 找到url所对应的tab对象，并更新点击状态
    var index = findTabByURL(laterTabs, this.href)
    if (index != -1) {
        var newTab = laterTabs[index];
        newTab.clicked = true;
        modifyTab(laterTabs, laterTabs[index], newTab);
        chrome.storage.sync.set({ later_tabs: laterTabs }, function() {
            //console.log("added");
        });
    }


    // 向发送content.js发送消息
    var msg = {
        text: "opentab",
        url: this.href
    };
    //console.log(msg);
    chrome.tabs.sendMessage(currentTab.id, msg);

}

var isHistory = false;

function openHistory() {
    var tc = document.getElementById("tabs-container");
    var hc = document.getElementById("history-container");
    var history = document.getElementById("history");
    var empty = document.getElementById("empty");
    if (!isHistory) {
        isHistory = true;
        hc.style.display = "block";
        empty.style.display = "block";
        tc.style.display = "none";
        history.innerHTML = "查看所有标签(" + laterTabs.length + ")";
    } else {
        isHistory = false;

        tc.style.display = "block";
        empty.style.display = "none";
        hc.style.display = "none";
        history.innerHTML = "打开历史记录(" + historyTabs.length + ")";
    }
}

function emptyHistory() {
    if (historyTabs.length == 0) {
        alert("没有历史记录可删除");
        return;
    }
    var result = confirm("确定清除所有" + historyTabs.length + "条历史记录吗？");
    if (result) {
        historyTabs.splice(0, historyTabs.length);
        chrome.storage.sync.set({ history_tabs: historyTabs }, function() {
            //console.log("added");
        });
        clearTabs("history-container");
        updateData();
    }
}

window.onload = function() {
    var clear = document.getElementById("clear");
    clear.onclick = clearAllTabs;
    clear.innerHTML += "(" + laterTabs.length + ")"
    var add = document.getElementById("add");
    add.onclick = addTab;
    var history = document.getElementById("history");
    history.innerHTML += "(" + historyTabs.length + ")"
    history.onclick = openHistory;
    var empty = document.getElementById("empty");
    empty.onclick = emptyHistory;
}

function updateData() {
    var clear = document.getElementById("clear");
    clear.innerHTML = "清除所有标签(" + laterTabs.length + ")"
    var history = document.getElementById("history");
    history.innerHTML = "打开历史记录(" + historyTabs.length + ")"

}