/** ماژول فوتر — لینک‌ها، دسته‌بندی‌ها و نمادهای اعتماد */
import { Phone, Mail, MapPin, ShieldCheck, BadgeCheck, Send, Instagram, MessageCircle } from "lucide-react";
import { Link } from "../../store/router";
import { categories } from "../../data/products";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-night-700/60 bg-night-900/70">
      <div className="bg-stripes pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* برند */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center">
              <span className="absolute inset-0 rotate-6 rounded-[10px] bg-night-700" />
              <span className="absolute inset-0 rounded-[10px] bg-saffron-500" />
              <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="#0a161b"><path d="M8 4h9v3h-6v3.5h5v3h-5V20H8z" /></svg>
            </span>
            <span className="font-display text-2xl text-mist-100">فایلینو</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-mist-400">
            مارکت‌پلیس تخصصی محصولات دیجیتال وردپرس؛ قالب، افزونه و ابزار طراحی با فارسی‌سازی واقعی، آپدیت دائمی و پشتیبانی به زبان خودتان.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: <Send size={15} />, label: "تلگرام" },
              { icon: <Instagram size={15} />, label: "اینستاگرام" },
              { icon: <MessageCircle size={15} />, label: "واتس‌اپ" },
            ].map((s) => (
              <a key={s.label} href="#/" aria-label={s.label} onClick={(e) => e.preventDefault()} className="grid h-9 w-9 place-items-center rounded-lg border border-night-600/60 bg-night-850 text-mist-400 transition-all duration-300 hover:-translate-y-1 hover:border-saffron-500/50 hover:text-saffron-300">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* دسترسی سریع */}
        <nav>
          <h4 className="mb-4 font-display text-lg text-mist-100">دسترسی سریع</h4>
          <ul className="space-y-2.5 text-sm text-mist-400">
            {[
              { to: "shop", l: "فروشگاه محصولات" },
              { to: "blog", l: "مقالات و آموزش‌ها" },
              { to: "panel", l: "پنل کاربری" },
              { to: "faq", l: "سوالات متداول" },
              { to: "about", l: "درباره فایلینو" },
              { to: "contact", l: "تماس با ما" },
            ].map((x) => (
              <li key={x.to}>
                <Link to={x.to} className="link-underline transition hover:text-saffron-300">{x.l}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* دسته‌بندی‌ها */}
        <nav>
          <h4 className="mb-4 font-display text-lg text-mist-100">دسته‌بندی‌ها</h4>
          <ul className="space-y-2.5 text-sm text-mist-400">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`shop?cat=${c.id}`} className="link-underline transition hover:text-saffron-300">{c.label}</Link>
              </li>
            ))}
            <li><Link to="shop?sale=1" className="link-underline text-coral-300 transition hover:text-coral-400">تخفیف‌های ویژه 🔥</Link></li>
          </ul>
        </nav>

        {/* تماس و نمادها */}
        <div>
          <h4 className="mb-4 font-display text-lg text-mist-100">در ارتباط باشیم</h4>
          <ul className="space-y-3 text-sm text-mist-400">
            <li className="flex items-center gap-2.5"><Phone size={14} className="shrink-0 text-mint-400" /><span dir="ltr">۰۲۱ - ۹۱۰۰ ۸۴۰۰</span></li>
            <li className="flex items-center gap-2.5"><Mail size={14} className="shrink-0 text-mint-400" /><span dir="ltr">hello@filino.ir</span></li>
            <li className="flex items-start gap-2.5"><MapPin size={14} className="mt-1 shrink-0 text-mint-400" />تهران، سعادت‌آباد، برج نگین، طبقه‌ی ۷</li>
          </ul>
          <div className="mt-5 flex items-center gap-2.5">
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-night-600/60 bg-night-850 text-mint-400" title="نماد اعتماد الکترونیکی"><ShieldCheck size={24} /></span>
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-night-600/60 bg-night-850 text-saffron-400" title="ساماندهی رسانه‌ها"><BadgeCheck size={24} /></span>
            <span className="text-[10px] leading-4 text-mist-500">دارای نماد اعتماد<br />و مجوز رسمی</span>
          </div>
        </div>
      </div>

      <div className="border-t border-night-700/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-[11px] text-mist-500 sm:flex-row">
          <p>© ۱۴۰۴ فایلینو — تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            قالب ماژولار وردپرس <span className="rounded bg-night-800 px-1.5 py-0.5 font-mono text-[10px] text-mint-400">v2.4.0</span>
            ساخته‌شده با <span className="text-coral-400">♥</span> برای وردپرس فارسی
          </p>
        </div>
      </div>
    </footer>
  );
}
