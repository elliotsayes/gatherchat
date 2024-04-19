// Source page:
// https://masterpose.itch.io/pixelduuuuudesmaker
// Source link:
// https://html-classic.itch.zone/html/2463959/app.js

var gHash = "";
var gCanvas = document.getElementById("c");
gCanvas.width = 16;
gCanvas.height = 24;
var gCtx = gCanvas.getContext("2d");
gCtx.mozImageSmoothingEnabled = false;
gCtx.webkitImageSmoothingEnabled = false;
var texCount = 0;
function onTexload() {
	texCount++;
	if (texCount === 2) {
		start();
		document.getElementById("all").className = "";
	}
}
var gTex = new Image();
gTex.onload = onTexload;
gTex.src = "parts.png";
var gBaseTex = new Image();
gBaseTex.onload = onTexload;
gBaseTex.src = "base.png";
var gStep = 0;
var gCurrentAnim = "run";
var gSrcCanvas =
	document.getElementById("src") || document.createElement("canvas");
gSrcCanvas.width = 16 * 7;
gSrcCanvas.height = 24 * 4;
var gSrcCtx = gSrcCanvas.getContext("2d");
gCtx.mozImageSmoothingEnabled = false;
gCtx.webkitImageSmoothingEnabled = false;
var SHAPE_OPTIONS = [
	{ key: "face", y: 2, max: 25 }, //13 default
	{ key: "head", y: 0, max: 44 }, //28 default
];
var ANIMATIONS = {
	no_anim: { len: 1, y: 0 },
	idle: { len: 4, y: 1 },
	run: { len: 4, y: 2 },
	jump: { len: 7, y: 3 },
};
var HEAD_ORIGINS = [
	[0],
	[0, 1, 2, 1],
	[-1, -2, 0, 1],
	[-1, -1, -1, 1, 2, 1, 0],
];
EYES_ORIGINS = HEAD_ORIGINS;
function draw16(e, a, t, r, n, c) {
	var i = 16;
	var o = 20;
	var d = 4;
	e.drawImage(r, (n || 0) * i, (c || 0) * o, i, o, a, t + d, i, o);
}
var gInputs = {};
function readVal(e) {
	gInputs[e] = gInputs[e] || document.querySelector("[data-" + e + "]");
	return gInputs[e].value | 0;
}
function writeVal(e, a) {
	gInputs[e] = gInputs[e] || document.querySelector("[data-" + e + "]");
	gInputs[e].value = a | 0;
}
function drawShape(e, a, t, r, n) {
	var c = false;
	if (t == 4 && r == 2) {
		if (a == 1) {
			if (a == 2 && e == 2) {
				draw16(gSrcCtx, e * 16, a * 24 + 0, gTex, 4, 4);
				c = true;
			} else if (a == 1 && e == 1) {
				draw16(gSrcCtx, e * 16, a * 24 + 1, gTex, 4, 4);
				c = true;
			} else if (a == 1 && e == 2) {
				draw16(gSrcCtx, e * 16, a * 24 + 2, gTex, 5, 4);
				c = true;
			} else if (a == 1 && e == 3) {
				draw16(gSrcCtx, e * 16, a * 24 + 1, gTex, 4, 4);
				c = true;
			}
		} else if (a == 3) {
			draw16(gSrcCtx, e * 16, a * 24 + EYES_ORIGINS[3][e], gTex, 4, 4);
			c = true;
		}
	} else if (t == 6 && r == 0) {
		if (a == 1 && (e == 1 || e == 3)) {
			draw16(gSrcCtx, e * 16, a * 24 + HEAD_ORIGINS[1][e], gTex, 6, 4);
			c = true;
		} else if (a == 1 && e == 2) {
			draw16(gSrcCtx, e * 16, a * 24 + HEAD_ORIGINS[1][e], gTex, 7, 4);
			c = true;
		} else if (a == 2 && e == 3) {
			draw16(gSrcCtx, e * 16, a * 24 + HEAD_ORIGINS[1][e], gTex, 6, 4);
			c = true;
		} else if (a == 3 && e == 2) {
			draw16(gSrcCtx, e * 16, a * 24 + 2, gTex, 8, 4);
			c = true;
		} else if (a == 3 && (e == 5 || e == 3)) {
			draw16(gSrcCtx, e * 16, a * 24 + HEAD_ORIGINS[3][e], gTex, 6, 4);
			c = true;
		} else if (a == 3 && e == 4) {
			draw16(gSrcCtx, e * 16, a * 24 + HEAD_ORIGINS[3][e], gTex, 7, 4);
			c = true;
		} else if (a == 3 && e == 1) {
			draw16(gSrcCtx, e * 16, a * 24 + 2, gTex, 9, 4);
			c = true;
		}
	} else if (t == 8 && r == 3) {
		if ((e == 1 || e == 3) && a == 3) {
			draw16(gSrcCtx, e * 16, a * 24 + EYES_ORIGINS[3][e], gTex, 10, 4);
			c = true;
		}
		if (e == 2 && a == 3) {
			draw16(gSrcCtx, e * 16, a * 24 + EYES_ORIGINS[3][e], gTex, 11, 4);
			c = true;
		}
	} else if (t == 13 && (r == 0 || r == 1)) {
		drawShape(e, a, 6, r, n);
		drawShape(e, a, 12, r, n);
		c = true;
	} else if (t == 14 && (r == 0 || r == 1)) {
		drawShape(e, a, 10, r, n);
		drawShape(e, a, 12, r, n);
		c = true;
	} else if (t == 15 && (r == 0 || r == 1)) {
		drawShape(e, a, 7, r, n);
		drawShape(e, a, 12, r, n);
		c = true;
	} else if (t == 23 && (r == 0 || r == 1)) {
		drawShape(e, a, 6, r, n);
		drawShape(e, a, 22, r, n);
		c = true;
	} else if (t == 24 && (r == 0 || r == 1)) {
		drawShape(e, a, 7, r, n);
		drawShape(e, a, 22, r, n);
		c = true;
	}
	if (!c) {
		draw16(gSrcCtx, e * 16, a * 24 + n[e], gTex, t, r);
	}
}
var gLastHash = null;
function recalcVal(e, a, t, r) {
	for (y = 0; y < r.length; y++) {
		var n = r[y];
		for (x = 0; x < n.length; x++) {
			drawShape(x, y, readVal(e), t, n);
		}
	}
}
function recalc() {
	var e = serialize();
	if (gLastHash === e) {
		return;
	}
	gLastHash = e;
	window.location.hash = e;
	gSrcCtx.clearRect(0, 0, gSrcCanvas.width, gSrcCanvas.height);
	gSrcCtx.drawImage(gBaseTex, 0, 0);
	recalcVal("face", EYES_ORIGINS.length, 3, EYES_ORIGINS);
	recalcVal("head", HEAD_ORIGINS.length, 0, HEAD_ORIGINS);
	recalcVal("head", EYES_ORIGINS.length, 1, HEAD_ORIGINS);
	recalcVal("face", EYES_ORIGINS.length, 2, EYES_ORIGINS);
	recolorAll();
	var a = document.getElementById("export_btn");
	a.href = gSrcCanvas.toDataURL("image/png");
	a.download = e + ".png";
	document.getElementById("serialized_input").value = e;
}
window.onhashchange = function () {
	try {
		deserialize(window.location.hash);
	} catch (e) {}
	recalc();
};
function randomize() {
	var e = Date.now();
	var a = document.getElementById("options");
	var t = a.querySelectorAll("input");
	for (var r = 0; r < t.length; r++) {
		var n = t[r];
		var c = parseInt(n.getAttribute("max"));
		n.value = Math.floor(Math.random() * (c + 1));
	}
	var i = Date.now();
	recalc();
}
var colorThemes = [
	{
		key: "eyes",
		defaults: ["ee7755"],
		options: [
			["222033"],
			["178178"],
			["7722ab"],
			["346524"],
			["5a8ca6"],
			["fafafa"],
			["ababab"],
			["751f20"],
			["da4e38"],
			["000000"],
		],
	},
	{
		key: "skin",
		defaults: ["cccc77", "aaaa55", "888844"],
		options: [
			//[Light, Medium, Dark],
			["cccc77", "aaaa55", "888844"],
			["f0f0dd", "d1d1c2", "b1b1b1"],
			["ccccbe", "877d78", "675d58"],
			["e6d1bc", "d9af83", "b98f73"],
			["cb9f76", "af8055", "8f6035"],
			["a47d5b", "7c5e46", "5c3e56"],
			["7a3333", "56252f", "36051f"],
			["686e46", "505436", "303416"],
			["dcb641", "aa6622", "8a4602"],
			["72b8e4", "5d96ba", "3d76aa"],
			["aa4951", "8a344d", "6a142d"],
			["887777", "554444", "775555"],
			["434343", "353535", "3e3e3e"],
			["6cb832", "3c8802", "4c9812"],
		],
	},
	{ key: "suit", defaults: ["7722aa", "552277"], options: "item" },
	{
		key: "item",
		defaults: ["dd77bb", "aa5599", "eebbee"],
		options: [
			//[Medium, Dark, Light]
			["91804c", "726641", "b9a156"],
			["ccaa44", "aa6622", "c89437"],
			["facb3e", "ee8e2e", "fdf7ed"],
			["d04648", "aa3333", "caacac"],
			["a9b757", "828a58", "c1cd74"],
			["4ba747", "3d734f", "79f874"],
			["f0f0dd", "d1d1c2", "fdfdfb"],
			["944a9c", "5a3173", "ae68b6"],
			["447ccf", "3d62b3", "69b7d8"],
			["72d6ce", "5698cc", "fdf7ed"],
			["3e3e3e", "353535", "434343"],
		],
	},
	{
		key: "hair",
		defaults: ["eeeeee", "cccccc"],
		options: [
			["ebebeb", "c7c7c7"],
			["e4da99", "d9c868"],
			["b62f31", "751f20"],
			["cc7733", "bb5432"],
			["4d4e4c", "383839"],
		],
	},
];
colorThemes.forEach(function (e) {
	if (typeof e.options === "string") {
		e.options = colorThemes.find(function (a) {
			return a.key === e.options;
		}).options;
	}
});
function pad2(e) {
	return ("00" + e.toString(16)).slice(-2);
}
function hexToArr(e) {
	return [
		parseInt(e.slice(0, 2), 16),
		parseInt(e.slice(2, 4), 16),
		parseInt(e.slice(4, 6), 16),
	];
}
function applyTheme(e, a, t) {
	for (var r = 0; r < a.length; r++) {
		var n = a[r];
		var c = hexToArr(t[r]);
		for (var i = 0; i < e.length; i += 4) {
			var o = pad2(e[i]) + pad2(e[i + 1]) + pad2(e[i + 2]);
			if (e[i + 3] == 255 && o === n) {
				e[i + 0] = c[0];
				e[i + 1] = c[1];
				e[i + 2] = c[2];
			}
		}
	}
}
function recolorAll() {
	var e = gSrcCtx.getImageData(0, 0, gSrcCanvas.width, gSrcCanvas.height);
	var a = e.data;
	for (var t = 0; t < colorThemes.length; t++) {
		var r = colorThemes[t];
		var n = r.options[readVal(r.key)];
		applyTheme(a, r.defaults, n);
	}
	gSrcCtx.putImageData(e, 0, 0);
}
function getKey(e) {
	return e.key;
}
var serializeParams = SHAPE_OPTIONS.map(getKey).concat(colorThemes.map(getKey));
function serialize() {
	var e = "a";
	return (
		e +
		serializeParams
			.map(function (e) {
				return pad2(readVal(e).toString(16));
			})
			.join("")
	);
}
function deserialize(e) {
	e = e.replace(/^#/, "");
	var a = e[0];
	var t = e
		.slice(1)
		.match(/.{1,2}/g)
		.forEach(function (e, a) {
			writeVal(serializeParams[a], parseInt(e, 16));
		});
	recalc();
}
var gPrevCurrentAnim = "";
var gPrevAnimX = -1;
var gPrevAnimY = -1;
var stepMods = { _default: 8, jump: 6 };
function mainLoop() {
	var e = (gStep / (stepMods[gCurrentAnim] || stepMods._default)) | 0;
	var a = e % ANIMATIONS[gCurrentAnim].len;
	var t = ANIMATIONS[gCurrentAnim].y;
	if (
		gPrevCurrentAnim !== gCurrentAnim ||
		gPrevAnimX !== a ||
		gPrevAnimY !== t ||
		(gPrevCurrentAnim == "no_anim" && gStep % 10 == 0)
	) {
		gCtx.clearRect(0, 0, 16, 24);
		gCtx.drawImage(gSrcCanvas, a * 16, t * 24, 16, 24, 0, 0, 16, 24);
		gPrevCurrentAnim = gCurrentAnim;
		gPrevAnimX = a;
		gPrevAnimY = t;
	}
	gStep++;
	requestAnimationFrame(mainLoop);
}
function start() {
	colorThemes.forEach(function (e) {
		document
			.querySelector("[data-" + e.key + "]")
			.setAttribute("max", e.options.length - 1);
	});
	SHAPE_OPTIONS.forEach(function (e) {
		document.querySelector("[data-" + e.key + "]").setAttribute("max", e.max);
	});
	document.getElementById("randomize").addEventListener("click", randomize);
	var e = document.getElementById("options");
	e.addEventListener("change", recalc);
	e.addEventListener("input", recalc);
	document
		.getElementById("from_code_btn")
		.addEventListener("click", function e() {
			try {
				deserialize(document.getElementById("serialized_input").value);
			} catch (e) {
				throw e;
			}
		});
	document.getElementById("scale").addEventListener("change", function e() {
		gCanvas.className = "s" + document.getElementById("scale").value;
	});
	var a = document.getElementById("current_anim");
	a.value = gCurrentAnim;
	a.addEventListener("change", function e() {
		gCurrentAnim = this.value;
	});
	try {
		deserialize(window.location.hash);
	} catch (e) {
		randomize();
	}
	mainLoop();
}
