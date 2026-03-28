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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gifuct-js/lib/index.js [app-ssr] (ecmascript)");
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
function NecoWalker() {
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!imgRef.current || !canvasRef.current) return;
        const img = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const basePageY = img.getBoundingClientRect().top + window.scrollY;
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
        // drag state
        let grabOffsetX = 0;
        let grabOffsetY = 0;
        // fall animation state
        let fallStartY = 0;
        let fallDistance = 0;
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
        const walkSpeed = ()=>(window.innerWidth + HEIGHT * 2) / (48 * 60);
        // ── decode gif frames ──
        fetch('/neco-falling.gif').then((r)=>r.arrayBuffer()).then((buf)=>{
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseGIF"])(buf);
            gifFrames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifuct$2d$js$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decompressFrames"])(parsed, true);
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
        });
        // ── helpers ──
        function cancelSequence() {
            if (stareTimer) {
                clearTimeout(stareTimer);
                stareTimer = null;
            }
            isAnimating = false;
        }
        const VISUAL_TAGS = new Set([
            'IMG',
            'SVG',
            'CANVAS',
            'VIDEO',
            'INPUT',
            'BUTTON',
            'SELECT',
            'TEXTAREA',
            'HR',
            'PICTURE',
            'IFRAME',
            'OBJECT',
            'EMBED'
        ]);
        // Viable ground: any element with visual presence that is substantial
        // enough to serve as a landing surface. Based on the "razzyshmazzy" h1
        // as the baseline — visible text with no background/border still counts.
        const CONTENT_TAGS = new Set([
            'P',
            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
            'H6',
            'SPAN',
            'A',
            'LABEL',
            'LI',
            'TD',
            'TH',
            'STRONG',
            'EM',
            'B',
            'I',
            'SMALL',
            'CODE',
            'PRE',
            'BLOCKQUOTE',
            'FIGCAPTION',
            'DT',
            'DD'
        ]);
        const MIN_TEXT_SURFACE_WIDTH = 60;
        function isVisualElement(el) {
            if (el === img || el === canvas) return false;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return false;
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            if (parseFloat(style.opacity) === 0) return false;
            // Decorative overlays are not ground
            if (style.pointerEvents === 'none') return false;
            // Intrinsically visual elements (img, svg, canvas, button, etc.)
            if (VISUAL_TAGS.has(el.tagName)) return true;
            // Has visible background
            const bg = style.backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return true;
            // Has background image
            if (style.backgroundImage && style.backgroundImage !== 'none') return true;
            // Has visible border on any side
            const bw = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
            if (bw > 0) {
                const bc = style.borderColor;
                if (bc && bc !== 'transparent' && bc !== 'rgba(0, 0, 0, 0)') return true;
            }
            // Has box-shadow
            if (style.boxShadow && style.boxShadow !== 'none') return true;
            // Visible text in a content element — must be wide enough to walk on
            // (filters out individual letter spans while keeping headings, paragraphs)
            if (rect.width >= MIN_TEXT_SURFACE_WIDTH) {
                const text = el.textContent?.trim();
                if (text && text.length > 0) {
                    if (el.children.length === 0 || CONTENT_TAGS.has(el.tagName)) return true;
                }
            }
            return false;
        }
        function findNearestSurface(charBottomPageY, charLeft, charRight) {
            const viewportFloor = window.scrollY + window.innerHeight;
            let nearest = viewportFloor;
            let nearestElement = null;
            const candidates = document.body.querySelectorAll('*');
            for(let i = 0; i < candidates.length; i++){
                const el = candidates[i];
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) continue;
                const elTopPage = rect.top + window.scrollY;
                if (elTopPage <= charBottomPageY) continue;
                if (elTopPage >= nearest) continue;
                if (elTopPage > charBottomPageY + 2000) continue;
                const elLeft = rect.left;
                const elRight = rect.right;
                if (charRight <= elLeft || charLeft >= elRight) continue;
                if (!isVisualElement(el)) continue;
                nearest = elTopPage;
                nearestElement = el;
            }
            return {
                element: nearestElement,
                pageY: nearest
            };
        }
        function showImg() {
            img.style.display = '';
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
            // fallY must be pre-set for canvas FALL_HEIGHT before calling this
            const charBottomPageY = basePageY + fallY + FALL_HEIGHT;
            const displayWidth = getCharDisplayWidth();
            const charLeft = x;
            const charRight = x + displayWidth;
            const surface = findNearestSurface(charBottomPageY, charLeft, charRight);
            targetSurface = surface.element;
            fallStartY = fallY;
            fallDistance = surface.pageY - charBottomPageY;
            if (fallDistance <= 0) {
                fallY = surface.pageY - basePageY - FALL_HEIGHT;
                land();
                return;
            }
            if (cursorX !== null) {
                x = cursorX - displayWidth / 2;
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
                const surfPageY = landedSurface.getBoundingClientRect().top + window.scrollY;
                fallY = surfPageY - basePageY - HEIGHT;
            } else {
                fallY = window.scrollY + window.innerHeight - basePageY - HEIGHT;
            }
            showImg();
            img.src = '/neco-stare.png';
            img.style.height = `${HEIGHT}px`;
            img.style.zIndex = String(NORMAL_Z);
            img.style.pointerEvents = '';
            applyImgTransform();
            stareTimer = setTimeout(()=>{
                direction = Math.random() < 0.5 ? -1 : 1;
                img.src = '/neco-walk.gif';
                phase = 'walking';
                isAnimating = false;
            }, STARE_MS);
        }
        // ── edge fall (walk off surface edge → fall to next surface) ──
        function triggerEdgeFall() {
            cancelSequence();
            // Adjust fallY from img HEIGHT to canvas FALL_HEIGHT, keeping bottom at surface top
            if (landedSurface) {
                const surfPageY = landedSurface.getBoundingClientRect().top + window.scrollY;
                fallY = surfPageY - basePageY - FALL_HEIGHT;
            }
            landedSurface = null;
            beginFall(null);
        }
        // ── render loop ──
        function tick() {
            // ── walking phase ──
            if (phase === 'walking') {
                if (landedSurface) {
                    // Walk on landed surface — track its Y live
                    const surfRect = landedSurface.getBoundingClientRect();
                    const surfPageY = surfRect.top + window.scrollY;
                    fallY = surfPageY - basePageY - HEIGHT;
                    x += walkSpeed() * direction;
                    // Edge detection: char center beyond surface edge → fall
                    const charRect = img.getBoundingClientRect();
                    const charCenter = charRect.left + charRect.width / 2;
                    if (charCenter < surfRect.left || charCenter > surfRect.right) {
                        triggerEdgeFall();
                    } else {
                        applyImgTransform();
                    }
                } else {
                    // No surface — walk across full viewport (pre-fall)
                    x += walkSpeed() * direction;
                    if (direction === 1 && x > window.innerWidth + HEIGHT) x = -HEIGHT;
                    if (direction === -1 && x < -HEIGHT) x = window.innerWidth + HEIGHT;
                    applyImgTransform();
                }
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
                // Live collision check against target surface
                const charBottomPageY = basePageY + fallY + FALL_HEIGHT;
                let surfacePageY;
                if (targetSurface) {
                    surfacePageY = targetSurface.getBoundingClientRect().top + window.scrollY;
                } else {
                    surfacePageY = window.scrollY + window.innerHeight;
                }
                if (charBottomPageY >= surfacePageY) {
                    // Contact — snap and land
                    fallY = surfacePageY - basePageY - FALL_HEIGHT;
                    applyCanvasTransform(fallY);
                    drawFrame(totalFrames);
                    land();
                } else if (posProgress >= 1) {
                    // Time-based fallback
                    fallY = fallStartY + fallDistance;
                    applyCanvasTransform(fallY);
                    drawFrame(totalFrames);
                    land();
                } else {
                    // Lightweight re-scan for closer surfaces
                    rescanCounter++;
                    if (rescanCounter >= RESCAN_INTERVAL) {
                        rescanCounter = 0;
                        const displayWidth = getCharDisplayWidth();
                        const surface = findNearestSurface(charBottomPageY, x, x + displayWidth);
                        if (surface.pageY < surfacePageY) {
                            // Closer surface found — remap remaining fall
                            const currentFrame = Math.min(fallFrameOffset + Math.floor(posProgress * remainingFrames), totalFrames - 1);
                            fallFrameOffset = currentFrame;
                            fallStartY = fallY;
                            fallStartTime = performance.now();
                            fallDistance = surface.pageY - charBottomPageY;
                            fallDuration = Math.max(MIN_FALL_DURATION, Math.sqrt(2 * fallDistance / G_PX_PER_MS2));
                            targetSurface = surface.element;
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
            x = clientX - grabOffsetX;
            fallY = clientY - grabOffsetY + window.scrollY - basePageY;
            applyCanvasTransform(fallY);
        }
        function endDrag() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            // fallY already set by drag — canvas bottom is at basePageY + fallY + FALL_HEIGHT
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
        if (window.scrollY >= 200) phase = 'walking';
        function onScroll() {
            if (phase === 'idle' && window.scrollY >= 200) {
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
        return ()=>{
            window.removeEventListener('scroll', onScroll);
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
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
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
                lineNumber: 529,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                "aria-hidden": "true",
                className: "neco-walker",
                style: {
                    display: 'none',
                    imageRendering: 'pixelated'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/NecoWalker.tsx",
                lineNumber: 537,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/RepoCard.module.css [app-ssr] (css module)");
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
                            lineNumber: 29,
                            columnNumber: 9
                        }, this),
                        repo.language && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lang-badge",
                            children: repo.language
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 28,
                    columnNumber: 7
                }, this),
                repo.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "repo-desc",
                    children: repo.description
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 44,
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
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            techItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "tech-pills",
                                children: techItems.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tech-pill",
                                        children: t
                                    }, t, false, {
                                        fileName: "[project]/src/components/RepoGrid.tsx",
                                        lineNumber: 53,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this),
                            s.architecture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "summary-arch",
                                children: s.architecture.length > 160 ? s.architecture.slice(0, 160) + '…' : s.architecture
                            }, void 0, false, {
                                fileName: "[project]/src/components/RepoGrid.tsx",
                                lineNumber: 58,
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
                        lineNumber: 66,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 46,
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
                            lineNumber: 72,
                            columnNumber: 23
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: timeAgo(repo.updatedAt)
                        }, void 0, false, {
                            fileName: "[project]/src/components/RepoGrid.tsx",
                            lineNumber: 73,
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
                            lineNumber: 74,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/RepoGrid.tsx",
                    lineNumber: 71,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 27,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function RepoGrid({ repos }) {
    if (!repos.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "repos-grid",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid-empty",
                children: "No repos match your search."
            }, void 0, false, {
                fileName: "[project]/src/components/RepoGrid.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/RepoGrid.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "repos-grid",
        children: repos.map((repo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RepoCard, {
                repo: repo
            }, repo.name, false, {
                fileName: "[project]/src/components/RepoGrid.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/RepoGrid.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/AboutMe.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function AboutMe() {
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/aboutme.txt').then((r)=>r.text()).then((t)=>setText(t.trim())).catch(()=>{});
    }, []);
    if (!text) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "about-me",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "about-me-heading",
                children: "About Me"
            }, void 0, false, {
                fileName: "[project]/src/components/AboutMe.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AboutMe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AboutMe.tsx [app-ssr] (ecmascript)");
'use client';
;
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
        Promise.all([
            fetch('/repos.json').then((r)=>r.json()),
            fetch('/repoHeroes').then((r)=>r.text()).catch(()=>null)
        ]).then(([data, heroesRaw])=>{
            let repoList = data.repos ?? [];
            if (heroesRaw) {
                const heroNames = [
                    ...heroesRaw.matchAll(/\{(\S+)/g)
                ].map((m)=>m[1]);
                if (heroNames.length) {
                    repoList = repoList.filter((r)=>heroNames.includes(r.name));
                }
            }
            const sorted = repoList.sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NecoWalker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuoteDivider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Loading repositories…"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid-empty",
                    children: "Could not load repos.json — make sure it exists in the public directory."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RepoGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    repos: repos
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AboutMe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 61,
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
"[project]/node_modules/js-binary-schema-parser/lib/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loop = exports.conditional = exports.parse = void 0;
var parse = function parse(stream, schema) {
    var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : result;
    if (Array.isArray(schema)) {
        schema.forEach(function(partSchema) {
            return parse(stream, partSchema, result, parent);
        });
    } else if (typeof schema === 'function') {
        schema(stream, result, parent, parse);
    } else {
        var key = Object.keys(schema)[0];
        if (Array.isArray(schema[key])) {
            parent[key] = {};
            parse(stream, schema[key], result, parent[key]);
        } else {
            parent[key] = schema[key](stream, result, parent, parse);
        }
    }
    return result;
};
exports.parse = parse;
var conditional = function conditional(schema, conditionFunc) {
    return function(stream, result, parent, parse) {
        if (conditionFunc(stream, result, parent)) {
            parse(stream, schema, result, parent);
        }
    };
};
exports.conditional = conditional;
var loop = function loop(schema, continueFunc) {
    return function(stream, result, parent, parse) {
        var arr = [];
        var lastStreamPos = stream.pos;
        while(continueFunc(stream, result, parent)){
            var newParent = {};
            parse(stream, schema, result, newParent); // cases when whole file is parsed but no termination is there and stream position is not getting updated as well
            // it falls into infinite recursion, null check to avoid the same
            if (stream.pos === lastStreamPos) {
                break;
            }
            lastStreamPos = stream.pos;
            arr.push(newParent);
        }
        return arr;
    };
};
exports.loop = loop;
}),
"[project]/node_modules/js-binary-schema-parser/lib/parsers/uint8.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readBits = exports.readArray = exports.readUnsigned = exports.readString = exports.peekBytes = exports.readBytes = exports.peekByte = exports.readByte = exports.buildStream = void 0;
// Default stream and parsers for Uint8TypedArray data type
var buildStream = function buildStream(uint8Data) {
    return {
        data: uint8Data,
        pos: 0
    };
};
exports.buildStream = buildStream;
var readByte = function readByte() {
    return function(stream) {
        return stream.data[stream.pos++];
    };
};
exports.readByte = readByte;
var peekByte = function peekByte() {
    var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return function(stream) {
        return stream.data[stream.pos + offset];
    };
};
exports.peekByte = peekByte;
var readBytes = function readBytes(length) {
    return function(stream) {
        return stream.data.subarray(stream.pos, stream.pos += length);
    };
};
exports.readBytes = readBytes;
var peekBytes = function peekBytes(length) {
    return function(stream) {
        return stream.data.subarray(stream.pos, stream.pos + length);
    };
};
exports.peekBytes = peekBytes;
var readString = function readString(length) {
    return function(stream) {
        return Array.from(readBytes(length)(stream)).map(function(value) {
            return String.fromCharCode(value);
        }).join('');
    };
};
exports.readString = readString;
var readUnsigned = function readUnsigned(littleEndian) {
    return function(stream) {
        var bytes = readBytes(2)(stream);
        return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
    };
};
exports.readUnsigned = readUnsigned;
var readArray = function readArray(byteSize, totalOrFunc) {
    return function(stream, result, parent) {
        var total = typeof totalOrFunc === 'function' ? totalOrFunc(stream, result, parent) : totalOrFunc;
        var parser = readBytes(byteSize);
        var arr = new Array(total);
        for(var i = 0; i < total; i++){
            arr[i] = parser(stream);
        }
        return arr;
    };
};
exports.readArray = readArray;
var subBitsTotal = function subBitsTotal(bits, startIndex, length) {
    var result = 0;
    for(var i = 0; i < length; i++){
        result += bits[startIndex + i] && Math.pow(2, length - i - 1);
    }
    return result;
};
var readBits = function readBits(schema) {
    return function(stream) {
        var _byte = readByte()(stream); // convert the byte to bit array
        var bits = new Array(8);
        for(var i = 0; i < 8; i++){
            bits[7 - i] = !!(_byte & 1 << i);
        } // convert the bit array to values based on the schema
        return Object.keys(schema).reduce(function(res, key) {
            var def = schema[key];
            if (def.length) {
                res[key] = subBitsTotal(bits, def.index, def.length);
            } else {
                res[key] = bits[def.index];
            }
            return res;
        }, {});
    };
};
exports.readBits = readBits;
}),
"[project]/node_modules/js-binary-schema-parser/lib/schemas/gif.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var _ = __turbopack_context__.r("[project]/node_modules/js-binary-schema-parser/lib/index.js [app-ssr] (ecmascript)");
var _uint = __turbopack_context__.r("[project]/node_modules/js-binary-schema-parser/lib/parsers/uint8.js [app-ssr] (ecmascript)");
// a set of 0x00 terminated subblocks
var subBlocksSchema = {
    blocks: function blocks(stream) {
        var terminator = 0x00;
        var chunks = [];
        var streamSize = stream.data.length;
        var total = 0;
        for(var size = (0, _uint.readByte)()(stream); size !== terminator; size = (0, _uint.readByte)()(stream)){
            // size becomes undefined for some case when file is corrupted and  terminator is not proper 
            // null check to avoid recursion
            if (!size) break; // catch corrupted files with no terminator
            if (stream.pos + size >= streamSize) {
                var availableSize = streamSize - stream.pos;
                chunks.push((0, _uint.readBytes)(availableSize)(stream));
                total += availableSize;
                break;
            }
            chunks.push((0, _uint.readBytes)(size)(stream));
            total += size;
        }
        var result = new Uint8Array(total);
        var offset = 0;
        for(var i = 0; i < chunks.length; i++){
            result.set(chunks[i], offset);
            offset += chunks[i].length;
        }
        return result;
    }
}; // global control extension
var gceSchema = (0, _.conditional)({
    gce: [
        {
            codes: (0, _uint.readBytes)(2)
        },
        {
            byteSize: (0, _uint.readByte)()
        },
        {
            extras: (0, _uint.readBits)({
                future: {
                    index: 0,
                    length: 3
                },
                disposal: {
                    index: 3,
                    length: 3
                },
                userInput: {
                    index: 6
                },
                transparentColorGiven: {
                    index: 7
                }
            })
        },
        {
            delay: (0, _uint.readUnsigned)(true)
        },
        {
            transparentColorIndex: (0, _uint.readByte)()
        },
        {
            terminator: (0, _uint.readByte)()
        }
    ]
}, function(stream) {
    var codes = (0, _uint.peekBytes)(2)(stream);
    return codes[0] === 0x21 && codes[1] === 0xf9;
}); // image pipeline block
var imageSchema = (0, _.conditional)({
    image: [
        {
            code: (0, _uint.readByte)()
        },
        {
            descriptor: [
                {
                    left: (0, _uint.readUnsigned)(true)
                },
                {
                    top: (0, _uint.readUnsigned)(true)
                },
                {
                    width: (0, _uint.readUnsigned)(true)
                },
                {
                    height: (0, _uint.readUnsigned)(true)
                },
                {
                    lct: (0, _uint.readBits)({
                        exists: {
                            index: 0
                        },
                        interlaced: {
                            index: 1
                        },
                        sort: {
                            index: 2
                        },
                        future: {
                            index: 3,
                            length: 2
                        },
                        size: {
                            index: 5,
                            length: 3
                        }
                    })
                }
            ]
        },
        (0, _.conditional)({
            lct: (0, _uint.readArray)(3, function(stream, result, parent) {
                return Math.pow(2, parent.descriptor.lct.size + 1);
            })
        }, function(stream, result, parent) {
            return parent.descriptor.lct.exists;
        }),
        {
            data: [
                {
                    minCodeSize: (0, _uint.readByte)()
                },
                subBlocksSchema
            ]
        }
    ]
}, function(stream) {
    return (0, _uint.peekByte)()(stream) === 0x2c;
}); // plain text block
var textSchema = (0, _.conditional)({
    text: [
        {
            codes: (0, _uint.readBytes)(2)
        },
        {
            blockSize: (0, _uint.readByte)()
        },
        {
            preData: function preData(stream, result, parent) {
                return (0, _uint.readBytes)(parent.text.blockSize)(stream);
            }
        },
        subBlocksSchema
    ]
}, function(stream) {
    var codes = (0, _uint.peekBytes)(2)(stream);
    return codes[0] === 0x21 && codes[1] === 0x01;
}); // application block
var applicationSchema = (0, _.conditional)({
    application: [
        {
            codes: (0, _uint.readBytes)(2)
        },
        {
            blockSize: (0, _uint.readByte)()
        },
        {
            id: function id(stream, result, parent) {
                return (0, _uint.readString)(parent.blockSize)(stream);
            }
        },
        subBlocksSchema
    ]
}, function(stream) {
    var codes = (0, _uint.peekBytes)(2)(stream);
    return codes[0] === 0x21 && codes[1] === 0xff;
}); // comment block
var commentSchema = (0, _.conditional)({
    comment: [
        {
            codes: (0, _uint.readBytes)(2)
        },
        subBlocksSchema
    ]
}, function(stream) {
    var codes = (0, _uint.peekBytes)(2)(stream);
    return codes[0] === 0x21 && codes[1] === 0xfe;
});
var schema = [
    {
        header: [
            {
                signature: (0, _uint.readString)(3)
            },
            {
                version: (0, _uint.readString)(3)
            }
        ]
    },
    {
        lsd: [
            {
                width: (0, _uint.readUnsigned)(true)
            },
            {
                height: (0, _uint.readUnsigned)(true)
            },
            {
                gct: (0, _uint.readBits)({
                    exists: {
                        index: 0
                    },
                    resolution: {
                        index: 1,
                        length: 3
                    },
                    sort: {
                        index: 4
                    },
                    size: {
                        index: 5,
                        length: 3
                    }
                })
            },
            {
                backgroundColorIndex: (0, _uint.readByte)()
            },
            {
                pixelAspectRatio: (0, _uint.readByte)()
            }
        ]
    },
    (0, _.conditional)({
        gct: (0, _uint.readArray)(3, function(stream, result) {
            return Math.pow(2, result.lsd.gct.size + 1);
        })
    }, function(stream, result) {
        return result.lsd.gct.exists;
    }),
    {
        frames: (0, _.loop)([
            gceSchema,
            applicationSchema,
            commentSchema,
            imageSchema,
            textSchema
        ], function(stream) {
            var nextCode = (0, _uint.peekByte)()(stream); // rather than check for a terminator, we should check for the existence
            // of an ext or image block to avoid infinite loops
            //var terminator = 0x3B;
            //return nextCode !== terminator;
            return nextCode === 0x21 || nextCode === 0x2c;
        })
    }
];
var _default = schema;
exports["default"] = _default;
}),
"[project]/node_modules/gifuct-js/lib/deinterlace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deinterlace = void 0;
/**
 * Deinterlace function from https://github.com/shachaf/jsgif
 */ var deinterlace = function deinterlace(pixels, width) {
    var newPixels = new Array(pixels.length);
    var rows = pixels.length / width;
    var cpRow = function cpRow(toRow, fromRow) {
        var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [
            toRow * width,
            width
        ].concat(fromPixels));
    }; // See appendix E.
    var offsets = [
        0,
        4,
        2,
        1
    ];
    var steps = [
        8,
        8,
        4,
        2
    ];
    var fromRow = 0;
    for(var pass = 0; pass < 4; pass++){
        for(var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]){
            cpRow(toRow, fromRow);
            fromRow++;
        }
    }
    return newPixels;
};
exports.deinterlace = deinterlace;
}),
"[project]/node_modules/gifuct-js/lib/lzw.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.lzw = void 0;
/**
 * javascript port of java LZW decompression
 * Original java author url: https://gist.github.com/devunwired/4479231
 */ var lzw = function lzw(minCodeSize, data, pixelCount) {
    var MAX_STACK_SIZE = 4096;
    var nullCode = -1;
    var npix = pixelCount;
    var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
    var dstPixels = new Array(pixelCount);
    var prefix = new Array(MAX_STACK_SIZE);
    var suffix = new Array(MAX_STACK_SIZE);
    var pixelStack = new Array(MAX_STACK_SIZE + 1); // Initialize GIF data stream decoder.
    data_size = minCodeSize;
    clear = 1 << data_size;
    end_of_information = clear + 1;
    available = clear + 2;
    old_code = nullCode;
    code_size = data_size + 1;
    code_mask = (1 << code_size) - 1;
    for(code = 0; code < clear; code++){
        prefix[code] = 0;
        suffix[code] = code;
    } // Decode GIF pixel stream.
    var datum, bits, count, first, top, pi, bi;
    datum = bits = count = first = top = pi = bi = 0;
    for(i = 0; i < npix;){
        if (top === 0) {
            if (bits < code_size) {
                // get the next byte
                datum += data[bi] << bits;
                bits += 8;
                bi++;
                continue;
            } // Get the next code.
            code = datum & code_mask;
            datum >>= code_size;
            bits -= code_size; // Interpret the code
            if (code > available || code == end_of_information) {
                break;
            }
            if (code == clear) {
                // Reset decoder.
                code_size = data_size + 1;
                code_mask = (1 << code_size) - 1;
                available = clear + 2;
                old_code = nullCode;
                continue;
            }
            if (old_code == nullCode) {
                pixelStack[top++] = suffix[code];
                old_code = code;
                first = code;
                continue;
            }
            in_code = code;
            if (code == available) {
                pixelStack[top++] = first;
                code = old_code;
            }
            while(code > clear){
                pixelStack[top++] = suffix[code];
                code = prefix[code];
            }
            first = suffix[code] & 0xff;
            pixelStack[top++] = first; // add a new string to the table, but only if space is available
            // if not, just continue with current table until a clear code is found
            // (deferred clear code implementation as per GIF spec)
            if (available < MAX_STACK_SIZE) {
                prefix[available] = old_code;
                suffix[available] = first;
                available++;
                if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
                    code_size++;
                    code_mask += available;
                }
            }
            old_code = in_code;
        } // Pop a pixel off the pixel stack.
        top--;
        dstPixels[pi++] = pixelStack[top];
        i++;
    }
    for(i = pi; i < npix; i++){
        dstPixels[i] = 0; // clear missing pixels
    }
    return dstPixels;
};
exports.lzw = lzw;
}),
"[project]/node_modules/gifuct-js/lib/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decompressFrames = exports.decompressFrame = exports.parseGIF = void 0;
var _gif = _interopRequireDefault(__turbopack_context__.r("[project]/node_modules/js-binary-schema-parser/lib/schemas/gif.js [app-ssr] (ecmascript)"));
var _jsBinarySchemaParser = __turbopack_context__.r("[project]/node_modules/js-binary-schema-parser/lib/index.js [app-ssr] (ecmascript)");
var _uint = __turbopack_context__.r("[project]/node_modules/js-binary-schema-parser/lib/parsers/uint8.js [app-ssr] (ecmascript)");
var _deinterlace = __turbopack_context__.r("[project]/node_modules/gifuct-js/lib/deinterlace.js [app-ssr] (ecmascript)");
var _lzw = __turbopack_context__.r("[project]/node_modules/gifuct-js/lib/lzw.js [app-ssr] (ecmascript)");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    };
}
var parseGIF = function parseGIF(arrayBuffer) {
    var byteData = new Uint8Array(arrayBuffer);
    return (0, _jsBinarySchemaParser.parse)((0, _uint.buildStream)(byteData), _gif["default"]);
};
exports.parseGIF = parseGIF;
var generatePatch = function generatePatch(image) {
    var totalPixels = image.pixels.length;
    var patchData = new Uint8ClampedArray(totalPixels * 4);
    for(var i = 0; i < totalPixels; i++){
        var pos = i * 4;
        var colorIndex = image.pixels[i];
        var color = image.colorTable[colorIndex] || [
            0,
            0,
            0
        ];
        patchData[pos] = color[0];
        patchData[pos + 1] = color[1];
        patchData[pos + 2] = color[2];
        patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
    }
    return patchData;
};
var decompressFrame = function decompressFrame(frame, gct, buildImagePatch) {
    if (!frame.image) {
        console.warn('gif frame does not have associated image.');
        return;
    }
    var image = frame.image; // get the number of pixels
    var totalPixels = image.descriptor.width * image.descriptor.height; // do lzw decompression
    var pixels = (0, _lzw.lzw)(image.data.minCodeSize, image.data.blocks, totalPixels); // deal with interlacing if necessary
    if (image.descriptor.lct.interlaced) {
        pixels = (0, _deinterlace.deinterlace)(pixels, image.descriptor.width);
    }
    var resultImage = {
        pixels: pixels,
        dims: {
            top: frame.image.descriptor.top,
            left: frame.image.descriptor.left,
            width: frame.image.descriptor.width,
            height: frame.image.descriptor.height
        }
    }; // color table
    if (image.descriptor.lct && image.descriptor.lct.exists) {
        resultImage.colorTable = image.lct;
    } else {
        resultImage.colorTable = gct;
    } // add per frame relevant gce information
    if (frame.gce) {
        resultImage.delay = (frame.gce.delay || 10) * 10; // convert to ms
        resultImage.disposalType = frame.gce.extras.disposal; // transparency
        if (frame.gce.extras.transparentColorGiven) {
            resultImage.transparentIndex = frame.gce.transparentColorIndex;
        }
    } // create canvas usable imagedata if desired
    if (buildImagePatch) {
        resultImage.patch = generatePatch(resultImage);
    }
    return resultImage;
};
exports.decompressFrame = decompressFrame;
var decompressFrames = function decompressFrames(parsedGif, buildImagePatches) {
    return parsedGif.frames.filter(function(f) {
        return f.image;
    }).map(function(f) {
        return decompressFrame(f, parsedGif.gct, buildImagePatches);
    });
};
exports.decompressFrames = decompressFrames;
}),
];

//# sourceMappingURL=_03fnhj8._.js.map