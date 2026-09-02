/** ماژول صفحه اصلی / بخش‌ها — دسته‌بندی، پرفروش‌ها، بنر تخفیف، آمار، بلاگ، نظرات و خبرنامه */
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowUpLeft, Download, Headphones, ImageIcon, LayoutTemplate, Mail, PenTool, Puzzle, Quote, RefreshCw, ShieldCheck, Star, Zap,
} from "lucide-react";
import { Link } from "../../store/router";
import { bestSellers, categories, products } from "../../data/products";
import { articles } from "../../data/articles";
import { faNum, price } from "../../lib/format";
import { useApp } from "../../store/AppContext";
import { ProductCard } from "../../components/ProductCard";
import { Btn, Countdown, CountUp, CoverArt, Reveal, SectionHead, Field } from "../../components/ui";

const CAT_ICONS: Record<string, ReactNode> = {
  LayoutTemplate: <LayoutTemplate size={22} />,
  Puzzle: <Puzzle size={22} />,
  PenTool: <PenTool size={22} />,
  ImageIcon: <ImageIcon size={22} />,
};

/* نوار متحرک محصولات */
function MarqueeStrip() {
  const items = products.map((p) => p.name);
  return (
    <div className="marquee overflow-hidden border-y border-night-700/60 bg-night-900/60 py-3.5" dir="ltr">
      <div className="marquee-track items-center gap-8">
        {[...items, ...items].map((name, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm font-bold text-mist-500" dir="rtl">
            <span className="transition hover:text-saffron-300">{name}</span>
            <span className="text-saffron-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* دسته‌بندی‌ها */
function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Reveal>
        <SectionHead kicker="ویترین ماژولار" title="دسته‌بندی محصولات" desc="هر دسته، یک ماژول مستقل قالب است؛ فقط ماژول‌هایی که لازم دارید فعال می‌شوند تا سایت سبک بماند." />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => {
          const count = products.filter((p) => p.category === c.id).length;
          return (
            <Reveal key={c.id} delay={i * 90}>
              <Link to={`shop?cat=${c.id}`} className="group flex items-start justify-between gap-3 rounded-xl border border-night-600/50 bg-night-850/70 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-night-500 hover:bg-night-800/80">
                <div>
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: `${c.tint}18`, color: c.tint }}>
                    {CAT_ICONS[c.icon]}
                  </span>
                  <h3 className="font-display text-xl text-mist-100">{c.label}</h3>
                  <p className="mt-1 text-xs leading-6 text-mist-500">{c.desc}</p>
                  <p className="mt-3 text-[11px] font-bold" style={{ color: c.tint }}>{faNum(count)} محصول</p>
                </div>
                <ArrowUpLeft size={18} className="mt-1 text-mist-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:text-saffron-400" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* پرفروش‌ها */
function BestSellers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Reveal>
        <SectionHead
          kicker="انتخاب خریداران"
          title="پرفروش‌ترین محصولات"
          desc="محبوب‌ترین ابزارهایی که فروشگاه‌های ایرانی را می‌چرخانند."
          action={
            <Link to="shop" className="group inline-flex items-center gap-2 rounded-lg border border-night-600/60 px-4 py-2.5 text-sm font-bold text-mist-300 transition hover:border-saffron-500/50 hover:text-saffron-300">
              همه‌ی محصولات
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          }
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers(4).map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* بنر پیشنهاد ویژه با شمارش معکوس */
function PromoBanner() {
  const { addToCart, toast } = useApp();
  const p = products[0];
  const target = useMemo(() => Date.now() + 34 * 3_600_000, []);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-saffron-500/25 bg-night-850">
          <div className="bg-stripes absolute inset-0" />
          <div className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-saffron-500/15 blur-3xl" />
          <div className="relative grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-coral-500/15 px-3.5 py-1.5 text-xs font-black text-coral-300">
                🔥 پیشنهاد شگفت‌انگیز هفته — ٪{faNum(24)} تخفیف
              </p>
              <h2 className="mt-4 font-display text-4xl leading-snug text-mist-100">{p.name}</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-mist-400">{p.short}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.features.slice(0, 3).map((f) => (
                  <span key={f} className="rounded-full border border-night-600/70 bg-night-900/70 px-3 py-1.5 text-[11px] font-bold text-mist-300">{f}</span>
                ))}
              </div>
              <div className="mt-6"><Countdown targetMs={target} /></div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Btn size="lg" cut onClick={() => { addToCart(p.slug); toast(`«${p.name}» به سبد اضافه شد`); }}>
                  خرید با تخفیف — {price(p.price)}
                </Btn>
                <span className="text-sm text-mist-500 line-through">{price(p.oldPrice ?? p.price)}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-4 rounded-2xl bg-saffron-500/20 blur-2xl" />
              <img src={p.cover} alt={p.name} className="relative aspect-[16/10] w-full rounded-xl border border-night-600/60 object-cover shadow-2xl" />
              <span className="absolute -top-3 end-6 rounded-full bg-coral-500 px-4 py-1.5 font-display text-lg text-white shadow-lg">٪{faNum(24)}−</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* چرا فایلینو + آمار */
function WhyStats() {
  const items = [
    { icon: <Zap size={19} />, tint: "#efa33a", t: "معماری کامپوننت‌محور", d: "هر بخش فروشگاه یک ماژول مستقل است؛ فقط کدی که لازم است بارگذاری می‌شود و سرعت سایت تضمین می‌ماند." },
    { icon: <ShieldCheck size={19} />, tint: "#52d8bc", t: "گارانتی ۷ روزه‌ی بازگشت وجه", d: "اگر محصول با توضیحات فرق داشت، بدون قیدوشرط هزینه برمی‌گردد." },
    { icon: <RefreshCw size={19} />, tint: "#7fb4ff", t: "آپدیت مادام‌العثر رایگان", d: "یک بار بخرید، همیشه آخرین نسخه را از پنل کاربری دانلود کنید." },
    { icon: <Headphones size={19} />, tint: "#ff8a6e", t: "پشتیبانی به زبان خودتان", d: "تیم فنی فارسی‌زبان، ۷ روز هفته با میانگین پاسخ زیر ۲ ساعت." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionHead kicker="تعهد فایلینو" title="چرا فروشگاه‌ها به ما اعتماد می‌کنند؟" />
          </Reveal>
          <div className="space-y-3">
            {items.map((it, i) => (
              <Reveal key={it.t} delay={i * 80}>
                <div className="group flex gap-4 rounded-xl border border-night-600/40 bg-night-850/50 p-5 transition-all duration-300 hover:border-night-500 hover:bg-night-800/70">
                  <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110" style={{ background: `${it.tint}16`, color: it.tint }}>{it.icon}</span>
                  <div>
                    <h3 className="font-bold text-mist-100">{it.t}</h3>
                    <p className="mt-1 text-[13px] leading-6 text-mist-400">{it.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={150}>
          <div className="bg-blueprint relative overflow-hidden rounded-2xl border border-night-600/50 bg-night-850/80 p-8">
            <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-mint-500/10 blur-3xl" />
            <h3 className="font-display text-3xl text-mist-100">فایلینو در یک نگاه</h3>
            <p className="mt-2 text-sm leading-7 text-mist-400">اعدادی که هر روز با هر فروش، بزرگ‌تر می‌شوند.</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { n: 8400, s: "+", l: "فروش موفق", t: "#efa33a" },
                { n: 98, s: "٪", l: "رضایت خریداران", t: "#52d8bc" },
                { n: 45, s: "+", l: "محصول اورجینال", t: "#7fb4ff" },
                { n: 1240, s: "+", l: "دیدگاه ۵ ستاره", t: "#ff8a6e" },
              ].map((x) => (
                <div key={x.l} className="rounded-xl border border-night-600/50 bg-night-900/70 p-5 transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-display text-4xl" style={{ color: x.t }}>
                    <CountUp to={x.n} suffix={x.s} />
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-mist-400">{x.l}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-[11px] text-mist-500">
              <Download size={13} className="text-mint-400" />
              تحویل آنی فایل بلافاصله پس از پرداخت، بدون انتظار
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* پیش‌نمایش بلاگ */
function BlogPreview() {
  const [first, ...rest] = articles;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Reveal>
        <SectionHead
          kicker="بلاگ فایلینو"
          title="تازه‌ترین مقالات و آموزش‌ها"
          action={<Link to="blog" className="group inline-flex items-center gap-2 rounded-lg border border-night-600/60 px-4 py-2.5 text-sm font-bold text-mist-300 transition hover:border-mint-500/50 hover:text-mint-300">همه‌ی مقالات<ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /></Link>}
        />
      </Reveal>
      <div className="grid gap-5 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <Link to={`blog/${first.slug}`} className="card-lift group block overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80">
            <CoverArt tint={first.tint} glyph={first.glyph} category={first.category} className="aspect-[16/8]" />
            <div className="p-6">
              <div className="flex items-center gap-3 text-[11px] text-mist-500">
                <span>{first.date}</span><span className="h-1 w-1 rounded-full bg-night-600" /><span>{faNum(first.readMin)} دقیقه مطالعه</span>
              </div>
              <h3 className="mt-2.5 font-display text-2xl leading-snug text-mist-100 transition-colors group-hover:text-saffron-300">{first.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-7 text-mist-400">{first.excerpt}</p>
            </div>
          </Link>
        </Reveal>
        <div className="space-y-4 lg:col-span-2">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 90}>
              <Link to={`blog/${a.slug}`} className="group flex items-center gap-4 rounded-xl border border-night-600/50 bg-night-850/70 p-4 transition-all duration-300 hover:border-night-500 hover:bg-night-800/70">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl font-display text-3xl transition-transform duration-300 group-hover:scale-110" style={{ background: `${a.tint}14`, color: a.tint }}>{a.glyph}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold" style={{ color: a.tint }}>{a.category}</p>
                  <h4 className="mt-0.5 truncate text-sm font-bold text-mist-100 transition-colors group-hover:text-saffron-300">{a.title}</h4>
                  <p className="mt-1 text-[10px] text-mist-500">{a.date} • {faNum(a.readMin)} دقیقه</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* نظرات خریداران — اسکرول افقی */
function Testimonials() {
  const quotes = [
    { n: "محمد رضایی", r: "مدیر فروشگاه فایل‌گرام", t: "از وقتی قالب آفتاب را نصب کردیم، نرخ تبدیل ۲ برابر شد. سیستم تحویل فایلش بی‌نقص است." },
    { n: "نگار کیانی", r: "طراح محصول", t: "کیت نگار نجاتم داد! سه هفته کار طراحی را در سه روز تمام کردم." },
    { n: "سعید ملکی", r: "سئوکار", t: "افزونه‌ی نشان تنها افزونه‌ای است که واقعاً فارسی می‌فهمد. نتایجش را در کنسول گوگل دیدم." },
    { n: "بهاره نیکو", r: "فریلنسر گرافیک", t: "پشتیبانی فایلینو واقعاً زیر ۲ ساعت جواب می‌دهد؛ حتی جمعه‌شب!" },
  ];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <SectionHead kicker="صدای خریداران" title="آن‌ها چه می‌گویند؟" />
        </Reveal>
      </div>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:px-[max(1rem,calc((100vw-80rem)/2+1rem))]">
        {quotes.map((q, i) => (
          <Reveal key={q.n} delay={i * 70} className="w-[300px] shrink-0 snap-start sm:w-[360px]">
            <figure className="relative h-full rounded-xl border border-night-600/50 bg-night-850/70 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-saffron-500/30">
              <Quote size={26} className="absolute -top-3.5 start-5 rounded-lg bg-saffron-500 p-1.5 text-night-950" />
              <div className="flex gap-1 pt-2">{[...Array(5)].map((_, s) => <Star key={s} size={13} className="fill-saffron-400 text-saffron-400" />)}</div>
              <blockquote className="mt-3 text-sm leading-7 text-mist-300">«{q.t}»</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-night-700/60 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-night-700 font-display text-lg text-saffron-300">{q.n.charAt(0)}</span>
                <div><p className="text-sm font-bold text-mist-100">{q.n}</p><p className="text-[11px] text-mist-500">{q.r}</p></div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* خبرنامه */
function Newsletter() {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("ایمیل معتبر وارد کنید"); return; }
    setErr("");
    setEmail("");
    toast("عضویت شما در خبرنامه ثبت شد 📬");
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-mint-500/20 bg-night-850 p-8 sm:p-12">
          <div className="bg-dots absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -start-20 -bottom-20 h-64 w-64 rounded-full bg-mint-500/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold text-mint-400"><Mail size={14} /> خبرنامه‌ی هفتگی</p>
              <h2 className="mt-3 font-display text-3xl leading-snug text-mist-100 sm:text-4xl">هر هفته یک ترفند وردپرسی + کد تخفیف</h2>
              <p className="mt-2 text-sm leading-7 text-mist-400">عضو ۴٬۲۰۰+ فروشنده‌ای شوید که جمعه‌ها بهترین آموزش‌ها و آفرهای فایلینو را می‌گیرند. بدون اسپم، قول می‌دهیم.</p>
            </div>
            <form onSubmit={submit} className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Field dir="ltr" className="text-left" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} error={err} />
                </div>
                <Btn size="lg" variant="mint" type="submit">عضویت رایگان</Btn>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeSections() {
  return (
    <>
      <MarqueeStrip />
      <CategoryGrid />
      <BestSellers />
      <PromoBanner />
      <WhyStats />
      <BlogPreview />
      <Testimonials />
      <Newsletter />
    </>
  );
}
