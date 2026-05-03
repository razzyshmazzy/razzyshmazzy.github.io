module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/BlackHole.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlackHole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const W = 600;
const H = 600;
// Black hole center — offset so it bleeds off the top-left corner
const CX = 210;
const CY = 230;
const EH = 68; // event horizon radius (px)
const SHADOW_R = EH * 1.32; // gravitational shadow (photon capture cross-section)
const DISK_IN = EH * 1.55; // innermost stable circular orbit
const DISK_OUT = EH * 4.4; // outer disk edge
const INCL = 74 * (Math.PI / 180); // inclination from face-on (74° ≈ nearly edge-on)
const COS_I = Math.cos(INCL);
const SIN_I = Math.sin(INCL);
const LENS_LIFT = EH * 0.38; // upward shift applied to back-of-disk (lensing approximation)
function initParticles(n) {
    return Array.from({
        length: n
    }, ()=>{
        // Bias toward inner disk (more interesting region)
        const u = Math.random();
        const r = DISK_IN + Math.pow(u, 0.6) * (DISK_OUT - DISK_IN);
        return {
            r,
            phi: Math.random() * Math.PI * 2,
            omega: 0.22 / Math.pow(r / EH, 1.5),
            sz: 0.4 + Math.random() * 1.6,
            jitter: Math.random()
        };
    });
}
// Returns [r, g, b] with Doppler beaming and temperature gradient applied
function diskRGB(r, phi) {
    const t = (r - DISK_IN) / (DISK_OUT - DISK_IN); // 0 = inner, 1 = outer
    // Temperature: inner = blue-white, mid = yellow-orange, outer = deep orange-red
    let rc, gc, bc;
    if (t < 0.12) {
        rc = 255;
        gc = 248;
        bc = 255;
    } else if (t < 0.3) {
        const s = (t - 0.12) / 0.18;
        rc = 255;
        gc = 248;
        bc = Math.round(255 * (1 - s));
    } else if (t < 0.55) {
        const s = (t - 0.3) / 0.25;
        rc = 255;
        gc = Math.round(248 - s * 130);
        bc = 0;
    } else {
        const s = Math.min((t - 0.55) / 0.45, 1);
        rc = Math.round(255 - s * 85);
        gc = Math.round(118 - s * 110);
        bc = 0;
    }
    // Doppler beaming: the approaching side (phi ≈ π, left side) appears brighter
    // Relativistic beaming factor ∝ (1 + β·cos(α))^3 — simplified here
    const beta = 0.3 * Math.pow(EH / r, 0.5); // v/c proxy
    const cosAlpha = -Math.sin(phi) * SIN_I; // projection along line of sight
    const beam = Math.pow(1 + beta * cosAlpha, 3);
    return [
        Math.min(255, Math.round(rc * beam)),
        Math.min(255, Math.round(gc * beam)),
        Math.min(255, Math.round(bc * beam))
    ];
}
function BlackHole() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const particles = initParticles(1400);
        let raf;
        function render() {
            ctx.clearRect(0, 0, W, H);
            // ── 1. Outer ambient glow ──────────────────────────────────────
            const ambGrad = ctx.createRadialGradient(CX, CY, EH, CX, CY, DISK_OUT * 1.6);
            ambGrad.addColorStop(0, 'rgba(120,50,10,0.18)');
            ambGrad.addColorStop(0.3, 'rgba(80,25,5,0.12)');
            ambGrad.addColorStop(0.7, 'rgba(30,8,0,0.05)');
            ambGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = ambGrad;
            ctx.fillRect(0, 0, W, H);
            // ── 2. Back of disk (sin(phi) > 0 → far side) ────────────────
            // These appear above the EH due to gravitational lensing; lift them up
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (const p of particles){
                if (Math.sin(p.phi) <= 0) continue; // skip front particles
                const sx = CX + p.r * Math.cos(p.phi);
                const sy = CY + p.r * Math.sin(p.phi) * COS_I - LENS_LIFT;
                const t = (p.r - DISK_IN) / (DISK_OUT - DISK_IN);
                const [rc, gc, bc] = diskRGB(p.r, p.phi);
                const alpha = (0.25 + p.jitter * 0.35) * (1 - t * 0.55);
                ctx.shadowBlur = p.sz * 6;
                ctx.shadowColor = `rgb(${rc},${gc},${bc})`;
                ctx.fillStyle = `rgba(${rc},${gc},${bc},${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(sx, sy, p.sz, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            // ── 3. Disk glow ring (back half) ─────────────────────────────
            // A soft glowing halo around the back disk edge
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const backGlow = ctx.createRadialGradient(CX, CY - LENS_LIFT * 0.6, SHADOW_R * 0.8, CX, CY - LENS_LIFT * 0.6, DISK_OUT * 0.85);
            backGlow.addColorStop(0, 'rgba(255,160,40,0.10)');
            backGlow.addColorStop(0.5, 'rgba(255,90,10,0.06)');
            backGlow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = backGlow;
            ctx.beginPath();
            ctx.ellipse(CX, CY - LENS_LIFT * 0.6, DISK_OUT * 0.85, DISK_OUT * 0.85 * COS_I * 0.5 + EH * 0.4, 0, 0, Math.PI);
            ctx.fill();
            ctx.restore();
            // ── 4. Gravitational shadow ────────────────────────────────────
            // Black-filled circle slightly larger than the event horizon
            const shadowGrad = ctx.createRadialGradient(CX, CY, EH * 0.7, CX, CY, SHADOW_R * 1.1);
            shadowGrad.addColorStop(0, 'rgba(0,0,0,1)');
            shadowGrad.addColorStop(0.85, 'rgba(0,0,0,1)');
            shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = shadowGrad;
            ctx.beginPath();
            ctx.arc(CX, CY, SHADOW_R * 1.1, 0, Math.PI * 2);
            ctx.fill();
            // ── 5. Photon ring ─────────────────────────────────────────────
            // The bright thin ring at the shadow boundary where light orbits
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const photonGrad = ctx.createRadialGradient(CX, CY, SHADOW_R * 0.88, CX, CY, SHADOW_R * 1.18);
            photonGrad.addColorStop(0, 'rgba(0,0,0,0)');
            photonGrad.addColorStop(0.35, 'rgba(200,160,80,0.5)');
            photonGrad.addColorStop(0.6, 'rgba(255,220,140,0.9)');
            photonGrad.addColorStop(0.78, 'rgba(255,248,220,1)');
            photonGrad.addColorStop(0.9, 'rgba(255,220,140,0.6)');
            photonGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = photonGrad;
            ctx.beginPath();
            ctx.arc(CX, CY, SHADOW_R * 1.18, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // ── 6. Event horizon (pure black) ─────────────────────────────
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(CX, CY, SHADOW_R * 0.88, 0, Math.PI * 2);
            ctx.fill();
            // ── 7. Front of disk (sin(phi) <= 0 → near side) ──────────────
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (const p of particles){
                if (Math.sin(p.phi) > 0) continue;
                const sx = CX + p.r * Math.cos(p.phi);
                const sy = CY + p.r * Math.sin(p.phi) * COS_I;
                const t = (p.r - DISK_IN) / (DISK_OUT - DISK_IN);
                const [rc, gc, bc] = diskRGB(p.r, p.phi);
                const alpha = (0.45 + p.jitter * 0.55) * (1 - t * 0.45);
                ctx.shadowBlur = p.sz * 8;
                ctx.shadowColor = `rgb(${rc},${gc},${bc})`;
                ctx.fillStyle = `rgba(${rc},${gc},${bc},${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(sx, sy, p.sz, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            // ── 8. Inner corona glow ───────────────────────────────────────
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const coronaGrad = ctx.createRadialGradient(CX, CY, SHADOW_R, CX, CY, DISK_IN * 1.3);
            coronaGrad.addColorStop(0, 'rgba(255,200,100,0.22)');
            coronaGrad.addColorStop(0.5, 'rgba(255,120,30,0.10)');
            coronaGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = coronaGrad;
            ctx.beginPath();
            ctx.arc(CX, CY, DISK_IN * 1.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // ── Advance physics ────────────────────────────────────────────
            for (const p of particles){
                p.phi += p.omega;
            }
            raf = requestAnimationFrame(render);
        }
        raf = requestAnimationFrame(render);
        return ()=>cancelAnimationFrame(raf);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        width: W,
        height: H,
        "aria-hidden": "true",
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 0
        }
    }, void 0, false, {
        fileName: "[project]/src/components/BlackHole.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-zrtfn._.js.map