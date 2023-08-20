/**
 * inspired by from https://codepen.io/Mobius1/pen/ZNgwbr
 * migrated to typescript
 * migrated to tsx preact component
 */

import { useRef, useEffect } from "preact/hooks"
import calendar from "../content/ORFTBackgrounds/calendar.json"


interface size {
    width: number,
    height: number,
}

interface configvcr {
    fps: number,
    miny: number, 
    maxy: number, 
    miny2: number,
    num: number,
    blur: number
}

interface innervcr {
    node: object,
    ctx: any, 
    config: configvcr
}

interface ivcr {
    vcr: innervcr
}

interface Iassets {
    name: string,
    url: string,
    image: any
}

/**
 * DEV
 * 0 = prod |  300 = show hydration dev mode
 */
const DEV_SHOW_HYDRATION = 50
//     { name: "tank", url: "/char1.jpeg", image: null },
const assetsToLoad: Iassets[] = [
    { name: "crt", url: "/crt.png", image: null  }
]

let randEvent = calendar.mode.calendar.items[Math.round(Math.random()*(calendar.mode.calendar.items.length-1))]
console.log(randEvent)
assetsToLoad.push({
    name: randEvent.date+"-"+randEvent.items[0].place+"-",
    url: calendar.mode.calendar.pictureDirectory+randEvent.items[0].picture,
    image: null
})

export function ORTFCanvas() {
    // REFERENCES CANVAS
    const HistoryCanvasRef: any = useRef()
    const EffectSnowCanvasRef: any = useRef()
    const EffectVCRCanvasRef: any = useRef()
    const CrtCanvasRef: any = useRef()
    // CONTEXTS
    let HistoryCanvasCTX: any = null
    let EffectSnowCanvasCTX: any = null
    let EffectVCRCanvasCTX: any = null
    let CrtCanvasCTX: any = null
    // SCRIPT VARS
    let windowDimensions: size = getWindowDimensions()
    let EffectsCanvas_rqAF: number = 0   
    let toggleHistoryCanvasEvent = true
    let elementsToResize: any = null
    let assets: any[] = []
    
    // CONFIG VARS
    const vcr_opacity = 0.9
    const snow_opacity = 0.3
    const vcrConfig: configvcr = { 
        fps: 24,
        miny: 20, 
        maxy: getWindowDimensions().height -20, 
        miny2: 30,
        num: 25,
        blur: 1.5
    } 

    const effects: ivcr = {
        vcr : { 
            node: EffectSnowCanvasRef.current, 
            ctx: EffectVCRCanvasCTX,  
            config: vcrConfig
        }
    };
        
    function getWindowDimensions() {
        const hasWindow: boolean = typeof window !== 'undefined'
        const width: number = hasWindow ? window.innerWidth : 0
        const height: number = hasWindow ? window.innerHeight : 0
        return {
            width,
            height,
        }
    }

    /** 
     * ------------------------- RequestAnimationFrame --------------------- 
     */
    let start: number = 0
    let delay: number = 0
    function drawBackgroundImage() {
        //cancelAnimationFrame(EffectsCanvas_rqAF) 
        clearInterval(EffectsCanvas_rqAF)
        start = Date.now() - start
        // if (EffectsCanvas_rqAF%100==0) console.log('elapsed (ms): ', start)
        HistoryCanvasCTX.drawImage(
            assets[1] , 0, 0, assets[1].width, assets[1].height, 
            0, 0, windowDimensions.width, windowDimensions.height)
        CrtCanvasCTX.drawImage(
            assets[0] , 0, 0, assets[0].width, assets[0].height, 
            0, 0, windowDimensions.width, windowDimensions.height) 
        generateSnow()
        renderTrackingNoise()
        //EffectsCanvas_rqAF = requestAnimationFrame(drawBackgroundImage)
        EffectsCanvas_rqAF = setInterval(drawBackgroundImage, (1000/vcrConfig.fps))
    }

    /**
     *  ----------------------------- effects --------------------------- 
     */

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Generate CRT noise
    function generateSnow() {
        var w = EffectSnowCanvasCTX.canvas.width,
            h = EffectSnowCanvasCTX.canvas.height,
            d = EffectSnowCanvasCTX.createImageData(w, h),
            b = new Uint32Array(d.data.buffer),
            len = b.length;
        for (var i = 0; i < len; i++) {
            b[i] = ((255 * Math.random()) | 0) << 24;
        }
        EffectSnowCanvasCTX.putImageData(d, 0, 0);
    }

    function renderTrackingNoise(radius:number = 2) {        
        const canvas = EffectVCRCanvasRef.current
        const config = effects.vcr.config
        let posy1 = config.miny || 0
        let posy2 = config.maxy || canvas.height
        let posy3 = config.miny2 || 0
        const num = config.num || 20

        canvas.style.filter = `blur(${config.blur}px)`
        EffectVCRCanvasCTX.clearRect(0, 0, canvas.width, canvas.height)
        EffectVCRCanvasCTX.fillStyle = `#fff`
        EffectVCRCanvasCTX.beginPath()
        for (let i:number = 0; i <= num; i++) {
            var x = Math.random() * i * canvas.width
            var y1 = getRandomInt(posy1+=3, posy2)
            var y2 = getRandomInt(0, posy3-=3)
            EffectVCRCanvasCTX.fillRect(x, y1, radius, radius)
            EffectVCRCanvasCTX.fillRect(x, y2, radius, radius)
            EffectVCRCanvasCTX.fill()
            renderTail(EffectVCRCanvasCTX, x, y1, radius)
            renderTail(EffectVCRCanvasCTX, x, y2, radius)
        }
        EffectVCRCanvasCTX.closePath()
    }

    function renderTail(ctx: any, x: number, y: number, radius: number) {
        const n = getRandomInt(1, 50)
        const dirs = [1, -1]
        let rd = radius
        const dir = dirs[Math.floor(Math.random() * dirs.length)]
        for (let i = 0; i < n; i++) {
            const step = 0.01
            let r = getRandomInt((rd -= step), radius)
            let dx = getRandomInt(1, 4)
            radius -= 0.1
            dx *= dir
            EffectVCRCanvasCTX.fillRect((x += dx), y, r, r)
            EffectVCRCanvasCTX.fill()
        }
    }

    /** 
     * ----------------------------- /effects -------------------------- 
     */

    function handleHistoryCanvasEvents() {
        if (DEV_SHOW_HYDRATION > 0 && toggleHistoryCanvasEvent == true) console.log("scroll")
        const header = document.querySelector("#page-header") as HTMLElement
        const page = document.documentElement
        const d: number = page.clientHeight - page.scrollTop - header.offsetHeight - DEV_SHOW_HYDRATION
        if (d < 0 && toggleHistoryCanvasEvent == true) {
            if (DEV_SHOW_HYDRATION > 0) console.log('dropping History Canvas Events')
            removeEventListener('resize', handleHistoryCanvasResize)
            toggleHistoryCanvasEvent = false
            //cancelAnimationFrame(EffectsCanvas_rqAF) 
            clearInterval(EffectsCanvas_rqAF) 
        }
        if (d >= 0 && toggleHistoryCanvasEvent == false) {
            if (DEV_SHOW_HYDRATION > 0) console.log('re-init History Canvas Events')
            windowDimensions = getWindowDimensions()
            if (HistoryCanvasRef.current.width != windowDimensions.width) handleHistoryCanvasResize()
            window.addEventListener('resize', handleHistoryCanvasResize)
            toggleHistoryCanvasEvent = true
            EffectsCanvas_rqAF = requestAnimationFrame(drawBackgroundImage)
        }
    }

    const handleHistoryCanvasResize = () => {
        if (DEV_SHOW_HYDRATION > 0) console.log('resize')
        windowDimensions = getWindowDimensions()
        elementsToResize.map( (element: any) => {
            element.width = windowDimensions.width 
            element.height = windowDimensions.height
        })
        drawBackgroundImage()    
    }

    let useEffectCalls = 0
    useEffect(() => {
        console.log("UseEffect call : ", ++useEffectCalls)
        console.log(`History Background is LOADED !!!!!!!!`)
        if (HistoryCanvasRef.current) { 
            console.log('HistoryCanvasRef ready')
            HistoryCanvasCTX = HistoryCanvasRef.current.getContext('2d')
        }if (CrtCanvasRef.current) {
            console.log('CrtCanvasRef ready')
            CrtCanvasCTX = CrtCanvasRef.current.getContext('2d')
        }if (EffectSnowCanvasRef.current){  
            console.log('EffectSnowCanvasRef ready')  
            EffectSnowCanvasRef.current.style.opacity = snow_opacity
            EffectSnowCanvasCTX = EffectSnowCanvasRef.current.getContext('2d')
        }
        if (EffectVCRCanvasRef.current) {
            console.log('EffectVCRCanvasRef ready')
            EffectVCRCanvasRef.current.style.opacity = vcr_opacity
            EffectVCRCanvasCTX = EffectVCRCanvasRef.current.getContext('2d')
        }

        if ( HistoryCanvasRef.current && CrtCanvasRef.current && EffectSnowCanvasRef.current &&EffectVCRCanvasRef.current) {
            elementsToResize = [
                HistoryCanvasRef.current,
                EffectSnowCanvasRef.current,
                EffectVCRCanvasRef.current,
                CrtCanvasRef.current
            ]
            let loadedAssets = 0
            assetsToLoad.map( (img) => {
                img.image = new Image()
                img.image.src = img.url
                img.image.onload = () => { 
                    console.log("loadedAsset "+loadedAssets, img.name)
                    assets[loadedAssets++] = img.image
                    if (loadedAssets == assetsToLoad.length) {
                        console.log('all assets loaded')
                        start = Date.now()
                        EffectsCanvas_rqAF = requestAnimationFrame(drawBackgroundImage) 
                    }
                }
            })
            console.log(assets)
        }
        
        window.addEventListener('resize', handleHistoryCanvasResize)
        document.addEventListener('scroll', handleHistoryCanvasEvents)
        // COMPOSANTS REGULAR EVENT REMOVE @DISMOUNT (dont proc atm)
        return(removeEventListener('scroll', handleHistoryCanvasEvents))
    }, [])

    return (
        <div id="screen">
        <canvas 
            id="history_canvas"
            height={windowDimensions.height}
            width={windowDimensions.width}
            style="position: absolute; width: 100%; height: 100%; filter: blur(1.5px) grayscale(80%); z-index:1;"
            ref={HistoryCanvasRef}
        ></canvas>
        <canvas 
            id="effects_snow"
            height={windowDimensions.height}
            width={windowDimensions.width}
            style="position: absolute; width: 100%; height: 100%; z-index:2; opacity: 1;"
            ref={EffectSnowCanvasRef}
        ></canvas>
        <canvas 
            id="effects_vcr"
            height={windowDimensions.height}
            width={windowDimensions.width}
            style="position: absolute; width: 100%; height: 100%; z-index:3; opacity: 1;"
            ref={EffectVCRCanvasRef}
        ></canvas>
        <canvas 
            id="crt"
            height={windowDimensions.height}
            width={windowDimensions.width}
            style="position: absolute; width: 100%; height: 100%; z-index:4; opacity: 1;"
            ref={CrtCanvasRef}
        ></canvas>
        <div 
            id="calendarContainer" 
            class="" 
            style="position: absolute; width: 40%; bottom: 10%; left: 30%; z-index:4; opacity: 1; border: solid 1px; border-radius: 20px; padding: 10px; background-color: rgba(5,5,5,0.5); display: block"
        >
            <div id="calendarContent">
                { randEvent.date } {randEvent.items[0].place} <br />
                <hr /><br />
                { randEvent.items[0].description }
            </div>
        </div>
        </div>      
    )
}
