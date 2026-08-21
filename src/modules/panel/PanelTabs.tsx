/** ماژول پنل کاربری / تب‌های پیشخوان و دانلودها */
import { useState, type ReactNode } from "react";
import { ArrowLeft, Download, FileKey, KeyRound, ShoppingBag, Ticket, Wallet } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { Link, navigate } from "../../store/router";
import { mockDownloads, mockOrders, mockTickets, mockUser, type DownloadItem } from "../../data/user";
import { products } from "../../data/products";
import { faDate, faNum, price } from "../../lib/format";
import { StatusBadge } from "../../components/ui";

function TabHead({ title, desc, extra }: { title: string; desc: string; extra?: ReactNode }) {
  const { user } = useApp();
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-mist-100 sm:text-4xl">
          {title.includes("{name}") ? title.replace("{name}", user?.name ?? "") : title}
        </h1>
        <p className="mt-1.5 text-sm text-mist-400">{desc}</p>
      </div>
      {extra}
    </div>
  );
}

/* ---------- پیشخوان ---------- */
export function DashboardTab() {
  const { user } = useApp();
  const openTickets = mockTickets.filter((t) => t.status === "باز").length;
  const stats = [
    { l: "خریدهای من", v: faNum(mockOrders.length), n: `${faNum(1)} سفارش در انتظار پرداخت`, i: <ShoppingBag size={20} />, t: "#efa33a" },
    { l: "دانلودهای فعال", v: faNum(mockDownloads.length), n: "همه‌ی لایسنس‌ها فعال‌اند", i: <Download size={20} />, t: "#52d8bc" },
    { l: "تیکت‌های باز", v: faNum(openTickets), n: "میانگین پاسخ: ۲ ساعت", i: <Ticket size={20} />, t: "#ff8a6e" },
    { l: "موجودی کیف پول", v: price(mockUser.wallet), n: "قابل استفاده در خرید بعدی", i: <Wallet size={20} />, t: "#7fb4ff" },
  ];
  const offers = [products[3], products[7]];

  return (
    <div>
      <TabHead title={`سلام ${user?.name} عزیز 👋`} desc={`امروز ${faDate(new Date())} — خوش برگشتی! وضعیت حسابت در یک نگاه:`} />

      {/* آمار */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.l} className="card-lift rounded-xl border border-night-600/50 bg-night-850/70 p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: `${s.t}15`, color: s.t }}>{s.i}</span>
            </div>
            <p className="mt-4 font-display text-2xl text-mist-100">{s.v}</p>
            <p className="mt-1 text-xs font-bold text-mist-400">{s.l}</p>
            <p className="mt-2 text-[10px] text-mist-500">{s.n}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* سفارش‌های اخیر */}
        <section className="rounded-xl border border-night-600/50 bg-night-850/70 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-mist-100">آخرین سفارش‌ها</h2>
            <button onClick={() => navigate("panel/orders")} className="group flex items-center gap-1.5 text-xs font-bold text-mist-400 transition hover:text-saffron-300">
              همه‌ی سفارش‌ها <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
          <ul className="space-y-3">
            {mockOrders.slice(0, 3).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-night-700/50 bg-night-900/60 px-4 py-3">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {o.items.map((it) => <img key={it.slug} src={it.cover} alt={it.name} className="h-10 w-14 rounded-md border-2 border-night-900 object-cover" />)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-mist-100">#{o.id}</p>
                  <p className="text-[10px] text-mist-500">{o.date}</p>
                </div>
                <span className="text-sm font-black text-saffron-300">{price(o.total)}</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </section>

        {/* تکمیل پروفایل + پیشنهاد */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-night-600/50 bg-night-850/70 p-5">
            <h2 className="font-display text-xl text-mist-100">تکمیل پروفایل</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-night-700">
                <div className="progress-stripes h-full w-[80%] rounded-full bg-mint-500" />
              </div>
              <span className="text-sm font-black text-mint-300">٪{faNum(80)}</span>
            </div>
            <p className="mt-3 text-xs leading-6 text-mist-400">با تکمیل شماره موبایل، اعلان‌های سفارش را پیامکی هم دریافت می‌کنید.</p>
            <button onClick={() => navigate("panel/settings")} className="mt-3 text-xs font-bold text-saffron-400 transition hover:text-saffron-300">تکمیل از تنظیمات ←</button>
          </section>

          <section className="rounded-xl border border-saffron-500/25 bg-saffron-500/6 p-5">
            <h2 className="font-display text-xl text-saffron-300">پیشنهاد ویژه برای شما 🔥</h2>
            <ul className="mt-4 space-y-3">
              {offers.map((p) => (
                <li key={p.slug} className="flex items-center gap-3 rounded-lg bg-night-900/60 p-2.5">
                  <img src={p.cover} alt={p.name} className="h-12 w-16 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`product/${p.slug}`} className="block truncate text-xs font-bold text-mist-100 transition hover:text-saffron-300">{p.name}</Link>
                    <p className="mt-0.5 text-[11px] font-black text-saffron-300">{price(p.price)}</p>
                  </div>
                  <Link to={`product/${p.slug}`} className="cut-sm shrink-0 bg-saffron-500 px-3 py-1.5 text-[10px] font-black text-night-950 transition hover:bg-saffron-400">مشاهده</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- دانلودها ---------- */
export function DownloadsTab() {
  const { toast } = useApp();
  const [items, setItems] = useState<DownloadItem[]>(mockDownloads);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const startDownload = (item: DownloadItem) => {
    if ((progress[item.slug] ?? 100) < 100) return;
    setProgress((p) => ({ ...p, [item.slug]: 0 }));
    const iv = window.setInterval(() => {
      setProgress((p) => {
        const cur = (p[item.slug] ?? 0) + 9 + Math.random() * 14;
        if (cur >= 100) {
          window.clearInterval(iv);
          window.setTimeout(() => {
            toast(`دانلود «${item.name}» شروع شد`);
            setItems((list) => list.map((x) => (x.slug === item.slug ? { ...x, downloadsLeft: Math.max(0, x.downloadsLeft - 1) } : x)));
            setProgress((pp) => { const { [item.slug]: _done, ...rest } = pp; return rest; });
          }, 250);
          return { ...p, [item.slug]: 100 };
        }
        return { ...p, [item.slug]: cur };
      });
    }, 170);
  };

  return (
    <div>
      <TabHead
        title="دانلودهای من"
        desc={`${faNum(items.length)} محصول فعال — فایل‌ها همیشه با آخرین نسخه در دسترس‌اند.`}
        extra={<span className="flex items-center gap-2 rounded-lg border border-mint-500/25 bg-mint-500/8 px-3.5 py-2 text-xs font-bold text-mint-300"><Download size={14} /> تحویل مادام‌العصر</span>}
      />
      <ul className="space-y-4">
        {items.map((d) => {
          const pct = progress[d.slug];
          const downloading = pct !== undefined;
          return (
            <li key={d.slug} className="card-lift rounded-xl border border-night-600/50 bg-night-850/70 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-4">
                <img src={d.cover} alt={d.name} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`product/${d.slug}`} className="font-bold text-mist-100 transition hover:text-saffron-300">{d.name}</Link>
                    <span className="rounded-full bg-night-700 px-2 py-0.5 text-[10px] font-bold text-mint-300">نسخه {d.version}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-mist-500">
                    {faNum(d.sizeMb)} مگابایت • بروزرسانی: {d.updated} • انقضای لایسنس: <b className="text-mist-300">{d.licenseExpiry}</b>
                  </p>
                  <p className="mt-1 text-[11px] text-mist-500">{faNum(d.downloadsLeft)} دانلود باقی‌مانده</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    onClick={() => { navigator.clipboard?.writeText(`FILINO-LIC-${d.slug.slice(0, 6).toUpperCase()}-1404`).catch(() => undefined); toast("کلید لایسنس کپی شد", "info"); }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-night-600/60 px-3.5 py-2.5 text-xs font-bold text-mist-300 transition hover:border-saffron-500/50 hover:text-saffron-300"
                  >
                    <KeyRound size={13} /> دریافت لایسنس
                  </button>
                  <button
                    onClick={() => startDownload(d)}
                    disabled={downloading && pct < 100}
                    className={`cut-sm inline-flex min-w-[130px] items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black transition ${downloading && pct < 100 ? "bg-night-700 text-mist-400" : "bg-mint-500 text-night-950 hover:bg-mint-400"}`}
                  >
                    {downloading && pct < 100 ? (
                      <>در حال آماده‌سازی… ٪{faNum(Math.round(pct))}</>
                    ) : (
                      <><Download size={14} /> دانلود فایل</>
                    )}
                  </button>
                </div>
              </div>
              {downloading && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-night-700">
                  <div className="progress-stripes h-full rounded-full bg-mint-500 transition-all duration-200" style={{ width: `${pct}%` }} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-5 flex items-center gap-2 rounded-lg border border-night-600/40 bg-night-850/50 px-4 py-3 text-[11px] leading-5 text-mist-500">
        <FileKey size={15} className="shrink-0 text-saffron-400" />
        طبق قوانین استفاده، هر محصول تا ۱۰ بار قابل دانلود است. در صورت نیاز به دانلود بیشتر، تیکت بزنید.
      </p>
    </div>
  );
}
