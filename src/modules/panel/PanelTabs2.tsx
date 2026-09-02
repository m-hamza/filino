/** ماژول پنل کاربری / تب‌های سفارش‌ها، تیکت‌های پشتیبانی و تنظیمات حساب */
import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle, ChevronDown, CreditCard, PlusCircle, Receipt, Send, Trash2,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { navigate } from "../../store/router";
import { mockOrders, mockTickets, mockUser, type Order, type Ticket } from "../../data/user";
import { products } from "../../data/products";
import { faNum, price } from "../../lib/format";
import { Btn, Field, Modal, StatusBadge, Switch } from "../../components/ui";

function TabHead({ title, desc, extra }: { title: string; desc: string; extra?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-mist-100 sm:text-4xl">{title}</h1>
        <p className="mt-1.5 text-sm text-mist-400">{desc}</p>
      </div>
      {extra}
    </div>
  );
}

/* ---------- سفارش‌ها ---------- */
export function OrdersTab() {
  const { toast } = useApp();
  const [orders] = useState<Order[]>(mockOrders);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <TabHead title="سفارش‌ها" desc={`مجموع ${faNum(orders.length)} سفارش — فاکتور هر خرید از همین‌جا قابل دریافت است.`} />
      <ul className="space-y-4">
        {orders.map((o) => {
          const open = openId === o.id;
          return (
            <li key={o.id} className="overflow-hidden rounded-xl border border-night-600/50 bg-night-850/70">
              <button onClick={() => setOpenId(open ? null : o.id)} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-start transition hover:bg-night-800/50">
                <span className="font-display text-lg text-saffron-300">#{o.id}</span>
                <span className="text-[11px] text-mist-500">{o.date}</span>
                <span className="ms-auto flex items-center gap-3">
                  <span className="text-sm font-black text-mist-100">{price(o.total)}</span>
                  <StatusBadge status={o.status} />
                  <ChevronDown size={16} className={`text-mist-500 transition-transform duration-300 ${open ? "rotate-180 text-saffron-400" : ""}`} />
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-night-700/60 px-5 py-4">
                    <ul className="space-y-2.5">
                      {o.items.map((it) => (
                        <li key={it.slug} className="flex items-center gap-3">
                          <img src={it.cover} alt={it.name} className="h-11 w-16 rounded-md object-cover" />
                          <span className="flex-1 text-sm font-bold text-mist-200">{it.name}</span>
                          <span className="text-xs font-black text-mist-300">{price(it.price)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-night-700 pt-4">
                      <span className="flex items-center gap-2 text-[11px] text-mist-500"><CreditCard size={13} /> روش پرداخت: {o.method}</span>
                      <div className="flex gap-2">
                        <button onClick={() => toast(`فاکتور #${o.id} دانلود شد`)} className="flex items-center gap-1.5 rounded-lg border border-night-600/60 px-3.5 py-2 text-xs font-bold text-mist-300 transition hover:border-saffron-500/50 hover:text-saffron-300">
                          <Receipt size={13} /> دانلود فاکتور
                        </button>
                        <Btn size="sm" variant="mint" onClick={() => navigate("panel/downloads")}>دریافت فایل‌ها</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- تیکت‌ها ---------- */
export function TicketsTab() {
  const { toast, user } = useApp();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});

  const active = tickets.find((t) => t.id === selected);

  const sendReply = () => {
    if (!active) return;
    if (reply.trim().length < 5) { toast("پیام کوتاه است؛ کمی بیشتر بنویسید", "error"); return; }
    setTickets((ts) => ts.map((t) => t.id === active.id ? { ...t, status: "باز", updated: "همین حالا", messages: [...t.messages, { from: "user" as const, text: reply.trim(), date: "همین حالا" }] } : t));
    setReply("");
    toast("پاسخ شما ارسال شد؛ تا لحظاتی دیگر جواب می‌گیرید");
  };

  const submitNew = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (subject.trim().length < 8) er.subject = "موضوع باید حداقل ۸ حرف باشد";
    if (message.trim().length < 20) er.message = "شرح مشکل باید حداقل ۲۰ حرف باشد";
    setErrs(er);
    if (Object.keys(er).length) return;
    const id = `TK-${2220 + tickets.length}`;
    setTickets((ts) => [{ id, subject: subject.trim(), product: product || undefined, status: "باز" as const, updated: "همین حالا", messages: [{ from: "user" as const, text: message.trim(), date: "همین حالا" }] }, ...ts]);
    setNewOpen(false); setSubject(""); setProduct(""); setMessage("");
    toast(`تیکت #${id} ثبت شد — کد پیگیری: ${id}`);
    setSelected(id);
  };

  /* نمای گفتگو */
  if (active) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-5 flex items-center gap-2 text-sm font-bold text-mist-400 transition hover:text-saffron-300">
          ← بازگشت به فهرست تیکت‌ها
        </button>
        <div className="rounded-xl border border-night-600/50 bg-night-850/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night-700/60 px-5 py-4">
            <div>
              <h2 className="font-display text-xl text-mist-100">{active.subject}</h2>
              <p className="mt-0.5 text-[11px] text-mist-500">#{active.id} {active.product && <>• محصول: {active.product}</>}</p>
            </div>
            <StatusBadge status={active.status} />
          </div>
          <div className="max-h-[420px] space-y-4 overflow-y-auto p-5">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-3 ${m.from === "user" ? "rounded-ts-none bg-night-700/80" : "rounded-te-none border border-mint-500/25 bg-mint-500/8"}`}>
                  <p className="text-[10px] font-bold text-mist-500">{m.from === "user" ? user?.name : "پشتیبانی فایلینو"} • {m.date}</p>
                  <p className="mt-1.5 text-sm leading-7 text-mist-200">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-night-700/60 p-4">
            <div className="flex gap-2">
              <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendReply()} placeholder="پاسخ خود را بنویسید…" className="flex-1 rounded-lg border border-night-600/60 bg-night-950/70 px-4 py-2.5 text-sm outline-none focus:border-saffron-500/60" />
              <Btn onClick={sendReply}><Send size={15} /> ارسال</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* فهرست + ثبت تیکت */
  return (
    <div>
      <TabHead
        title="تیکت‌های پشتیبانی"
        desc="سوال، مشکل یا پیشنهاد؟ تیم فنی معمولاً زیر ۲ ساعت پاسخ می‌دهد."
        extra={<Btn onClick={() => setNewOpen(true)}><PlusCircle size={16} /> تیکت جدید</Btn>}
      />
      <ul className="space-y-3">
        {tickets.map((t) => (
          <li key={t.id}>
            <button onClick={() => setSelected(t.id)} className="card-lift flex w-full flex-wrap items-center gap-3 rounded-xl border border-night-600/50 bg-night-850/70 px-5 py-4 text-start transition hover:border-night-500">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${t.status === "باز" ? "bg-coral-500/15 text-coral-300" : t.status === "بسته شده" ? "bg-night-700/70 text-mist-500" : "bg-mint-500/12 text-mint-300"}`}>
                <Send size={16} className={t.status === "باز" ? "-scale-x-100" : ""} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-mist-100">{t.subject}</span>
                <span className="mt-0.5 block text-[10px] text-mist-500">#{t.id} • {t.messages.length.toLocaleString("fa-IR")} پیام • آخرین بروزرسانی: {t.updated}</span>
              </span>
              <StatusBadge status={t.status} />
            </button>
          </li>
        ))}
      </ul>

      {/* مودال تیکت جدید */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="ثبت تیکت جدید" wide>
        <form onSubmit={submitNew} className="space-y-4">
          <Field label="موضوع تیکت" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="مثلاً: مشکل در دانلود فایل قالب" error={errs.subject} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-mist-300">محصول مرتبط (اختیاری)</span>
            <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full rounded-lg border border-night-600/60 bg-night-950/70 px-4 py-2.5 text-sm text-mist-100 outline-none focus:border-saffron-500/60 [&>option]:bg-night-850">
              <option value="">— بدون محصول مشخص —</option>
              {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-mist-300">شرح مشکل</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="هرچه دقیق‌تر توضیح دهید، سریع‌تر حل می‌شود…" className={`w-full rounded-lg border bg-night-950/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-saffron-500/60 ${errs.message ? "border-coral-500/60" : "border-night-600/60"}`} />
            {errs.message && <span className="anim-pop-in mt-1.5 flex items-center gap-1 text-[11px] text-coral-300"><AlertTriangle size={12} />{errs.message}</span>}
          </label>
          <Btn size="lg" className="w-full" type="submit"><Send size={16} /> ثبت تیکت</Btn>
        </form>
      </Modal>
    </div>
  );
}

/* ---------- تنظیمات ---------- */
export function SettingsTab() {
  const { user, login, logout, toast } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(mockUser.phone);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [notif, setNotif] = useState({ order: true, update: true, news: false });
  const [delOpen, setDelOpen] = useState(false);

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("نام یا ایمیل معتبر نیست", "error");
      return;
    }
    login({ name: name.trim(), email });
    toast("اطلاعات حساب ذخیره شد");
  };

  const changePass = (e: FormEvent) => {
    e.preventDefault();
    if (curPass.length < 4) { setPassErr("رمز فعلی را درست وارد کنید"); return; }
    if (newPass.length < 6) { setPassErr("رمز جدید حداقل ۶ کاراکتر باشد"); return; }
    if (newPass !== confPass) { setPassErr("تکرار رمز با رمز جدید یکسان نیست"); return; }
    setPassErr("");
    setCurPass(""); setNewPass(""); setConfPass("");
    toast("رمز عبور تغییر کرد");
  };

  return (
    <div>
      <TabHead title="تنظیمات حساب" desc="اطلاعات شخصی، امنیت و ترجیحات اعلان‌ها را مدیریت کنید." />
      <div className="grid gap-6 lg:grid-cols-2">
        {/* پروفایل */}
        <form onSubmit={saveProfile} className="rounded-xl border border-night-600/50 bg-night-850/70 p-6">
          <h2 className="mb-5 font-display text-xl text-mist-100">اطلاعات شخصی</h2>
          <div className="space-y-4">
            <Field label="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} />
            <Field label="ایمیل" dir="ltr" className="text-left" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field label="شماره موبایل" dir="ltr" className="text-left" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <p className="text-[11px] text-mist-500">عضویت از: {mockUser.joined}</p>
            <Btn type="submit" className="w-full">ذخیره‌ی تغییرات</Btn>
          </div>
        </form>

        <div className="space-y-6">
          {/* رمز عبور */}
          <form onSubmit={changePass} className="rounded-xl border border-night-600/50 bg-night-850/70 p-6">
            <h2 className="mb-5 font-display text-xl text-mist-100">تغییر رمز عبور</h2>
            <div className="space-y-4">
              <Field label="رمز فعلی" type="password" dir="ltr" className="text-left" value={curPass} onChange={(e) => setCurPass(e.target.value)} />
              <Field label="رمز جدید" type="password" dir="ltr" className="text-left" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              <Field label="تکرار رمز جدید" type="password" dir="ltr" className="text-left" value={confPass} onChange={(e) => setConfPass(e.target.value)} />
              {passErr && <p className="anim-pop-in flex items-center gap-1.5 text-[11px] text-coral-300"><AlertTriangle size={12} />{passErr}</p>}
              <Btn type="submit" variant="ghost" className="w-full">تغییر رمز عبور</Btn>
            </div>
          </form>

          {/* اعلان‌ها */}
          <section className="rounded-xl border border-night-600/50 bg-night-850/70 p-6">
            <h2 className="mb-4 font-display text-xl text-mist-100">اعلان‌ها</h2>
            <div className="space-y-2.5">
              <Switch checked={notif.order} onChange={(v) => { setNotif({ ...notif, order: v }); toast("ترجیحات اعلان ذخیره شد", "info"); }} label="اعلان ثبت و تکمیل سفارش" />
              <Switch checked={notif.update} onChange={(v) => { setNotif({ ...notif, update: v }); toast("ترجیحات اعلان ذخیره شد", "info"); }} label="اعلان بروزرسانی محصولات خریداری‌شده" />
              <Switch checked={notif.news} onChange={(v) => { setNotif({ ...notif, news: v }); toast("ترجیحات اعلان ذخیره شد", "info"); }} label="خبرنامه و تخفیف‌های هفتگی" />
            </div>
          </section>
        </div>
      </div>

      {/* منطقه خطر */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-coral-500/30 bg-coral-500/6 p-6">
        <div className="flex items-center gap-3">
          <Trash2 size={20} className="text-coral-400" />
          <div>
            <p className="text-sm font-black text-coral-300">حذف حساب کاربری</p>
            <p className="mt-0.5 text-[11px] text-mist-500">با حذف حساب، دسترسی به لایسنس‌ها و دانلودها از بین می‌رود.</p>
          </div>
        </div>
        <Btn variant="danger" onClick={() => setDelOpen(true)}>حذف دائمی حساب</Btn>
      </div>

      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="مطمئن هستید؟">
        <p className="text-sm leading-7 text-mist-300">
          این عمل <b className="text-coral-300">غیرقابل بازگشت</b> است. همه‌ی لایسنس‌ها، دانلودها و سابقه‌ی خرید شما حذف می‌شود.
        </p>
        <div className="mt-6 flex gap-3">
          <Btn variant="danger" className="flex-1" onClick={() => { setDelOpen(false); logout(); toast("حساب شما حذف شد", "info"); }}>بله، حذف شود</Btn>
          <Btn variant="ghost" className="flex-1" onClick={() => setDelOpen(false)}>انصراف</Btn>
        </div>
      </Modal>
    </div>
  );
}
