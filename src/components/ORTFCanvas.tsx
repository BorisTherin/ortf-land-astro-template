/**
 * inspired by from https://codepen.io/Mobius1/pen/ZNgwbr
 * migrated to typescript
 * migrated to tsx preact component
 */

import { useRef, useEffect } from "preact/hooks"
import { h } from "preact"

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
/**
 * EFFECT CONSTANTS
 */

/**
 * DEV
 * 0 = prod |  300 = show hydration dev mode
 */
const DEV_SHOW_HYDRATION = 50

interface Iassets {
    name: string,
    url: string,
    image: any, 
}

const assets: Iassets[] = [
    {
        name: "tank",
        url: "/char.jpeg",
        image: null
    },
    {
        name: "crt",
        url: "/crt.png",
        image: null
    }
]

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
    let vcrInterval: any = 0 
    let toggleHistoryCanvasEvent = true

    // CONFIG VARS
    const vcr_opacity = 0.9
    const snow_opacity = 0.3
    const vcrConfig: configvcr = { 
        fps: 70,
        miny: 100, 
        maxy: getWindowDimensions().height, 
        miny2: 30,
        num: 25,
        blur: 1.5
    } 

    let effects: ivcr = {
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

    function drawBackgroundImage() {
        cancelAnimationFrame(EffectsCanvas_rqAF) 
        HistoryCanvasCTX.drawImage(
            assets[0].image , 0, 0, assets[0].image.width, assets[0].image.height, 
            0, 0, windowDimensions.width, windowDimensions.height)
        
        CrtCanvasCTX.drawImage(
            assets[1].image , 0, 0, assets[1].image.width, assets[1].image.height, 
            0, 0, windowDimensions.width, windowDimensions.height)
        
        generateSnow()
        generateVCRNoise()        
        EffectsCanvas_rqAF = requestAnimationFrame(drawBackgroundImage)
    }

    const handleHistoryCanvasResize = () => {
        if (DEV_SHOW_HYDRATION > 0) console.log('resize')
        windowDimensions = getWindowDimensions()
        HistoryCanvasRef.current.height = windowDimensions.height
        HistoryCanvasRef.current.width = windowDimensions.width    
        EffectSnowCanvasRef.current.height = windowDimensions.height
        EffectSnowCanvasRef.current.width = windowDimensions.width  
        EffectVCRCanvasRef.current.height = windowDimensions.height
        EffectVCRCanvasRef.current.width = windowDimensions.width  
        CrtCanvasRef.current.width = windowDimensions.width 
        CrtCanvasRef.current.height = windowDimensions.height
        drawBackgroundImage()    
    }

    function handleHistoryCanvasEvents() {
        if (DEV_SHOW_HYDRATION > 0 && toggleHistoryCanvasEvent == true) console.log("scroll")
        const header = document.querySelector("#page-header") as HTMLElement
        const page = document.documentElement
        const d: number = page.clientHeight - page.scrollTop - header.offsetHeight - DEV_SHOW_HYDRATION
        if (d < 0 && toggleHistoryCanvasEvent == true) {
            if (DEV_SHOW_HYDRATION > 0) console.log('dropping History Canvas Events')
            removeEventListener('resize', handleHistoryCanvasResize)
            toggleHistoryCanvasEvent = false
            cancelAnimationFrame(EffectsCanvas_rqAF) 
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

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function generateVCRNoise() {            
            // console.log("noise")
        const canvas = effects.vcr.node;
        const config = effects.vcr.config;
        const div = effects.vcr.node;
        //renderTrackingNoise();

        if ( config.fps >= 60 ) {
            cancelAnimationFrame(vcrInterval);
            const animate = () => {
                renderTrackingNoise();
                //vcrInterval = requestAnimationFrame(animate);
            };
            
            animate();
        } /* else {
            clearInterval(vcrInterval);
            vcrInterval = setInterval(() => {
                renderTrackingNoise();
            }, 1000 / config.fps);
        } */

    }
    
    // Generate CRT noise
    function generateSnow() {
        //EffectSnowCanvasCTX.clearRect(0,0,windowDimensions.width,windowDimensions.height)
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

    function renderTrackingNoise(radius:number = 2, xmax?: number, ymax?: number) {
        
        const canvas = EffectVCRCanvasRef.current //effects.vcr.node;
        //const ctx = canvas.getContext('2d') // effects.vcr.ctx; CTX = canvasRef.current.getContext('2d')
        const config = effects.vcr.config;
        let posy1 = config.miny || 0;
        let posy2 = config.maxy || canvas.height;
        let posy3 = config.miny2 || 0;
        const num = config.num || 20;
                
        if ( xmax === undefined ) {
            xmax = canvas.width;
        }
        
        if ( ymax === undefined ) {
            ymax = canvas.height;
        }			
        
        canvas.style.filter = `blur(${config.blur}px)`;
        EffectVCRCanvasCTX.clearRect(0, 0, canvas.width, canvas.height);
        EffectVCRCanvasCTX.fillStyle = `#fff`;

        EffectVCRCanvasCTX.beginPath();
        for (let i:number = 0; i <= num; i++) {
            var x = Math.random() * i * xmax
            var y1 = getRandomInt(posy1+=3, posy2);
            var y2 = getRandomInt(0, posy3-=3);
            EffectVCRCanvasCTX.fillRect(x, y1, radius, radius);
            EffectVCRCanvasCTX.fillRect(x, y2, radius, radius);
            EffectVCRCanvasCTX.fill();

            renderTail(EffectVCRCanvasCTX, x, y1, radius);
            renderTail(EffectVCRCanvasCTX, x, y2, radius);
        }
        EffectVCRCanvasCTX.closePath();
    }

    function renderTail(ctx: any, x: number, y: number, radius: number) {
        const n = getRandomInt(1, 50);
        const dirs = [1, -1];
        let rd = radius;
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        for (let i = 0; i < n; i++) {
            const step = 0.01;
            let r = getRandomInt((rd -= step), radius);
            let dx = getRandomInt(1, 4);
            radius -= 0.1;
            dx *= dir;
            EffectVCRCanvasCTX.fillRect((x += dx), y, r, r);
            EffectVCRCanvasCTX.fill();
        }
    }

    let useEffectCalls = 0
    useEffect(() => {
        console.log(++useEffectCalls)
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
            let loadedAssets = 0
            assets.map( (img) => {
                img.image = new Image()
                img.image.src = img.url
                img.image.onload = () => { 
                    console.log("loadedAsset", img.name)
                    assets[loadedAssets].image = img.image
                    if (++loadedAssets == assets.length) {
                        console.log('all assets loaded')
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
        </div>      
    )
}
