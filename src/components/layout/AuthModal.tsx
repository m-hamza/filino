/** ماژول احراز هویت — ورود و ثبت‌نام (شبیه‌سازی برای نسخه‌ی نمایشی قالب) */
import { useState, type FormEvent } from "react";
import { Sparkles, LogIn, UserPlus } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { Btn, Field, Modal } from "../ui";

export function AuthModal() {
  const { authOpen, setAuthOpen, login, toast } = useApp();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (tab === "register" && name.trim().length < 3) errs.name = "نام باید حداقل ۳ حرف باشد";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "ایمیل معتبر وارد کنید";
    if (pass.length < 4) errs.pass = "رمز عبور حداقل ۴ کاراکتر";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const displayName = tab === "register" ? name.trim() : email.split("@")[0];
    login({ name: displayName, email });
    setAuthOpen(false);
    setPass("");
    toast(tab === "register" ? `خوش آمدید ${displayName}! حساب شما ساخته شد` : `خوش آمدید ${displayName}!`);
  };

  return (
    <Modal open={authOpen} onClose={() => setAuthOpen(false)} title={tab === "login" ? "ورود به فایلینو" : "ساخت حساب رایگان"}>
      {/* تب‌ها */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-night-600/60 bg-night-950/60 p-1">
        {(["login", "register"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setErrors({}); }} className={`rounded-md py-2 text-sm font-bold transition-all duration-300 ${tab === t ? "bg-saffron-500 text-night-950 shadow" : "text-mist-400 hover:text-mist-200"}`}>
            {t === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        {tab === "register" && (
          <Field label="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علیرضا احمدی" error={errors.name} />
        )}
        <Field label="ایمیل" dir="ltr" className="text-left" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
        <Field label="رمز عبور" dir="ltr" className="text-left" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" error={errors.pass} />
        <Btn size="lg" cut className="w-full" type="submit">
          {tab === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
          {tab === "login" ? "ورود به حساب" : "ایجاد حساب"}
        </Btn>
      </form>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-saffron-500/25 bg-saffron-500/8 px-3 py-2.5 text-[11px] leading-5 text-mist-400">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-saffron-400" />
        این نسخه‌ی نمایشی قالب است؛ با هر ایمیل و رمزی (حداقل ۴ کاراکتر) می‌توانید وارد شوید و پنل کاربری را کامل تجربه کنید.
      </p>
    </Modal>
  );
}
