/** ماژول جزئیات محصول — گالری، خرید، تب‌های توضیح/تغییرات/دیدگاه‌ها و محصولات مرتبط */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Box, CalendarDays, Download, HardDrive, PackageOpen, RefreshCw, Send, ShieldCheck, Star, Zap } from "lucide-react";
import { Link } from "../../store/router";
import { categoryLabel, productBySlug, relatedTo } from "../../data/products";
import type { Review } from "../../data/products";
import { faNum, offPercent, price } from "../../lib/format";
import { useApp } from "../../store/AppContext";
import { ProductCard } from "../../components/ProductCard";
import { Btn, EmptyState, Rating, Reveal, SectionHead } from "../../components/ui";

type Tab = "desc" | "changelog" | "reviews";

export function ProductPage({ slug }: { slug: string }) {
  const product = productBySlug(slug);
  const app = useApp();
  const [tab, setTab] = useState<Tab>("desc");
  const [view, setView] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [revText, setRevText] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revErr, setRevErr] = useState("");

  useEffect(() => {
    setTab("desc"); setView(0); setReviews(product?.reviews ?? []); setRevText(""); setRevErr("");
  }, [slug, product]);

  const related = useMemo(() => relatedTo(slug), [slug]);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState icon={<PackageOpen size={28} />} title="محصول پیدا نشد" desc="ممکن است این محصول حذف شده یا آدرس اشتباه وارد شده باشد." action={<Btn onClick={() => (window.location.hash = "#/shop")}>بازگشت به فروشگاه</Btn>} />
      </main>
    );
  }

  const off = product.oldPrice ? offPercent(product.price, product.oldPrice) : 0;
  const inCart = app.cart.some((i) => i.slug === product.slug);

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!app.user) { app.setAuthOpen(true); app.toast("برای ثبت دیدگاه ابتدا وارد شوید", "info"); return; }
    if (revText.trim().length < 10) { setRevErr("دیدگاه باید حداقل ۱۰ حرف باشد"); return; }
    setReviews((r) => [{ name: app.user!.name, rating: revRating, date: "همین حالا", text: revText.trim() }, ...r]);
    setRevText(""); setRevErr("");
    app.toast("دیدگاه شما ثبت شد؛ پس از تأیید منتشر می‌شود");
  };

  const galleryArt = (idx: number) => (
    <div className="grid h-full w-full place-items-center bg-night-800" style={{ background: `linear-gradient(140deg, ${product.hue}22, #0d1c22 60%)` }}>
      <div className="bg-dots absolute inset-0 opacity-40" />
      <span className="font-display text-7xl" style={{ color: product.hue }}>{["نمای کلی", "جزئیات", "دمو"][idx]}</span>
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* بردکرامب */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-mist-500">
        <Link to="" className="transition hover:text-saffron-300">خانه</Link><span>/</span>
        <Link to="shop" className="transition hover:text-saffron-300">فروشگاه</Link><span>/</span>
        <Link to={`shop?cat=${product.category}`} className="transition hover:text-saffron-300">{categoryLabel(product.category)}</Link><span>/</span>
        <span className="font-bold text-mist-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* گالری */}
        <div>
          <div className="relative overflow-hidden rounded-xl border border-night-600/60">
            <div key={view} className="anim-pop-in aspect-[16/10] w-full">
              {view === 0 ? (
                <img src={product.cover} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-full">{galleryArt(view)}</div>
              )}
            </div>
            {off > 0 && <span className="absolute top-4 start-4 rounded-full bg-coral-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">٪{faNum(off)} تخفیف</span>}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => setView(i)} className={`overflow-hidden rounded-lg border-2 transition-all duration-300 ${view === i ? "border-saffron-500" : "border-night-600/50 opacity-60 hover:opacity-100"}`}>
                {i === 0 ? (
                  <img src={product.cover} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="relative aspect-[16/10]">{galleryArt(i)}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* اطلاعات خرید */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && <span className="rounded-full bg-saffron-500 px-3 py-1 text-[11px] font-black text-night-950">{product.badge}</span>}
            <span className="rounded-full border border-night-600/60 bg-night-850 px-3 py-1 text-[11px] font-bold text-mist-300">{categoryLabel(product.category)}</span>
            <span className="rounded-full border border-mint-500/30 bg-mint-500/10 px-3 py-1 text-[11px] font-bold text-mint-300">نسخه {product.version}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-snug text-mist-100 sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Rating value={product.rating} count={product.ratingCount} size={16} />
            <span className="text-xs text-mist-500">{faNum(product.sales)}+ فروش موفق</span>
            <span className="flex items-center gap-1.5 text-xs text-mist-500"><RefreshCw size={13} className="text-mint-400" /> بروزرسانی: {product.updated}</span>
          </div>
          <p className="mt-4 text-[15px] leading-8 text-mist-300">{product.short}</p>

          {/* پنل قیمت */}
          <div className="mt-6 rounded-xl border border-night-600/60 bg-night-850/80 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                {product.oldPrice && <p className="text-sm text-mist-500 line-through decoration-coral-500/60">{price(product.oldPrice)}</p>}
                <p className="font-display text-4xl text-saffron-300">
                  {faNum(product.price)} <span className="text-base text-mist-400">تومان</span>
                </p>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-mist-500"><ShieldCheck size={14} className="text-mint-400" /> گارانتی ۷ روزه‌ی بازگشت وجه</p>
            </div>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Btn size="lg" cut className="flex-1" onClick={() => { if (inCart) app.setCartOpen(true); else { app.addToCart(product.slug); app.toast(`«${product.name}» به سبد اضافه شد`); } }}>
                {inCart ? "مشاهده در سبد خرید" : "افزودن به سبد خرید"}
              </Btn>
              <Btn size="lg" variant="mint" cut className="flex-1" onClick={() => { if (!inCart) app.addToCart(product.slug); app.setCartOpen(true); }}>
                <Zap size={16} /> خرید فوری
              </Btn>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-mist-500">
              <Download size={12} className="text-mint-400" /> تحویل آنی بلافاصله پس از پرداخت
            </p>
          </div>

          {/* متا */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { i: <Box size={16} />, l: "نسخه", v: product.version },
              { i: <HardDrive size={16} />, l: "حجم فایل", v: `${faNum(product.sizeMb)} مگابایت` },
              { i: <CalendarDays size={16} />, l: "آخرین بروزرسانی", v: product.updated },
              { i: <ShieldCheck size={16} />, l: "لایسنس", v: "۶ ماه پشتیبانی" },
              { i: <RefreshCw size={16} />, l: "آپدیت", v: "رایگان" },
              { i: <Download size={16} />, l: "تحویل", v: "آنی و خودکار" },
            ].map((m) => (
              <div key={m.l} className="rounded-lg border border-night-600/50 bg-night-850/60 p-3.5">
                <span className="flex items-center gap-1.5 text-[10px] text-mist-500">{m.i}{m.l}</span>
                <p className="mt-1 text-sm font-bold text-mist-200">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="mt-14">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-night-600/50 bg-night-850/70 p-1.5">
          {([
            { id: "desc", l: "توضیحات و امکانات" },
            { id: "changelog", l: "تغییرات نسخه‌ها" },
            { id: "reviews", l: `دیدگاه‌ها (${faNum(reviews.length)})` },
          ] as { id: Tab; l: string }[]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${tab === t.id ? "bg-saffron-500 text-night-950 shadow" : "text-mist-400 hover:text-mist-100"}`}>
              {t.l}
            </button>
          ))}
        </div>

        <div key={tab} className="anim-pop-in mt-6">
          {tab === "desc" && (
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                {product.description.map((p, i) => (
                  <p key={i} className="text-[15px] leading-8 text-mist-300">{p}</p>
                ))}
              </div>
              <div className="lg:col-span-2">
                <h3 className="mb-4 font-display text-2xl text-mist-100">امکانات کلیدی</h3>
                <ul className="space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 rounded-lg border border-night-600/40 bg-night-850/50 px-3.5 py-2.5 text-sm text-mist-300">
                      <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint-500/15 text-mint-400"><Zap size={10} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "changelog" && (
            <div className="max-w-2xl space-y-4">
              {product.changelog.map((c, i) => (
                <div key={c.version} className="relative rounded-xl border border-night-600/50 bg-night-850/60 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl text-saffron-300">نسخه {c.version}</p>
                    <span className="text-[11px] text-mist-500">{c.date}</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-mist-300">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-mint-400" : "bg-night-500"}`} />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                {reviews.map((r, i) => (
                  <article key={i} className="rounded-xl border border-night-600/50 bg-night-850/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-night-700 font-display text-mint-300">{r.name.charAt(0)}</span>
                        <div><p className="text-sm font-bold text-mist-100">{r.name}</p><p className="text-[10px] text-mist-500">{r.date} • خرید تأییدشده</p></div>
                      </div>
                      <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className={s <= r.rating ? "fill-saffron-400 text-saffron-400" : "text-night-600"} />)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-mist-300">{r.text}</p>
                  </article>
                ))}
              </div>
              <form onSubmit={submitReview} className="h-fit rounded-xl border border-night-600/50 bg-night-850/60 p-5 lg:col-span-2">
                <h3 className="font-display text-2xl text-mist-100">ثبت دیدگاه</h3>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-xs font-bold text-mist-400">امتیاز شما:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button type="button" key={s} onClick={() => setRevRating(s)} className="transition-transform hover:scale-125" aria-label={`${s} ستاره`}>
                      <Star size={20} className={s <= revRating ? "fill-saffron-400 text-saffron-400" : "text-night-600"} />
                    </button>
                  ))}
                </div>
                <textarea value={revText} onChange={(e) => { setRevText(e.target.value); setRevErr(""); }} rows={4} placeholder="تجربه‌تان از این محصول را بنویسید…" className={`mt-3 w-full rounded-lg border bg-night-950/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-saffron-500/60 ${revErr ? "border-coral-500/60" : "border-night-600/60"}`} />
                {revErr && <p className="anim-pop-in mt-1.5 text-[11px] text-coral-300">{revErr}</p>}
                <Btn type="submit" className="mt-4 w-full">
                  <Send size={15} /> ارسال دیدگاه
                </Btn>
                {!app.user && <p className="mt-2 text-center text-[10px] text-mist-500">برای ثبت دیدگاه باید وارد حساب شوید</p>}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* مرتبط‌ها */}
      <div className="mt-20">
        <Reveal>
          <SectionHead kicker="پیشنهادهای مرتبط" title="شاید بپسندید" action={<Link to="shop" className="group inline-flex items-center gap-2 text-sm font-bold text-mist-300 transition hover:text-saffron-300">همه<ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /></Link>} />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
