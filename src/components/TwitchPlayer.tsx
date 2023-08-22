import { h } from 'preact'

export function TwitchPlayer() {

    function getWindowDimensions() {
        const hasWindow: boolean = typeof window !== 'undefined'
        const width: number = hasWindow ? window.innerWidth : 0
        const height: number = hasWindow ? window.innerHeight : 0
        return { width, height }
    }
    
    const windowDimensions = getWindowDimensions()
    /**
     *  CONFIG YOUR FLAVOR
     */
    const chatLayout = true                  // layout option [video|video-and-chat]
    const pixelRangeToSwitchSrcOptions = 799 // minimal pixel range to fire src option replacement when chatLayout=true (TwitchPlayer constraint (800), but may change), (windowDimensions.width+1 to disable)
    const widthRatio = 1.5                 // TwitchPlayer width screen ratio
    const heightRatio = 2                 // TwitchPlayer height screen ratio
    const channel = 'radiojaune'         // your channel
    const webUrls = '"embed.example.com", "othersite.example.com"'   // your network
    const autoplay = true              // Twitch.Embed.VIDEO_READY action
    const verbose = true              // console feedback on|off

    const embedTwitchScript = 'const widthRatio = '+widthRatio+';'+
    'const heightRatio = '+heightRatio+';'+
    'const inject = document.createElement("script");'+
    'inject.type = "text/javascript";'+
    'inject.src = "https://embed.twitch.tv/embed/v1.js";'+
    'inject.onload = () => { startTwitch() };'+
    'document.getElementById("twitch-embed").append(inject);'+
    'function startTwitch() {'+
        'embed = new Twitch.Embed("twitch-embed", {'+
            'width: '+(windowDimensions.width/1.5)+','+
            'height: '+(windowDimensions.height/2) +','+
            'channel: "'+channel+'",'+
            'layout: "video'+((windowDimensions.width>pixelRangeToSwitchSrcOptions && chatLayout)?"-and-chat":"")+'",'+
            'parent: ['+webUrls+']'+
        '});'+
        'embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {'+
            'var player = embed.getPlayer();'+
            ((autoplay)?'player.play();':'')+
            ((verbose)?'console.log("TwitchPlayer: VIDEO_READY");':'')+
        '});'+
        'embed.addEventListener(Twitch.Embed.VIDEO_PLAY, () => {'+
            'document.getElementById("twitch-embed").style.opacity = 1;'+
            'document.getElementById("calendarContainer").style.display = "none";'+
            ((verbose)?'console.log("TwitchPlayer: VIDEO_PLAY");':'')+
        '});'+
        'const embedDiv = document.getElementById("twitch-embed");'+        
        'for (var i=0; i < embedDiv.getElementsByTagName("iframe").length; i++) {'+
            'if (embedDiv.getElementsByTagName("iframe")[i].title == "Twitch") {'+
                // ((verbose)?'console.log("attaching resize Events on TwitchPlayer-frame["+i+"]");':'')+
                'const frameId = i;'+
                'embedDiv.getElementsByTagName("iframe")[frameId].width = "100%";'+
                'embedDiv.getElementsByTagName("iframe")[frameId].height = "100%";'+
                'const chatLayout = '+chatLayout+';'+
                /*
                'window.addEventListener("resize", () => {'+
                    'embedDiv.getElementsByTagName("iframe")[frameId].width = window.innerWidth/widthRatio;'+
                    'embedDiv.getElementsByTagName("iframe")[frameId].height = (window.innerHeight/heightRatio);'+
                    'if (chatLayout && window.innerWidth < 800 && embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","layout=video") != embedDiv.getElementsByTagName("iframe")[frameId].src ) {'+
                        'embedDiv.getElementsByTagName("iframe")[frameId].src = embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","layout=video");'+
                        ((verbose)?'console.log("switching player src");':'')+
                    '} else if (chatLayout && window.innerWidth > 800 && embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","") == embedDiv.getElementsByTagName("iframe")[frameId].src ) {'+
                        'embedDiv.getElementsByTagName("iframe")[frameId].src = embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video","layout=video-and-chat");'+
                        ((verbose)?'console.log("switching player src");':'')+
                    '}'+
                '});'+
                */
            '};'+
        '};'+
    '};'

    return (
        <>
            <div id="twitch-embed" class="absolute grid justify-items-center items-center min-w-[80%] min-h-[50%]" style="opacity: 0.3; z-index:5;"></div>
            {
                h(
                    'script',
                    { type: 'text/javascript'},
                    embedTwitchScript
                )
            }
        </>
    )
}