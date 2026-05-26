(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/NewtonCradleText.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewtonCradleText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const LETTERS = 'razzyshmazzy'.split('');
const SPRING_K = 0.08;
const DAMPING = 0.93;
const HOVER_TARGET = -5;
const LEAVE_IMPULSE = 4;
const RIPPLE_AMPLITUDE = 4;
const RIPPLE_DECAY = 0.6;
const RIPPLE_DELAY = 60; // ms per letter distance
function NewtonCradleText() {
    _s();
    const n = LETTERS.length;
    const spansRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const stateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        offsets: new Float64Array(n),
        velocities: new Float64Array(n),
        hovered: new Array(n).fill(false),
        activeIndex: -1,
        animating: false,
        rafId: null
    });
    const timersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewtonCradleText.useCallback[animate]": ()=>{
            const s = stateRef.current;
            let anyMoving = false;
            for(let i = 0; i < n; i++){
                const target = s.hovered[i] ? HOVER_TARGET : 0;
                const displacement = s.offsets[i] - target;
                const springForce = -SPRING_K * displacement;
                s.velocities[i] += springForce;
                s.velocities[i] *= DAMPING;
                s.offsets[i] += s.velocities[i];
                if (Math.abs(displacement) < 0.05 && Math.abs(s.velocities[i]) < 0.05) {
                    s.offsets[i] = target;
                    s.velocities[i] = 0;
                } else {
                    anyMoving = true;
                }
                const span = spansRef.current[i];
                if (span) {
                    span.style.transform = `translateY(${s.offsets[i]}px)`;
                }
            }
            if (anyMoving) {
                s.rafId = requestAnimationFrame(animate);
            } else {
                s.animating = false;
                s.rafId = null;
            }
        }
    }["NewtonCradleText.useCallback[animate]"], [
        n
    ]);
    const ensureAnimating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewtonCradleText.useCallback[ensureAnimating]": ()=>{
            const s = stateRef.current;
            if (!s.animating) {
                s.animating = true;
                s.rafId = requestAnimationFrame(animate);
            }
        }
    }["NewtonCradleText.useCallback[ensureAnimating]"], [
        animate
    ]);
    // Cursor enters a letter — raise it, gently lower the previous one
    const handleLetterEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewtonCradleText.useCallback[handleLetterEnter]": (index)=>{
            const s = stateRef.current;
            const prev = s.activeIndex;
            // Un-hover previous letter (gentle spring back, no fling)
            if (prev >= 0 && prev !== index) {
                s.hovered[prev] = false;
            }
            s.activeIndex = index;
            s.hovered[index] = true;
            s.velocities[index] -= 2; // small upward kick
            ensureAnimating();
        }
    }["NewtonCradleText.useCallback[handleLetterEnter]"], [
        ensureAnimating
    ]);
    // Cursor leaves the entire text — fling + ripple from last active letter
    const handleTextLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewtonCradleText.useCallback[handleTextLeave]": ()=>{
            const s = stateRef.current;
            const index = s.activeIndex;
            if (index < 0) return;
            s.hovered[index] = false;
            s.activeIndex = -1;
            // Downward fling
            s.velocities[index] += LEAVE_IMPULSE;
            ensureAnimating();
            // Propagate ripple outward
            for(let d = 1; d < n; d++){
                const amplitude = RIPPLE_AMPLITUDE * Math.pow(RIPPLE_DECAY, d);
                if (amplitude < 0.1) break;
                const timer = setTimeout({
                    "NewtonCradleText.useCallback[handleTextLeave].timer": ()=>{
                        const left = index - d;
                        const right = index + d;
                        if (left >= 0) s.velocities[left] += amplitude;
                        if (right < n) s.velocities[right] += amplitude;
                        ensureAnimating();
                    }
                }["NewtonCradleText.useCallback[handleTextLeave].timer"], d * RIPPLE_DELAY);
                timersRef.current.push(timer);
            }
        }
    }["NewtonCradleText.useCallback[handleTextLeave]"], [
        n,
        ensureAnimating
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewtonCradleText.useEffect": ()=>{
            return ({
                "NewtonCradleText.useEffect": ()=>{
                    const s = stateRef.current;
                    if (s.rafId !== null) cancelAnimationFrame(s.rafId);
                    timersRef.current.forEach(clearTimeout);
                }
            })["NewtonCradleText.useEffect"];
        }
    }["NewtonCradleText.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-block'
        },
        onMouseLeave: handleTextLeave,
        children: LETTERS.map((letter, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                ref: (el)=>{
                    spansRef.current[i] = el;
                },
                onMouseEnter: ()=>handleLetterEnter(i),
                style: {
                    display: 'inline-block',
                    cursor: 'pointer',
                    willChange: 'transform'
                },
                children: letter
            }, i, false, {
                fileName: "[project]/src/components/NewtonCradleText.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/NewtonCradleText.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(NewtonCradleText, "szRC1RC2itYvEdo8R2ua8Sk+QbM=");
_c = NewtonCradleText;
var _c;
__turbopack_context__.k.register(_c, "NewtonCradleText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NewtonCradleText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NewtonCradleText.tsx [app-client] (ecmascript)");
;
;
function Hero() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "hero",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hero-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "hero-name",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NewtonCradleText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 8,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Hero.tsx",
                lineNumber: 7,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Hero.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Hero.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/shelves.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BASELINE_SHELVES",
    ()=>BASELINE_SHELVES,
    "EDGE_SNAP_PX",
    ()=>EDGE_SNAP_PX,
    "SHELVES_CHANGED_EVENT",
    ()=>SHELVES_CHANGED_EVENT,
    "SHELVES_STORAGE_KEY",
    ()=>SHELVES_STORAGE_KEY,
    "loadShelves",
    ()=>loadShelves,
    "snapShelfToEdges",
    ()=>snapShelfToEdges
]);
const SHELVES_STORAGE_KEY = 'neco-shelves';
const SHELVES_CHANGED_EVENT = 'neco-shelves-changed';
const EDGE_SNAP_PX = 15;
function snapShelfToEdges(shelf, viewportWidth) {
    const x1 = shelf.x1 <= EDGE_SNAP_PX ? 0 : shelf.x1;
    const x2 = shelf.x2 >= viewportWidth - EDGE_SNAP_PX ? viewportWidth : shelf.x2;
    return {
        ...shelf,
        x1,
        x2
    };
}
// Named anchor Y values for key layout boundaries
const HERO_SHELF_Y = 373;
const QUOTE_TOP_Y = 788;
const QUOTE_BOTTOM_Y = 944;
// All shelves below are expressed as offsets from QUOTE_BOTTOM_Y
const REPO_TOP_Y = QUOTE_BOTTOM_Y + 0; // 944  — top of repos (same line)
const REPO_SHELF_Y = QUOTE_BOTTOM_Y + 479; // 1423 — shelf across repo grid
const REPO_MID_Y = QUOTE_BOTTOM_Y + 624; // 1568 — narrow shelf in repo grid
const ABOUT_TOP_Y = QUOTE_BOTTOM_Y + 693; // 1637 — about section top
const BASELINE_SHELVES = [
    {
        y: HERO_SHELF_Y,
        x1: 499,
        x2: 899
    },
    {
        y: QUOTE_TOP_Y,
        x1: 0,
        x2: 1400
    },
    {
        y: QUOTE_BOTTOM_Y,
        x1: 0,
        x2: 1400
    },
    {
        y: REPO_TOP_Y,
        x1: 131,
        x2: 1265
    },
    {
        y: REPO_SHELF_Y,
        x1: 133,
        x2: 1267
    },
    {
        y: REPO_MID_Y,
        x1: 640,
        x2: 756
    },
    {
        y: ABOUT_TOP_Y,
        x1: 432,
        x2: 967
    }
];
function loadShelves() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(SHELVES_STORAGE_KEY);
        if (raw === null) return BASELINE_SHELVES;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return BASELINE_SHELVES;
    } catch  {
        return BASELINE_SHELVES;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NecoWalker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NecoWalker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gifuct-js/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shelves.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const HEIGHT = 96;
const FALL_HEIGHT = 300;
const STARE_MS = 3000;
const DRAG_Z = 9999;
const NORMAL_Z = 3;
const MIN_FALL_DURATION = 200;
const G_PX_PER_MS2 = 0.002;
const RESCAN_INTERVAL = 5;
const WALK_MIN_MS = 5000;
const WALK_MAX_MS = 12000;
const STAND_PAUSE_MIN_MS = 1000;
const STAND_PAUSE_MAX_MS = 2500;
const EMOTE_DURATION_MS = 3000;
const EMOTE_MIN_COUNT = 1;
const EMOTE_MAX_COUNT = 3;
const RUN_SPEED_MULT = 2.2;
const STANDING_SRC = '/neco-stickers/neco-standing.webp';
const RUN_SRC = '/neco-stickers/neco-run.webp';
const EMOTE_SRCS = [
    '/neco-stickers/neco-dance.webp',
    '/neco-stickers/neco-dance-2.webp',
    '/neco-stickers/neco-dance-3.webp',
    '/neco-stickers/neco-hooray.webp',
    '/neco-stickers/neco-laugh.webp',
    '/neco-stickers/neco-scream.webp',
    '/neco-stickers/neco-shrug.webp',
    '/neco-stickers/neco-smart.webp',
    '/neco-stickers/neco-sulk.webp',
    '/neco-stickers/neco-whatever.webp',
    '/neco-stickers/neco-wine.webp',
    '/neco-stickers/neco-chill-2.webp',
    '/neco-stickers/neco-cmon.webp'
];
function randRange(min, max) {
    return min + Math.random() * (max - min);
}
function randInt(min, max) {
    return Math.floor(randRange(min, max + 1));
}
function NecoWalker() {
    _s();
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NecoWalker.useEffect": ()=>{
            if (!imgRef.current || !canvasRef.current) return;
            const img = imgRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const basePageY = img.getBoundingClientRect().top + window.scrollY;
            // ── shelves (only landing surfaces) ──
            let currentShelves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadShelves"])();
            const onShelvesChanged = {
                "NecoWalker.useEffect.onShelvesChanged": (e)=>{
                    const detail = e.detail;
                    if (Array.isArray(detail)) currentShelves = detail;
                }
            }["NecoWalker.useEffect.onShelvesChanged"];
            window.addEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHELVES_CHANGED_EVENT"], onShelvesChanged);
            // ── state ──
            let x = -HEIGHT;
            let fallY = 0;
            let direction = 1;
            let phase = 'idle';
            let isAnimating = false;
            let scrollFallDone = false;
            let rafId;
            let stareTimer = null;
            let lastCursorX = 0;
            let lastCursorY = 0;
            // idle sequence state
            let walkStartTime = 0;
            let walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
            let moveMode = 'walk';
            let emotesRemaining = 0;
            let lastEmoteIndex = -1;
            // drag state
            let grabOffsetX = 0;
            let grabOffsetY = 0;
            // fall animation state
            let fallStartY = 0;
            let fallDistance = 0;
            // Feet are always at canvas-bottom (basePageY + fallY + FALL_HEIGHT).
            const SNAP_THRESHOLD = 5;
            let fallDuration = 0;
            let fallStartTime = 0;
            let fallFrameOffset = 0;
            let rescanCounter = 0;
            // surface tracking
            let targetSurface = null;
            let landedSurface = null;
            // gif frame data
            let gifFrames = [];
            let gifWidth = 0;
            let gifHeight = 0;
            let compositeFrames = [];
            const baseSpeed = {
                "NecoWalker.useEffect.baseSpeed": ()=>(window.innerWidth + HEIGHT * 2) / (48 * 60)
            }["NecoWalker.useEffect.baseSpeed"];
            const moveSpeed = {
                "NecoWalker.useEffect.moveSpeed": ()=>moveMode === 'run' ? baseSpeed() * RUN_SPEED_MULT : baseSpeed()
            }["NecoWalker.useEffect.moveSpeed"];
            // Preload sticker images for smooth transitions
            [
                STANDING_SRC,
                RUN_SRC,
                ...EMOTE_SRCS
            ].forEach({
                "NecoWalker.useEffect": (src)=>{
                    const preload = new Image();
                    preload.src = src;
                }
            }["NecoWalker.useEffect"]);
            // ── decode gif frames ──
            fetch('/neco-falling.gif').then({
                "NecoWalker.useEffect": (r)=>r.arrayBuffer()
            }["NecoWalker.useEffect"]).then({
                "NecoWalker.useEffect": (buf)=>{
                    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGIF"])(buf);
                    gifFrames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decompressFrames"])(parsed, true);
                    gifWidth = parsed.lsd.width;
                    gifHeight = parsed.lsd.height;
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = gifWidth;
                    tempCanvas.height = gifHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    for(let i = 0; i < gifFrames.length; i++){
                        const frame = gifFrames[i];
                        if (i > 0) {
                            const prev = gifFrames[i - 1];
                            if (prev.disposalType === 2) {
                                tempCtx.clearRect(prev.dims.left, prev.dims.top, prev.dims.width, prev.dims.height);
                            }
                        }
                        const frameImageData = new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height);
                        const patchCanvas = document.createElement('canvas');
                        patchCanvas.width = frame.dims.width;
                        patchCanvas.height = frame.dims.height;
                        patchCanvas.getContext('2d').putImageData(frameImageData, 0, 0);
                        tempCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
                        compositeFrames.push(tempCtx.getImageData(0, 0, gifWidth, gifHeight));
                    }
                    canvas.width = gifWidth;
                    canvas.height = gifHeight;
                }
            }["NecoWalker.useEffect"]);
            // ── helpers ──
            function cancelSequence() {
                if (stareTimer) {
                    clearTimeout(stareTimer);
                    stareTimer = null;
                }
                isAnimating = false;
            }
            function startIdleSequence() {
                phase = 'standing';
                img.src = STANDING_SRC;
                applyImgTransform();
                emotesRemaining = randInt(EMOTE_MIN_COUNT, EMOTE_MAX_COUNT);
                lastEmoteIndex = -1;
                stareTimer = setTimeout(doNextEmote, randRange(STAND_PAUSE_MIN_MS, STAND_PAUSE_MAX_MS));
            }
            function doNextEmote() {
                if (emotesRemaining <= 0) {
                    resumeMoving();
                    return;
                }
                let idx;
                do {
                    idx = randInt(0, EMOTE_SRCS.length - 1);
                }while (idx === lastEmoteIndex && EMOTE_SRCS.length > 1)
                lastEmoteIndex = idx;
                phase = 'emoting';
                img.src = EMOTE_SRCS[idx];
                applyImgTransform();
                emotesRemaining--;
                stareTimer = setTimeout({
                    "NecoWalker.useEffect.doNextEmote": ()=>{
                        if (emotesRemaining > 0) {
                            // Brief standing pause between emotes
                            phase = 'standing';
                            img.src = STANDING_SRC;
                            applyImgTransform();
                            stareTimer = setTimeout(doNextEmote, randRange(500, 1200));
                        } else {
                            resumeMoving();
                        }
                    }
                }["NecoWalker.useEffect.doNextEmote"], EMOTE_DURATION_MS);
            }
            function resumeMoving() {
                direction = Math.random() < 0.5 ? -1 : 1;
                moveMode = Math.random() < 0.35 ? 'run' : 'walk';
                img.src = moveMode === 'run' ? RUN_SRC : '/neco-walk.gif';
                walkStartTime = performance.now();
                walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
                phase = 'walking';
                applyImgTransform();
            }
            // Shelves are her ONLY landing surfaces.
            // Returns the closest shelf below (or at, when inclusive) the char that
            // horizontally overlaps the char's footprint, or null.
            // Drops use inclusive=true (cursor exactly on a shelf y still counts).
            // Edge falls use inclusive=false (the shelf she just left must be excluded).
            function findNearestSurface(referenceY, charLeft, charRight, inclusive = false) {
                let nearest = null;
                for (const shelf of currentShelves){
                    if (inclusive ? shelf.y < referenceY : shelf.y <= referenceY) continue;
                    if (shelf.x2 <= charLeft || shelf.x1 >= charRight) continue;
                    if (nearest !== null && shelf.y >= nearest.y) continue;
                    nearest = {
                        y: shelf.y,
                        left: shelf.x1,
                        right: shelf.x2
                    };
                }
                return nearest;
            }
            function showImg() {
                img.style.display = '';
                img.style.pointerEvents = '';
                canvas.style.display = 'none';
            }
            function showCanvas() {
                img.style.display = 'none';
                canvas.style.display = '';
            }
            function drawFrame(index) {
                if (compositeFrames.length === 0) return;
                const clamped = Math.max(0, Math.min(index, compositeFrames.length - 1));
                ctx.putImageData(compositeFrames[clamped], 0, 0);
            }
            function applyCanvasTransform(posY) {
                const scaleX = direction === -1 ? -1 : 1;
                canvas.style.transform = `translateX(${x}px) translateY(${posY}px) scaleX(${scaleX})`;
            }
            function applyImgTransform() {
                const scaleX = direction === -1 ? -1 : 1;
                img.style.height = `${HEIGHT}px`;
                img.style.transform = `translateX(${x}px) translateY(${fallY}px) scaleX(${scaleX})`;
            }
            function getCharDisplayWidth() {
                return gifWidth > 0 ? FALL_HEIGHT / gifHeight * gifWidth : FALL_HEIGHT;
            }
            // ── unified fall function (shared by drag-drop and scroll-trigger) ──
            function beginFall(cursorX) {
                const fromDrop = cursorX !== null;
                const displayWidth = getCharDisplayWidth();
                // For drops: search reference = cursor Y (the user's release point).
                // For edge/scroll: search reference = canvas-bottom (pre-aligned by caller).
                // Canvas position is NOT changed — fallStartY = current fallY in both cases.
                const canvasBottomPageY = basePageY + fallY + FALL_HEIGHT;
                const searchRefY = fromDrop ? lastCursorY + window.scrollY : canvasBottomPageY;
                if (fromDrop) {
                    x = cursorX - displayWidth / 2;
                }
                const charLeft = x;
                const charRight = x + displayWidth;
                const surface = findNearestSurface(searchRefY, charLeft, charRight, fromDrop);
                if (!surface) {
                    targetSurface = null;
                    landedSurface = null;
                    fallY = canvasBottomPageY - basePageY - HEIGHT;
                    showImg();
                    img.style.zIndex = String(NORMAL_Z);
                    isAnimating = false;
                    resumeMoving();
                    return;
                }
                targetSurface = surface;
                fallStartY = fallY;
                // Canvas-bottom travels from its current position to the shelf.
                fallDistance = surface.y - canvasBottomPageY;
                // Snap when cursor is within SNAP_THRESHOLD of the shelf, OR when
                // canvas-bottom is already at or past the shelf (fallDistance <= 0 would
                // make fallDuration NaN and crash the animation).
                if (surface.y - searchRefY < SNAP_THRESHOLD || fallDistance <= 0) {
                    fallY = surface.y - basePageY - FALL_HEIGHT;
                    land();
                    return;
                }
                fallDuration = Math.max(MIN_FALL_DURATION, Math.sqrt(2 * fallDistance / G_PX_PER_MS2));
                fallStartTime = performance.now();
                fallFrameOffset = 0;
                rescanCounter = 0;
                phase = 'falling';
                isAnimating = true;
                landedSurface = null;
                showCanvas();
                canvas.style.height = `${FALL_HEIGHT}px`;
                canvas.style.width = 'auto';
                canvas.style.zIndex = String(DRAG_Z);
                drawFrame(0);
                applyCanvasTransform(fallY);
            }
            // ── landing ──
            function land() {
                phase = 'staring';
                landedSurface = targetSurface;
                targetSurface = null;
                // Adjust fallY so img bottom aligns with surface top
                if (landedSurface) {
                    fallY = landedSurface.y - basePageY - HEIGHT;
                }
                showImg();
                img.src = '/neco-stare.png';
                img.style.height = `${HEIGHT}px`;
                img.style.zIndex = String(NORMAL_Z);
                applyImgTransform();
                stareTimer = setTimeout({
                    "NecoWalker.useEffect.land": ()=>{
                        isAnimating = false;
                        resumeMoving();
                    }
                }["NecoWalker.useEffect.land"], STARE_MS);
            }
            // ── edge fall (walk off surface edge → fall to next surface) ──
            function triggerEdgeFall() {
                cancelSequence();
                // Adjust fallY from img HEIGHT to canvas FALL_HEIGHT, keeping bottom at surface top
                if (landedSurface) {
                    fallY = landedSurface.y - basePageY - FALL_HEIGHT;
                }
                landedSurface = null;
                beginFall(null);
            }
            // ── render loop ──
            function tick() {
                // ── walking phase ──
                if (phase === 'walking') {
                    if (landedSurface) {
                        // Walk on landed shelf — y is fixed page-coord
                        fallY = landedSurface.y - basePageY - HEIGHT;
                        x += moveSpeed() * direction;
                        // Edge detection: char center beyond shelf edge → fall
                        const charRect = img.getBoundingClientRect();
                        const charCenter = charRect.left + charRect.width / 2;
                        if (charCenter < landedSurface.left || charCenter > landedSurface.right) {
                            triggerEdgeFall();
                        } else {
                            applyImgTransform();
                        }
                    } else {
                        // No surface — walk across full viewport (pre-fall)
                        x += moveSpeed() * direction;
                        if (direction === 1 && x > window.innerWidth + HEIGHT) x = -HEIGHT;
                        if (direction === -1 && x < -HEIGHT) x = window.innerWidth + HEIGHT;
                        applyImgTransform();
                    }
                    // Random idle stop — only when on-screen
                    if (phase === 'walking' && x > 0 && x < window.innerWidth && performance.now() - walkStartTime > walkStopAfter) {
                        startIdleSequence();
                    }
                }
                // ── standing / emoting — anchor to shelf Y ──
                if ((phase === 'standing' || phase === 'emoting') && landedSurface) {
                    fallY = landedSurface.y - basePageY - HEIGHT;
                    applyImgTransform();
                }
                // ── falling phase ──
                if (phase === 'falling' && compositeFrames.length > 0) {
                    const elapsed = performance.now() - fallStartTime;
                    const tNorm = Math.min(elapsed / fallDuration, 1);
                    const posProgress = tNorm * tNorm; // quadratic ease-in
                    fallY = fallStartY + posProgress * fallDistance;
                    applyCanvasTransform(fallY);
                    // Map progress to frame index (offset preserves continuity after rescan)
                    const totalFrames = compositeFrames.length - 1;
                    const remainingFrames = totalFrames - fallFrameOffset;
                    const frameIndex = fallFrameOffset + Math.floor(posProgress * remainingFrames);
                    drawFrame(frameIndex);
                    // Live collision check — feet = canvas bottom
                    const feetPageY = basePageY + fallY + FALL_HEIGHT;
                    const surfacePageY = targetSurface ? targetSurface.y : Infinity;
                    if (feetPageY >= surfacePageY) {
                        // Canvas bottom reached shelf — final frame, then land
                        fallY = surfacePageY - basePageY - FALL_HEIGHT;
                        applyCanvasTransform(fallY);
                        drawFrame(totalFrames);
                        land();
                    } else if (posProgress >= 1) {
                        // Time expired — snap to target shelf
                        fallY = surfacePageY === Infinity ? fallStartY + fallDistance : surfacePageY - basePageY - FALL_HEIGHT;
                        applyCanvasTransform(fallY);
                        drawFrame(totalFrames);
                        land();
                    } else {
                        // Lightweight re-scan for closer shelves
                        rescanCounter++;
                        if (rescanCounter >= RESCAN_INTERVAL) {
                            rescanCounter = 0;
                            const displayWidth = getCharDisplayWidth();
                            const surface = findNearestSurface(feetPageY, x, x + displayWidth);
                            if (surface && surface.y < surfacePageY) {
                                // Closer shelf found — remap remaining fall
                                const currentFrame = Math.min(fallFrameOffset + Math.floor(posProgress * remainingFrames), totalFrames - 1);
                                fallFrameOffset = currentFrame;
                                fallStartY = fallY;
                                fallStartTime = performance.now();
                                fallDistance = surface.y - feetPageY;
                                fallDuration = Math.max(MIN_FALL_DURATION, Math.sqrt(2 * fallDistance / G_PX_PER_MS2));
                                targetSurface = surface;
                            }
                        }
                    }
                }
                rafId = requestAnimationFrame(tick);
            }
            // ── drag ──
            function startDrag(clientX, clientY) {
                cancelSequence();
                phase = 'dragging';
                landedSurface = null;
                const r = img.style.display === 'none' ? canvas.getBoundingClientRect() : img.getBoundingClientRect();
                grabOffsetX = clientX - r.left;
                grabOffsetY = clientY - r.top;
                lastCursorX = clientX;
                showCanvas();
                canvas.style.height = `${FALL_HEIGHT}px`;
                canvas.style.width = 'auto';
                canvas.style.zIndex = String(DRAG_Z);
                drawFrame(0);
                img.style.pointerEvents = 'none';
                // Apply initial canvas position immediately (before any mousemove)
                moveDrag(clientX, clientY);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('touchmove', onTouchMove, {
                    passive: false
                });
                document.addEventListener('touchend', onTouchEnd);
            }
            function moveDrag(clientX, clientY) {
                lastCursorX = clientX;
                lastCursorY = clientY;
                x = clientX - grabOffsetX;
                fallY = clientY - grabOffsetY + window.scrollY - basePageY;
                applyCanvasTransform(fallY);
            }
            function endDrag() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                // fallY left as-is — fall starts visually from where she was held.
                beginFall(lastCursorX);
            }
            // ── event handlers ──
            function onMouseDown(e) {
                e.preventDefault();
                startDrag(e.clientX, e.clientY);
            }
            function onMouseMove(e) {
                moveDrag(e.clientX, e.clientY);
            }
            function onMouseUp() {
                endDrag();
            }
            function onTouchStart(e) {
                if (e.touches.length !== 1) return;
                e.preventDefault();
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
            function onTouchMove(e) {
                if (e.touches.length !== 1) return;
                e.preventDefault();
                moveDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
            function onTouchEnd() {
                endDrag();
            }
            img.addEventListener('mousedown', onMouseDown);
            img.addEventListener('touchstart', onTouchStart, {
                passive: false
            });
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('touchstart', onTouchStart, {
                passive: false
            });
            // ── scroll handling ──
            if (window.scrollY >= 200) {
                walkStartTime = performance.now();
                phase = 'walking';
            }
            function onScroll() {
                if (phase === 'idle' && window.scrollY >= 200) {
                    walkStartTime = performance.now();
                    phase = 'walking';
                    return;
                }
                if (phase === 'walking' && !isAnimating && !scrollFallDone && x > 0) {
                    if (window.scrollY >= basePageY) {
                        scrollFallDone = true;
                        // Adjust fallY from img HEIGHT to canvas FALL_HEIGHT (keep bottom aligned)
                        fallY = fallY + HEIGHT - FALL_HEIGHT;
                        beginFall(null);
                    }
                }
            }
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            canvas.style.display = 'none';
            rafId = requestAnimationFrame(tick);
            return ({
                "NecoWalker.useEffect": ()=>{
                    window.removeEventListener('scroll', onScroll);
                    window.removeEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHELVES_CHANGED_EVENT"], onShelvesChanged);
                    cancelAnimationFrame(rafId);
                    cancelSequence();
                    img.removeEventListener('mousedown', onMouseDown);
                    img.removeEventListener('touchstart', onTouchStart);
                    canvas.removeEventListener('mousedown', onMouseDown);
                    canvas.removeEventListener('touchstart', onTouchStart);
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }
            })["NecoWalker.useEffect"];
        }
    }["NecoWalker.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                ref: imgRef,
                src: "/neco-walk.gif",
                alt: "",
                "aria-hidden": "true",
                className: "neco-walker",
                style: {
                    transform: 'translateX(-96px)'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoWalker.tsx",
                lineNumber: 608,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                "aria-hidden": "true",
                className: "neco-walker",
                style: {
                    display: 'none',
                    imageRendering: 'pixelated'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoWalker.tsx",
                lineNumber: 616,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(NecoWalker, "b93XHdRupPYPAq04ud0vy1vkBGY=");
_c = NecoWalker;
var _c;
__turbopack_context__.k.register(_c, "NecoWalker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NecoShelfEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NecoShelfEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shelves.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const MIN_WIDTH = 4;
function NecoShelfEditor() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shelves, setShelves] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const draftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const loadedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NecoShelfEditor.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHELVES_STORAGE_KEY"]);
                if (raw === null) {
                    setShelves(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASELINE_SHELVES"]);
                } else {
                    setShelves(JSON.parse(raw));
                }
            } catch  {
                setShelves(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASELINE_SHELVES"]);
            }
            loadedRef.current = true;
        }
    }["NecoShelfEditor.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NecoShelfEditor.useEffect": ()=>{
            if (!loadedRef.current) return;
            try {
                localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHELVES_STORAGE_KEY"], JSON.stringify(shelves));
            } catch  {}
            window.dispatchEvent(new CustomEvent(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHELVES_CHANGED_EVENT"], {
                detail: shelves
            }));
        }
    }["NecoShelfEditor.useEffect"], [
        shelves
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NecoShelfEditor.useEffect": ()=>{
            if (!editing) return;
            const onDown = {
                "NecoShelfEditor.useEffect.onDown": (e)=>{
                    const target = e.target;
                    if (target.closest('[data-neco-toolbar]')) return;
                    e.preventDefault();
                    const pageY = e.clientY + window.scrollY;
                    dragStartRef.current = {
                        x: e.clientX,
                        y: pageY
                    };
                    const next = {
                        y: pageY,
                        x1: e.clientX,
                        x2: e.clientX
                    };
                    draftRef.current = next;
                    setDraft(next);
                }
            }["NecoShelfEditor.useEffect.onDown"];
            const onMove = {
                "NecoShelfEditor.useEffect.onMove": (e)=>{
                    const start = dragStartRef.current;
                    if (!start) return;
                    const next = {
                        y: start.y,
                        x1: Math.min(start.x, e.clientX),
                        x2: Math.max(start.x, e.clientX)
                    };
                    draftRef.current = next;
                    setDraft(next);
                }
            }["NecoShelfEditor.useEffect.onMove"];
            const onUp = {
                "NecoShelfEditor.useEffect.onUp": ()=>{
                    dragStartRef.current = null;
                    const d = draftRef.current;
                    draftRef.current = null;
                    setDraft(null);
                    if (d && d.x2 - d.x1 >= MIN_WIDTH) {
                        const snapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapShelfToEdges"])({
                            y: Math.round(d.y),
                            x1: Math.round(d.x1),
                            x2: Math.round(d.x2)
                        }, window.innerWidth);
                        setShelves({
                            "NecoShelfEditor.useEffect.onUp": (prev)=>[
                                    ...prev,
                                    snapped
                                ]
                        }["NecoShelfEditor.useEffect.onUp"]);
                    }
                }
            }["NecoShelfEditor.useEffect.onUp"];
            window.addEventListener('mousedown', onDown);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
            return ({
                "NecoShelfEditor.useEffect": ()=>{
                    window.removeEventListener('mousedown', onDown);
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                }
            })["NecoShelfEditor.useEffect"];
        }
    }["NecoShelfEditor.useEffect"], [
        editing
    ]);
    const copyToClipboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NecoShelfEditor.useCallback[copyToClipboard]": ()=>{
            const json = JSON.stringify(shelves, null, 2);
            navigator.clipboard.writeText(json).then({
                "NecoShelfEditor.useCallback[copyToClipboard]": ()=>{
                    setCopied(true);
                    setTimeout({
                        "NecoShelfEditor.useCallback[copyToClipboard]": ()=>setCopied(false)
                    }["NecoShelfEditor.useCallback[copyToClipboard]"], 1500);
                }
            }["NecoShelfEditor.useCallback[copyToClipboard]"]);
        }
    }["NecoShelfEditor.useCallback[copyToClipboard]"], [
        shelves
    ]);
    const removeShelf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NecoShelfEditor.useCallback[removeShelf]": (index)=>{
            setShelves({
                "NecoShelfEditor.useCallback[removeShelf]": (prev)=>prev.filter({
                        "NecoShelfEditor.useCallback[removeShelf]": (_, i)=>i !== index
                    }["NecoShelfEditor.useCallback[removeShelf]"])
            }["NecoShelfEditor.useCallback[removeShelf]"]);
        }
    }["NecoShelfEditor.useCallback[removeShelf]"], []);
    const clearAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NecoShelfEditor.useCallback[clearAll]": ()=>{
            if (confirm('Clear all shelves?')) setShelves([]);
        }
    }["NecoShelfEditor.useCallback[clearAll]"], []);
    const resetToBaseline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NecoShelfEditor.useCallback[resetToBaseline]": ()=>{
            if (confirm('Discard current shelves and restore the saved baseline?')) {
                setShelves(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shelves$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASELINE_SHELVES"]);
            }
        }
    }["NecoShelfEditor.useCallback[resetToBaseline]"], []);
    const showLines = open || editing;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showLines && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    pointerEvents: 'none',
                    zIndex: 9000
                },
                children: [
                    shelves.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShelfLine, {
                            shelf: s
                        }, i, false, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)),
                    draft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShelfLine, {
                        shelf: draft,
                        draft: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/NecoShelfEditor.tsx",
                        lineNumber: 142,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this),
            editing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    cursor: 'crosshair',
                    zIndex: 9998
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-neco-toolbar": true,
                style: {
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 10000,
                    background: 'rgba(15, 15, 15, 0.95)',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#d0d0d0',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    userSelect: 'none'
                },
                children: !open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setOpen(true),
                    style: btnStyle,
                    children: [
                        "shelves (",
                        shelves.length,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 12,
                        minWidth: 280,
                        maxWidth: 360
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Neco shelves"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setOpen(false);
                                        setEditing(false);
                                    },
                                    style: iconBtnStyle,
                                    "aria-label": "Close",
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 190,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 6,
                                marginBottom: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setEditing((e)=>!e),
                                    style: {
                                        ...btnStyle,
                                        flex: 1,
                                        background: editing ? '#ff3366' : '#222',
                                        color: editing ? '#000' : '#d0d0d0',
                                        borderColor: editing ? '#ff3366' : '#333'
                                    },
                                    children: editing ? 'Done' : 'Click & drag to add'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 203,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: copyToClipboard,
                                    style: btnStyle,
                                    disabled: !shelves.length,
                                    children: copied ? 'Copied!' : 'Copy'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this),
                        shelves.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                opacity: 0.6,
                                fontStyle: 'italic',
                                padding: '8px 0'
                            },
                            children: "No shelves yet. Enable editing and drag horizontally to draw a line."
                        }, void 0, false, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 225,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxHeight: 240,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4
                            },
                            children: shelves.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '4px 6px',
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: 4
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                flex: 1
                                            },
                                            children: [
                                                "y=",
                                                s.y,
                                                " · x=[",
                                                s.x1,
                                                ", ",
                                                s.x2,
                                                "] · w=",
                                                s.x2 - s.x1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                            lineNumber: 256,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>removeShelf(i),
                                            style: iconBtnStyle,
                                            "aria-label": "Delete",
                                            children: "×"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                            lineNumber: 259,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 245,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 235,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 6,
                                marginTop: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: resetToBaseline,
                                    style: {
                                        ...btnStyle,
                                        flex: 1
                                    },
                                    title: "Restore the shelves saved in src/lib/shelves.ts",
                                    children: "Reset to saved"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: clearAll,
                                    style: {
                                        ...btnStyle,
                                        flex: 1,
                                        color: '#ff6b6b'
                                    },
                                    disabled: !shelves.length,
                                    children: "Clear all"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NecoShelfEditor.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NecoShelfEditor.tsx",
                    lineNumber: 180,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(NecoShelfEditor, "3DoRLyssC7kj8zizrpfqj+SzULY=");
_c = NecoShelfEditor;
const btnStyle = {
    background: '#222',
    border: '1px solid #333',
    color: '#d0d0d0',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 12
};
const iconBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 16,
    padding: '0 4px',
    lineHeight: 1
};
function ShelfLine({ shelf, draft = false }) {
    const color = draft ? '#ffffff' : '#ff3366';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: shelf.y - 1,
                    left: shelf.x1,
                    width: shelf.x2 - shelf.x1,
                    height: 2,
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                    opacity: draft ? 0.7 : 0.9
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: shelf.y - 4,
                    left: shelf.x1 - 4,
                    width: 8,
                    height: 8,
                    background: color,
                    borderRadius: '50%',
                    boxShadow: `0 0 4px ${color}`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: shelf.y - 4,
                    left: shelf.x2 - 4,
                    width: 8,
                    height: 8,
                    background: color,
                    borderRadius: '50%',
                    boxShadow: `0 0 4px ${color}`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: shelf.y - 24,
                    left: shelf.x1,
                    fontSize: 10,
                    color: '#fff',
                    background: 'rgba(0,0,0,0.85)',
                    padding: '2px 6px',
                    borderRadius: 3,
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap'
                },
                children: [
                    "y=",
                    Math.round(shelf.y),
                    " · x=[",
                    Math.round(shelf.x1),
                    ", ",
                    Math.round(shelf.x2),
                    "]"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NecoShelfEditor.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c1 = ShelfLine;
var _c, _c1;
__turbopack_context__.k.register(_c, "NecoShelfEditor");
__turbopack_context__.k.register(_c1, "ShelfLine");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Icarus.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icarus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const WIDTH = 360;
const HEIGHT = 540;
function Icarus() {
    _s();
    const [place, setPlace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Icarus.useEffect": ()=>{
            const update = {
                "Icarus.useEffect.update": ()=>{
                    rafRef.current = null;
                    const about = document.querySelector('.about-me');
                    const aboutText = document.querySelector('.about-me-text');
                    const atlens = document.querySelector('[data-repo="atlens"]');
                    if (!about || !aboutText || !atlens) {
                        setPlace(null);
                        return;
                    }
                    const aboutRect = about.getBoundingClientRect();
                    const aboutTextRect = aboutText.getBoundingClientRect();
                    const atlensRect = atlens.getBoundingClientRect();
                    const scrollY = window.scrollY;
                    const aboutMidDoc = aboutRect.top + scrollY + aboutRect.height / 2;
                    const viewportBottomDoc = scrollY + window.innerHeight;
                    const triggerScrollY = aboutMidDoc - window.innerHeight;
                    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
                    if (viewportBottomDoc < aboutMidDoc) {
                        setPlace(null);
                        return;
                    }
                    // Base: Icarus starts just above the viewport at trigger (bottom = viewport top).
                    const baseTopDoc = triggerScrollY - HEIGHT;
                    // Target (at page bottom): bottom of Icarus aligned with bottom of about-me paragraph.
                    const aboutTextBottomDoc = aboutTextRect.top + scrollY + aboutTextRect.height;
                    const targetTopDoc = aboutTextBottomDoc - HEIGHT;
                    const maxDelta = Math.max(1, maxScrollY - triggerScrollY);
                    const t = Math.min(1, Math.max(0, (scrollY - triggerScrollY) / maxDelta));
                    const eased = t * t; // quadratic ease-in → rushes faster as you near the bottom
                    const topDoc = baseTopDoc + (targetTopDoc - baseTopDoc) * eased;
                    const topViewport = topDoc - scrollY;
                    const left = atlensRect.left + atlensRect.width / 2 - WIDTH / 2 + 100;
                    setPlace({
                        top: topViewport,
                        left
                    });
                }
            }["Icarus.useEffect.update"];
            const onScroll = {
                "Icarus.useEffect.onScroll": ()=>{
                    if (rafRef.current != null) return;
                    rafRef.current = requestAnimationFrame(update);
                }
            }["Icarus.useEffect.onScroll"];
            update();
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            window.addEventListener('resize', onScroll);
            // Repos load async — re-check periodically until atlens shows up, then stop.
            const interval = window.setInterval({
                "Icarus.useEffect.interval": ()=>{
                    if (document.querySelector('[data-repo="atlens"]')) {
                        update();
                        window.clearInterval(interval);
                    }
                }
            }["Icarus.useEffect.interval"], 200);
            return ({
                "Icarus.useEffect": ()=>{
                    window.removeEventListener('scroll', onScroll);
                    window.removeEventListener('resize', onScroll);
                    window.clearInterval(interval);
                    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
                }
            })["Icarus.useEffect"];
        }
    }["Icarus.useEffect"], []);
    if (!place) return null;
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: "/icarus.png",
        alt: "icarus",
        style: {
            position: 'fixed',
            left: place.left,
            top: place.top,
            width: WIDTH,
            height: HEIGHT,
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: -10
        }
    }, void 0, false, {
        fileName: "[project]/src/components/Icarus.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this));
}
_s(Icarus, "x+MZUZDzIujOySV9h1mq9/qsVUA=");
_c = Icarus;
var _c;
__turbopack_context__.k.register(_c, "Icarus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/QuoteDivider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuoteDivider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function parseQuotes(raw) {
    const matches = [
        ...raw.matchAll(/\{([\s\S]*?)\}/g)
    ];
    return matches.map((m)=>{
        const block = m[1].trim();
        const authorMatch = block.match(/^([\s\S]+?)\n(-[\s\S]+)$/);
        if (authorMatch) {
            return {
                text: authorMatch[1].trim(),
                author: authorMatch[2].trim()
            };
        }
        return {
            text: block,
            author: ''
        };
    });
}
function QuoteDivider() {
    _s();
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuoteDivider.useEffect": ()=>{
            if (videoRef.current) videoRef.current.playbackRate = 0.75;
        }
    }["QuoteDivider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuoteDivider.useEffect": ()=>{
            fetch('/quotes.txt').then({
                "QuoteDivider.useEffect": (r)=>r.text()
            }["QuoteDivider.useEffect"]).then({
                "QuoteDivider.useEffect": (raw)=>{
                    const quotes = parseQuotes(raw);
                    if (quotes.length) {
                        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
                    }
                }
            }["QuoteDivider.useEffect"]).catch({
                "QuoteDivider.useEffect": ()=>{}
            }["QuoteDivider.useEffect"]);
        }
    }["QuoteDivider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "quote-divider",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true,
                "aria-hidden": "true",
                style: {
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                    zIndex: 0,
                    opacity: 0.4
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                    src: "/roses.mp4",
                    type: "video/mp4"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuoteDivider.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/QuoteDivider.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "quote-inner",
                style: {
                    position: 'relative',
                    zIndex: 1
                },
                children: quote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "quote-text",
                            style: {
                                whiteSpace: 'pre'
                            },
                            children: quote.text
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuoteDivider.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        quote.author && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "quote-author",
                            children: quote.author
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuoteDivider.tsx",
                            lineNumber: 69,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "quote-text",
                    style: {
                        opacity: 0
                    },
                    children: "Loading…"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuoteDivider.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/QuoteDivider.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/QuoteDivider.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(QuoteDivider, "E8tHLBBSzTzoXcqmDOxZk1PmPe4=");
_c = QuoteDivider;
var _c;
__turbopack_context__.k.register(_c, "QuoteDivider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RepoCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "body": "RepoCard-module__OdBfVW__body",
  "card": "RepoCard-module__OdBfVW__card",
  "desc": "RepoCard-module__OdBfVW__desc",
  "image": "RepoCard-module__OdBfVW__image",
  "imagePlaceholder": "RepoCard-module__OdBfVW__imagePlaceholder",
  "imageWrap": "RepoCard-module__OdBfVW__imageWrap",
  "name": "RepoCard-module__OdBfVW__name",
  "perspective": "RepoCard-module__OdBfVW__perspective",
});
}),
"[project]/src/components/RepoGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RepoGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/RepoCard.module.css [app-client] (css module)");
'use client';
;
;
const HREF_OVERRIDES = {
    library: 'https://razzyshmazzy.com/library/',
    doccer: 'https://doccer.razzyshmazzy.com'
};
const IMAGE_OVERRIDES = {
    library: '/screenshots/library.png'
};
function RepoCard({ repo }) {
    const href = HREF_OVERRIDES[repo.name] ?? repo.homepage ?? repo.url;
    const image = IMAGE_OVERRIDES[repo.name] ?? repo.image;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].perspective,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card} repo-card`,
            "data-repo": repo.name,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrap,
                    children: image ? // eslint-disable-next-line @next/next/no-img-element
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: image,
                        alt: repo.name,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image
                    }, void 0, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imagePlaceholder,
                        children: repo.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].body,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name,
                            children: repo.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        repo.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].desc,
                            children: repo.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = RepoCard;
function RepoGrid({ repos }) {
    if (!repos.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-grid",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid-empty",
                children: "No repos to show."
            }, void 0, false, {
                fileName: "[project]/src/components/RepoGrid.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "repos-grid",
        children: repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
                repo: repo
            }, repo.name, false, {
                fileName: "[project]/src/components/RepoGrid.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c1 = RepoGrid;
var _c, _c1;
__turbopack_context__.k.register(_c, "RepoCard");
__turbopack_context__.k.register(_c1, "RepoGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AboutMe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function AboutMe() {
    _s();
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AboutMe.useEffect": ()=>{
            fetch('/aboutme.txt').then({
                "AboutMe.useEffect": (r)=>r.text()
            }["AboutMe.useEffect"]).then({
                "AboutMe.useEffect": (t)=>setText(t.trim())
            }["AboutMe.useEffect"]).catch({
                "AboutMe.useEffect": ()=>{}
            }["AboutMe.useEffect"]);
        }
    }["AboutMe.useEffect"], []);
    if (!text) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "about-me",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "about-me-heading",
                children: "About Me"
            }, void 0, false, {
                fileName: "[project]/src/components/AboutMe.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "about-me-text",
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/AboutMe.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AboutMe.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(AboutMe, "Ia7+bKH2TeMPqcUhrJrukKDzahc=");
_c = AboutMe;
var _c;
__turbopack_context__.k.register(_c, "AboutMe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NecoWalker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoShelfEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NecoShelfEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Icarus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Icarus.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuoteDivider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RepoGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AboutMe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AboutMe.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function HomePage() {
    _s();
    const [repos, setRepos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            Promise.all([
                fetch('/repos.json').then({
                    "HomePage.useEffect": (r)=>r.json()
                }["HomePage.useEffect"]),
                fetch('/repoHeroes').then({
                    "HomePage.useEffect": (r)=>r.text()
                }["HomePage.useEffect"]).catch({
                    "HomePage.useEffect": ()=>null
                }["HomePage.useEffect"])
            ]).then({
                "HomePage.useEffect": ([data, heroesRaw])=>{
                    let repoList = data.repos ?? [];
                    if (heroesRaw) {
                        const heroNames = [
                            ...heroesRaw.matchAll(/\{(\S+)/g)
                        ].map({
                            "HomePage.useEffect.heroNames": (m)=>m[1]
                        }["HomePage.useEffect.heroNames"]);
                        if (heroNames.length) {
                            repoList = repoList.filter({
                                "HomePage.useEffect": (r)=>heroNames.includes(r.name)
                            }["HomePage.useEffect"]);
                        }
                    }
                    const sorted = repoList.sort({
                        "HomePage.useEffect.sorted": (a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    }["HomePage.useEffect.sorted"]);
                    setRepos(sorted);
                    setLoading(false);
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{
                    setError(true);
                    setLoading(false);
                }
            }["HomePage.useEffect"]);
        }
    }["HomePage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Loading repositories…"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Could not load repos.json — make sure it exists in the public directory."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    repos: repos
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AboutMe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoShelfEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Icarus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                className: "tower-deco",
                src: "/hoover.png",
                alt: "hoover"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                className: "sunny-deco",
                src: "/sunny.png",
                alt: "sunny"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(HomePage, "iaVmORlAlllCnIKtRtFU9pLfvhc=");
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0u7t9i5._.js.map