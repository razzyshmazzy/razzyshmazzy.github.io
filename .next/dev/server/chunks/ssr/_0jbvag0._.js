module.exports = [
"[project]/src/components/NewtonCradleText.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewtonCradleText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
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
    const n = LETTERS.length;
    const spansRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const stateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        offsets: new Float64Array(n),
        velocities: new Float64Array(n),
        hovered: new Array(n).fill(false),
        activeIndex: -1,
        animating: false,
        rafId: null
    });
    const timersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    }, [
        n
    ]);
    const ensureAnimating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const s = stateRef.current;
        if (!s.animating) {
            s.animating = true;
            s.rafId = requestAnimationFrame(animate);
        }
    }, [
        animate
    ]);
    // Cursor enters a letter — raise it, gently lower the previous one
    const handleLetterEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((index)=>{
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
    }, [
        ensureAnimating
    ]);
    // Cursor leaves the entire text — fling + ripple from last active letter
    const handleTextLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
            const timer = setTimeout(()=>{
                const left = index - d;
                const right = index + d;
                if (left >= 0) s.velocities[left] += amplitude;
                if (right < n) s.velocities[right] += amplitude;
                ensureAnimating();
            }, d * RIPPLE_DELAY);
            timersRef.current.push(timer);
        }
    }, [
        n,
        ensureAnimating
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            const s = stateRef.current;
            if (s.rafId !== null) cancelAnimationFrame(s.rafId);
            timersRef.current.forEach(clearTimeout);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-block'
        },
        onMouseLeave: handleTextLeave,
        children: LETTERS.map((letter, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/Hero.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NewtonCradleText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NewtonCradleText.tsx [app-ssr] (ecmascript)");
;
;
function Hero() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "hero",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hero-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "hero-name",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NewtonCradleText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
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
}),
"[project]/src/components/NecoWalker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NecoWalker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const HEIGHT = 96;
const GRAVITY = 0.4;
const STARE_MS = 3000;
const FALL_HEIGHT = 300;
const DRAG_Z = 9999;
const NORMAL_Z = 3;
function NecoWalker() {
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const walkSpeed = ()=>(window.innerWidth + HEIGHT * 2) / (48 * 60);
        // ── extract frame 0 of the falling gif ──
        const tmpImg = new Image();
        tmpImg.onload = ()=>{
            const c = document.createElement('canvas');
            c.width = tmpImg.naturalWidth;
            c.height = tmpImg.naturalHeight;
            c.getContext('2d').drawImage(tmpImg, 0, 0);
            frozenFrame = c.toDataURL();
        };
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
            stareTimer = setTimeout(()=>{
                direction = Math.random() < 0.5 ? -1 : 1;
                img.src = '/neco-walk.gif';
                phase = 'walking';
                isAnimating = false;
            }, STARE_MS);
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
        return ()=>{
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
            cancelSequence();
            img.removeEventListener('mousedown', onMouseDown);
            img.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, []);
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
}),
"[project]/src/components/QuoteDivider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuoteDivider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
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
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/quotes.txt').then((r)=>r.text()).then((raw)=>{
            const quotes = parseQuotes(raw);
            if (quotes.length) {
                setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            }
        }).catch(()=>{});
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "quote-divider",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "quote-inner",
            children: quote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "quote-text",
                        children: quote.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/QuoteDivider.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this),
                    quote.author && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "quote-author",
                        children: quote.author
                    }, void 0, false, {
                        fileName: "[project]/src/components/QuoteDivider.tsx",
                        lineNumber: 44,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/components/RepoCard.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "RepoCard-module__OdBfVW__card",
  "cardTitle": "RepoCard-module__OdBfVW__cardTitle",
  "perspective": "RepoCard-module__OdBfVW__perspective",
});
}),
"[project]/src/components/RepoGrid.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RepoGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/RepoCard.module.css [app-ssr] (css module)");
'use client';
;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].perspective,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            className: `repo-card ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card-top",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: `repo-name-link ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cardTitle}`,
                            href: repo.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: repo.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 30,
                            columnNumber: 9
                        }, this),
                        repo.language && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                repo.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "repo-desc",
                    children: repo.description
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "summary-box",
                    children: s ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "summary-purpose",
                                children: s.purpose
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            techItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "tech-pills",
                                children: techItems.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            s.architecture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "summary-arch",
                                children: s.architecture.length > 160 ? s.architecture.slice(0, 160) + '…' : s.architecture
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card-meta",
                    children: [
                        repo.stars ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "★ ",
                                repo.stars
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 73,
                            columnNumber: 23
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: timeAgo(repo.updatedAt)
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 74,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
function RepoGrid({ repos }) {
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const speedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(1);
    const targetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(1);
    const lerp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const diff = targetRef.current - speedRef.current;
        if (Math.abs(diff) > 0.001) {
            speedRef.current += diff * 0.06;
            const el = trackRef.current;
            if (el) {
                el.getAnimations().forEach((a)=>{
                    a.playbackRate = Math.max(0, speedRef.current);
                });
            }
            rafRef.current = requestAnimationFrame(lerp);
        } else {
            speedRef.current = targetRef.current;
            trackRef.current?.getAnimations().forEach((a)=>{
                a.playbackRate = speedRef.current;
            });
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>cancelAnimationFrame(rafRef.current), []);
    const handleEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        targetRef.current = 0;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(lerp);
    }, [
        lerp
    ]);
    const handleLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        targetRef.current = 1;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(lerp);
    }, [
        lerp
    ]);
    if (!repos.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-slider",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "repos-slider",
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-slider-track",
            ref: trackRef,
            style: {
                animationDuration: `${duration}s`
            },
            children: [
                repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
                        repo: repo
                    }, repo.name, false, {
                        fileName: "[project]/src/components/RepoGrid.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this)),
                repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
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
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NecoWalker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuoteDivider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RepoGrid.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function HomePage() {
    const [repos, setRepos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/repos.json').then((r)=>r.json()).then((data)=>{
            const sorted = (data.repos ?? []).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setRepos(sorted);
            setLoading(false);
        }).catch(()=>{
            setError(true);
            setLoading(false);
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Loading repositories…"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Could not load repos.json — make sure it exists in the public directory."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_0jbvag0._.js.map