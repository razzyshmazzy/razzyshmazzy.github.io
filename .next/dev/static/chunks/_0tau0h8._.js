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
"[project]/src/components/NecoWalker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NecoWalker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const HEIGHT = 96;
const GRAVITY = 0.4;
const STARE_MS = 3000;
const FALL_HEIGHT = 300;
const DRAG_Z = 9999;
const NORMAL_Z = 3;
function NecoWalker() {
    _s();
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NecoWalker.useEffect": ()=>{
            if (!imgRef.current) return;
            const img = imgRef.current;
            // Cache the element's base page-Y before any transforms
            const basePageY = img.getBoundingClientRect().top + window.scrollY;
            // ── state ──
            let x = -HEIGHT;
            let fallY = 0;
            let direction = 1; // 1 = right, -1 = left
            let phase = 'idle';
            let fallVelocity = 0;
            let fallTarget = 0;
            let isAnimating = false;
            let scrollFallDone = false;
            let rafId;
            let stareTimer = null;
            // drag state
            let grabOffsetX = 0;
            let grabOffsetY = 0;
            // frozen first-frame of falling gif
            let frozenFrame = '';
            const walkSpeed = {
                "NecoWalker.useEffect.walkSpeed": ()=>(window.innerWidth + HEIGHT * 2) / (48 * 60)
            }["NecoWalker.useEffect.walkSpeed"];
            // ── extract frame 0 of the falling gif ──
            const tmpImg = new Image();
            tmpImg.onload = ({
                "NecoWalker.useEffect": ()=>{
                    const c = document.createElement('canvas');
                    c.width = tmpImg.naturalWidth;
                    c.height = tmpImg.naturalHeight;
                    c.getContext('2d').drawImage(tmpImg, 0, 0);
                    frozenFrame = c.toDataURL();
                }
            })["NecoWalker.useEffect"];
            tmpImg.src = '/neco-falling.gif';
            // ── helpers ──
            function cancelSequence() {
                if (stareTimer) {
                    clearTimeout(stareTimer);
                    stareTimer = null;
                }
                fallVelocity = 0;
                isAnimating = false;
            }
            function findSurfaceBelow(pageY) {
                const parent = img.parentElement;
                if (!parent) return window.scrollY + window.innerHeight;
                let nearest = Infinity;
                for (const child of Array.from(parent.children)){
                    if (child === img) continue;
                    const top = child.getBoundingClientRect().top + window.scrollY;
                    if (top > pageY && top < nearest) nearest = top;
                }
                return nearest === Infinity ? window.scrollY + window.innerHeight : nearest;
            }
            function land() {
                phase = 'staring';
                img.src = '/neco-stare.png';
                img.style.height = `${HEIGHT}px`;
                img.style.zIndex = String(NORMAL_Z);
                img.style.pointerEvents = '';
                stareTimer = setTimeout({
                    "NecoWalker.useEffect.land": ()=>{
                        direction = Math.random() < 0.5 ? -1 : 1;
                        img.src = '/neco-walk.gif';
                        phase = 'walking';
                        isAnimating = false;
                    }
                }["NecoWalker.useEffect.land"], STARE_MS);
            }
            function applyTransform() {
                const scaleX = direction === -1 ? -1 : 1;
                const isFalling = phase === 'falling' || phase === 'dragging';
                img.style.height = `${isFalling ? FALL_HEIGHT : HEIGHT}px`;
                img.style.transform = `translateX(${x}px) translateY(${fallY}px) scaleX(${scaleX})`;
            }
            // ── render loop ──
            function tick() {
                if (phase === 'walking') {
                    x += walkSpeed() * direction;
                    if (direction === 1 && x > window.innerWidth + HEIGHT) x = -HEIGHT;
                    if (direction === -1 && x < -HEIGHT) x = window.innerWidth + HEIGHT;
                }
                if (phase === 'falling') {
                    fallVelocity += GRAVITY;
                    fallY += fallVelocity;
                    if (fallY >= fallTarget) {
                        fallY = fallTarget;
                        land();
                    }
                }
                if (phase !== 'dragging') applyTransform();
                rafId = requestAnimationFrame(tick);
            }
            // ── drag ──
            function startDrag(clientX, clientY) {
                cancelSequence();
                phase = 'dragging';
                const r = img.getBoundingClientRect();
                grabOffsetX = clientX - r.left;
                grabOffsetY = clientY - r.top;
                img.src = frozenFrame || '/neco-falling.gif';
                img.style.zIndex = String(DRAG_Z);
                img.style.pointerEvents = 'none';
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('touchmove', onTouchMove, {
                    passive: false
                });
                document.addEventListener('touchend', onTouchEnd);
            }
            function moveDrag(clientX, clientY) {
                x = clientX - grabOffsetX;
                fallY = clientY - grabOffsetY + window.scrollY - basePageY;
                applyTransform();
            }
            function endDrag() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                img.src = '/neco-falling.gif';
                fallVelocity = 0;
                isAnimating = true;
                const imgPageY = basePageY + fallY;
                const surfaceY = findSurfaceBelow(imgPageY);
                fallTarget = surfaceY - basePageY - HEIGHT;
                if (fallY >= fallTarget) {
                    fallY = fallTarget;
                    land();
                } else {
                    phase = 'falling';
                }
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
            // ── scroll handling ──
            if (window.scrollY >= 200) phase = 'walking';
            function onScroll() {
                if (phase === 'idle' && window.scrollY >= 200) {
                    phase = 'walking';
                    return;
                }
                if (phase === 'walking' && !isAnimating && !scrollFallDone && x > 0) {
                    if (window.scrollY >= basePageY) {
                        scrollFallDone = true;
                        isAnimating = true;
                        phase = 'falling';
                        fallVelocity = 0;
                        fallY = 0;
                        img.src = '/neco-falling.gif';
                        const next = img.nextElementSibling;
                        if (next) {
                            const nextPageTop = next.getBoundingClientRect().top + window.scrollY;
                            fallTarget = nextPageTop - basePageY - HEIGHT;
                        } else {
                            fallTarget = window.innerHeight;
                        }
                    }
                }
            }
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            rafId = requestAnimationFrame(tick);
            return ({
                "NecoWalker.useEffect": ()=>{
                    window.removeEventListener('scroll', onScroll);
                    cancelAnimationFrame(rafId);
                    cancelSequence();
                    img.removeEventListener('mousedown', onMouseDown);
                    img.removeEventListener('touchstart', onTouchStart);
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }
            })["NecoWalker.useEffect"];
        }
    }["NecoWalker.useEffect"], []);
    return(// eslint-disable-next-line @next/next/no-img-element
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
        lineNumber: 240,
        columnNumber: 5
    }, this));
}
_s(NecoWalker, "yH8mEGw9zDQgg3u40vY4RuXceis=");
_c = NecoWalker;
var _c;
__turbopack_context__.k.register(_c, "NecoWalker");
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "quote-inner",
            children: quote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "quote-text",
                        children: quote.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/QuoteDivider.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this),
                    quote.author && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "quote-author",
                        children: quote.author
                    }, void 0, false, {
                        fileName: "[project]/src/components/QuoteDivider.tsx",
                        lineNumber: 44,
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
                lineNumber: 48,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/QuoteDivider.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/QuoteDivider.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(QuoteDivider, "pHUr4/1SkZ+pqek8O0wcMu7nkro=");
_c = QuoteDivider;
var _c;
__turbopack_context__.k.register(_c, "QuoteDivider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RepoCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "RepoCard-module__OdBfVW__card",
  "cardTitle": "RepoCard-module__OdBfVW__cardTitle",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/RepoCard.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function timeAgo(iso) {
    if (!iso) return '';
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
    return `${Math.floor(s / 2592000)}mo ago`;
}
function RepoCard({ repo }) {
    const s = repo.summary;
    const techItems = s ? [
        ...s.techStack?.languages ?? [],
        ...s.techStack?.frameworks ?? []
    ].slice(0, 5) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].perspective,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            className: `repo-card ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card-top",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: `repo-name-link ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardTitle}`,
                            href: repo.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: repo.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 30,
                            columnNumber: 9
                        }, this),
                        repo.language && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lang-badge",
                            children: repo.language
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, this),
                repo.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "repo-desc",
                    children: repo.description
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "summary-box",
                    children: s ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "summary-purpose",
                                children: s.purpose
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            techItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "tech-pills",
                                children: techItems.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tech-pill",
                                        children: t
                                    }, t, false, {
                                        fileName: "[project]/src/components/RepoGrid.tsx",
                                        lineNumber: 54,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 52,
                                columnNumber: 15
                            }, this),
                            s.architecture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "summary-arch",
                                children: s.architecture.length > 160 ? s.architecture.slice(0, 160) + '…' : s.architecture
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: 'var(--muted)',
                            fontSize: '0.82rem'
                        },
                        children: "Analysis pending — runs nightly via GitHub Actions."
                    }, void 0, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 47,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card-meta",
                    children: [
                        repo.stars ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "★ ",
                                repo.stars
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 73,
                            columnNumber: 23
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: timeAgo(repo.updatedAt)
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 74,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "card-meta-link",
                            href: repo.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "GitHub →"
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 75,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 72,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = RepoCard;
function RepoGrid({ repos }) {
    _s();
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const speedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(1);
    const targetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(1);
    const lerp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RepoGrid.useCallback[lerp]": ()=>{
            const diff = targetRef.current - speedRef.current;
            if (Math.abs(diff) > 0.001) {
                speedRef.current += diff * 0.06;
                const el = trackRef.current;
                if (el) {
                    el.getAnimations().forEach({
                        "RepoGrid.useCallback[lerp]": (a)=>{
                            a.playbackRate = Math.max(0, speedRef.current);
                        }
                    }["RepoGrid.useCallback[lerp]"]);
                }
                rafRef.current = requestAnimationFrame(lerp);
            } else {
                speedRef.current = targetRef.current;
                trackRef.current?.getAnimations().forEach({
                    "RepoGrid.useCallback[lerp]": (a)=>{
                        a.playbackRate = speedRef.current;
                    }
                }["RepoGrid.useCallback[lerp]"]);
            }
        }
    }["RepoGrid.useCallback[lerp]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RepoGrid.useEffect": ()=>({
                "RepoGrid.useEffect": ()=>cancelAnimationFrame(rafRef.current)
            })["RepoGrid.useEffect"]
    }["RepoGrid.useEffect"], []);
    const handleEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RepoGrid.useCallback[handleEnter]": ()=>{
            targetRef.current = 0;
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(lerp);
        }
    }["RepoGrid.useCallback[handleEnter]"], [
        lerp
    ]);
    const handleLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RepoGrid.useCallback[handleLeave]": ()=>{
            targetRef.current = 1;
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(lerp);
        }
    }["RepoGrid.useCallback[handleLeave]"], [
        lerp
    ]);
    if (!repos.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-slider",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid-empty",
                children: "No repos match your search."
            }, void 0, false, {
                fileName: "[project]/src/components/RepoGrid.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    const duration = repos.length * 8;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "repos-slider",
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-slider-track",
            ref: trackRef,
            style: {
                animationDuration: `${duration}s`
            },
            children: [
                repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
                        repo: repo
                    }, repo.name, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this)),
                repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
                        repo: repo
                    }, `dup-${repo.name}`, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_s(RepoGrid, "f8XOkBirR2OjUfLAyRGmDXQZRLw=");
_c1 = RepoGrid;
var _c, _c1;
__turbopack_context__.k.register(_c, "RepoCard");
__turbopack_context__.k.register(_c1, "RepoGrid");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuoteDivider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RepoGrid.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
            fetch('/repos.json').then({
                "HomePage.useEffect": (r)=>r.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    const sorted = (data.repos ?? []).sort({
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
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Loading repositories…"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Could not load repos.json — make sure it exists in the public directory."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    repos: repos
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 37,
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
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_0tau0h8._.js.map