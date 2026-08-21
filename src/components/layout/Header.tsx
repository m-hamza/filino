/** ماژول هدر — نویگیشن چسبان، جستجو، سبد و منوی موبایل */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ShoppingCart, Search, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Headphones, ShieldCheck, ChevronDown } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { Link, navigate, useRoute } from "../../store/router";
import { faNum } from "../../lib/format";

function Logo() {
  return (
    <Link to="" className="group flex items-center gap-2.5" ariaLabel="فایلینو — صفحه اصلی">
      <span className="relative grid h-10 w-10 place-items-center">
        <span className="absolute inset-0 rotate-6 rounded-[10px] bg-night-700 transition-transform duration-500 group-hover:rotate-12" />
        <span className="absolute inset-0 rounded-[10px] bg-saffron-500 shadow-[0_8px_24px_-8px_rgba(239,163,58,0.7)]" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="#0a161b"><path d="M8 4h9v3h-6v3.5h5v3h-5V20H8z" /></svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-2xl text-mist-100">فایلینو</span>
        <span className="mt-0.5 block text-[9px] font-bold tracking-[0.35em] text-mist-500">FILINO MARKET</span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "", label: "خانه", key: "home" },
  { to: "shop", label: "فروشگاه", key: "shop" },
  { to: "blog", label: "مقالات", key: "blog" },
  { to: "panel", label: "پنل کاربری", key: "panel" },
  { to: "contact", label: "تماس با ما", key: "contact" },
];

export function Header() {
  const { cartCount, setCartOpen, user, setAuthOpen, logout, toast } = useApp();
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [term, setTerm] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeKey = route.parts[0] || "home";

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(term.trim() ? `shop?q=${encodeURIComponent(term.trim())}` : "shop");
    setTerm("");
    setMobileOpen(false);
  };

  return (
    <>
      {/* نوار بالایی */}
      <div className="relative z-[60] border-b border-night-700/50 bg-night-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] text-mist-400">
          <span className="inline-flex items-center gap-1.5"><Headphones size={13} className="text-mint-400" /> پشتیبانی ۷ روز هفته، پاسخ زیر ۲ ساعت</span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <ShieldCheck size={13} className="text-saffron-400" />
            گارانتی ۷ روزه‌ی بازگشت وجه
            <span className="mx-2 h-3 w-px bg-night-600" />
            کد تخفیف خوش‌آمدگویی: <b className="font-black text-saffron-300">OFF20</b>
          </span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-night-600/60 bg-night-950/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl" : "border-transparent bg-night-950/60 backdrop-blur-sm"}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Logo />

          {/* ناوبری دسکتاپ */}
          <nav className="ms-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active = activeKey === n.key || (n.key === "home" && activeKey === "");
              return (
                <Link key={n.key} to={n.to} className={`relative rounded-lg px-3.5 py-2 text-sm font-bold transition-colors duration-300 ${active ? "text-saffron-300" : "text-mist-300 hover:text-mist-100"}`}>
                  {n.label}
                  {active && <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-saffron-500" />}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-2.5">
            {/* جستجو */}
            <form onSubmit={submitSearch} className="relative hidden md:block">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="جستجوی محصول…"
                className="w-44 rounded-full border border-night-600/60 bg-night-850/80 py-2 pe-4 ps-9 text-xs text-mist-100 placeholder:text-mist-500 outline-none transition-all duration-300 focus:w-60 focus:border-saffron-500/60 focus:ring-2 focus:ring-saffron-500/15"
              />
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-mist-500" />
            </form>

            {/* سبد خرید */}
            <button onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-lg border border-night-600/60 bg-night-850/80 text-mist-200 transition hover:border-saffron-500/50 hover:text-saffron-300" aria-label="سبد خرید">
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span key={cartCount} className="anim-pop-in absolute -top-1.5 -end-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-black text-white">
                  {faNum(cartCount)}
                </span>
              )}
            </button>

            {/* کاربر */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 rounded-lg border border-night-600/60 bg-night-850/80 py-1.5 pe-2.5 ps-1.5 transition hover:border-mint-500/50">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-mint-500 font-display text-sm text-night-950">
                    {user.name.trim().charAt(0) || "ک"}
                  </span>
                  <span className="hidden max-w-24 truncate text-xs font-bold text-mist-200 sm:block">{user.name}</span>
                  <ChevronDown size={13} className={`text-mist-500 transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                {userMenu && (
                  <div className="anim-pop-in absolute start-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-night-600/60 bg-night-850 shadow-2xl">
                    <Link to="panel" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-mist-200 transition hover:bg-night-700/60 hover:text-saffron-300">
                      <LayoutDashboard size={15} /> پنل کاربری
                    </Link>
                    <button onClick={() => { logout(); setUserMenu(false); toast("از حساب خارج شدید", "info"); }} className="flex w-full items-center gap-2.5 border-t border-night-700/60 px-4 py-3 text-sm text-coral-300 transition hover:bg-coral-500/10">
                      <LogOut size={15} /> خروج از حساب
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="cut-sm hidden items-center gap-2 bg-saffron-500 px-4 py-2.5 text-sm font-black text-night-950 transition hover:bg-saffron-400 sm:inline-flex">
                <UserIcon size={15} />
                ورود | ثبت‌نام
              </button>
            )}

            {/* منوی موبایل */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="grid h-10 w-10 place-items-center rounded-lg border border-night-600/60 bg-night-850/80 text-mist-200 lg:hidden" aria-label="منو">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        <div className={`grid transition-all duration-300 lg:hidden ${mobileOpen ? "grid-rows-[1fr] border-t border-night-700/60" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="space-y-1 px-4 py-4">
              <form onSubmit={submitSearch} className="relative mb-3 md:hidden">
                <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="جستجوی محصول…" className="w-full rounded-lg border border-night-600/60 bg-night-850 py-2.5 pe-4 ps-10 text-sm outline-none focus:border-saffron-500/60" />
                <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
              </form>
              {NAV.map((n) => (
                <Link key={n.key} to={n.to} onClick={() => setMobileOpen(false)} className={`block rounded-lg px-4 py-3 text-sm font-bold transition ${activeKey === n.key ? "bg-saffron-500/10 text-saffron-300" : "text-mist-200 hover:bg-night-800"}`}>
                  {n.label}
                </Link>
              ))}
              {!user && (
                <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} className="mt-2 w-full rounded-lg bg-saffron-500 py-3 text-sm font-black text-night-950">
                  ورود | ثبت‌نام
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
