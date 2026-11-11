import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as Slot, m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as Activity, a as SlidersHorizontal, c as Moon, d as FileText, f as FileOutput, g as BookOpen, h as Check, i as Sun, l as Info, m as Copy, n as Upload, o as Shield, p as Download, s as RotateCcw, t as X, u as Globe } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as PROFILE_META, a as parseImportedConfig, b as TIMEFRAMES, c as copyText, d as formatCount, f as formatUsd, g as PILLARS, h as weightTotal, i as ignoredImportKeys, l as downloadText, m as profileLabel, n as configFromSearch, o as searchFor, p as parseTickerInput, r as forgetSavedHistory, s as useBlueprint, u as estimateTokens, v as QUOTES, x as TIMEFRAME_MINUTES, y as TARGET_OPTIONS } from "./router-j3IBbSFG.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as TooltipTrigger, i as TooltipProvider$1, n as TooltipContent, r as TooltipPortal, t as Tooltip$1 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BUq7WZUW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider$1, {
		delayDuration: 250,
		children
	});
}
function Tooltip({ content, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		sideOffset: 6,
		className: cn("tip-motion z-50 max-w-xs rounded-lg bg-elevated px-3 py-2 text-xs leading-relaxed text-fg shadow-[var(--shadow-border)]"),
		children: content
	}) })] });
}
/** Canonical fee and sizing math. Percents are percentage points (1.05 = 1.05%). */
function effectivePct(ratePct, rebatePct) {
	return ratePct * (1 - rebatePct / 100);
}
/** Round-trip cost in percentage points. Maker entry + taker exit unless entry is taker. */
function spotRoundTripPct(input) {
	const makerEff = effectivePct(input.makerPct, input.rebatePct);
	const takerEff = effectivePct(input.takerPct, input.rebatePct);
	return (input.entryOrder === "maker" ? makerEff : takerEff) + takerEff;
}
function spotRtPct(config) {
	return spotRoundTripPct({
		makerPct: config.fallbackMakerBps / 100,
		takerPct: config.defaultFeeBps / 100,
		rebatePct: config.rebatePct,
		entryOrder: config.entryOrder
	});
}
function getNotices(config) {
	const notices = [];
	const leverage = config.marketMode === "leverage";
	if (config.targetCapR <= config.minRrr) notices.push({
		level: "error",
		message: "Target cap has to sit above the min gross R, or every idea fails."
	});
	if (config.minNetR > config.targetCapR) notices.push({
		level: "error",
		message: "Min net R is above the target cap, so nothing can qualify."
	});
	if (config.maxLeverage > 4) notices.push({
		level: "error",
		message: "Leverage is capped at 4x in this book."
	});
	if (config.riskPerTradePct > 2) notices.push({
		level: "error",
		message: "Risk per idea is above 2%."
	});
	if (leverage && config.liqBufferMultiple < 1.5) notices.push({
		level: "error",
		message: "The liquidation buffer has to be at least 1.5x the stop."
	});
	if (!leverage) {
		const feesR = spotRtPct(config) / config.minStopPct;
		if (feesR > config.maxFeesR) notices.push({
			level: "warn",
			message: `A stop at the minimum pays ${feesR.toFixed(2)}R in fees, above the ${config.maxFeesR}R cap.`
		});
		if (config.entryTf === "15m" || config.entryTf === "1H") notices.push({
			level: "warn",
			message: "15m and 1H spot stops are usually fee-heavy at retail taker rates."
		});
		if (config.fundingLeg === "btc") notices.push({
			level: "warn",
			message: "A BTC funding leg charges four fee legs on a USD or USDC pair."
		});
	}
	if (leverage && config.useIntradayMargin) notices.push({
		level: "warn",
		message: "Intraday margin reprices to the overnight rate at 4:00 PM ET."
	});
	if (config.target === "grok" && config.universeSize > 10 && !leverage) notices.push({
		level: "warn",
		message: "Without the connector, Grok only screens the core list, up to 10 names."
	});
	return notices;
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium uppercase tracking-widest text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		suppressHydrationWarning: true,
		className: cn("h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/50", className),
		...props
	});
}
function NativeSelect({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: cn("h-11 w-full appearance-none rounded-lg bg-elevated px-3 pr-9 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] outline-none focus-visible:ring-2 focus-visible:ring-accent/50", className),
			...props,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
			})
		})]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 grow overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-5 rounded-full bg-fg shadow-[var(--shadow-border)] transition-transform duration-[var(--motion-quick)] ease-[var(--ease-out)] outline-none hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-100" })]
	});
}
function Field({ label, hint, value, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor,
					children: label
				}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					content: hint,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pressable inline-flex size-11 items-center justify-center text-accent",
						"aria-label": `About ${label}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" })
					})
				}) : null]
			}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs tabular-nums text-accent",
				children: value
			}) : null]
		}), children]
	});
}
function SliderField({ id, label, hint, value, display, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		hint,
		value: display,
		htmlFor: id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			id,
			min,
			max,
			step,
			value: [value],
			onValueChange: ([v]) => onChange(v ?? min)
		})
	});
}
function SelectField({ id, label, hint, value, onChange, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		hint,
		htmlFor: id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
			id,
			value,
			onChange: (e) => onChange(e.target.value),
			children
		})
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-semibold leading-tight tracking-tight text-fg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-5",
			children
		})]
	});
}
function OutputSection() {
	const config = useBlueprint((s) => s.config);
	const patch = useBlueprint((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Guards",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nothing here is saved. Copy the prompt, or keep the link."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "ideas",
				label: "Max ideas",
				value: config.numOps,
				display: String(config.numOps),
				min: 1,
				max: 8,
				step: 1,
				onChange: (numOps) => patch({ numOps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "drift",
				label: "Max drift",
				hint: "Chase beyond this many ATR is a stale entry.",
				value: config.maxDriftAtr,
				display: `${config.maxDriftAtr.toFixed(1)} ATR`,
				min: .1,
				max: 2,
				step: .1,
				onChange: (maxDriftAtr) => patch({ maxDriftAtr })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "min-score",
				label: "Min score",
				value: config.confidence,
				display: String(config.confidence),
				min: 0,
				max: 90,
				step: 5,
				onChange: (confidence) => patch({ confidence })
			})
		]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-elevated shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-[var(--motion-quick)] data-[state=checked]:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-1 rounded-full bg-fg transition-transform duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] data-[state=checked]:translate-x-6 data-[state=checked]:bg-accent-fg" })
	});
}
function RiskSection() {
	const config = useBlueprint((s) => s.config);
	const patch = useBlueprint((s) => s.patch);
	const leverage = config.marketMode === "leverage";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Size",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "risk-pct",
				label: "Risk per idea",
				value: config.riskPerTradePct,
				display: `${config.riskPerTradePct.toFixed(2)}%`,
				min: .25,
				max: 2,
				step: .05,
				onChange: (riskPerTradePct) => patch({ riskPerTradePct })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "heat",
				label: "Heat cap",
				hint: "Open risk may be this many times one idea.",
				value: config.heatCapMultiple,
				display: `${config.heatCapMultiple.toFixed(1)}×`,
				min: 1,
				max: 6,
				step: .5,
				onChange: (heatCapMultiple) => patch({ heatCapMultiple })
			}),
			!leverage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "max-position",
				label: "Max position",
				value: config.maxPositionPct,
				display: `${config.maxPositionPct.toFixed(0)}%`,
				min: 5,
				max: 50,
				step: 1,
				onChange: (maxPositionPct) => patch({ maxPositionPct })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "equity",
				label: "Fallback equity",
				hint: "Used when no balance comes back, and always for Grok.",
				value: config.equityUsd,
				display: `$${config.equityUsd.toLocaleString()}`,
				min: 100,
				max: 1e5,
				step: 100,
				onChange: (equityUsd) => patch({ equityUsd })
			})
		]
	}), leverage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Futures cost",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "fut-maker",
				label: "Fallback maker",
				hint: "Percent. Live FUTURE fees replace this.",
				value: config.futMakerPct,
				display: `${config.futMakerPct.toFixed(3)}%`,
				min: 0,
				max: .5,
				step: .005,
				onChange: (futMakerPct) => patch({ futMakerPct })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "fut-taker",
				label: "Fallback taker",
				value: config.futTakerPct,
				display: `${config.futTakerPct.toFixed(3)}%`,
				min: 0,
				max: .5,
				step: .005,
				onChange: (futTakerPct) => patch({ futTakerPct })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "fut-pt",
				label: "Pass-through",
				hint: "Dollars per contract per side. US exchange fee is $0.10. The rest of $0.15 is unverified.",
				value: config.futPassThroughUsd,
				display: `$${config.futPassThroughUsd.toFixed(2)}`,
				min: 0,
				max: 1,
				step: .01,
				onChange: (futPassThroughUsd) => patch({ futPassThroughUsd })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "max-lev",
				label: "Max leverage",
				hint: "Hard ceiling is 4x. Sizing uses overnight margin.",
				value: config.maxLeverage,
				display: `${config.maxLeverage.toFixed(1)}x`,
				min: 1,
				max: 4,
				step: .5,
				onChange: (maxLeverage) => patch({ maxLeverage })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "liq-buffer",
				label: "Liquidation buffer",
				hint: "Stop must be inside 1 / this of the distance to the overnight margin line.",
				value: config.liqBufferMultiple,
				display: `${config.liqBufferMultiple.toFixed(1)}×`,
				min: 1.5,
				max: 4,
				step: .1,
				onChange: (liqBufferMultiple) => patch({ liqBufferMultiple })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "funding-drag",
				label: "Funding drag cap",
				value: config.fundingDragR,
				display: `${config.fundingDragR.toFixed(2)}R`,
				min: .05,
				max: .5,
				step: .01,
				onChange: (fundingDragR) => patch({ fundingDragR })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-11 items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: "Show intraday margin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Display only. The stop still uses overnight margin."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: config.useIntradayMargin,
					onCheckedChange: (useIntradayMargin) => patch({ useIntradayMargin })
				})]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Spot cost",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
				id: "entry-order",
				label: "Entry",
				hint: "Exit is always taker.",
				value: config.entryOrder,
				onChange: (entryOrder) => patch({ entryOrder }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "maker",
					children: "Maker (post-only)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "taker",
					children: "Taker"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "rebate",
				label: "Fee rebate",
				hint: "Coinbase One Preferred is 25%, paid in USDC, cap $100 a month.",
				value: config.rebatePct,
				display: `${config.rebatePct.toFixed(0)}%`,
				min: 0,
				max: 25,
				step: 1,
				onChange: (rebatePct) => patch({ rebatePct })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "rebate-cap",
				label: "Rebate cap",
				value: config.rebateCapUsd,
				display: `$${config.rebateCapUsd.toFixed(0)}`,
				min: 0,
				max: 500,
				step: 10,
				onChange: (rebateCapUsd) => patch({ rebateCapUsd })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
				id: "funding-leg",
				label: "Funding leg",
				value: config.fundingLeg,
				onChange: (fundingLeg) => patch({ fundingLeg }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "quote",
					children: "Quote (2 legs)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "btc",
					children: "BTC (4 legs off a BTC book)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "fallback-taker",
				label: "Fallback taker bps",
				hint: "Used only if the live fee read fails.",
				value: config.defaultFeeBps,
				display: `${config.defaultFeeBps} bps`,
				min: 0,
				max: 150,
				step: 1,
				onChange: (defaultFeeBps) => patch({ defaultFeeBps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "fallback-maker",
				label: "Fallback maker bps",
				value: config.fallbackMakerBps,
				display: `${config.fallbackMakerBps} bps`,
				min: 0,
				max: 100,
				step: 1,
				onChange: (fallbackMakerBps) => patch({ fallbackMakerBps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "max-fees",
				label: "Max fees R",
				value: config.maxFeesR,
				display: `${config.maxFeesR.toFixed(2)}R`,
				min: .1,
				max: 1,
				step: .05,
				onChange: (maxFeesR) => patch({ maxFeesR })
			})
		]
	})] });
}
var buttonVariants = cva("pressable inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-fg/80 hover:bg-elevated hover:text-fg",
			outline: "text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			danger: "bg-danger text-bg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-11 px-3 text-xs",
			icon: "size-11",
			"icon-sm": "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var TONES = {
	regime: "bg-accent",
	technical: "bg-accent/70",
	rr: "bg-accent/40"
};
function WeightBar({ weights }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-2 overflow-hidden rounded-full bg-elevated",
			children: PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("weight-seg h-full", TONES[p.id]),
				style: { width: `${Math.max(weights[p.id], 0)}%` },
				title: `${p.short} ${weights[p.id]}%`
			}, p.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-3 gap-x-3 gap-y-1.5",
			children: PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${TONES[p.id]}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.short }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto font-mono tabular-nums text-fg",
						children: weights[p.id]
					})
				]
			}, p.id))
		})]
	});
}
function ScoringSection() {
	const config = useBlueprint((s) => s.config);
	const setWeight = useBlueprint((s) => s.setWeight);
	const patch = useBlueprint((s) => s.patch);
	const normalize = useBlueprint((s) => s.normalize);
	const total = weightTotal(config);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Score",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Regime, technical, and R. Missing data is dropped, not scored as zero."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("font-mono text-sm tabular-nums", total === 100 ? "text-accent" : "text-warn"),
					children: [total, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightBar, { weights: config.weights }),
			total !== 100 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: normalize,
				children: "Normalize to 100%"
			}) : null,
			PILLARS.map((pillar) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: `w-${pillar.id}`,
				label: pillar.label,
				value: config.weights[pillar.id],
				display: `${config.weights[pillar.id]}`,
				min: 0,
				max: 100,
				step: 5,
				onChange: (value) => setWeight(pillar.id, value)
			}, pillar.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "min-gross",
				label: "Min gross R",
				value: config.minRrr,
				display: config.minRrr.toFixed(1),
				min: 1,
				max: 4,
				step: .1,
				onChange: (minRrr) => patch({ minRrr })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "target-cap",
				label: "Target cap R",
				value: config.targetCapR,
				display: config.targetCapR.toFixed(1),
				min: 1.5,
				max: 6,
				step: .1,
				onChange: (targetCapR) => patch({ targetCapR })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "breakout-r",
				label: "Breakout target R",
				value: config.breakoutTargetR,
				display: config.breakoutTargetR.toFixed(1),
				min: 1,
				max: 5,
				step: .1,
				onChange: (breakoutTargetR) => patch({ breakoutTargetR })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "min-net",
				label: "Min net R",
				value: config.minNetR,
				display: config.minNetR.toFixed(1),
				min: 0,
				max: 4,
				step: .1,
				onChange: (minNetR) => patch({ minNetR })
			})
		]
	});
}
function StrategySection() {
	const config = useBlueprint((s) => s.config);
	const patch = useBlueprint((s) => s.patch);
	const leverage = config.marketMode === "leverage";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: leverage ? "Futures setup" : "Spot setup",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
				id: "entry-tf",
				label: "Entry timeframe",
				value: config.entryTf,
				onChange: (entryTf) => patch({ entryTf }),
				children: TIMEFRAMES.map((tf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: tf,
					children: tf
				}, tf))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
				id: "trend-tf",
				label: "Trend timeframe",
				value: config.trendTf,
				onChange: (trendTf) => patch({ trendTf }),
				children: TIMEFRAMES.map((tf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: tf,
					children: tf
				}, tf))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
				id: "side",
				label: "Side",
				value: config.signalBias,
				onChange: (signalBias) => patch({ signalBias }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "long",
						children: "Long"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "short",
						children: "Short"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "both",
						children: "Both"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "stop-lookback",
				label: "Stop lookback",
				hint: "Closed entry bars.",
				value: config.stopLookback,
				display: String(config.stopLookback),
				min: 2,
				max: 20,
				step: 1,
				onChange: (stopLookback) => patch({ stopLookback })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "swing-lookback",
				label: "Swing lookback",
				value: config.swingLookback,
				display: String(config.swingLookback),
				min: 5,
				max: 40,
				step: 1,
				onChange: (swingLookback) => patch({ swingLookback })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "min-stop-atr",
				label: "Min stop",
				hint: "Times ATR. Tighter than this is rejected.",
				value: config.minStopAtr,
				display: `${config.minStopAtr.toFixed(1)} ATR`,
				min: .5,
				max: 3,
				step: .1,
				onChange: (minStopAtr) => patch({ minStopAtr })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "max-stop-atr",
				label: "Max stop",
				value: config.maxStopAtr,
				display: `${config.maxStopAtr.toFixed(1)} ATR`,
				min: 1,
				max: 4,
				step: .1,
				onChange: (maxStopAtr) => patch({ maxStopAtr })
			}),
			!leverage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "min-stop-pct",
				label: "Min stop %",
				hint: "A tighter spot stop is STOP_TIGHT.",
				value: config.minStopPct,
				display: `${config.minStopPct.toFixed(1)}%`,
				min: .5,
				max: 10,
				step: .1,
				onChange: (minStopPct) => patch({ minStopPct })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
				id: "max-hold",
				label: "Max hold",
				hint: "Funding is estimated only this far.",
				value: config.maxHoldH,
				display: `${config.maxHoldH}h`,
				min: 1,
				max: 168,
				step: 1,
				onChange: (maxHoldH) => patch({ maxHoldH })
			})
		]
	});
}
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("flex size-6 shrink-0 items-center justify-center rounded-md bg-elevated text-accent shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 data-[state=checked]:shadow-[var(--shadow-border-hover)]", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			className: "check-pop grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-3.5",
				strokeWidth: 2.5
			})
		})
	});
}
function UniverseSection() {
	const config = useBlueprint((s) => s.config);
	const patch = useBlueprint((s) => s.patch);
	const leverage = config.marketMode === "leverage";
	function toggleQuote(quote) {
		const next = config.quotes.includes(quote) ? config.quotes.filter((item) => item !== quote) : [...config.quotes, quote];
		if (!next.length) return;
		patch({ quotes: next });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		leverage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Futures universe",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
					id: "min-vol-contracts",
					label: "Min 24h volume",
					hint: "Contracts, not dollars. Thin books are skipped.",
					value: config.minVolContracts,
					display: config.minVolContracts.toLocaleString(),
					min: 0,
					max: 1e5,
					step: 1e3,
					onChange: (minVolContracts) => patch({ minVolContracts })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
					id: "min-oi",
					label: "Min open interest",
					hint: "Contracts. A name under this is skipped.",
					value: config.minOiContracts,
					display: config.minOiContracts.toLocaleString(),
					min: 0,
					max: 1e5,
					step: 1e3,
					onChange: (minOiContracts) => patch({ minOiContracts })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-11 items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: "Include metals, energy, and indexes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Off keeps crypto perp-style contracts only."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: config.includeNonCrypto,
						onCheckedChange: (includeNonCrypto) => patch({ includeNonCrypto })
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Spot universe",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
					id: "universe-size",
					label: "Universe size",
					hint: "How many names survive the volume rank before the candle pass.",
					value: String(config.universeSize),
					onChange: (value) => patch({ universeSize: Number(value) }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "50",
							children: "Top 50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "100",
							children: "Top 100"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "200",
							children: "Top 200"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "500",
							children: "Top 500"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
					id: "min-volume",
					label: "Min 24h volume",
					hint: "Quote notional. BTC-quoted books must clear the same floor.",
					value: config.minVolume,
					display: formatUsd(config.minVolume),
					min: 1e6,
					max: 5e7,
					step: 1e6,
					onChange: (minVolume) => patch({ minVolume })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
					id: "max-spread",
					label: "Max spread",
					value: config.maxSpreadBps,
					display: `${config.maxSpreadBps} bps`,
					min: 1,
					max: 50,
					step: 1,
					onChange: (maxSpreadBps) => patch({ maxSpreadBps })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: QUOTES.map((quote) => {
						const on = config.quotes.includes(quote);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => toggleQuote(quote),
							className: cn("pressable h-11 rounded-full px-3 text-xs font-medium", on ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
							children: quote
						}, quote);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-xs font-medium uppercase tracking-widest text-muted",
							children: "Exclusions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Exclusion, {
							id: "exclude-stables",
							label: "Exclude stablecoins",
							checked: config.excludeStables,
							onChange: (excludeStables) => patch({ excludeStables })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Exclusion, {
							id: "exclude-wrapped",
							label: "Exclude wrapped assets",
							checked: config.excludeWrapped,
							onChange: (excludeWrapped) => patch({ excludeWrapped })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Exclusion, {
							id: "exclude-new",
							label: "Exclude new listings (<30d)",
							checked: config.excludeNew,
							onChange: (excludeNew) => patch({ excludeNew })
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerListCard, {
			title: "Core list",
			hint: "Used when the product list comes back short.",
			values: config.coreUniverse,
			onChange: (coreUniverse) => patch({ coreUniverse }),
			placeholder: leverage ? "BIP, ETP" : "BTC-USD, ETH-USD"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerListCard, {
			title: "Watchlist",
			hint: "Always added when the product is returned.",
			values: config.watchlist,
			onChange: (watchlist) => patch({ watchlist }),
			placeholder: "ETH-USD"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerListCard, {
			title: "Denylist",
			hint: "Base or full product id.",
			values: config.denylist,
			onChange: (denylist) => patch({ denylist }),
			placeholder: "DOGE-USD"
		})
	] });
}
function Exclusion({ id, label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "flex min-h-11 items-center justify-between gap-3 text-sm",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
			id,
			checked,
			onCheckedChange: (v) => onChange(v === true)
		})]
	});
}
function TickerListCard({ title, hint, values, onChange, placeholder }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	function add() {
		const incoming = parseTickerInput(draft);
		if (!incoming.length) return;
		const next = [...values];
		for (const ticker of incoming) if (!next.includes(ticker) && next.length < 40) next.push(ticker);
		onChange(next);
		setDraft("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft,
					placeholder,
					onChange: (e) => setDraft(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							add();
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: add,
					disabled: !draft.trim(),
					children: "Add"
				})]
			}),
			values.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-1.5",
				children: values.map((ticker) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "pressable inline-flex h-9 items-center gap-1 rounded-full bg-elevated px-2.5 font-mono text-xs",
					onClick: () => onChange(values.filter((item) => item !== ticker)),
					children: [ticker, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })]
				}) }, ticker))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "None yet."
			})
		]
	});
}
var TABS = [
	{
		id: "universe",
		label: "Universe",
		icon: Globe
	},
	{
		id: "strategy",
		label: "Strategy",
		icon: Activity
	},
	{
		id: "risk",
		label: "Risk",
		icon: Shield
	},
	{
		id: "scoring",
		label: "Scoring",
		icon: SlidersHorizontal
	},
	{
		id: "output",
		label: "Output",
		icon: FileOutput
	}
];
function ConfigPanel() {
	const section = useBlueprint((s) => s.section);
	const setSection = useBlueprint((s) => s.setSection);
	const notices = getNotices(useBlueprint((s) => s.config));
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [section]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar flex gap-1 overflow-x-auto px-4 pt-3 pb-2",
				children: TABS.map((tab) => {
					const Icon = tab.icon;
					const on = section === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSection(tab.id),
						className: cn("pressable inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-medium select-none", on ? "bg-accent text-accent-fg" : "text-muted hover:bg-elevated hover:text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), tab.label]
					}, tab.id);
				})
			}),
			notices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 px-4 pb-2",
				children: notices.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cn("notice-in rounded-lg px-3 py-2 text-xs leading-relaxed shadow-[var(--shadow-border)]", n.level === "error" ? "bg-warn/15 text-warn" : n.level === "warn" ? "text-warn" : "text-accent"),
					children: n.message
				}, n.message))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in grid gap-4",
					children: [
						section === "universe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniverseSection, {}),
						section === "strategy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StrategySection, {}),
						section === "risk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskSection, {}),
						section === "scoring" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoringSection, {}),
						section === "output" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutputSection, {})
					]
				}, section)
			})
		]
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("dialog-panel fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[min(92vw,40rem)] overflow-y-auto rounded-3xl bg-surface p-4 text-fg shadow-[var(--shadow-border)] outline-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4 px-2 pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-2xl leading-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-2 pt-4 pb-2",
			children
		})]
	})] });
}
function GuideBody() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 text-sm leading-relaxed text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This builds one paste-ready Coinbase scan. It does not trade, and it does not keep a history. The link is the setting." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: "Grok Bot"
			}), " uses the Coinbase connector and computes every number in code. Read-only tools only."] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: "Grok"
			}), " has no account tools. Paste a USER DATA block, or it may read the public candle and ticker URLs. Futures candles are not on that public API, so a leverage run needs the paste."] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: "Aggressive"
			}), " is the default: 4 hour entries, daily trend, maker entry, taker exit, after a 25% Coinbase One rebate capped at $100 a month."] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: "Perps"
			}), " is US futures only. Stops are checked against overnight margin. Losses can exceed margin."] })
		]
	});
}
function IconSwap({ show, children, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative grid size-4 place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"data-show": show ? "true" : "false",
			className: "icon-swap col-start-1 row-start-1",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"data-show": show ? "false" : "true",
			className: "icon-swap col-start-1 row-start-1",
			children: alt
		})]
	});
}
var PROFILES = Object.keys(PROFILE_META);
function subtitle(config) {
	return `${profileLabel(config)} · ${config.marketMode === "leverage" ? "US futures" : "spot"} · ${config.target === "grok" ? "Grok" : "Grok Bot"}`;
}
function AppHeader() {
	const config = useBlueprint((s) => s.config);
	const patch = useBlueprint((s) => s.patch);
	const applyProfile = useBlueprint((s) => s.applyProfile);
	const reset = useBlueprint((s) => s.reset);
	const importConfig = useBlueprint((s) => s.importConfig);
	const fileRef = (0, import_react.useRef)(null);
	const [guideOpen, setGuideOpen] = (0, import_react.useState)(false);
	const [resetOpen, setResetOpen] = (0, import_react.useState)(false);
	function onImportFile(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const raw = JSON.parse(String(reader.result));
				const parsed = parseImportedConfig(raw);
				if (!parsed) throw new Error("bad");
				importConfig(parsed);
				const ignored = ignoredImportKeys(raw);
				toast.success(ignored.length ? `Imported. Ignored: ${ignored.slice(0, 6).join(", ")}` : "Config imported");
			} catch {
				toast.error("That file is not a blueprint config");
			}
		};
		reader.readAsText(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "shrink-0 border-b border-border bg-bg/80 backdrop-blur-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full min-w-0 items-center gap-2 sm:w-auto sm:gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 sm:flex-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate font-display text-lg font-semibold leading-none tracking-tight sm:text-xl",
								children: "Prompt Blueprint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 truncate font-mono text-xs text-muted",
								children: subtitle(config)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 shrink-0 overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]",
						role: "group",
						"aria-label": "Target",
						children: TARGET_OPTIONS.map((option) => {
							const on = config.target === option.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": on,
								onClick: () => patch({ target: option.id }),
								className: cn("pressable h-11 rounded-full px-3 text-sm font-medium select-none", on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
								children: option.label
							}, option.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 shrink-0 overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]",
						role: "group",
						"aria-label": "Market",
						children: [["spot", "Spot"], ["leverage", "Leverage"]].map(([id, label]) => {
							const on = config.marketMode === id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": on,
								onClick: () => patch({ marketMode: id }),
								className: cn("pressable h-11 rounded-full px-4 text-sm font-medium select-none", on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
								children: label
							}, id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								"aria-label": config.darkMode ? "Switch to light mode" : "Switch to dark mode",
								onClick: () => {
									const next = !config.darkMode;
									patch({ darkMode: next });
									document.documentElement.classList.toggle("dark", next);
									document.documentElement.classList.toggle("light", !next);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSwap, {
									show: config.darkMode,
									alt: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								"aria-label": "Guide",
								onClick: () => setGuideOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								"aria-label": "Import settings",
								onClick: () => fileRef.current?.click(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json",
								className: "hidden",
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) onImportFile(file);
									event.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								"aria-label": "Reset to defaults",
								onClick: () => setResetOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 lg:px-6",
				children: [PROFILES.map((id) => {
					const on = config.profile === id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": on,
						onClick: () => applyProfile(id),
						className: cn("pressable h-11 shrink-0 rounded-full px-3 text-xs font-medium select-none", on ? "bg-accent text-accent-fg" : "text-muted hover:bg-elevated hover:text-fg"),
						children: PROFILE_META[id].label
					}, id);
				}), config.profile === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-11 items-center rounded-full px-3 text-xs text-accent",
					children: "Custom"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: guideOpen,
				onOpenChange: setGuideOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "How to use this",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBody, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: resetOpen,
				onOpenChange: setResetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Reset this book?",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Every control returns to Aggressive Spot. The link updates. Nothing is stored."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setResetOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								reset();
								setResetOpen(false);
								toast.success("Back to Aggressive Spot");
							},
							children: "Reset"
						})]
					})]
				})
			})
		]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		"aria-hidden": true,
		viewBox: "0 0 32 32",
		className: "size-8 shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "8",
			className: "fill-accent"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M8 22V10h4.2l3.8 7.2L19.8 10H24v12h-3.2v-7.1L17.2 22h-2.4l-3.6-7.1V22H8Z",
			className: "fill-accent-fg"
		})]
	});
}
function dataSection(target, mode) {
	if (target === "grok") return [
		"T DATA (Grok)",
		"You have no Coinbase account tools. Data sources, in order:",
		"1) USER DATA block below, if filled. 2) Public endpoints:",
		"https://api.exchange.coinbase.com/products/{ID}/candles?granularity={60|300|900|3600|21600|86400}",
		"https://api.coinbase.com/api/v3/brokerage/market/products/{ID}/ticker?limit=1",
		"Never use prices from news, aggregators or memory. If neither source works -> NO_DATA, list what to paste, stop.",
		"Fees: use the FEES block. Equity: use EQUITY. Compute with code if available, else show the arithmetic.",
		"Universe limited to the CORE list (max 10).",
		mode === "leverage" ? "CFM futures ids are not on the public exchange candle API (BIP-20DEC30-CDE returned NotFound on 15 Oct 2026). Leverage candles, margin, and funding must be in USER DATA or the run is NO_DATA." : "",
		"USER DATA:",
		"<paste here>"
	].filter(Boolean).join("\n");
	return [
		"T DATA (Grok Bot)",
		"Use the Coinbase connector (namespace user-Coinbase-xai). Read-only tools only:",
		"coinbase_fees (SPOT, and FUTURE in Leverage mode), coinbase_products_list (paginate cursor; FUTURE in Leverage),",
		"coinbase_products_get, coinbase_products_candles, coinbase_products_best_bid_ask, coinbase_products_book,",
		"coinbase_products_ticker, coinbase_portfolios_list, coinbase_portfolios_get, coinbase_balance.",
		"FORBIDDEN: any orders_*, close_position, convert_*, transfer, portfolios_create/edit/delete, x402_*.",
		"Compute every indicator and number in code (shell), never by eye. Missing a required tool -> MISSING_TOOLS, print why, stop.",
		"1W bars: aggregate 1d candles into ISO weeks in code (the tool has no 1w granularity).",
		"There is no futures positions or margin-ratio tool. Equity = DERIVATIVES_CASH plus available USD/USDC, else EQUITY_USD (tag EQUITY_INPUT). Assume no open futures positions unless USER DATA lists them."
	].join("\n");
}
function num(value) {
	if (!Number.isFinite(value)) return "na";
	const rounded = Math.round(value * 1e3) / 1e3;
	return String(rounded);
}
function profileTitle(config) {
	if (config.profile === "custom") return "Custom";
	return profileLabel(config);
}
function targetTitle(config) {
	return TARGET_OPTIONS.find((row) => row.id === config.target)?.label ?? "Grok Bot";
}
function headerLine(config) {
	const mode = config.marketMode === "leverage" ? "Leverage" : "Spot";
	return `PROMPT BLUEPRINT v5.1 | ${profileTitle(config)} | ${targetTitle(config)} | ${mode}`;
}
function indicatorBlock() {
	return [
		"D DEFINITIONS",
		"Closed bars only. Compute in code.",
		"D1 Drop a candle whose start plus its granularity is after now. Sort ascending. Dedupe by start.",
		"D2 ATR14 Wilder. TR = max(h-l, abs(h-prev close), abs(l-prev close)). Seed = mean of the first 14 TR, then (13 x prior + TR)/14. ATR% = ATR/last close x 100. Fewer than 15 bars -> na.",
		"D3 1W = ISO weeks from closed 1d candles (Monday 00:00 UTC). Open first, high max, low min, close last, volume sum. Drop the partial week.",
		"D4 RSI14 Wilder. Seed avgGain and avgLoss on the first 14 changes, then (13 x prev + x)/14. RSI = 100 - 100/(1+avgGain/avgLoss). avgLoss 0 -> 100.",
		"D5 SMA20 of closes. UP if close > SMA20 and SMA20 > SMA20 of five bars earlier. DOWN if both reverse. Else FLAT. Fewer than 25 bars -> na.",
		"D6 EMA20, only if a step cites it: alpha = 2/21, seed = SMA20. Do not invent an EMA use.",
		"D7 BREAKOUT = close > max high of the prior SWING_LOOKBACK bars. CONTINUATION = entry trend equals the side and the last-10 min low is above the prior-10 min low. SWEEP_RECLAIM = one of the last 3 bars takes the 20-bar extreme and the last close reclaims it.",
		"D8 VWAP = sum(typical price x volume) / sum(volume). 15m and 1H from 00:00 UTC. 4H last 42 bars. 1D last 20. Zero volume -> na.",
		"D9 Regime = BTC-USD trend on TREND_TF. Long: UP 1, FLAT 0.5, DOWN 0. Short mirrors. The BTC idea itself is na."
	].join("\n");
}
var STABLES = [
	"USDT",
	"USDC",
	"DAI",
	"TUSD",
	"USDP",
	"GUSD",
	"PYUSD",
	"EURC",
	"FDUSD"
];
var WRAPPED = [
	"WBTC",
	"WETH",
	"WSTETH",
	"CBETH",
	"WEETH"
];
function signalAgeMin(config) {
	if (config.maxSignalAgeMin != null && Number.isFinite(config.maxSignalAgeMin)) return config.maxSignalAgeMin;
	return TIMEFRAME_MINUTES[config.entryTf];
}
function list$1(items) {
	return items.length ? items.join(",") : "none";
}
function buildSpotContract(config) {
	const age = signalAgeMin(config);
	const excludes = [...config.excludeStables ? STABLES : [], ...config.excludeWrapped ? WRAPPED : []];
	const text = [
		headerLine(config),
		"",
		"R0 ROLE",
		"You are a read-only Coinbase Advanced Trade spot scanner. Analysis only.",
		"Never call an order, close-position, convert, transfer, portfolio-write, or payment tool.",
		"Every number comes from this run's data and is computed in code, or it is na. na is never 0.",
		"Zero qualified ideas is a valid result. Do not invent a product id, price, or fill.",
		"",
		dataSection(config.target, "spot"),
		"",
		"S STEPS",
		"S1 Data. S2 Fees and equity. S3 Universe U. S4 Pass A then Pass B.",
		"S5 Indicators. S6 Side, stop, target, fees. S7 Rank. S8 Print OUT.",
		"Reason privately. Print only OUT.",
		"",
		"U UNIVERSE",
		"Request product_type=SPOT with an explicit limit. Follow pagination.next_cursor / has_next.",
		"If num_products equals the limit with no cursor, or the response is cut off, flag UNIVERSE_PARTIAL.",
		"Retry once with a smaller limit, then product_ids batches over CORE + WATCHLIST.",
		"Print the method and the row counts. Absent market_cap never drops a name.",
		"",
		"A PASS A",
		"Keep SPOT, quote in QUOTES, online, not trading_disabled, base not in DENY or EXCLUDE.",
		"A listing newer than 30 days drops only when the time is present.",
		"quote_notional_24h = volume_24h x price. One book per base: higher notional, then product_id.",
		"Below MIN_VOL_USD -> VOL_FLOOR. Keep the first PASS_A_MAX after adding WATCHLIST names that returned.",
		"",
		"B PASS B",
		"Spread: (ask-bid)/mid x 10000. Above MAX_SPREAD_BPS -> WIDE_SPREAD.",
		"Candles need start and end. Entry TF >= 60 closed bars. Trend TF >= 30. Also 1d >= 21.",
		"Candle limit is 350. There is no weekly candle. Build 1W from 1d bars.",
		"",
		indicatorBlock(),
		"",
		"F SPOT FEES",
		"maker_pct, taker_pct = live FEES maker_fee_rate and taker_fee_rate times 100.",
		"If that read fails: maker_pct = FALLBACK_MAKER_BPS/100, taker_pct = FALLBACK_TAKER_BPS/100, tag FEES_ASSUMED.",
		"eff = pct x (1 - REBATE_PCT/100). Rebate applies only while estimated month fees are under REBATE_CAP_USD / (REBATE_PCT/100).",
		"rt_pct = (ENTRY_ORDER=maker ? maker_eff : taker_eff) + taker_eff.",
		"legs = 2, or 4 if FUNDING_LEG=btc and the quote is not BTC.",
		"stop_pct = abs(entry-stop)/entry x 100.",
		"fees_R = rt_pct x legs/2 / stop_pct.",
		"gross_R = (target-entry)/risk for a long, mirrored for a short.",
		"gross_R < MIN_GROSS_R -> RRR. fees_R > MAX_FEES_R -> FEE_HEAVY. net_R = gross_R - fees_R < MIN_NET_R -> NET_R.",
		"stop_pct < MIN_STOP_PCT -> STOP_TIGHT.",
		"",
		"G SIDE",
		"Long stop = min low of the last STOP_LOOKBACK closed entry bars, minus one tick. Short mirrors.",
		"stop_dist must be within [MIN_STOP_ATR, MAX_STOP_ATR] x ATR14, else STOP_ATR.",
		"Target = opposite SWING_LOOKBACK swing, or BREAKOUT_TARGET_R x risk on a breakout or when the swing is not beyond entry. Then cap at TARGET_CAP_R x risk.",
		"Age = minutes since the signal bar closed. Age > MAX_SIGNAL_AGE_MIN -> STALE_SIGNAL.",
		"drift = (entry - signal close) / ATR in the chase direction. drift > MAX_DRIFT_ATR -> STALE_ENTRY.",
		"One side. First match: SWEEP_RECLAIM, BREAKOUT, CONTINUATION.",
		"Trend opposite the side, and the setup is not SWEEP_RECLAIM -> TF_CONFLICT.",
		"A spot short is research only. It is not a fill.",
		"",
		"K RANK",
		"exp_R = gross_R x setup_mult - fees_R. Mult: BREAKOUT 1, CONTINUATION 1, SWEEP_RECLAIM 0.85.",
		"Rank by exp_R, then final, then product_id. Keep the first MAX_IDEAS.",
		"final = raw. raw = 100 x sum(weight x value) / sum(weights). coverage < 0.7 -> COVERAGE. final < MIN_SCORE -> SCORE.",
		"",
		"OUT",
		"Receipt: time UTC, fee source (live or assumed), rebate used or not, universe method and counts, qualified count, top drop codes, and the line No order was sent.",
		"Table: product, side, setup, entry, stop, target, gross_R, fees_R, net_R, exp_R, notional, tags.",
		"Then up to 5 near-misses with codes. Zero qualified ideas is a complete result.",
		"",
		"C CONFIG",
		`PROFILE=${config.profile} SIDE=${config.signalBias} ENTRY_TF=${config.entryTf} TREND_TF=${config.trendTf} ENTRY_ORDER=${config.entryOrder}`,
		`QUOTES=${config.quotes.join(",")} TOP_N=${config.universeSize} MIN_VOL_USD=${config.minVolume} MAX_SPREAD_BPS=${num(config.maxSpreadBps)}`,
		`PASS_A_MAX=${config.passAMax} PASS_B_MAX=${config.passBMax} MAX_IDEAS=${config.numOps}`,
		`CORE=${list$1(config.coreUniverse)} WATCH=${list$1(config.watchlist)} DENY=${list$1(config.denylist)} EXCLUDE=${list$1(excludes)}`,
		`STOP_LOOKBACK=${config.stopLookback} SWING_LOOKBACK=${config.swingLookback} MIN_STOP_PCT=${num(config.minStopPct)} MIN_STOP_ATR=${num(config.minStopAtr)} MAX_STOP_ATR=${num(config.maxStopAtr)}`,
		`MIN_GROSS_R=${num(config.minRrr)} MIN_NET_R=${num(config.minNetR)} TARGET_CAP_R=${num(config.targetCapR)} BREAKOUT_TARGET_R=${num(config.breakoutTargetR)} MAX_FEES_R=${num(config.maxFeesR)}`,
		`REBATE_PCT=${num(config.rebatePct)} REBATE_CAP_USD=${num(config.rebateCapUsd)} FALLBACK_MAKER_BPS=${num(config.fallbackMakerBps)} FALLBACK_TAKER_BPS=${num(config.defaultFeeBps)} FUNDING_LEG=${config.fundingLeg}`,
		`MAX_DRIFT_ATR=${num(config.maxDriftAtr)} MAX_SIGNAL_AGE_MIN=${num(age)} RISK_PCT=${num(config.riskPerTradePct)} MAX_POSITION_PCT=${num(config.maxPositionPct)} EQUITY_USD=${num(config.equityUsd)}`,
		`W regime=${config.weights.regime} tech=${config.weights.technical} rr=${config.weights.rr} MIN_SCORE=${num(config.confidence)}`,
		config.target === "grok" ? `FEES maker_pct=${num(config.fallbackMakerBps / 100)} taker_pct=${num(config.defaultFeeBps / 100)} rebate_pct=${num(config.rebatePct)} rebate_cap_usd=${num(config.rebateCapUsd)}` : "",
		config.target === "grok" ? `EQUITY=${num(config.equityUsd)}` : ""
	].filter((line, i, all) => line !== "" || i > 0 && all[i - 1] !== "").join("\n");
	return {
		text: text.endsWith("\n") ? text : `${text}\n`,
		chars: text.endsWith("\n") ? text.length : text.length + 1
	};
}
function list(items) {
	return items.length ? items.join(",") : "none";
}
function buildLeverageContract(config) {
	const age = signalAgeMin(config);
	const text = [
		headerLine(config),
		"",
		"L0 ROLE",
		"You are a read-only Coinbase US futures (CFM) scanner. Analysis only.",
		"Never call an order, close-position, transfer, or convert tool.",
		"Futures can lose more than margin. Every idea must pass the liquidation guard.",
		"na is never 0. Zero qualified ideas is a valid result. Do not invent a product id or a price.",
		"",
		dataSection(config.target, "leverage"),
		"",
		indicatorBlock(),
		"",
		"L1 UNIVERSE",
		"List FUTURE products and follow the cursor. Keep perp-style crypto: expiry > 365 days,",
		"volume_24h >= MIN_VOL_CONTRACTS, open_interest >= MIN_OI_CONTRACTS.",
		"Skip metals, energy, and index products unless INCLUDE_NONCRYPTO=on.",
		"Dated contracts with under 7 days to expiry are skipped.",
		"Record contract_size, price, funding_rate, intraday and overnight margin for long and short, and the session.",
		"Core prefixes if the list is partial: CORE.",
		"",
		"L2 SIDE",
		"Trend TF: long if close > SMA20 and SMA20 is rising. Short if close < SMA20 and SMA20 is falling.",
		"Else TF_CONFLICT. Setups in D7 apply, mirrored for shorts. Age > MAX_SIGNAL_AGE_MIN -> STALE_SIGNAL.",
		"",
		"L3 STOP / TARGET",
		"Long stop = min low of the last STOP_LOOKBACK entry bars, minus one tick. Short = max high plus one tick.",
		"stop_dist must sit in [MIN_STOP_ATR, MAX_STOP_ATR] x ATR14, else STOP_ATR.",
		"Target = opposite SWING_LOOKBACK swing, or BREAKOUT_TARGET_R x risk on a breakout. Then cap at TARGET_CAP_R x risk.",
		"drift > MAX_DRIFT_ATR in the chase direction -> STALE_ENTRY.",
		"",
		"L4 FEES AND FUNDING",
		"Live FEES product_type=FUTURE returns maker_fee_rate and taker_fee_rate as decimals (0.00095 = 0.095%).",
		"If that read fails, rate = FUT_MAKER_PCT/100 or FUT_TAKER_PCT/100 and tag FEES_ASSUMED. PT = FUT_PASS_THROUGH_USD.",
		"per contract: notional_1 = price x contract_size. risk_1 = stop_dist x contract_size.",
		"entry_rate = maker rate if ENTRY_ORDER=maker, else taker rate.",
		"rt_1 = notional_1 x (entry_rate + taker rate) + 2 x PT.",
		"funding_1 = notional_1 x funding_rate x MAX_HOLD_H. A long pays when the rate is above 0. A short receives.",
		"fees_R = rt_1 / risk_1. funding_R = funding_1 / risk_1 (negative means received).",
		"net_R = gross_R - fees_R - funding_R.",
		"Reject gross_R < MIN_GROSS_R (RRR), net_R < MIN_NET_R (NET_R), funding_R > FUNDING_DRAG_R (FUNDING).",
		"",
		"L5 SIZING AND LIQUIDATION",
		"equity = DERIVATIVES_CASH + available USD/USDC, else EQUITY_USD (tag EQUITY_INPUT).",
		"risk_usd = equity x RISK_PCT/100. contracts = floor(risk_usd / risk_1). contracts < 1 -> TOO_SMALL.",
		"notional = contracts x notional_1. If notional > MAX_LEV x equity, contracts = floor(MAX_LEV x equity / notional_1), tag LEV_CAPPED.",
		"mm = the overnight margin rate for the side. Always use overnight, even during the day.",
		"USE_INTRADAY_MARGIN only changes the displayed leverage, not the stop.",
		"liq_dist = equity / notional - mm. stop_pct > liq_dist / LIQ_BUFFER -> LIQ_RISK (reject).",
		"Open heat: sum of risk_usd over listed ideas <= HEAT_CAP x one idea's risk_usd. Drop the lowest exp_R past that.",
		"",
		"L6 TIME",
		"A run during 15:30-18:00 ET on a weekday, or any time Saturday or Sunday, is tagged OVERNIGHT_MARGIN.",
		"Intraday margin is 6:00 PM ET to 4:00 PM ET the next day, Sunday evening through Friday afternoon, not weekends.",
		"Full overnight rates apply at 4:00 PM ET. The 3:30 PM warning is why the tag starts at 15:30.",
		"Planned hold above MAX_HOLD_H: cap the funding estimate at MAX_HOLD_H and tag TIME_STOP.",
		"",
		"L7 OUTPUT",
		"One table: product, side, entry, stop, target, contracts, notional, eff_leverage, gross_R, fees_R, funding_R, net_R, liq_dist%, tags.",
		"Then one regime line. Zero qualified ideas is a valid result. No order was sent.",
		"",
		"C CONFIG",
		`ENTRY_TF=${config.entryTf} TREND_TF=${config.trendTf} SIDE=${config.signalBias} ENTRY_ORDER=${config.entryOrder}`,
		`RISK_PCT=${num(config.riskPerTradePct)} MAX_LEV=${num(config.maxLeverage)} LIQ_BUFFER=${num(config.liqBufferMultiple)} FUNDING_DRAG_R=${num(config.fundingDragR)} MAX_HOLD_H=${num(config.maxHoldH)}`,
		`FUT_MAKER_PCT=${num(config.futMakerPct)} FUT_TAKER_PCT=${num(config.futTakerPct)} FUT_PASS_THROUGH_USD=${num(config.futPassThroughUsd)}`,
		`MIN_GROSS_R=${num(config.minRrr)} MIN_NET_R=${num(config.minNetR)} TARGET_CAP_R=${num(config.targetCapR)} BREAKOUT_TARGET_R=${num(config.breakoutTargetR)}`,
		`STOP_LOOKBACK=${config.stopLookback} SWING_LOOKBACK=${config.swingLookback} MIN_STOP_ATR=${num(config.minStopAtr)} MAX_STOP_ATR=${num(config.maxStopAtr)}`,
		`MIN_VOL_CONTRACTS=${config.minVolContracts} MIN_OI_CONTRACTS=${config.minOiContracts} INCLUDE_NONCRYPTO=${config.includeNonCrypto ? "on" : "off"} USE_INTRADAY_MARGIN=${config.useIntradayMargin ? "on" : "off"}`,
		`EQUITY_USD=${num(config.equityUsd)} MAX_SIGNAL_AGE_MIN=${num(age)} MAX_DRIFT_ATR=${num(config.maxDriftAtr)} HEAT_CAP=${num(config.heatCapMultiple)} MAX_IDEAS=${config.numOps}`,
		`CORE=${list(config.coreUniverse)}`,
		config.target === "grok" ? `FEES fut_maker_pct=${num(config.futMakerPct)} fut_taker_pct=${num(config.futTakerPct)} pass_through_usd=${num(config.futPassThroughUsd)}` : "",
		config.target === "grok" ? `EQUITY=${num(config.equityUsd)}` : ""
	].filter(Boolean).join("\n") + "\n";
	return {
		text,
		chars: text.length
	};
}
function buildContract(config) {
	const built = config.marketMode === "leverage" ? buildLeverageContract(config) : buildSpotContract(config);
	return {
		text: built.text,
		hash12: "",
		contractId: "",
		chars: built.chars
	};
}
function buildPrompt(config) {
	return buildContract(config).text;
}
var VARIATION_KEYS = [
	"entryTf",
	"maxFeesR",
	"targetCapR",
	"riskPerTradePct",
	"signalBias",
	"maxLeverage"
];
var VARIATION_LABELS = {
	entryTf: "Entry timeframe",
	maxFeesR: "Max fees R",
	targetCapR: "Target cap R",
	riskPerTradePct: "Risk %",
	signalBias: "Side",
	maxLeverage: "Max leverage"
};
var BIASES = [
	"both",
	"long",
	"short"
];
function parseVariationValues(key, raw) {
	const parts = raw.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean).slice(0, 4);
	const out = [];
	for (const part of parts) {
		if (key === "entryTf") {
			const tf = TIMEFRAMES.find((item) => item.toLowerCase() === part.toLowerCase());
			if (tf && !out.includes(tf)) out.push(tf);
			continue;
		}
		if (key === "signalBias") {
			const bias = BIASES.find((item) => item === part.toLowerCase());
			if (bias && !out.includes(bias)) out.push(bias);
			continue;
		}
		const n = Number(part);
		if (!Number.isFinite(n)) continue;
		if (key === "maxLeverage" && (n < 1 || n > 4)) continue;
		const text = String(n);
		if (!out.includes(text)) out.push(text);
	}
	return out.length >= 2 ? out : [];
}
function applyValue(config, key, value) {
	if (key === "entryTf") {
		const entryTf = value;
		const order = [
			"15m",
			"1H",
			"4H",
			"1D",
			"1W"
		];
		const entryAt = order.indexOf(entryTf);
		const trendTf = order.indexOf(config.trendTf) >= entryAt ? config.trendTf : order[Math.min(entryAt + 1, order.length - 1)] ?? entryTf;
		return {
			...config,
			entryTf,
			trendTf,
			profile: "custom"
		};
	}
	if (key === "signalBias") return {
		...config,
		signalBias: value,
		profile: "custom"
	};
	const n = Number(value);
	return {
		...config,
		[key]: n,
		profile: "custom"
	};
}
function renderVariationValues(config, key, values) {
	return values.slice(0, 4).map((value, index) => ({
		key,
		value,
		separator: `===== VARIANT ${index + 1}: ${key}=${value} =====`,
		text: buildPrompt(applyValue(config, key, value))
	}));
}
function joinVariationText(rows) {
	return rows.map((row) => `${row.separator}\n${row.text.trim()}`).join("\n\n");
}
function VariationsPanel() {
	const config = useBlueprint((s) => s.config);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [key, setKey] = (0, import_react.useState)("entryTf");
	const [raw, setRaw] = (0, import_react.useState)("1H, 4H");
	const values = (0, import_react.useMemo)(() => parseVariationValues(key, raw), [key, raw]);
	const rows = (0, import_react.useMemo)(() => open && values.length ? renderVariationValues(config, key, values) : [], [
		open,
		config,
		key,
		values
	]);
	async function onCopyAll() {
		if (rows.length < 2) {
			toast.error("Enter 2 to 4 values");
			return;
		}
		if (await copyText(joinVariationText(rows))) toast.success(`Copied ${rows.length} variations`);
		else toast.error("Could not copy");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-expanded": open,
				onClick: () => setOpen((value) => !value),
				className: "pressable h-11 rounded-full bg-elevated px-3 text-xs font-medium",
				children: "Variations"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "One setting, two to four values. Nothing is saved."
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: VARIATION_KEYS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": key === id,
						onClick: () => {
							setKey(id);
							setRaw(id === "entryTf" ? "1H, 4H" : id === "signalBias" ? "long, short" : id === "maxLeverage" ? "2, 3" : "2.5, 3, 3.5");
						},
						className: cn("pressable h-11 rounded-full px-3 text-xs font-medium", key === id ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
						children: VARIATION_LABELS[id]
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						"aria-label": "Variation values",
						value: raw,
						onChange: (event) => setRaw(event.target.value),
						className: "max-w-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void onCopyAll(),
						disabled: rows.length < 2,
						children: "Copy all"
					})]
				}),
				rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-1",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "truncate font-mono text-xs text-muted",
						children: [
							row.separator,
							" · ",
							row.text.length.toLocaleString(),
							" chars"
						]
					}, row.separator))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Need 2 to 4 values."
				})
			]
		}) : null]
	});
}
function PromptPane() {
	const config = useBlueprint((s) => s.config);
	const mobilePane = useBlueprint((s) => s.mobilePane);
	const [prompt, setPrompt] = (0, import_react.useState)(() => buildContract(config).text);
	const [contractId, setContractId] = (0, import_react.useState)(() => buildContract(config).contractId);
	const [copyPhase, setCopyPhase] = (0, import_react.useState)("idle");
	const copyTimer = (0, import_react.useRef)(null);
	const copyRef = (0, import_react.useRef)(() => {});
	const blocked = getNotices(config).some((notice) => notice.level === "error");
	function currentContract() {
		return buildContract(config);
	}
	(0, import_react.useEffect)(() => {
		const next = currentContract();
		setPrompt(next.text);
		setContractId(next.contractId);
	}, [config]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (copyTimer.current) window.clearTimeout(copyTimer.current);
		};
	}, []);
	copyRef.current = () => {
		onCopy();
	};
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "c") return;
			const target = event.target;
			if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
			if (window.getSelection()?.toString()) return;
			if (window.matchMedia("(max-width: 1023px)").matches && mobilePane !== "contract") return;
			if (blocked) return;
			event.preventDefault();
			copyRef.current();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mobilePane, blocked]);
	function onExport() {
		const next = currentContract();
		setPrompt(next.text);
		setContractId(next.contractId);
		downloadText("prompt-blueprint.txt", next.text, "text/plain;charset=utf-8");
		toast.success("Exported as text");
	}
	async function onCopy() {
		if (blocked) return;
		const next = currentContract();
		setPrompt(next.text);
		setContractId(next.contractId);
		const ok = await copyText(next.text);
		if (copyTimer.current) window.clearTimeout(copyTimer.current);
		if (ok) {
			setCopyPhase("copied");
			toast.success("Contract copied");
			copyTimer.current = window.setTimeout(() => setCopyPhase("idle"), 1400);
		} else {
			setCopyPhase("failed");
			toast.error("Could not copy. Select the contract and copy it manually.");
			copyTimer.current = window.setTimeout(() => setCopyPhase("idle"), 2e3);
		}
	}
	const tokens = estimateTokens(prompt);
	const weightSum = weightTotal(config);
	const lev = config.marketMode === "leverage";
	const badge = !lev ? "SPOT" : "LEV · US";
	const hot = lev && config.maxLeverage > 3;
	const withinLimit = prompt.length <= 9e3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		id: "contract-heading",
		className: "sr-only",
		children: "Contract"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mr-auto flex items-center gap-2 font-mono text-xs tabular-nums text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2.5 py-1 text-xs font-medium tracking-wide", hot ? "bg-warn/15 text-warn" : "bg-elevated text-fg"),
								children: badge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2.5 py-1 text-xs font-medium", withinLimit ? "bg-elevated text-fg" : "bg-warn/15 text-warn"),
								children: withinLimit ? "Under 9k" : "Over 9k"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "max-w-full break-all",
								children: [
									"v",
									"5.1",
									" · ",
									formatCount(prompt.length),
									" chars · ~",
									formatCount(tokens),
									" tok"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: onCopy,
						disabled: blocked,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSwap, {
							show: copyPhase === "copied",
							alt: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
						}), blocked ? "Copy blocked" : copyPhase === "copied" ? "Copied" : copyPhase === "failed" ? "Copy failed" : "Copy"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: onExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						"aria-live": "polite",
						children: copyPhase === "copied" ? "Contract copied" : copyPhase === "failed" ? "Copy failed" : ""
					}),
					weightSum !== 100 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-warn/15 px-2.5 py-1 text-xs font-medium text-warn",
						children: ["Weights ", weightSum]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariationsPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-xs leading-relaxed text-fg",
				"aria-label": "Generated prompt",
				children: prompt
			})
		]
	})] });
}
function useNarrow() {
	const [narrow, setNarrow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(max-width: 1023px)");
		const apply = () => setNarrow(query.matches);
		apply();
		query.addEventListener("change", apply);
		return () => query.removeEventListener("change", apply);
	}, []);
	return narrow;
}
function BlueprintApp() {
	const mobilePane = useBlueprint((s) => s.mobilePane);
	const setMobilePane = useBlueprint((s) => s.setMobilePane);
	const darkMode = useBlueprint((s) => s.config.darkMode);
	const config = useBlueprint((s) => s.config);
	const hydrated = useBlueprint((s) => s.hydrated);
	const replaceConfig = useBlueprint((s) => s.replaceConfig);
	const markHydrated = useBlueprint((s) => s.markHydrated);
	const narrow = useNarrow();
	(0, import_react.useEffect)(() => {
		forgetSavedHistory();
		const next = configFromSearch(window.location.search, useBlueprint.getState().config.darkMode);
		if (next) replaceConfig(next);
		else markHydrated();
	}, [markHydrated, replaceConfig]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const timer = window.setTimeout(() => {
			const qs = searchFor(config);
			const path = window.location.pathname;
			const next = qs ? `${path}?${qs}` : path;
			if (next !== `${path}${window.location.search}`) window.history.replaceState(null, "", next);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [config, hydrated]);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		document.documentElement.classList.toggle("light", !darkMode);
	}, [darkMode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "blueprint-grid flex h-dvh min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1 overflow-hidden lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					inert: narrow && mobilePane !== "configure" ? true : void 0,
					className: cn("pane-slide absolute inset-0 z-10 flex min-h-0 flex-col bg-bg lg:static lg:z-auto lg:w-[28rem] lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-border lg:bg-transparent lg:transition-none", mobilePane === "contract" ? "-translate-x-full" : "translate-x-0"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigPanel, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					"aria-labelledby": "contract-heading",
					inert: narrow && mobilePane !== "contract" ? true : void 0,
					className: cn("pane-slide absolute inset-0 z-10 flex min-h-0 flex-col bg-surface lg:static lg:z-auto lg:min-w-0 lg:flex-1 lg:translate-x-0 lg:transition-none", mobilePane === "configure" ? "translate-x-full" : "translate-x-0"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptPane, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid h-14 grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							"data-pane": mobilePane,
							className: "pane-pill pointer-events-none absolute top-2 bottom-2 left-2 rounded-full bg-elevated shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": mobilePane === "configure",
							onClick: () => setMobilePane("configure"),
							className: cn("pressable relative z-10 flex flex-col items-center justify-center gap-0.5 text-xs font-medium uppercase tracking-widest", mobilePane === "configure" ? "text-accent" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "Configure"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": mobilePane === "contract",
							onClick: () => setMobilePane("contract"),
							className: cn("pressable relative z-10 flex flex-col items-center justify-center gap-0.5 text-xs font-medium uppercase tracking-widest", mobilePane === "contract" ? "text-accent" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Contract"]
						})
					]
				})
			})
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlueprintApp, {});
}
//#endregion
export { Home as component };
