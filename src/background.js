browser.menus.create({
    id: "ff-ext-yt-embed",
    title: "Open In Embedded Mode",
    contexts: ["link"]
});

browser.menus.onClicked.addListener(async function (info, tab) {

    if (info.menuItemId == "ff-ext-yt-embed") {
        if (info.linkUrl) {
            let embedPageUrl;
            if (info.linkUrl.includes("list=")) {
                let playlistIdStartingIndex = info.linkUrl.indexOf("list=") + 5;
                let playlistId = info.linkUrl.substring(playlistIdStartingIndex);
                embedPageUrl = "https://www.youtube.com/embed/videoseries?list=" + playlistId;
            } else {
                let videoIdStartingIndex = info.linkUrl.indexOf("v=") + 2;
                let videoId = info.linkUrl.substring(videoIdStartingIndex);
                if (videoId.includes("pp=")) {
                    videoId = videoId.substring(0, videoId.indexOf("&pp="));
                }
                embedPageUrl = "https://www.youtube.com/embed/" + videoId
            }
            await browser.tabs.create({
                'active': false, 'url': embedPageUrl, 'index': tab.index + 1
            });
        }
    }
});