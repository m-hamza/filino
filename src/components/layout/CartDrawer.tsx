/** ماژول کشوی سبد خرید — مدیریت اقلام، کد تخفیف و تسویه‌حساب */
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Ticket, CheckCircle2, ArrowLeft } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { productBySlug } from "../../data/products";
import { price } from "../../lib/format";
import { Btn, Drawer, EmptyState } from "../ui";
import { navigate } from "../../store/router";

export function CartDrawer() {
  const app = useApp();
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, cartSubtotal, discount, discountCode, applyDiscount, placeOrder, user, setAuthOpen, toast } = app;
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const total = cartSubtotal - discount;
  const close = () => { setCartOpen(false); window.setTimeout(() => setSuccessId(null), 350); };

  const submitCode = () => {
    if (!code.trim()) { setCodeError("کد تخفیف را وارد کنید"); return; }
    if (applyDiscount(code)) {
      setCodeError("");
      setCode("");
      toast(`کد «${code.toUpperCase()}» اعمال شد 🎉`);
    } else {
      setCodeError("این کد معتبر نیست");
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
    }
  };

  const checkout = () => {
    if (!user) {
      toast("برای تسویه‌حساب ابتدا وارد حساب شوید", "info");
      setAuthOpen(true);
      return;
    }
    const id = placeOrder();
    setSuccessId(id);
    toast("سفارش شما با موفقیت ثبت شد");
  };

  return (
    <Drawer open={cartOpen} onClose={close} title={successId ? "سفارش ثبت شد" : `سبد خرید ${cart.length ? `(${cart.length.toLocaleString("fa-IR")} کالا)` : ""}`}>
      {successId ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="anim-breathe grid h-20 w-20 place-items-center rounded-full bg-mint-500/15 text-mint-400">
            <CheckCircle2 size={44} />
          </span>
          <h4 className="font-display text-3xl text-mist-100">پرداخت موفق!</h4>
          <p className="text-sm leading-7 text-mist-400">
            سفارش <b className="text-saffron-300">#{successId}</b> ثبت شد و لینک دانلود فایل‌ها به پنل کاربری و ایمیل شما ارسال گردید.
          </p>
          <div className="mt-3 flex w-full flex-col gap-2.5">
            <Btn variant="mint" onClick={() => { close(); navigate("panel/downloads"); }}>
              مشاهده‌ی دانلودها
              <ArrowLeft size={16} />
            </Btn>
            <Btn variant="ghost" onClick={() => { close(); navigate("shop"); }}>ادامه‌ی خرید</Btn>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="سبد شما خالی است"
            desc="هنوز محصولی اضافه نکرده‌اید؛ از فروشگاه فایلینو دیدن کنید و اولین خرید دیجیتال‌تان را انجام دهید."
            action={<Btn onClick={() => { close(); navigate("shop"); }}>رفتن به فروشگاه</Btn>}
          />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* اقلام */}
          <ul className="flex-1 space-y-3 p-5">
            {cart.map((item) => {
              const p = productBySlug(item.slug);
              if (!p) return null;
              return (
                <li key={item.slug} className="anim-slide-start flex gap-3 rounded-xl border border-night-600/50 bg-night-850/70 p-3">
                  <img src={p.cover} alt={p.name} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-mist-100">{p.name}</p>
                    <p className="mt-0.5 text-xs font-black text-saffron-300">{price(p.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-night-600/60 bg-night-950/60 p-0.5">
                        <button onClick={() => setQty(item.slug, item.qty + 1)} className="grid h-6 w-6 place-items-center rounded-md text-mist-300 transition hover:bg-night-700 hover:text-mint-300" aria-label="افزایش"><Plus size={13} /></button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty.toLocaleString("fa-IR")}</span>
                        <button onClick={() => setQty(item.slug, item.qty - 1)} className="grid h-6 w-6 place-items-center rounded-md text-mist-300 transition hover:bg-night-700 hover:text-coral-300" aria-label="کاهش"><Minus size={13} /></button>
                      </div>
                      <button onClick={() => { removeFromCart(item.slug); toast("محصول از سبد حذف شد", "info"); }} className="grid h-7 w-7 place-items-center rounded-md text-mist-500 transition hover:bg-coral-500/15 hover:text-coral-300" aria-label="حذف">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* جمع‌بندی */}
          <div className="border-t border-night-700/60 bg-night-900/80 p-5">
            {!discountCode ? (
              <div className={`mb-4 ${shake ? "anim-shake" : ""}`}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-mist-500" />
                    <input
                      value={code}
                      onChange={(e) => { setCode(e.target.value); setCodeError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && submitCode()}
                      placeholder="کد تخفیف (مثلاً OFF20)"
                      className="w-full rounded-lg border border-night-600/60 bg-night-950/70 py-2.5 pe-3 ps-9 text-xs outline-none transition focus:border-saffron-500/60"
                    />
                  </div>
                  <Btn variant="ghost" size="sm" onClick={submitCode}>اعمال</Btn>
                </div>
                {codeError && <p className="anim-pop-in mt-1.5 text-[11px] text-coral-300">{codeError}</p>}
              </div>
            ) : (
              <p className="anim-pop-in mb-3 flex items-center gap-2 rounded-lg border border-mint-500/30 bg-mint-500/10 px-3 py-2 text-xs font-bold text-mint-300">
                <CheckCircle2 size={14} />
                کد {discountCode} فعال است
              </p>
            )}
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-mist-400"><dt>جمع سبد</dt><dd>{price(cartSubtotal)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between font-bold text-mint-400"><dt>تخفیف</dt><dd>− {price(discount)}</dd></div>
              )}
              <div className="flex justify-between border-t border-dashed border-night-600 pt-2.5 text-base font-black text-mist-100">
                <dt>قابل پرداخت</dt><dd className="text-saffron-300">{price(total)}</dd>
              </div>
            </dl>
            <Btn size="lg" cut className="mt-4 w-full" onClick={checkout}>
              تسویه‌حساب امن
              <ArrowLeft size={17} />
            </Btn>
            <p className="mt-2.5 text-center text-[10px] text-mist-500">تحویل آنی فایل پس از پرداخت • گارانتی ۷ روزه</p>
          </div>
        </div>
      )}
    </Drawer>
  );
}
