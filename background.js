function onIconClick(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "toggleRedacted"
        });
    });
}

// Handle clicking on the chrome icon
chrome.browserAction.onClicked.addListener(function(tab) { onIconClick(); });
