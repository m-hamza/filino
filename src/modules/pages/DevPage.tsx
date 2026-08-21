/** ماژول کد قالب — نمایش فایل‌های PHP واقعی قالب وردپرس/ووکامرس */
import { useEffect, useState } from "react";
import { Braces, Check, Copy, FileCode2, FolderTree, HardDriveDownload, ServerCog, ShieldCheck, TerminalSquare } from "lucide-react";
import { Reveal } from "../../components/ui";
import { faNum } from "../../lib/format";
import { useApp } from "../../store/AppContext";

interface ThemeFile {
  path: string;
  label: string;
  desc: string;
  kind: "core" | "template" | "module" | "part";
}

const BASE = "wp-theme/filino/";

const FILES: ThemeFile[] = [
  { path: "style.css", label: "style.css", desc: "شناسنامه‌ی قالب + توکن‌های طراحی", kind: "core" },
  { path: "functions.php", label: "functions.php", desc: "هسته و بارگذار ماژول‌ها", kind: "core" },
  { path: "header.php", label: "header.php", desc: "سربرگ، منوها و سبد خرید", kind: "template" },
  { path: "footer.php", label: "footer.php", desc: "فوتر ابزارکی + کشوی سبد", kind: "template" },
  { path: "front-page.php", label: "front-page.php", desc: "صفحه اصلی از ۸ ماژول مستقل", kind: "template" },
  { path: "woocommerce.php", label: "woocommerce.php", desc: "پوسته‌ی آرشیو فروشگاه + فیلترها", kind: "template" },
  { path: "inc/woocommerce.php", label: "inc/woocommerce.php", desc: "هوک‌ها: بج تخفیف، پرداخت، حساب کاربری", kind: "module" },
  { path: "inc/licenses.php", label: "inc/licenses.php", desc: "لایسنس‌سازی و تحویل خودکار فایل", kind: "module" },
  { path: "inc/cpts.php", label: "inc/cpts.php", desc: "پست‌تایپ‌های تیکت، لایسنس و FAQ", kind: "module" },
  { path: "inc/ajax.php", label: "inc/ajax.php", desc: "ایجکس سبد خرید و دانلود امن", kind: "module" },
  { path: "inc/widgets.php", label: "inc/widgets.php", desc: "سایدبار فروشگاه و ستون‌های فوتر", kind: "module" },
  { path: "template-parts/home/hero.php", label: "template-parts/home/hero.php", desc: "افتتاحیه با محصول ویژه + فید خرید زنده", kind: "part" },
  { path: "template-parts/home/bestsellers.php", label: "template-parts/home/bestsellers.php", desc: "پرفروش‌ها با WC_Product_Query", kind: "part" },
];

const KIND_META: Record<ThemeFile["kind"], { label: string; color: string }> = {
  core: { label: "هسته", color: "#efa33a" },
  template: { label: "قالب صفحه", color: "#7fb4ff" },
  module: { label: "ماژول عملکردی", color: "#52d8bc" },
  part: { label: "بخش صفحه", color: "#ff8a6e" },
};

const INSTALL = [
  { t: "کپی قالب", d: "پوشه‌ی filino را داخل wp-content/themes/ هاست خود آپلود کنید." },
  { t: "نصب ووکامرس", d: "افزونه‌ی WooCommerce را از مخزن وردپرس نصب و فعال کنید (الزامی قالب)." },
  { t: "فعال‌سازی", d: "از پیشخوان → نمایش → پوسته‌ها، قالب فایلینو را فعال کنید." },
  { t: "ساخت فروشگاه", d: "صفحات فروشگاه، سبد، پرداخت و حساب کاربری با یک کلیک ساخته می‌شوند." },
];

export function DevPage() {
  const { toast } = useApp();
  const [active, setActive] = useState<ThemeFile>(FILES[1]);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetch(BASE + active.path)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => { if (alive) setCode(t); })
      .catch(() => { if (alive) { setCode(null); setFailed(true); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [active]);

  const copy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    toast("کد فایل کپی شد", "info");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="relative">
      <div className="relative overflow-hidden border-b border-night-700/50 bg-night-900/50">
        <div className="bg-blueprint absolute inset-0 opacity-50 [mask-image:linear-gradient(black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-mint-500/30 bg-mint-500/10 px-3.5 py-1.5 text-xs font-bold text-mint-300">
            <Braces size={13} /> نسخه‌ی PHP — آماده برای هاست وردپرس
          </p>
          <h1 className="font-display text-4xl text-mist-100 sm:text-5xl">کد منبع قالب وردپرس</h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-mist-400">
            آنچه می‌بینید همان قالب است با زبان PHP و هوک‌های رسمی وردپرس و ووکامرس؛ هر قابلیت یک ماژول مستقل زیر <code dir="ltr" className="rounded bg-night-800 px-1.5 py-0.5 font-mono text-[11px] text-mint-300">inc/</code> و هر بخش صفحه یک <code dir="ltr" className="rounded bg-night-800 px-1.5 py-0.5 font-mono text-[11px] text-mint-300">template-parts/</code> جداگانه. فایل‌ها را باز کنید و ببینید.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* درخت فایل‌ها */}
          <aside>
            <div className="sticky top-24 overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80">
              <p className="flex items-center gap-2 border-b border-night-700/60 bg-night-800/70 px-4 py-3 font-mono text-xs font-bold text-mist-200" dir="ltr">
                <FolderTree size={15} className="text-saffron-400" /> wp-content/themes/filino/
              </p>
              <nav className="max-h-[540px] overflow-y-auto p-2.5">
                {FILES.map((f) => {
                  const k = KIND_META[f.kind];
                  const on = active.path === f.path;
                  return (
                    <button key={f.path} onClick={() => setActive(f)} className={`mb-1 flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-start transition-all duration-200 ${on ? "bg-night-700/70 shadow-[inset_3px_0_0_var(--tw-shadow-color,#efa33a)]" : "hover:bg-night-800/70"}`} style={on ? { boxShadow: `inset 3px 0 0 ${k.color}` } : undefined}>
                      <FileCode2 size={15} className="mt-0.5 shrink-0" style={{ color: k.color }} />
                      <span className="min-w-0">
                        <span dir="ltr" className={`block truncate text-start font-mono text-[12px] font-bold ${on ? "text-mist-100" : "text-mist-300"}`}>{f.path}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-mist-500">{f.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* نمایشگر کد */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-night-600/60 bg-night-950 shadow-2xl" dir="ltr">
              <div className="flex flex-wrap items-center gap-2 border-b border-night-700/60 bg-night-900/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-coral-500" /><span className="h-2.5 w-2.5 rounded-full bg-saffron-500" /><span className="h-2.5 w-2.5 rounded-full bg-mint-500" />
                <span className="ms-2 font-mono text-xs text-mist-400">{active.path}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: `${KIND_META[active.kind].color}1a`, color: KIND_META[active.kind].color }}>
                  {KIND_META[active.kind].label}
                </span>
                <button onClick={copy} className="ms-auto flex items-center gap-1.5 rounded-md border border-night-600/60 px-2.5 py-1.5 font-mono text-[11px] font-bold text-mist-300 transition hover:border-saffron-500/50 hover:text-saffron-300">
                  {copied ? <Check size={12} className="text-mint-400" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="max-h-[600px] overflow-auto p-5">
                {loading ? (
                  <div className="space-y-2.5 py-2">
                    {[80, 65, 90, 45, 72, 58, 84, 38].map((w, i) => (
                      <div key={i} className="anim-blink h-3 rounded bg-night-800" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ) : failed ? (
                  <p className="py-10 text-center text-sm text-coral-300">فایل در این پیش‌نمایش در دسترس نیست؛ در پوشه‌ی خروجی پروژه موجود است.</p>
                ) : (
                  <pre className="font-mono text-[12px] leading-6 text-mist-200"><code>{code}</code></pre>
                )}
              </div>
            </div>

            {/* معماری ماژولار */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { i: <ServerCog size={18} />, t: "هوک‌محور، نه بازنویسی", d: "فروشگاه با هوک‌های رسمی ووکامرس شخصی‌سازی شده؛ با هر آپدیت سازگار می‌ماند.", c: "#efa33a" },
                { i: <ShieldCheck size={18} />, t: "امنیت در لایه‌ی دانلود", d: "نونس، بررسی مالکیت سفارش و سقف ۱۰ دانلود برای هر فایل — قبل از ارسال.", c: "#52d8bc" },
                { i: <TerminalSquare size={18} />, t: "فقط کدِ لازم اجرا می‌شود", d: "functions.php فقط ماژول‌های موجود را include می‌کند؛ اسکریپت‌های وو فقط در صفحات فروشگاهی.", c: "#7fb4ff" },
              ].map((x, i) => (
                <Reveal key={x.t} delay={i * 80}>
                  <div className="h-full rounded-xl border border-night-600/50 bg-night-850/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-night-500">
                    <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${x.c}16`, color: x.c }}>{x.i}</span>
                    <h3 className="font-bold text-mist-100">{x.t}</h3>
                    <p className="mt-1.5 text-[12px] leading-6 text-mist-400">{x.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* راهنمای نصب */}
            <div className="mt-6 rounded-xl border border-saffron-500/25 bg-saffron-500/6 p-6">
              <h2 className="flex items-center gap-2.5 font-display text-2xl text-saffron-300">
                <HardDriveDownload size={20} /> نصب روی وردپرس در ۴ قدم
              </h2>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {INSTALL.map((s, i) => (
                  <li key={s.t} className="rounded-lg border border-night-600/40 bg-night-900/60 p-4">
                    <span className="font-display text-2xl text-saffron-400">{faNum(i + 1)}</span>
                    <h3 className="mt-1.5 text-sm font-black text-mist-100">{s.t}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-mist-400">{s.d}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] leading-6 text-mist-500">
                پیش‌نیازها: وردپرس ۶.۲ به‌بالا، PHP ۷.۴ به‌بالا و افزونه‌ی فعال ووکامرس. قالب راست‌چین، ترجمه‌پذیر (Text Domain: <code dir="ltr" className="font-mono text-mint-300">filino</code>) و دارای فایل RTL خودکار است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
