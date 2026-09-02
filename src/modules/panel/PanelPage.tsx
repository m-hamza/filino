/** ماژول پنل کاربری — پوسته‌ی اصلی، نگهبان ورود و ناوبری تب‌ها */
import type { ReactNode } from "react";
import { Download, LayoutDashboard, Lock, LogOut, Settings, ShoppingBag, Ticket, Wallet } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { Link, navigate } from "../../store/router";
import { mockDownloads, mockOrders, mockTickets, mockUser } from "../../data/user";
import { faNum, price } from "../../lib/format";
import { Btn } from "../../components/ui";
import { DashboardTab, DownloadsTab } from "./PanelTabs";
import { OrdersTab, SettingsTab, TicketsTab } from "./PanelTabs2";

export type PanelTabId = "dashboard" | "downloads" | "orders" | "tickets" | "settings";

const TABS: { id: PanelTabId; label: string; icon: ReactNode; badge?: number }[] = [
  { id: "dashboard", label: "پیشخوان", icon: <LayoutDashboard size={17} /> },
  { id: "downloads", label: "دانلودهای من", icon: <Download size={17} />, badge: mockDownloads.length },
  { id: "orders", label: "سفارش‌ها", icon: <ShoppingBag size={17} />, badge: mockOrders.length },
  { id: "tickets", label: "تیکت پشتیبانی", icon: <Ticket size={17} />, badge: mockTickets.filter((t) => t.status === "باز").length },
  { id: "settings", label: "تنظیمات حساب", icon: <Settings size={17} /> },
];

export function PanelPage({ tab }: { tab: PanelTabId }) {
  const { user, setAuthOpen, logout, toast } = useApp();

  if (!user) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="anim-breathe grid h-20 w-20 place-items-center rounded-2xl border border-saffron-500/30 bg-saffron-500/10 text-saffron-400"><Lock size={34} /></span>
        <h1 className="mt-6 font-display text-4xl text-mist-100">ورود لازم است</h1>
        <p className="mt-3 text-sm leading-7 text-mist-400">
          برای دسترسی به دانلودها، سفارش‌ها و تیکت‌های پشتیبانی، ابتدا وارد حساب کاربری‌تان شوید. نسخه‌ی نمایشی با هر ایمیلی کار می‌کند.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2.5">
          <Btn size="lg" cut onClick={() => setAuthOpen(true)}>ورود | ثبت‌نام</Btn>
          <Link to="shop" className="rounded-lg border border-night-600/60 py-3 text-sm font-bold text-mist-300 transition hover:border-saffron-500/40 hover:text-saffron-300">بازگشت به فروشگاه</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-2 text-[11px] text-mist-500">
        <Link to="" className="transition hover:text-saffron-300">خانه</Link><span>/</span>
        <span className="font-bold text-mist-300">پنل کاربری</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        {/* سایدبار */}
        <aside>
          <div className="overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80">
            <div className="bg-stripes relative border-b border-night-700/60 bg-night-800/70 p-5">
              <div className="flex items-center gap-3.5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-saffron-500 font-display text-2xl text-night-950 shadow-lg">
                  {user.name.trim().charAt(0) || "ک"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl text-mist-100">{user.name}</p>
                  <p className="truncate text-[11px] text-mist-500" dir="ltr">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-mint-500/25 bg-night-950/60 px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-[11px] font-bold text-mist-400"><Wallet size={14} className="text-mint-400" /> کیف پول</span>
                <span className="text-sm font-black text-mint-300">{price(mockUser.wallet)}</span>
              </div>
            </div>

            {/* ناوبری دسکتاپ */}
            <nav className="hidden p-3 lg:block">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => navigate(`panel/${t.id}`)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 ${tab === t.id ? "bg-saffron-500/12 text-saffron-300 shadow-[inset_3px_0_0_#efa33a]" : "text-mist-300 hover:bg-night-800 hover:text-mist-100"}`}>
                  {t.icon}
                  {t.label}
                  {t.badge ? <span className="ms-auto rounded-full bg-night-700 px-2 py-0.5 text-[10px] text-mist-300">{faNum(t.badge)}</span> : null}
                </button>
              ))}
              <div className="my-2 border-t border-night-700/60" />
              <button onClick={() => { logout(); toast("از حساب خارج شدید", "info"); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-coral-300 transition hover:bg-coral-500/10">
                <LogOut size={17} /> خروج از حساب
              </button>
            </nav>

            {/* ناوبری موبایل */}
            <nav className="flex gap-1 overflow-x-auto p-2 lg:hidden">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => navigate(`panel/${t.id}`)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition ${tab === t.id ? "bg-saffron-500 text-night-950" : "bg-night-800 text-mist-300"}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* محتوای تب */}
        <div key={tab} className="anim-pop-in min-w-0">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "downloads" && <DownloadsTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "tickets" && <TicketsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </main>
  );
}
