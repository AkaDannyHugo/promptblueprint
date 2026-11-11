import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-j3IBbSFG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var PILLARS = [
	{
		id: "regime",
		label: "Regime",
		short: "Regime",
		max: 100
	},
	{
		id: "technical",
		label: "Technical",
		short: "Technical",
		max: 100
	},
	{
		id: "rr",
		label: "R / R",
		short: "R/R",
		max: 100
	}
];
var TARGET_OPTIONS = [{
	id: "grok_bot",
	label: "Grok Bot"
}, {
	id: "grok",
	label: "Grok"
}];
var TIMEFRAMES = [
	"15m",
	"1H",
	"4H",
	"1D",
	"1W"
];
var TIMEFRAME_MINUTES = {
	"15m": 15,
	"1H": 60,
	"4H": 240,
	"1D": 1440,
	"1W": 10080
};
var QUOTES = [
	"USD",
	"USDC",
	"BTC"
];
var CORE_UNIVERSE_SPOT = [
	"BTC-USD",
	"ETH-USD",
	"SOL-USD",
	"XRP-USD",
	"DOGE-USD",
	"ADA-USD",
	"AVAX-USD",
	"LINK-USD",
	"SUI-USD",
	"LTC-USD"
];
var CORE_UNIVERSE_PERP = [
	"BIP",
	"ETP",
	"SLP",
	"XPP"
];
var PROFILE_META = {
	aggressiveSpot: {
		label: "Aggressive",
		blurb: "4H entries, daily trend. Maker in, taker out, after the Coinbase One rebate."
	},
	swingSpot: {
		label: "Swing",
		blurb: "Daily entries, weekly trend. Wider stops, tighter fee cap."
	},
	perpsAggressive: {
		label: "Perps",
		blurb: "US perp-style futures. 1H entries, 4H trend. Overnight margin sizes the stop."
	}
};
var WEIGHTS = {
	regime: 15,
	technical: 55,
	rr: 30
};
function shared() {
	return {
		target: "grok_bot",
		contractRev: 51,
		contractVersion: "5.1",
		entryTf: "4H",
		trendTf: "1D",
		signalBias: "long",
		stopLookback: 6,
		swingLookback: 20,
		minStopPct: 3,
		minStopAtr: 1,
		maxStopAtr: 2.5,
		targetCapR: 3,
		breakoutTargetR: 2.5,
		minRrr: 2,
		minNetR: 1.5,
		maxFeesR: .35,
		entryOrder: "maker",
		rebatePct: 25,
		rebateCapUsd: 100,
		defaultFeeBps: 90,
		fallbackMakerBps: 50,
		fundingLeg: "quote",
		quotes: [
			"USD",
			"USDC",
			"BTC"
		],
		maxSignalAgeMin: null,
		maxDriftAtr: .5,
		universeSize: 50,
		minVolume: 5e6,
		maxSpreadBps: 15,
		passAMax: 40,
		passBMax: 12,
		coreUniverse: [...CORE_UNIVERSE_SPOT],
		watchlist: [],
		denylist: [],
		excludeStables: true,
		excludeWrapped: true,
		excludeNew: true,
		riskPerTradePct: 1,
		maxPositionPct: 25,
		heatCapMultiple: 3,
		numOps: 3,
		confidence: 60,
		weights: { ...WEIGHTS },
		maxLeverage: 3,
		liqBufferMultiple: 2,
		useIntradayMargin: false,
		fundingDragR: .15,
		maxHoldH: 48,
		futMakerPct: .095,
		futTakerPct: .1,
		futPassThroughUsd: .15,
		includeNonCrypto: false,
		minOiContracts: 1e4,
		minVolContracts: 2e4,
		equityUsd: 1e4
	};
}
function configFor(id, darkMode = true) {
	const base = shared();
	if (id === "swingSpot") return {
		...base,
		profile: "swingSpot",
		marketMode: "spot",
		darkMode,
		entryTf: "1D",
		trendTf: "1W",
		minStopPct: 5,
		maxFeesR: .25,
		maxSignalAgeMin: 1440
	};
	if (id === "perpsAggressive") return {
		...base,
		profile: "perpsAggressive",
		marketMode: "leverage",
		darkMode,
		entryTf: "1H",
		trendTf: "4H",
		signalBias: "both",
		maxStopAtr: 2,
		coreUniverse: [...CORE_UNIVERSE_PERP]
	};
	return {
		...base,
		profile: "aggressiveSpot",
		marketMode: "spot",
		darkMode
	};
}
var DEFAULT_CONFIG = configFor("aggressiveSpot");
function formatUsd(value) {
	if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
	if (value >= 1e6) {
		const m = value / 1e6;
		return Number.isInteger(m) ? `$${m}M` : `$${m.toFixed(1)}M`;
	}
	if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
	return `$${value}`;
}
function estimateTokens(text) {
	return Math.max(1, Math.round(text.length / 4));
}
function formatCount(n) {
	return new Intl.NumberFormat("en-US").format(n);
}
function profileLabel(config) {
	if (config.profile === "custom") return "Custom";
	return PROFILE_META[config.profile]?.label ?? "Custom";
}
function weightTotal(config) {
	return Object.values(config.weights).reduce((sum, n) => sum + n, 0);
}
function normalizeTicker(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}
function parseTickerInput(raw) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const part of raw.split(/[\s,;]+/)) {
		const ticker = normalizeTicker(part);
		if (!ticker || seen.has(ticker)) continue;
		seen.add(ticker);
		out.push(ticker);
	}
	return out;
}
function clampWeights(weights) {
	const next = { ...weights };
	for (const pillar of PILLARS) {
		const value = Number(next[pillar.id]);
		next[pillar.id] = Number.isFinite(value) ? Math.min(pillar.max, Math.max(0, value)) : 0;
	}
	return next;
}
function normalizeWeights(weights) {
	const total = Object.values(weights).reduce((sum, n) => sum + n, 0);
	if (total === 100 || total === 0) return { ...weights };
	const ids = Object.keys(weights);
	const raw = ids.map((id) => weights[id] / total * 100);
	const rounded = raw.map((n) => Math.round(n / 5) * 5);
	let drift = 100 - rounded.reduce((s, n) => s + n, 0);
	const order = ids.map((id, i) => ({
		id,
		frac: raw[i] - rounded[i]
	})).sort((a, b) => drift > 0 ? b.frac - a.frac : a.frac - b.frac);
	const next = { ...weights };
	ids.forEach((id, i) => {
		next[id] = rounded[i];
	});
	let i = 0;
	while (drift !== 0 && i < order.length * 4) {
		const id = order[i % order.length].id;
		const step = drift > 0 ? 5 : -5;
		const candidate = next[id] + step;
		const cap = PILLARS.find((pillar) => pillar.id === id)?.max ?? 100;
		if (candidate >= 0 && candidate <= cap) {
			next[id] = candidate;
			drift -= step;
		}
		i += 1;
	}
	return next;
}
function downloadText(filename, contents, mime) {
	const blob = new Blob([contents], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.setAttribute("readonly", "");
			ta.style.position = "fixed";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(ta);
			return ok;
		} catch {
			return false;
		}
	}
}
var LEGACY_STORAGE_KEY = "prompt-blueprint-v3";
var BIASES = [
	"both",
	"long",
	"short"
];
var ORDERS = ["maker", "taker"];
var LEGS = ["quote", "btc"];
var MODES = ["spot", "leverage"];
var QUOTE_IDS = [
	"USD",
	"USDC",
	"BTC"
];
var SIZES = [
	50,
	100,
	200,
	500
];
var OLD_PROFILE = {
	conservative: "swingSpot",
	balanced: "swingSpot",
	dayTrade: "aggressiveSpot",
	momentum: "aggressiveSpot",
	meanReversion: "aggressiveSpot",
	agentDesk: "aggressiveSpot",
	btcAccumulation: "aggressiveSpot",
	aggressiveSpot: "aggressiveSpot",
	swingSpot: "swingSpot",
	perpsAggressive: "perpsAggressive"
};
var CONFIG_KEYS = [
	"target",
	"profile",
	"marketMode",
	"contractRev",
	"contractVersion",
	"darkMode",
	"entryTf",
	"trendTf",
	"signalBias",
	"stopLookback",
	"swingLookback",
	"minStopPct",
	"minStopAtr",
	"maxStopAtr",
	"targetCapR",
	"breakoutTargetR",
	"minRrr",
	"minNetR",
	"maxFeesR",
	"entryOrder",
	"rebatePct",
	"rebateCapUsd",
	"defaultFeeBps",
	"fallbackMakerBps",
	"fundingLeg",
	"quotes",
	"maxSignalAgeMin",
	"maxDriftAtr",
	"universeSize",
	"minVolume",
	"maxSpreadBps",
	"passAMax",
	"passBMax",
	"coreUniverse",
	"watchlist",
	"denylist",
	"excludeStables",
	"excludeWrapped",
	"excludeNew",
	"riskPerTradePct",
	"maxPositionPct",
	"heatCapMultiple",
	"numOps",
	"confidence",
	"weights",
	"maxLeverage",
	"liqBufferMultiple",
	"useIntradayMargin",
	"fundingDragR",
	"maxHoldH",
	"futMakerPct",
	"futTakerPct",
	"futPassThroughUsd",
	"includeNonCrypto",
	"minOiContracts",
	"minVolContracts",
	"equityUsd"
];
var KNOWN = new Set(CONFIG_KEYS);
var TF_ORDER = [
	"15m",
	"1H",
	"4H",
	"1D",
	"1W"
];
function withTrendGuard(config) {
	const entry = TF_ORDER.indexOf(config.entryTf);
	if (TF_ORDER.indexOf(config.trendTf) >= entry) return config;
	const next = TF_ORDER[Math.min(entry + 1, TF_ORDER.length - 1)] ?? config.entryTf;
	return {
		...config,
		trendTf: next
	};
}
function finite(value, fallback, min, max) {
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}
function flag(value, fallback) {
	if (typeof value === "boolean") return value;
	if (value === "1" || value === "true") return true;
	if (value === "0" || value === "false") return false;
	return fallback;
}
function oneOf(value, allowed, fallback) {
	return typeof value === "string" && allowed.includes(value) ? value : fallback;
}
function stringList(value, fallback) {
	const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : null;
	if (!source) return fallback;
	const out = [];
	for (const item of source) {
		const text = String(item).trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
		if (text && !out.includes(text)) out.push(text);
	}
	return out.slice(0, 40);
}
function quotesOf(value, fallback) {
	const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : null;
	if (!source) return fallback;
	const out = [];
	for (const item of source) {
		const text = String(item).trim().toUpperCase();
		if (QUOTE_IDS.includes(text) && !out.includes(text)) out.push(text);
	}
	return out.length ? out : fallback;
}
function weightsOf(value, fallback) {
	if (!value || typeof value !== "object") {
		if (typeof value === "string") {
			const parts = value.split(",").map((part) => Number(part.trim()));
			if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) return clampWeights({
				regime: parts[0],
				technical: parts[1],
				rr: parts[2]
			});
		}
		return fallback;
	}
	const raw = value;
	return clampWeights({
		regime: finite(raw.regime, fallback.regime, 0, 100),
		technical: finite(raw.technical, fallback.technical, 0, 100),
		rr: finite(raw.rr, fallback.rr, 0, 100)
	});
}
function unwrap(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const obj = value;
	if (obj.config && typeof obj.config === "object") return obj.config;
	if (obj.state && typeof obj.state === "object") {
		const state = obj.state;
		if (state.config && typeof state.config === "object") return state.config;
	}
	return obj;
}
function overlay(base, raw) {
	const size = finite(raw.universeSize, base.universeSize, 50, 500);
	const universeSize = SIZES.includes(size) ? size : base.universeSize;
	const ageRaw = raw.maxSignalAgeMin;
	const maxSignalAgeMin = ageRaw == null || ageRaw === "" || ageRaw === "null" ? base.maxSignalAgeMin : finite(ageRaw, base.maxSignalAgeMin ?? 0, 1, 2e4);
	return withTrendGuard({
		...base,
		target: raw.target === "grok" || raw.target === "grok_bot" ? raw.target : raw.targetLlm === "grok" ? "grok" : base.target,
		marketMode: oneOf(raw.marketMode, MODES, base.marketMode),
		entryTf: oneOf(raw.entryTf, TIMEFRAMES, base.entryTf),
		trendTf: oneOf(raw.trendTf, TIMEFRAMES, base.trendTf),
		signalBias: oneOf(raw.signalBias, BIASES, base.signalBias),
		stopLookback: Math.round(finite(raw.stopLookback, base.stopLookback, 2, 30)),
		swingLookback: Math.round(finite(raw.swingLookback, base.swingLookback, 5, 60)),
		minStopPct: finite(raw.minStopPct, base.minStopPct, .2, 20),
		minStopAtr: finite(raw.minStopAtr, base.minStopAtr, .2, 6),
		maxStopAtr: finite(raw.maxStopAtr, base.maxStopAtr, .5, 8),
		targetCapR: finite(raw.targetCapR, base.targetCapR, 1.2, 8),
		breakoutTargetR: finite(raw.breakoutTargetR, base.breakoutTargetR, .5, 6),
		minRrr: finite(raw.minRrr, base.minRrr, 1, 5),
		minNetR: finite(raw.minNetR, base.minNetR, 0, 6),
		maxFeesR: finite(raw.maxFeesR, base.maxFeesR, .05, 2),
		entryOrder: oneOf(raw.entryOrder, ORDERS, base.entryOrder),
		rebatePct: finite(raw.rebatePct, base.rebatePct, 0, 50),
		rebateCapUsd: finite(raw.rebateCapUsd, base.rebateCapUsd, 0, 1e5),
		defaultFeeBps: finite(raw.defaultFeeBps, base.defaultFeeBps, 0, 200),
		fallbackMakerBps: finite(raw.fallbackMakerBps, base.fallbackMakerBps, 0, 200),
		fundingLeg: oneOf(raw.fundingLeg, LEGS, base.fundingLeg),
		quotes: quotesOf(raw.quotes, base.quotes),
		maxSignalAgeMin,
		maxDriftAtr: finite(raw.maxDriftAtr, base.maxDriftAtr, .1, 3),
		universeSize,
		minVolume: finite(raw.minVolume, base.minVolume, 0, 5e8),
		maxSpreadBps: finite(raw.maxSpreadBps, base.maxSpreadBps, 1, 100),
		passAMax: Math.round(finite(raw.passAMax, base.passAMax, 5, 100)),
		passBMax: Math.round(finite(raw.passBMax, base.passBMax, 1, 40)),
		coreUniverse: stringList(raw.coreUniverse, base.coreUniverse),
		watchlist: stringList(raw.watchlist, base.watchlist),
		denylist: stringList(raw.denylist, base.denylist),
		excludeStables: flag(raw.excludeStables, base.excludeStables),
		excludeWrapped: flag(raw.excludeWrapped, base.excludeWrapped),
		excludeNew: flag(raw.excludeNew, base.excludeNew),
		riskPerTradePct: finite(raw.riskPerTradePct, base.riskPerTradePct, .1, 5),
		maxPositionPct: finite(raw.maxPositionPct, base.maxPositionPct, 1, 100),
		heatCapMultiple: finite(raw.heatCapMultiple, base.heatCapMultiple, 1, 8),
		numOps: Math.round(finite(raw.numOps, base.numOps, 1, 10)),
		confidence: finite(raw.confidence, base.confidence, 0, 95),
		weights: weightsOf(raw.weights, base.weights),
		maxLeverage: finite(raw.maxLeverage, base.maxLeverage, 1, 8),
		liqBufferMultiple: finite(raw.liqBufferMultiple, base.liqBufferMultiple, 1, 6),
		useIntradayMargin: flag(raw.useIntradayMargin, base.useIntradayMargin),
		fundingDragR: finite(raw.fundingDragR, base.fundingDragR, 0, 1),
		maxHoldH: finite(raw.maxHoldH, base.maxHoldH, 1, 240),
		futMakerPct: finite(raw.futMakerPct, base.futMakerPct, 0, 2),
		futTakerPct: finite(raw.futTakerPct, base.futTakerPct, 0, 2),
		futPassThroughUsd: finite(raw.futPassThroughUsd, base.futPassThroughUsd, 0, 5),
		includeNonCrypto: flag(raw.includeNonCrypto, base.includeNonCrypto),
		minOiContracts: finite(raw.minOiContracts, base.minOiContracts, 0, 1e6),
		minVolContracts: finite(raw.minVolContracts, base.minVolContracts, 0, 5e6),
		equityUsd: finite(raw.equityUsd, base.equityUsd, 0, 1e8),
		darkMode: flag(raw.darkMode, base.darkMode)
	});
}
function ignoredImportKeys(value) {
	const raw = unwrap(value);
	if (!raw) return [];
	return Object.keys(raw).filter((key) => !KNOWN.has(key));
}
function parseImportedConfig(value) {
	const raw = unwrap(value);
	if (!raw) return null;
	const named = raw.marketMode === "leverage" ? "perpsAggressive" : typeof raw.profile === "string" && OLD_PROFILE[raw.profile] ? OLD_PROFILE[raw.profile] : "aggressiveSpot";
	const next = overlay(configFor(named), raw);
	const drifted = searchFor({
		...next,
		profile: named
	}) !== (named === "aggressiveSpot" ? "" : `profile=${named}`);
	return {
		...next,
		profile: drifted ? "custom" : named
	};
}
function same(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function encodeValue(value) {
	if (value == null) return null;
	if (typeof value === "boolean") return value ? "1" : "0";
	if (typeof value === "number") return String(value);
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.join(",");
	if (typeof value === "object" && value && "regime" in value) {
		const weights = value;
		return `${weights.regime},${weights.technical},${weights.rr}`;
	}
	return null;
}
var SKIP_URL = /* @__PURE__ */ new Set([
	"darkMode",
	"contractRev",
	"contractVersion",
	"profile"
]);
function searchFor(config) {
	const baseId = config.profile === "swingSpot" || config.profile === "perpsAggressive" ? config.profile : "aggressiveSpot";
	const base = {
		...configFor(baseId, config.darkMode),
		target: configFor(baseId).target
	};
	const params = new URLSearchParams();
	if (config.profile !== "aggressiveSpot") params.set("profile", config.profile);
	for (const key of CONFIG_KEYS) {
		if (SKIP_URL.has(key)) continue;
		const value = config[key];
		const other = base[key];
		if (same(value, other)) continue;
		const encoded = encodeValue(value);
		if (encoded == null) continue;
		params.set(key, encoded);
	}
	return params.toString();
}
function configFromSearch(search, darkMode = true) {
	const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
	if ([...params.keys()].length === 0) return null;
	const profileParam = params.get("profile");
	const named = profileParam === "swingSpot" || profileParam === "perpsAggressive" || profileParam === "aggressiveSpot" ? profileParam : profileParam && OLD_PROFILE[profileParam] ? OLD_PROFILE[profileParam] : "aggressiveSpot";
	const raw = {};
	for (const [key, value] of params.entries()) {
		if (key === "profile") continue;
		raw[key] = value;
	}
	const next = overlay(configFor(named, darkMode), raw);
	const profile = profileParam === "custom" || profileParam == null && searchFor({
		...next,
		profile: "aggressiveSpot"
	}) !== "" ? "custom" : named;
	return {
		...next,
		profile,
		darkMode
	};
}
function forgetSavedHistory() {
	if (typeof localStorage === "undefined") return;
	localStorage.removeItem(LEGACY_STORAGE_KEY);
}
if (typeof window !== "undefined") forgetSavedHistory();
var useBlueprint = create()((set) => ({
	config: DEFAULT_CONFIG,
	section: "universe",
	mobilePane: "configure",
	hydrated: false,
	patch: (partial) => {
		set((state) => ({ config: withTrendGuard({
			...state.config,
			...partial,
			profile: partial.profile ?? state.config.profile,
			weights: partial.weights ? clampWeights(partial.weights) : state.config.weights
		}) }));
	},
	setWeight: (id, value) => {
		set((state) => ({ config: {
			...state.config,
			profile: "custom",
			weights: clampWeights({
				...state.config.weights,
				[id]: value
			})
		} }));
	},
	normalize: () => {
		set((state) => ({ config: {
			...state.config,
			profile: "custom",
			weights: clampWeights(normalizeWeights(state.config.weights))
		} }));
	},
	applyProfile: (id) => {
		set((state) => ({ config: withTrendGuard({
			...configFor(id, state.config.darkMode),
			target: state.config.target
		}) }));
	},
	reset: () => {
		set((state) => ({
			config: {
				...configFor("aggressiveSpot", state.config.darkMode),
				target: "grok_bot"
			},
			section: "universe"
		}));
	},
	importConfig: (config) => set({ config: withTrendGuard(config) }),
	setSection: (section) => set({ section }),
	setMobilePane: (mobilePane) => set({ mobilePane }),
	markHydrated: () => set({ hydrated: true }),
	replaceConfig: (config) => set({
		config: withTrendGuard(config),
		hydrated: true
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getShareHost = createServerFn({ method: "GET" }).handler(createSsrRpc("7f28a29e7d37bf13e303c5bec4358d18da820f2ca2b6fbbb96e791f11f12a40d"));
var styles_default = "/assets/styles-CCoQlG-H.css";
var APP_NAME = "Prompt Blueprint";
var THEME_BOOT = `(function(){document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");})();`;
var Route$1 = createRootRoute({
	loader: async () => {
		try {
			return await getShareHost();
		} catch {
			return "";
		}
	},
	head: ({ loaderData }) => {
		const host = typeof loaderData === "string" ? loaderData : "";
		const xBanner = host ? `https://${host}/x-banner.jpg` : "";
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ title: APP_NAME },
				{
					name: "theme-color",
					content: "#0b0c0e"
				},
				{
					name: "description",
					content: "A Grok contract for a Coinbase crypto screen. It does not trade."
				},
				...xBanner ? [{
					property: "x:game:image",
					content: xBanner
				}] : []
			],
			links: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg"
				},
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "manifest",
					href: "/__grok/manifest.webmanifest"
				},
				{
					rel: "apple-touch-icon",
					href: "/__grok/icon-180.png"
				}
			]
		};
	},
	component: RootDocument
});
function AppToaster() {
	const dark = useBlueprint((s) => s.config.darkMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		offset: 16,
		theme: dark ? "dark" : "light",
		toastOptions: {
			className: "font-sans",
			style: {
				background: "var(--elevated)",
				color: "var(--fg)",
				border: "1px solid var(--border)",
				boxShadow: "var(--shadow-border)"
			}
		}
	});
}
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppToaster, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter = () => import("./routes-BUq7WZUW.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { PROFILE_META as _, parseImportedConfig as a, TIMEFRAMES as b, copyText as c, formatCount as d, formatUsd as f, PILLARS as g, weightTotal as h, ignoredImportKeys as i, downloadText as l, profileLabel as m, configFromSearch as n, searchFor as o, parseTickerInput as p, forgetSavedHistory as r, useBlueprint as s, router_exports as t, estimateTokens as u, QUOTES as v, TIMEFRAME_MINUTES as x, TARGET_OPTIONS as y };
