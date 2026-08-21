/** ماژول فروشگاه — فیلتر دسته/قیمت/تخفیف، مرتب‌سازی، جستجو و گرید محصولات */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { useRoute, Link } from "../../store/router";
import { categories, products, type CategoryId } from "../../data/products";
import { faNum } from "../../lib/format";
import { ProductCard } from "../../components/ProductCard";
import { Btn, EmptyState, Reveal, Switch } from "../../components/ui";

type SortKey = "new" | "best" | "cheap" | "expensive" | "rated";
const SORTS: { id: SortKey; label: string }[] = [
  { id: "new", label: "جدیدترین" },
  { id: "best", label: "پرفروش‌ترین" },
  { id: "rated", label: "محبوب‌ترین" },
  { id: "cheap", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
];

export function ShopPage() {
  const route = useRoute();
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<SortKey>("new");
  const [onlySale, setOnlySale] = useState(false);
  const [q, setQ] = useState("");
  const [minK, setMinK] = useState("");
  const [maxK, setMaxK] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* همگام‌سازی قطعی فیلترها با پارامترهای آدرس (?cat=...&q=...&sale=1) */
  useEffect(() => {
    const c = route.query.get("cat");
    setCat(c && categories.some((x) => x.id === c) ? (c as CategoryId) : "all");
    setOnlySale(route.query.get("sale") === "1");
    setQ(route.query.get("q") ?? "");
  }, [route]);

  const result = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (onlySale) list = list.filter((p) => p.oldPrice);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || p.short.toLowerCase().includes(t));
    }
    const min = Number(minK) * 1000;
    const max = Number(maxK) * 1000;
    if (minK && !Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    if (maxK && !Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    switch (sort) {
      case "best": list.sort((a, b) => b.sales - a.sales); break;
      case "rated": list.sort((a, b) => b.rating - a.rating); break;
      case "cheap": list.sort((a, b) => a.price - b.price); break;
      case "expensive": list.sort((a, b) => b.price - a.price); break;
    }
    return list;
  }, [cat, sort, onlySale, q, minK, maxK]);

  const clearAll = () => {
    setCat("all"); setOnlySale(false); setQ(""); setMinK(""); setMaxK(""); setSort("new");
  };
  const hasFilter = cat !== "all" || onlySale || q.trim() !== "" || minK !== "" || maxK !== "";

  const Filters = (
    <div className="space-y-6">
      {/* جستجو */}
      <div>
        <h4 className="mb-3 text-xs font-black tracking-wide text-mist-500">جستجو</h4>
        <div className="relative">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="نام محصول…" className="w-full rounded-lg border border-night-600/60 bg-night-950/70 py-2.5 pe-3 ps-9 text-sm outline-none transition focus:border-saffron-500/60" />
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-mist-500" />
        </div>
      </div>
      {/* دسته‌بندی */}
      <div>
        <h4 className="mb-3 text-xs font-black tracking-wide text-mist-500">دسته‌بندی</h4>
        <div className="space-y-1.5">
          <button onClick={() => setCat("all")} className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition ${cat === "all" ? "bg-saffron-500/12 font-bold text-saffron-300" : "text-mist-300 hover:bg-night-800"}`}>
            همه‌ی محصولات
            <span className="text-[11px] text-mist-500">{faNum(products.length)}</span>
          </button>
          {categories.map((c) => {
            const n = products.filter((p) => p.category === c.id).length;
            const active = cat === c.id;
            return (
              <button key={c.id} onClick={() => setCat(c.id)} className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition ${active ? "bg-saffron-500/12 font-bold text-saffron-300" : "text-mist-300 hover:bg-night-800"}`}>
                <span className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.tint }} />
                  {c.label}
                </span>
                <span className="text-[11px] text-mist-500">{faNum(n)}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* بازه‌ی قیمت */}
      <div>
        <h4 className="mb-3 text-xs font-black tracking-wide text-mist-500">بازه‌ی قیمت (هزار تومان)</h4>
        <div className="flex items-center gap-2">
          <input type="number" min={0} value={minK} onChange={(e) => setMinK(e.target.value)} placeholder="از" className="w-full rounded-lg border border-night-600/60 bg-night-950/70 px-3 py-2.5 text-sm outline-none focus:border-saffron-500/60" />
          <span className="text-mist-600">—</span>
          <input type="number" min={0} value={maxK} onChange={(e) => setMaxK(e.target.value)} placeholder="تا" className="w-full rounded-lg border border-night-600/60 bg-night-950/70 px-3 py-2.5 text-sm outline-none focus:border-saffron-500/60" />
        </div>
      </div>
      <Switch checked={onlySale} onChange={setOnlySale} label="فقط محصولات تخفیف‌دار" />
      {hasFilter && (
        <button onClick={clearAll} className="flex w-full items-center justify-center gap-2 rounded-lg border border-coral-500/40 bg-coral-500/10 py-2.5 text-sm font-bold text-coral-300 transition hover:bg-coral-500/20">
          <X size={15} /> حذف همه‌ی فیلترها
        </button>
      )}
    </div>
  );

  return (
    <main className="relative">
      {/* سربرگ صفحه */}
      <div className="relative overflow-hidden border-b border-night-700/50 bg-night-900/50">
        <div className="bg-blueprint absolute inset-0 opacity-50 [mask-image:linear-gradient(black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <nav className="mb-3 flex items-center gap-2 text-[11px] text-mist-500">
            <Link to="" className="transition hover:text-saffron-300">خانه</Link>
            <span>/</span>
            <span className="font-bold text-mist-300">فروشگاه</span>
          </nav>
          <h1 className="font-display text-4xl text-mist-100 sm:text-5xl">فروشگاه محصولات دیجیتال</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-mist-400">
            {faNum(products.length)} محصول اورجینال با تحویل آنی؛ فیلتر کنید، مقایسه کنید و با خیال راحت بخرید.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[270px_1fr]">
        {/* فیلترها — دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-night-600/50 bg-night-850/70 p-5">{Filters}</div>
        </aside>

        <div>
          {/* نوار ابزار */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-mist-400">
              <b className="font-black text-mist-100">{faNum(result.length)}</b> محصول پیدا شد
            </p>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-night-600/60 bg-night-850 px-4 py-2.5 text-sm font-bold text-mist-200 lg:hidden">
                <SlidersHorizontal size={15} /> فیلترها
              </button>
              <label className="flex items-center gap-2 rounded-lg border border-night-600/60 bg-night-850 px-3.5 py-2.5 text-sm">
                <ArrowUpDown size={14} className="text-mist-500" />
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-transparent font-bold text-mist-200 outline-none [&>option]:bg-night-850">
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* گرید محصولات */}
          {result.length === 0 ? (
            <EmptyState
              icon={<PackageSearch size={28} />}
              title="چیزی پیدا نشد!"
              desc="با این فیلترها محصولی مطابق نیست. فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید."
              action={<Btn variant="ghost" onClick={clearAll}>حذف فیلترها</Btn>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i, 5) * 70}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* فیلترها — موبایل */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-night-950/80 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="anim-slide-start absolute bottom-0 start-0 end-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-night-600/60 bg-night-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl">فیلترها</h3>
              <button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-night-600 text-mist-300"><X size={17} /></button>
            </div>
            {Filters}
            <Btn size="lg" className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
              نمایش {faNum(result.length)} محصول
            </Btn>
          </div>
        </div>
      )}
    </main>
  );
}
