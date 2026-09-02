/** کیت رابط مشترک فایلینو — همه‌ی ماژول‌ها از این کامپوننت‌ها استفاده می‌کنند */
import {
  useEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode,
} from "react";
import { Check, Info, AlertTriangle, Star, ChevronDown, X } from "lucide-react";
import { useApp } from "../store/AppContext";
import { faNum, pad2 } from "../lib/format";

/* ---------- دکمه ---------- */
type BtnVariant = "primary" | "ghost" | "outline" | "mint" | "danger";
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  cut?: boolean;
}
export function Btn({ variant = "primary", size = "md", cut = false, className = "", children, ...rest }: BtnProps) {
  const v: Record<BtnVariant, string> = {
    primary: "bg-saffron-500 text-night-950 hover:bg-saffron-400 active:bg-saffron-600 font-bold shadow-[0_10px_30px_-12px_rgba(239,163,58,0.55)]",
    mint: "bg-mint-500 text-night-950 hover:bg-mint-400 active:bg-mint-600 font-bold shadow-[0_10px_30px_-12px_rgba(52,194,164,0.5)]",
    ghost: "bg-night-800 text-mist-100 hover:bg-night-700 border border-night-600/60",
    outline: "bg-transparent text-mist-200 hover:text-saffron-300 hover:border-saffron-500/60 border border-night-600",
    danger: "bg-coral-500/15 text-coral-300 hover:bg-coral-500/25 border border-coral-500/40",
  };
  const s = { sm: "text-xs px-3.5 py-2 gap-1.5", md: "text-sm px-5 py-2.5 gap-2", lg: "text-base px-7 py-3.5 gap-2.5" }[size];
  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${cut ? "cut" : "rounded-lg"} ${v[variant]} ${s} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- نشان وضعیت ---------- */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "تکمیل شده": "bg-mint-500/15 text-mint-300 border-mint-500/30",
    "در انتظار پرداخت": "bg-saffron-500/15 text-saffron-300 border-saffron-500/30",
    "باز": "bg-coral-500/15 text-coral-300 border-coral-500/30",
    "در حال بررسی": "bg-saffron-500/15 text-saffron-300 border-saffron-500/30",
    "پاسخ داده شده": "bg-mint-500/15 text-mint-300 border-mint-500/30",
    "بسته شده": "bg-night-700/60 text-mist-400 border-night-600",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${map[status] ?? "bg-night-700/60 text-mist-300 border-night-600"}`}>{status}</span>;
}

/* ---------- امتیاز ستاره‌ای ---------- */
export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5" aria-label={`امتیاز ${faNum(value)} از ۵`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={size} className={i <= Math.round(value) ? "fill-saffron-400 text-saffron-400" : "text-night-600"} />
        ))}
      </span>
      <span className="text-xs font-bold text-mist-200">{faNum(value)}</span>
      {count !== undefined && <span className="text-[11px] text-mist-500">({faNum(count)})</span>}
    </span>
  );
}

/* ---------- مودال ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-night-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`anim-pop-in relative w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-xl border border-night-600/60 bg-night-850 p-6 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-2xl text-mist-100">{title}</h3>}
          <button onClick={onClose} className="rounded-md p-1.5 text-mist-400 transition hover:bg-night-700 hover:text-mist-100" aria-label="بستن">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- پنل کشویی ---------- */
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-night-950/75 backdrop-blur-sm transition-opacity duration-400 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside
        className={`absolute top-0 bottom-0 left-0 flex w-full max-w-md flex-col border-s border-night-600/50 bg-night-900 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.3,1)] ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-night-700/60 px-5 py-4">
          <h3 className="font-display text-xl text-mist-100">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-mist-400 transition hover:bg-night-700 hover:text-mist-100" aria-label="بستن">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

/* ---------- آکاردئون ---------- */
export function Accordion({ title, children, defaultOpen }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-night-600/50 bg-night-850/60">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start transition hover:bg-night-800/70" aria-expanded={open}>
        <span className="font-bold text-mist-100">{title}</span>
        <ChevronDown size={17} className={`shrink-0 text-mist-400 transition-transform duration-300 ${open ? "rotate-180 text-saffron-400" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-night-700/50 px-4 py-4 text-sm leading-7 text-mist-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ظهور هنگام اسکرول ---------- */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("on"); io.disconnect(); } }),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- شمارنده‌ی آماری ---------- */
export function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{faNum(val)}{suffix}</span>;
}

/* ---------- شمارش معکوس ---------- */
export function Countdown({ targetMs }: { targetMs: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const box = (v: number, label: string) => (
    <div className="flex flex-col items-center rounded-lg border border-night-600/60 bg-night-950/70 px-3 py-2 min-w-[58px]">
      <span className="font-display text-2xl leading-none text-saffron-300">{pad2(v)}</span>
      <span className="mt-1 text-[10px] text-mist-500">{label}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2" dir="ltr">
      {box(h, "ساعت")}<span className="text-saffron-500 font-bold">:</span>
      {box(m, "دقیقه")}<span className="text-saffron-500 font-bold">:</span>
      {box(s, "ثانیه")}
    </div>
  );
}

/* ---------- سرتیتر بخش ---------- */
export function SectionHead({ kicker, title, desc, action }: { kicker: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-2.5 text-xs font-bold tracking-wide text-saffron-400">
          <span className="h-px w-8 bg-saffron-500" />
          {kicker}
        </p>
        <h2 className="font-display text-3xl leading-tight text-mist-100 sm:text-4xl">{title}</h2>
        {desc && <p className="mt-2 max-w-xl text-sm leading-7 text-mist-400">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- فیلد فرم ---------- */
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Field({ label, error, className = "", ...rest }: FieldProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-bold text-mist-300">{label}</span>}
      <input
        className={`w-full rounded-lg border bg-night-950/70 px-4 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 outline-none transition focus:border-saffron-500/70 focus:ring-2 focus:ring-saffron-500/20 ${error ? "border-coral-500/60" : "border-night-600/60"} ${className}`}
        {...rest}
      />
      {error && <span className="anim-pop-in mt-1.5 flex items-center gap-1 text-[11px] text-coral-300"><AlertTriangle size={12} />{error}</span>}
    </label>
  );
}

/* ---------- سوییچ ---------- */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-lg border border-night-600/50 bg-night-850/60 px-4 py-3 text-start transition hover:border-night-500">
      <span className="text-sm text-mist-200">{label}</span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-mint-500" : "bg-night-600"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-night-950 transition-all duration-300 ${checked ? "start-6" : "start-1"}`} />
      </span>
    </button>
  );
}

/* ---------- حالت خالی ---------- */
export function EmptyState({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="anim-pop-in flex flex-col items-center justify-center rounded-xl border border-dashed border-night-600 bg-night-850/40 px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-night-800 text-mist-400">{icon}</div>
      <h3 className="font-display text-2xl text-mist-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-7 text-mist-400">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- کاور مقالات (هنر SVG بدون تصویر) ---------- */
export function CoverArt({ tint, glyph, category, className = "" }: { tint: string; glyph: string; category: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, #0d1c22 0%, #12242c 100%)` }}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" aria-hidden>
        <defs>
          <pattern id={`p-${glyph}`} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill={tint} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${glyph})`} />
        <circle cx="82%" cy="20%" r="70" fill="none" stroke={tint} strokeWidth="1.5" opacity="0.6" />
        <circle cx="82%" cy="20%" r="100" fill="none" stroke={tint} strokeWidth="1" opacity="0.3" />
      </svg>
      <span className="absolute -bottom-7 -start-3 select-none font-display text-[110px] leading-none opacity-90" style={{ color: tint, textShadow: `0 0 60px ${tint}55` }}>
        {glyph}
      </span>
      <span className="absolute top-3 start-3 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm" style={{ color: tint, borderColor: `${tint}55`, background: "#0a161bcc" }}>
        {category}
      </span>
    </div>
  );
}

/* ---------- میزبان اعلان‌ها ---------- */
export function ToastHost() {
  const { toasts } = useApp();
  const icon = { success: <Check size={15} />, error: <AlertTriangle size={15} />, info: <Info size={15} /> };
  const tone = {
    success: "border-mint-500/40 text-mint-300 bg-mint-500/10",
    error: "border-coral-500/40 text-coral-300 bg-coral-500/10",
    info: "border-saffron-500/40 text-saffron-300 bg-saffron-500/10",
  };
  return (
    <div className="pointer-events-none fixed bottom-5 start-1/2 z-[80] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 rtl:translate-x-1/2">
      {toasts.map((t) => (
        <div key={t.id} className={`anim-pop-in pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold backdrop-blur-md ${tone[t.kind]}`}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-night-950/60">{icon[t.kind]}</span>
          <span className="text-mist-100">{t.text}</span>
        </div>
      ))}
    </div>
  );
}
