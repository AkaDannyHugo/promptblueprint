import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tooltip } from "@/components/ui/tooltip";

export function Field({
  label,
  hint,
  value,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  value?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={htmlFor}>{label}</Label>
          {hint ? (
            <Tooltip content={hint}>
              <button
                type="button"
                className="pressable inline-flex size-11 items-center justify-center text-accent"
                aria-label={`About ${label}`}
              >
                <Info className="size-3.5" />
              </button>
            </Tooltip>
          ) : null}
        </div>
        {value ? (
          <span className="font-mono text-xs tabular-nums text-accent">{value}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function SliderField({
  id,
  label,
  hint,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} hint={hint} value={display} htmlFor={id}>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v ?? min)}
      />
    </Field>
  );
}

export function SelectField({
  id,
  label,
  hint,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <NativeSelect
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </NativeSelect>
    </Field>
  );
}

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-xl font-semibold leading-tight tracking-tight text-fg">{title}</h2>
      <div className="mt-4 grid gap-5">{children}</div>
    </section>
  );
}
