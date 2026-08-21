/** ماژول صفحات ایستا — درباره ما، تماس، سوالات متداول و ۴۰۴ */
import { useState, type FormEvent } from "react";
import { Building2, CheckCircle2, Clock3, Compass, FolderTree, Mail, MapPin, Phone, Rocket, SearchX, Send, Users } from "lucide-react";
import { Link } from "../../store/router";
import { faNum } from "../../lib/format";
import { useApp } from "../../store/AppContext";
import { Accordion, Btn, Field, Reveal, SectionHead } from "../../components/ui";

function PageHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative overflow-hidden border-b border-night-700/50 bg-night-900/50">
      <div className="bg-blueprint absolute inset-0 opacity-50 [mask-image:linear-gradient(black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <h1 className="font-display text-4xl text-mist-100 sm:text-5xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-mist-400">{desc}</p>
      </div>
    </div>
  );
}

/* ---------- درباره ما ---------- */
export function AboutPage() {
  const timeline = [
    { y: "۱۴۰۰", t: "جرقه‌ی اول", d: "فایلینو با ۳ محصول و یک میز کار کوچک در تهران شروع شد." },
    { y: "۱۴۰۲", t: "هزارمین فروش", d: "اولین هزارتایی رد شد و تیم پشتیبانی ۲۴ ساعته شکل گرفت." },
    { y: "۱۴۰۳", t: "بازنویسی ماژولار", d: "کل قالب از صفر کامپوننت‌محور شد؛ سرعت لود ۳ برابر شد." },
    { y: "۱۴۰۴", t: "امروز", d: `${faNum(45)} محصول اورجینال، ${faNum(8400)}+ فروش موفق و یک جامعه‌ی بزرگ فروشنده.` },
  ];
  return (
    <main>
      <PageHead title="درباره‌ی فایلینو" desc="ما باور داریم فروشنده‌ی ایرانی لیاقت ابزارهایی را دارد که هم‌تراز نمونه‌های جهانی باشند — با زبانی که با آن فکر می‌کند." />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHead kicker="داستان ما" title="از یک میز کوچک تا مارکتِ هزاران فروشنده" />
              <p className="text-[15px] leading-8 text-mist-300">
                فایلینو در سال ۱۴۰۰ با یک سوال ساده شروع شد: چرا فروشگاه‌های فارسی باید با قالب‌های ترجمه‌شده‌ی نصفه‌ونیمه بسازند؟ ما تصمیم گرفتیم خودمان بسازیم — از صفر، راست‌چین واقعی، با تایپوگرافی فارسی و کدنویسی ماژولار.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-mist-300">
                امروز هر محصول فایلینو قبل از انتشار، از سه فیلتر رد می‌شود: سرعت (نمره‌ی سبز PageSpeed)، امنیت (اسکن خودکار هفتگی) و تجربه‌ی کاربری (تست روی ۱۲ دستگاه واقعی).
              </p>
              <div className="mt-6 flex items-center gap-6">
                <span className="flex items-center gap-2 text-sm font-bold text-mist-200"><Users size={17} className="text-saffron-400" /> تیم {faNum(14)} نفره</span>
                <span className="flex items-center gap-2 text-sm font-bold text-mist-200"><Rocket size={17} className="text-mint-400" /> {faNum(45)} محصول فعال</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-saffron-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-xl border border-night-600/60 bg-night-950 shadow-2xl" dir="ltr">
                <div className="flex items-center gap-1.5 border-b border-night-700/60 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral-500" /><span className="h-2.5 w-2.5 rounded-full bg-saffron-500" /><span className="h-2.5 w-2.5 rounded-full bg-mint-500" />
                  <span className="ms-2 font-mono text-[10px] text-mist-500">filino-theme/ — آناتومی ماژولار</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-7 text-mist-300"><code>{`├── 📁 components/
│   ├── ui/          → دکمه، مودال، اعلان…
│   └── ProductCard  → کارت محصول (memo شده)
├── 📁 modules/
│   ├── shop/        → فروشگاه + فیلترها
│   ├── product/     → جزئیات هر پست‌تایپ
│   ├── blog/        → مقالات و آرشیو
│   └── panel/       → پنل کاربری (۵ تب)
├── 📁 store/        → استیت سراسری سبک
└── ⚡ lazy-load هر ماژول فقط در صفحه‌ی خودش`}</code></pre>
              </div>
            </div>
          </Reveal>
        </div>

        {/* تایم‌لاین */}
        <div className="mt-20">
          <Reveal><SectionHead kicker="مسیر ما" title="فایلینو در گذر زمان" /></Reveal>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <span className="absolute inset-x-0 top-7 hidden h-px bg-night-600 lg:block" />
            {timeline.map((t, i) => (
              <Reveal key={t.y} delay={i * 100}>
                <div className="relative">
                  <span className="relative z-10 inline-grid h-14 w-14 place-items-center rounded-full border-2 border-saffron-500/50 bg-night-900 font-display text-lg text-saffron-300">{t.y}</span>
                  <h3 className="mt-4 font-display text-xl text-mist-100">{t.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-7 text-mist-400">{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-20 flex flex-col items-center gap-4 rounded-2xl border border-night-600/50 bg-night-850/70 p-10 text-center">
            <Compass size={30} className="text-saffron-400" />
            <h2 className="font-display text-3xl text-mist-100">آماده‌اید فروشگاه‌تان را حرفه‌ای کنید؟</h2>
            <p className="max-w-md text-sm leading-7 text-mist-400">ویترین ما را ببینید؛ هر محصول با گارانتی ۷ روزه‌ی بازگشت وجه همراه است.</p>
            <Link to="shop" className="cut mt-2 inline-flex items-center gap-2 bg-saffron-500 px-7 py-3.5 font-black text-night-950 transition hover:bg-saffron-400">مشاهده‌ی فروشگاه</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ---------- تماس با ما ---------- */
export function ContactPage() {
  const { toast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", topic: "پیش از خرید", msg: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 3) er.name = "نام خود را کامل وارد کنید";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "ایمیل معتبر وارد کنید";
    if (form.msg.trim().length < 15) er.msg = "پیام باید حداقل ۱۵ حرف باشد";
    setErrs(er);
    if (Object.keys(er).length) return;
    setSent(true);
    toast("پیام شما ارسال شد؛ زیر ۲۴ ساعت پاسخ می‌دهیم");
  };

  return (
    <main>
      <PageHead title="تماس با ما" desc="سوال پیش از خرید، مشکل فنی یا پیشنهاد همکاری؟ هر مسیری که راحت‌تر است را انتخاب کنید." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            { i: <Phone size={19} />, t: "تلفن پشتیبانی", v: "۰۲۱ - ۹۱۰۰ ۸۴۰۰", s: "شنبه تا پنجشنبه، ۹ تا ۲۱", tint: "#52d8bc" },
            { i: <Mail size={19} />, t: "ایمیل", v: "hello@filino.ir", s: "پاسخ زیر ۲۴ ساعت", tint: "#efa33a" },
            { i: <MapPin size={19} />, t: "دفتر مرکزی", v: "تهران، سعادت‌آباد، برج نگین، طبقه‌ی ۷", s: "جلسات حضوری با هماهنگی قبلی", tint: "#ff8a6e" },
            { i: <Clock3 size={19} />, t: "ساعات پاسخگویی", v: "۷ روز هفته", s: "تیکت‌ها حتی جمعه‌شب‌ها هم جواب دارند!", tint: "#7fb4ff" },
          ].map((c) => (
            <div key={c.t} className="card-lift flex items-start gap-4 rounded-xl border border-night-600/50 bg-night-850/70 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg" style={{ background: `${c.tint}15`, color: c.tint }}>{c.i}</span>
              <div><p className="text-sm font-black text-mist-100">{c.t}</p><p className="mt-1 text-sm text-mist-300">{c.v}</p><p className="mt-1 text-[11px] text-mist-500">{c.s}</p></div>
            </div>
          ))}
          <div className="bg-blueprint relative overflow-hidden rounded-xl border border-night-600/50 bg-night-850/70 p-6 text-center">
            <Building2 size={26} className="mx-auto text-saffron-400" />
            <p className="mt-2 font-display text-xl text-mist-100">نقشه‌ی دفتر</p>
            <p className="mt-1 text-[11px] text-mist-500">سعادت‌آباد، بلوار دریا، نبش گلستان — پلاک ۱۴</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <div className="anim-pop-in flex h-full flex-col items-center justify-center rounded-xl border border-mint-500/25 bg-mint-500/6 p-12 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-mint-500/15 text-mint-400"><CheckCircle2 size={40} /></span>
              <h2 className="mt-5 font-display text-3xl text-mist-100">پیام‌تان رسید!</h2>
              <p className="mt-2 max-w-sm text-sm leading-7 text-mist-400">معمولاً زیر ۲۴ ساعت (و اغلب خیلی زودتر) به ایمیل‌تان پاسخ می‌دهیم. کد پیگیری: <b className="text-mint-300">MSG-{faNum(4821)}</b></p>
              <Btn variant="ghost" className="mt-6" onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "پیش از خرید", msg: "" }); }}>ارسال پیام جدید</Btn>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-xl border border-night-600/50 bg-night-850/70 p-7">
              <h2 className="font-display text-2xl text-mist-100">فرم تماس</h2>
              <p className="mt-1 text-xs text-mist-500">فیلدهای ستاره‌دار الزامی‌اند.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="نام و نام خانوادگی *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errs.name} placeholder="مثلاً سارا محمدی" />
                <Field label="ایمیل *" dir="ltr" className="text-left" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errs.email} placeholder="you@example.com" />
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-bold text-mist-300">موضوع</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-lg border border-night-600/60 bg-night-950/70 px-4 py-2.5 text-sm text-mist-100 outline-none focus:border-saffron-500/60 [&>option]:bg-night-850">
                  {["پیش از خرید", "مشکل فنی", "درخواست فاکتور", "همکاری / فروش محصول", "سایر"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-bold text-mist-300">پیام شما *</span>
                <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} rows={6} placeholder="چطور می‌توانیم کمک کنیم؟" className={`w-full rounded-lg border bg-night-950/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-saffron-500/60 ${errs.msg ? "border-coral-500/60" : "border-night-600/60"}`} />
                {errs.msg && <span className="anim-pop-in mt-1.5 block text-[11px] text-coral-300">{errs.msg}</span>}
              </label>
              <Btn size="lg" cut type="submit" className="mt-5 w-full sm:w-auto"><Send size={16} /> ارسال پیام</Btn>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------- سوالات متداول ---------- */
export function FaqPage() {
  const faqs = [
    { q: "بعد از خرید، فایل‌ها چطور به دستم می‌رسد؟", a: "بلافاصله بعد از پرداخت، لینک دانلود در پنل کاربری (بخش دانلودها) فعال می‌شود و یک نسخه هم به ایمیل‌تان ارسال می‌شود. تحویل کاملاً خودکار است و نیازی به انتظار ندارد." },
    { q: "آیا محصولات واقعاً اورجینال هستند؟", a: "بله؛ همه‌ی محصولات یا توسعه‌ی مستقیم تیم فایلینو هستند یا با لایسنس رسمی از سازنده منتشر می‌شوند. فایلی که از مارکت‌های خارجی بدون اجازه برداشته شده باشد، در فایلینو جایی ندارد." },
    { q: "سیاست بازگشت وجه چگونه است؟", a: "تا ۷ روز بعد از خرید، اگر محصول با توضیحات صفحه‌اش مطابقت نداشت، تمام مبلغ بدون قیدوشرط برمی‌گردد. کافی است از پنل کاربری تیکت بزنید." },
    { q: "آپدیت محصولات هزینه دارد؟", a: "خیر؛ یک بار خرید کنید و تمام نسخه‌های بعدی را رایگان از پنل دانلود کنید. بعضی محصولات (مثل کیت نگار) آپدیت مادام‌العمر دارند." },
    { q: "لایسنس هر محصول برای چند سایت معتبر است؟", a: "لایسنس استاندارد برای یک دامنه فعال است. برای استفاده‌ی چندسایتی، لایسنس توسعه‌دهنده با ۵ دامنه موجود است که هنگام خرید قابل انتخاب است." },
    { q: "اگر در نصب به مشکل بخورم چه؟", a: "همه‌ی محصولات راهنمای نصب ویدیویی فارسی دارند و تیم پشتیبانی ۷ روز هفته، با میانگین پاسخ زیر ۲ ساعت، رایگان کمکتان می‌کند." },
    { q: "چطور محصول خودم را در فایلینو بفروشم؟", a: "از فرم تماس، موضوع «همکاری / فروش محصول» را انتخاب کنید. تیم بررسی ظرف ۴۸ ساعت نمونه‌کار شما را ارزیابی و شرایط همکاری (۷۰٪ سهم فروشنده) را ارسال می‌کند." },
  ];
  return (
    <main>
      <PageHead title="سوالات متداول" desc="جواب سوال‌هایی که هر روز می‌شنویم؛ اگر جواب‌تان این‌جا نبود، یک تیکت بزنید." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3">
        <div className="space-y-3.5 lg:col-span-2">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i, 4) * 60}>
              <Accordion title={f.q} defaultOpen={i === 0}>{f.a}</Accordion>
            </Reveal>
          ))}
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-saffron-500/25 bg-saffron-500/6 p-6">
            <FolderTree size={24} className="text-saffron-400" />
            <h2 className="mt-3 font-display text-2xl text-mist-100">جواب‌تان را پیدا نکردید؟</h2>
            <p className="mt-2 text-sm leading-7 text-mist-400">تیم پشتیبانی ۷ روز هفته آنلاین است؛ میانگین پاسخ زیر ۲ ساعت.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link to="panel/tickets" className="cut inline-flex items-center justify-center gap-2 bg-saffron-500 px-5 py-3 text-sm font-black text-night-950 transition hover:bg-saffron-400"><Send size={15} /> ثبت تیکت پشتیبانی</Link>
              <Link to="contact" className="inline-flex items-center justify-center gap-2 rounded-lg border border-night-600/60 py-3 text-sm font-bold text-mist-300 transition hover:border-mint-500/40 hover:text-mint-300">راه‌های تماس</Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

/* ---------- ۴۰۴ ---------- */
export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-2xl border border-night-600/60 bg-night-850 text-mist-500"><SearchX size={36} /></span>
      <h1 className="mt-6 font-display text-7xl text-saffron-400">۴۰۴</h1>
      <h2 className="mt-2 font-display text-3xl text-mist-100">این صفحه گم شده!</h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-mist-400">شاید آدرس اشتباه تایپ شده یا صفحه منتقل شده است. از فروشگاه یا خانه شروع کنید.</p>
      <div className="mt-6 flex gap-3">
        <Link to="" className="cut bg-saffron-500 px-6 py-3 text-sm font-black text-night-950 transition hover:bg-saffron-400">صفحه‌ی اصلی</Link>
        <Link to="shop" className="rounded-lg border border-night-600/60 px-6 py-3 text-sm font-bold text-mist-300 transition hover:border-saffron-500/40 hover:text-saffron-300">فروشگاه</Link>
      </div>
    </main>
  );
}
