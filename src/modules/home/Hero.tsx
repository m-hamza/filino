/** ماژول صفحه اصلی / هیرو — افتتاحیه‌ی مشخصه‌ی مارکت: محصول زنده + فید فروش لحظه‌ای */
import { useEffect, useState } from "react";
import { ArrowLeft, Download, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "../../store/router";
import { products } from "../../data/products";
import { price, faNum } from "../../lib/format";
import { useApp } from "../../store/AppContext";
import { Rating } from "../../components/ui";

const FEED = [
  { name: "محمد ر.", city: "تهران", slug: "aftab-store-theme" },
  { name: "نگین ک.", city: "اصفهان", slug: "negar-ui-kit" },
  { name: "امیر ت.", city: "شیراز", slug: "tizpa-cache-plugin" },
  { name: "لیلا م.", city: "تبریز", slug: "vitrin-device-mockup" },
  { name: "سعید ن.", city: "مشهد", slug: "neshan-seo-plugin" },
];

function SalesTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % FEED.length), 3200);
    return () => window.clearInterval(t);
  }, []);
  const f = FEED[i];
  const p = products.find((x) => x.slug === f.slug);
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80 px-4 py-3 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-400" />
      </span>
      <div key={i} className="anim-ticker-in min-w-0 text-sm text-mist-300">
        <b className="text-mist-100">{f.name}</b> از {f.city} همین حالا <b className="text-saffron-300">«{p?.name}»</b> را خرید
      </div>
      <span className="ms-auto hidden shrink-0 items-center gap-1 rounded-full bg-mint-500/10 px-2.5 py-1 text-[10px] font-bold text-mint-300 sm:inline-flex">
        <Download size={11} /> تحویل آنی
      </span>
    </div>
  );
}

export function Hero() {
  const { addToCart, toast } = useApp();
  const main = products[0];
  const mini1 = products[2];
  const mini2 = products[4];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 lg:grid-cols-12 lg:pt-20">
        {/* متن */}
        <div className="relative z-10 lg:col-span-6">
          <p className="anim-ticker-in inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-4 py-1.5 text-xs font-bold text-saffron-300">
            <Sparkles size={13} />
            مارکت‌پلیس تخصصی وردپرس فارسی
          </p>
          <h1 className="mt-5 font-display text-[44px] leading-[1.25] text-mist-100 sm:text-6xl sm:leading-[1.22]">
            فروشگاه فایلِ خودت را
            <br />
            با <span className="relative inline-block text-saffron-400">
              بهترین‌ها
              <svg viewBox="0 0 120 10" className="absolute -bottom-1 inset-x-0 h-2.5 w-full text-saffron-500/70" preserveAspectRatio="none"><path d="M2 7C30 2 90 2 118 6" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" /></svg>
            </span> بساز
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-8 text-mist-400">
            قالب، افزونه و ابزار طراحیِ راست‌چین و اورجینال — با فارسی‌سازی واقعی، آپدیت دائمی و تحویل آنی. هر آنچه یک فروشگاه دیجیتال حرفه‌ای لازم دارد، یک‌جا.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="shop" className="cut inline-flex items-center gap-2 bg-saffron-500 px-7 py-3.5 text-base font-black text-night-950 shadow-[0_14px_40px_-12px_rgba(239,163,58,0.6)] transition-all duration-300 hover:bg-saffron-400 active:scale-[0.97]">
              مشاهده فروشگاه
              <ArrowLeft size={18} />
            </Link>
            <Link to="blog" className="inline-flex items-center gap-2 rounded-lg border border-night-600 bg-night-850/70 px-6 py-3.5 text-sm font-bold text-mist-200 transition-all duration-300 hover:border-mint-500/50 hover:text-mint-300">
              مقالات آموزشی
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2.5 rtl:space-x-reverse">
              {["م", "ن", "ا", "س"].map((c, idx) => (
                <span key={c} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-night-950 font-display text-sm ${["bg-saffron-500 text-night-950", "bg-mint-500 text-night-950", "bg-night-600 text-mist-100", "bg-coral-500 text-white"][idx]}`}>{c}</span>
              ))}
            </div>
            <div>
              <Rating value={4.9} />
              <p className="mt-0.5 text-[11px] text-mist-500">امتیاز {faNum(4.9)} از دید {faNum(1240)} خریدار تأییدشده</p>
            </div>
          </div>
        </div>

        {/* کالای صحنه */}
        <div className="relative h-[430px] sm:h-[470px] lg:col-span-6">
          <div className="anim-breathe absolute start-1/2 top-1/2 h-72 w-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-saffron-500/15 blur-3xl" />
          <div className="absolute start-8 top-6 h-48 w-48 rounded-full bg-mint-500/10 blur-3xl" />

          {/* کارت اصلی */}
          <div className="anim-float absolute start-1/2 top-1/2 w-[min(330px,84%)] -translate-y-1/2 translate-x-1/2 overflow-hidden rounded-2xl border border-night-600/70 bg-night-850 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
            <img src={main.cover} alt={main.name} className="aspect-[16/10] w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-mist-100">{main.name}</h3>
                <span className="rounded-full bg-saffron-500/15 px-2 py-0.5 text-[10px] font-black text-saffron-300">{main.badge}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-black text-mist-100">{price(main.price)}</span>
                <button
                  onClick={() => { addToCart(main.slug); toast(`«${main.name}» به سبد اضافه شد`); }}
                  className="cut-sm bg-saffron-500 px-4 py-2 text-xs font-black text-night-950 transition hover:bg-saffron-400 active:scale-95"
                >
                  افزودن به سبد
                </button>
              </div>
            </div>
          </div>

          {/* کارت کوچک ۱ */}
          <div className="anim-float-soft absolute -start-1 top-6 w-44 overflow-hidden rounded-xl border border-night-600/60 bg-night-850/95 shadow-2xl backdrop-blur-sm sm:start-2 [animation-delay:0.8s]">
            <img src={mini1.cover} alt={mini1.name} className="aspect-[16/10] w-full object-cover" />
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="truncate text-[11px] font-bold text-mist-200">{mini1.name}</span>
            </div>
          </div>

          {/* کارت کوچک ۲ */}
          <div className="anim-float-soft absolute -end-1 bottom-10 w-44 overflow-hidden rounded-xl border border-night-600/60 bg-night-850/95 shadow-2xl backdrop-blur-sm sm:end-2 [animation-delay:1.6s]">
            <img src={mini2.cover} alt={mini2.name} className="aspect-[16/10] w-full object-cover" />
            <div className="px-3 py-2.5">
              <span className="block truncate text-[11px] font-bold text-mist-200">{mini2.name}</span>
              <Rating value={mini2.rating} size={10} />
            </div>
          </div>

          {/* چیپ شناور گارانتی */}
          <div className="anim-float-soft absolute bottom-4 start-6 flex items-center gap-2 rounded-full border border-mint-500/30 bg-night-900/90 px-3.5 py-2 text-[11px] font-bold text-mint-300 shadow-xl backdrop-blur-sm [animation-delay:0.4s]">
            <ShieldCheck size={14} />
            گارانتی ۷ روزه‌ی بازگشت وجه
          </div>
        </div>
      </div>

      {/* فید فروش زنده */}
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <SalesTicker />
      </div>
    </section>
  );
}
