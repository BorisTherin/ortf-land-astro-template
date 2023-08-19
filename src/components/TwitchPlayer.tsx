import { h } from 'preact'

export function TwitchPlayer() {

    function getWindowDimensions() {
        const hasWindow: boolean = typeof window !== 'undefined'
        const width: number = hasWindow ? window.innerWidth : 0
        const height: number = hasWindow ? window.innerHeight : 0
        return {
            width,
            height,
        }
    }
    
    let windowDimensions = getWindowDimensions()
  
    const embedTwitchScript = 'const widthRatio = 1.5;'+
    'const heightRatio = 2;'+
    'const inject = document.createElement("script");'+
    'inject.type = "text/javascript";'+
    'inject.src = "https://embed.twitch.tv/embed/v1.js";'+
    'inject.onload = () => { startTwitch() };'+
    'document.getElementById("twitch-embed").append(inject);'+
    'function startTwitch() {'+
        'embed = new Twitch.Embed("twitch-embed", {'+
            'width: '+(windowDimensions.width/1.5)+','+
            'height: '+(windowDimensions.height/2) +','+
            'channel: "lck",'+
            'layout: "video'+((windowDimensions.width>799)?"-and-chat":"")+'",'+
            'parent: ["embed.example.com", "othersite.example.com"]'+
        '});'+
        'embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {'+
            'var player = embed.getPlayer();'+
            'player.play();'+
            'console.log("TwitchPlayer: VIDEO_READY");'+
        '});'+
        'embed.addEventListener(Twitch.Embed.VIDEO_PLAY, () => {'+
            'document.getElementById("twitch-embed").style.opacity = 1;'+
            'console.log("TwitchPlayer: VIDEO_PLAY");'+
        '});'+
        'const embedDiv = document.getElementById("twitch-embed");'+        
        'for (var i=0; i < embedDiv.getElementsByTagName("iframe").length; i++) {'+
            'if (embedDiv.getElementsByTagName("iframe")[i].title == "Twitch") {'+
                'console.log("attaching resize Events on TwitchPlayer-frame["+i+"]");'+
                'const frameId = i;'+
                'window.addEventListener("resize", () => {'+
                    'embedDiv.getElementsByTagName("iframe")[frameId].width = window.innerWidth/widthRatio;'+
                    'embedDiv.getElementsByTagName("iframe")[frameId].height = (window.innerHeight/heightRatio);'+
                    'if (window.innerWidth < 800 && embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","layout=video") != embedDiv.getElementsByTagName("iframe")[frameId].src ) {'+
                        'embedDiv.getElementsByTagName("iframe")[frameId].src = embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","layout=video");'+
                        'console.log("switching player src");'+
                    '} else if (window.innerWidth > 800 && embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video-and-chat","") == embedDiv.getElementsByTagName("iframe")[frameId].src ) {'+
                        'embedDiv.getElementsByTagName("iframe")[frameId].src = embedDiv.getElementsByTagName("iframe")[frameId].src.replace("layout=video","layout=video-and-chat");'+
                        'console.log("switching player src");'+
                    '}'+
                '});'+
            '};'+
        '};'+
    '};'
    

    return (
        <>
            <div id="twitch-embed" class="absolute" style="opacity: 0.3; z-index:5;"></div>
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
