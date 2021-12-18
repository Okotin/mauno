let language = "fi";

function newGame() {

	setTimeout(() => play(resources.sound.start[language]), 500);
	hide(".frame, .mask, .virus");
	unhide("#start");
	unhide("#game-container");

}

function prepareGame() {

	setLanguage("fi");

	$("#start__button-fi").onclick = () => setLanguage("fi") || play(resources.sound.start[language]);
	$("#start__button-en").onclick = () => setLanguage("en") || play(resources.sound.start[language]);
	$("#start__button-play").onclick = function() {
		play(resources.sound.putMask[language]);
		hide("#start");
		unhide("#put-mask");
	};

	$("#put-mask__button-no").onclick = function() {
		play(resources.sound.lose[language]);
		hide("#put-mask");
		unhide("#hmm, #lose__virus-nose, #lose__virus-mouth");
		setTimeout(function() {
			hide("#hmm");
			unhide("#lose");
		}, 1000);
	};
	$("#put-mask__button-bad").onclick = function() {
		play(resources.sound.lose[language]);
		const masks = [];
		$("#hmm .mask").forEach(e => e.classList.forEach(c => c.indexOf("mask-") === 0 && masks.push(c)));
		const mask = masks[Math.floor(Math.random() * masks.length)];
		hide("#put-mask");
		unhide("." + mask);
		unhide("#hmm");
		setTimeout(function() {
			hide("#hmm");
			unhide("#lose");
		}, 1000);
	};
	$("#put-mask__button-yes").onclick = function() {
		play(resources.sound.win[language]);
		hide("#put-mask");
		unhide("#win");
	}

	$("#lose__button-replay").onclick = function() {
		play(resources.sound.start[language]);
		hide("#lose, .mask, .virus");
		unhide("#start");
	};
	
	$("#win__button-replay").onclick = function() {
		play(resources.sound.start[language]);
		hide("#win");
		unhide("#start");
	};

	newGame();

}

function setLanguage(lang) {
	language = lang;
	hide(".text");
	unhide(".text-" + lang);
}


function $(s) {
	// If there's only one selector, the last word of which is an id, use querySelector and return the element itself.
	// Otherwise, return a NodeList.
	if (s.indexOf(",") === -1 && s.split(" ").at(-1)[0] === "#") {
		return document.querySelector(s);
	}
	return document.querySelectorAll(s);
}


function hide(s) {
	document.querySelectorAll(s).forEach(e => e.classList.add("hide"));
}

function unhide(s) {
	document.querySelectorAll(s).forEach(e => e.classList.remove("hide"));
}

function play(sound) {
	sound.cloneNode(true).play();
}

function loadStuff() {
	resources.loadSVG();
	resources.loadSounds();
}

window.onload = loadStuff;


const resources = {

	svgLoaded: 0,
	soundLoaded: 0,

	sound: {},

	sources: {
		svg: {
			start:   "start",
			putMask: "put-mask",
			hmm:     "hmm",
			lose:    "lose",
			win:     "win"
		},
		sound: {
			start:   { fi: "start-fi", en: "start-en" },
			putMask: { fi: "put-mask-fi", en: "put-mask-en"},
			lose:    { fi: "lose-fi", en: "lose-en"},
			win:     { fi: "win-fi",  en: "win-en"}
		}
	},

	loadSVG() {
		const path = "resources/svg/";
		const fileExt = ".svg";
		for (let key in this.sources.svg) {
			const src = path + this.sources.svg[key] + fileExt;
			load(src, cb);
		}
		function cb(txt) {
			document.getElementById("game-container").innerHTML += txt;
			resources.svgLoaded++;
			console.log("Loading in progress: " + (resources.loadProgress() * 100).toString().substring(0, 4) + " %");
			if (resources.loadProgress() === 1) prepareGame();
		}
	},

	loadSounds() {
		const path = "resources/sound/";
		const fileExt = ".ogg";
		
		for (let key in this.sources.sound) {
			const sound = this.sources.sound[key];	// Either a string or an object containing strings for different languages
			if (typeof sound === "object") {
				this.sound[key] = {};
				for (let lang in sound) {
					const soundObj = new Audio(path + sound[lang] + fileExt);
					this.sound[key][lang] = soundObj;
					soundObj.onloadeddata = cb;
					// console.log(sound)
				}
			} else {
				const soundObj = new Audio(path + sound + fileExt);
				this.sound[key] = soundObj;
				soundObj.onloadeddata = cb;
			}
		}

		function cb() {
			resources.soundLoaded++;
			console.log("Loading in progress: " + (resources.loadProgress() * 100).toString().substring(0, 4) + " %");
			if (resources.loadProgress() === 1) prepareGame();
		}
	},

	loadProgress() {
		const totalSVG = Object.keys(this.sources.svg).length;
		const totalSound = Object.values(this.sources.sound).reduce((p, c) => (typeof c === "object" ? Object.keys(c).length : 1) + p, 0);
		return (this.svgLoaded + this.soundLoaded) / (totalSVG + totalSound);
	}

}


function load(src, cb) {
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if (this.status === 200) {
			cb(this.responseText);
		}
	}
	xhttp.open("GET", src, true);
	xhttp.send();
}