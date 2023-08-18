import { useRef, useEffect } from "preact/hooks"
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
    
    let { width, height } = { width: 0, height: 0 }
    let windowDimensions = getWindowDimensions()
    if (windowDimensions.width < 450) {
          width = 400
          height = 500
    } else {
        width = 800
        height = 400
    }

    return (
        <>
         {//<!-- Add a placeholder for the Twitch embed -->
         }
        <div id="twitch-embed" class="absolute" style="opacity: 0.3; z-index:5;"></div>
        
        {//<!-- Load the Twitch embed script -->
        //<!-- Create a Twitch.Embed object that will render within the "twitch-embed" element. -->
         }
        
         {
            h(
                'script',
                { type: 'text/javascript'},
                // twitch embed script injection (workaround error handling)
                'let twscript = document.createElement(\'script\');'+
                'twscript.src = \'https://embed.twitch.tv/embed/v1.js\';'+
                'twscript.onload = () => { startTwitchPlayer() };'+
                'twscript.onerror = (err) => { console.log(\'twscript error\', err)};'+
                'document.getElementById(\'twitch-embed\').appendChild(twscript);'+
                // original Twitch-Obj calls as a start function
                'function startTwitchPlayer() { '+
                'var embed = new Twitch.Embed(\'twitch-embed\', {'+
                'width: '+width+','+
                'height: '+height+','+
                'channel: \'radiojaune\','+
                'layout: \'video-and-chat\','+
                'autoplay: false,'+
                'parent: [\'embed.example.com\', \'radiojaune.com\']'+
                '});'+
                'embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {'+
                'var player = embed.getPlayer();'+
                'player.play();'+
                'embed.addEventListener(Twitch.Embed.VIDEO_PLAY, () => {'+
                'document.getElementById(\'twitch-embed\').style.opacity = 1;'+
                '});'+
                'window.addEventListener(\'resize\', () => {'+
                'document.getElementById(\'twitch-embed\').getElementsByTagName(\'iframe\')[0].width = window.innerWidth/1.5;'+
                'document.getElementById(\'twitch-embed\').getElementsByTagName(\'iframe\')[0].height = window.innerHeight/2;'+
                '});'+
                '})};'
            )}
        </>
    )
}


