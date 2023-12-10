browser.menus.create({
    id: "ff-ext-yt-embed",
    title: "Open In Embedded Mode",
    contexts: ["link"]
});

browser.menus.onClicked.addListener(async function (info, tab) {
    
    if (extensionMenuItemClicked(info.menuItemId)) {
        if (info.linkUrl) {
            if (isYoutubeLink(info.linkUrl)) {
                let embedPageUrl;
                let youtubeUrlType = determineYoutubeUrlType(info.linkUrl);
                if (youtubeUrlType == "VIDEO") {
                    let videoId = findVideoId(info.linkUrl);
                    embedPageUrl = "https://www.youtube.com/embed/" + videoId;
                } else if (youtubeUrlType == "PLAYLIST") {
                    let playlistId = findPlaylistId(info.linkUrl);
                    embedPageUrl = "https://www.youtube.com/embed/videoseries?list=" + playlistId;
                }
                if (embedPageUrl) {
                    await browser.tabs.create({
                        'active': false, 'url': embedPageUrl, 'index': tab.index + 1
                    });
                }
            }
        }
    }
});

function extensionMenuItemClicked(menuItemId) {
    
    return menuItemId == "ff-ext-yt-embed";
}

function isYoutubeLink(url) {
    
    return url.includes("youtube.com");
}

function determineYoutubeUrlType(url) {
    
    let urlType = "UNKNOWN";

    if (url.includes("list=")) {
        urlType = "PLAYLIST";
    } else if (url.includes("v=")) {
        urlType = "VIDEO";
    }

    return urlType;
}

function findVideoId(url) {
    
    return getQueryStringParameter(url,"v");
}

function findPlaylistId(url) {
    
    return getQueryStringParameter(url,"list");
}

function getQueryStringParameter(url, queryStringParameterId) {
    
    let queryStringParameterValue;
    let queryStringParameterStartingIndex = url.indexOf(queryStringParameterId + "=") + queryStringParameterId.length + 1;
    let nextAmpersandIndex = url.substring(queryStringParameterStartingIndex).indexOf("&");

    if (nextAmpersandIndex == -1) {
        queryStringParameterValue = url.substring(queryStringParameterStartingIndex);
    } else {
        queryStringParameterValue = url.substr(queryStringParameterStartingIndex, nextAmpersandIndex);
    }
    
    return queryStringParameterValue;    
}