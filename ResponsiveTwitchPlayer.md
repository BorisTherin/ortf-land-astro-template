# Make your Embeded Twitch Player pretty responsive 🔧
------------------------------------------------------

Twitch player isnt that bad, it's full reponsive when finishing the job as a frontend dev

## Goals
* we want our TwitchPlayer reponsive
	* at load
	* at resize (web) rotate (mobile)
	* we want to have the chat layout everTime it's possible
	* we dont want the video layer to cut
	


What we got from Twitch API Embedding Everything (https://dev.twitch.tv/docs/embed/everything/)
```js
<!-- Add a placeholder for the Twitch embed -->
<div id="twitch-embed"></div>

<!-- Load the Twitch embed JavaScript file -->
<script src="https://embed.twitch.tv/embed/v1.js"></script>

<!-- Create a Twitch.Embed object that will render within the "twitch-embed" element -->
<script type="text/javascript">
	new Twitch.Embed("twitch-embed", {
	width: 854,
	height: 480,
	channel: "monstercat",
	// Only needed if this page is going to be embedded on other websites
	parent: ["embed.example.com", "othersite.example.com"]
	});
</script>
```

This player is full responsive, depending its width, it will fold/unfold to keep at best in every screen.

* With the layout option : ```js layout: 'video-and-chat'``` the player will provide the chat, right or down the video depending the width, to fit into the best view.

But at the moment, the player wont be responsive with resize (web) or rotate (mobile), we need to attach events to detect resizing or rotation.

* Nothing really hard here

```js
const inject = document.createElement('script')
inject.type = "text/javascript"
inject.src = "https://embed.twitch.tv/embed/v1.js"
inject.onload = () => {
	new Twitch.Embed("twitch-embed", {
		width: 854,
		height: 480,
		channel: "monstercat",
		layout: "video-and-chat",
		// Only needed if this page is going to be embedded on other websites
		parent: ["embed.example.com", "othersite.example.com"]
	});
	window.addEventListener('resize', () => {
		...
	})
}
document.getElementById("twitch-embed").append(inject)
```

* The hard one is about what will u resize, as the player is injected with a remote script.
* Inspecting our DOM, we can observe the final injections, script & iframe tag in our ``` <div id="twitch-embed"></div> ```

```js
<div id="twitch-embed">
  <script src="https://embed.twitch.tv/embed/v1.js"></script>
  <iframe 
    src="https://embed.twitch.tv?autoplay=false&amp;channel=radiojaune&amp;height=400&amp;layout=video-and-chat&amp;parent=embed.example.com&amp;parent=radiojaune.com&amp;parent=localhost&amp;referrer=http%3A%2F%2Flocalhost%3A3000%2F&amp;width=800" 
    allowfullscreen="" 
    scrolling="no" 
    frameborder="0" 
    allow="autoplay; fullscreen" 
    title="Twitch" 
    sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" 
    width="472.6666666666667" 
    height="485.5"></iframe>
</div>
```

* what we want what is : 
	* get sure to hit the Twitch Player ```<iframe>```
	* attach our EventListeners
		* Twitch.Embed.VIDEO_READY
		* Twitch.Embed.VIDEO_PLAY
		* 'resize'

```js
const embedDiv = document.getElementById("twitch-embed");
for (var i=0; i < embedDiv.getElementsByTagName("iframe").length; i++) {
	if (embedDiv.getElementsByTagName("iframe")[i].title == "Twitch") {
		...
	}
}
```
# benefits: keep connected to Twitch-Api
----------------------------------------

* in my experience, such players are wanted on a basic (or not) landing page.
* watchin' for VIDEO_READY & VIDEO_PLAY is our key for any client-side design (opacity: 0.3 to 1 in this example, as i build my landing-page, with the payer to be on top of a canvas background)
* keep creative

```js
embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
		var player = embed.getPlayer();
		player.play();
		console.log("TwitchPlayer: VIDEO_READY");
	});
	embed.addEventListener(Twitch.Embed.VIDEO_PLAY, () => {
		document.getElementById("twitch-embed").style.opacity = 1;
		console.log("TwitchPlayer: VIDEO_PLAY");
	});
```

# The bad thing about TwitchPlayer & ```js layout: 'video-and-chat'```
--------------------------------------------------------------

* As we are able to have pretty responsive resized (web) or rotated (mobile) Player, But as we're providing ```layout: 'video-and-chat'``` we can observe the video layer being cut under a 800px screen size ...

* Unfortunatly, *layout* isnt an iframe property, but a script argument :
&lt;iframe src="...tv?autoplay=false&amp;channel=monstercat&amp;height=400&amp;**layout=video-and-chat**&amp;parent=..."

* we need to update, the best way we can (be sure to update once, not zounds) our iframe src tag, where js-layout options stand. 

* we will keep the original script arguments & only switch layout=...

```js
const iframe = embedDiv.getElementsByTagName("iframe")[frameId]
if (
	window.innerWidth < 800 && 
	iframe.src.replace("layout=video-and-chat","layout=video") != iframe.src 
	) {	// UPDATE ONCE (maybe 2)
		iframe.src = iframe.src.replace("layout=video-and-chat","layout=video");
		console.log("switching player src");
} else if (
	window.innerWidth > 800 && 
	iframe.src.replace("layout=video-and-chat","") == iframe.src 
	) { // UPDATE ONCE 
		iframe.src = iframe.src.replace("layout=video","layout=video-and-chat");
		console.log("switching player src");
}
```

# Final script ✅
-----------------

* Everythings full responsive TwitchPlayer

```js
// SOME CONFIG VARS
const videoMinSize = 799
const playerWidthScreenRatio = 1.5;
const playerHeightScreenRatio = 2;
// TWITCH API SCRIPT INJECTION
const inject = document.createElement("script");
inject.type = "text/javascript";
inject.src = "https://embed.twitch.tv/embed/v1.js";
inject.onload = () => { startTwitch() };
document.getElementById("twitch-embed").append(inject);
// PLAYER INITIALISATION & DEDICATED LISTENERS
function startTwitch() {
	embed = new Twitch.Embed("twitch-embed", {
		width: (windowDimensions.width/1.5),
		height: (windowDimensions.height/2),
		channel: "monstercat",
		layout: "video"+((windowDimensions.width>videoMinSize)?"-and-chat":""),
		parent: ["embed.example.com", "othersite.example.com"]
	});
	// TWITCH API
	embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
		var player = embed.getPlayer();
		player.play();
		console.log("TwitchPlayer: VIDEO_READY");
	});
	embed.addEventListener(Twitch.Embed.VIDEO_PLAY, () => {
		document.getElementById("twitch-embed").style.opacity = 1;
		console.log("TwitchPlayer: VIDEO_PLAY");
	});
	// MORE RESPONSIVTY (WEB)
	const embedDiv = document.getElementById("twitch-embed");      
	for (var i=0; i < embedDiv.getElementsByTagName("iframe").length; i++) {
		// FIND THE RIGHT NODE
		if (embedDiv.getElementsByTagName("iframe")[i].title == "Twitch") {
			console.log("attaching resize Events on TwitchPlayer-frame["+i+"]");
			const frameId = i;
			window.addEventListener("resize", () => {
				// IFRAME SIZES
				embedDiv.getElementsByTagName("iframe")[frameId].width = window.innerWidth/playerWidthScreenRatio;
				embedDiv.getElementsByTagName("iframe")[frameId].height = window.innerHeight/playerHeightScreenRatio;
				const iframe = embedDiv.getElementsByTagName("iframe")[frameId]
				// IFRAME SRC OPTIONS SWITCH 
				if (
					window.innerWidth < 800 && 
					iframe.src.replace("layout=video-and-chat","layout=video") != iframe.src 
					) {	// UPDATE ONCE
							iframe.src = iframe.src.replace("layout=video-and-chat","layout=video");
							console.log("switching player src");
					} else if (
						window.innerWidth > 800 && 
						iframe.src.replace("layout=video-and-chat","") == iframe.src 
					) { // UPDATE ONCE
							iframe.src = iframe.src.replace("layout=video","layout=video-and-chat");
							console.log("switching player src");
					}
			});
		};
	};
};
```

# &#127873; Feel free to git my preact component for 🚀Astro Island
-------------------------------------------------------------------

https://github.com/BorisTherin/ortf-land-astro-template/blob/main/src/components/TwitchPlayer.tsx
