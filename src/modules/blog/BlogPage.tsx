/** ماژول بلاگ — فهرست مقالات با فیلتر دسته و کارت ویژه */
import { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "../../store/router";
import { articleCategories, articles } from "../../data/articles";
import { faNum } from "../../lib/format";
import { CoverArt, EmptyState, Reveal } from "../../components/ui";
import { Btn } from "../../components/ui";

export function BlogPage() {
  const [cat, setCat] = useState("همه");
  const list = cat === "همه" ? articles : articles.filter((a) => a.category === cat);
  const [first, ...rest] = list;

  return (
    <main className="relative">
      <div className="relative overflow-hidden border-b border-night-700/50 bg-night-900/50">
        <div className="bg-blueprint absolute inset-0 opacity-50 [mask-image:linear-gradient(black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <nav className="mb-3 flex items-center gap-2 text-[11px] text-mist-500">
            <Link to="" className="transition hover:text-saffron-300">خانه</Link><span>/</span>
            <span className="font-bold text-mist-300">مقالات</span>
          </nav>
          <h1 className="font-display text-4xl text-mist-100 sm:text-5xl">بلاگ فایلینو</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-mist-400">
            آموزش، راهنمای خرید و تجربیات واقعی از دنیای وردپرس و فروشگاه‌های دیجیتال — هر هفته تازه می‌شود.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* فیلتر دسته */}
        <div className="mb-8 flex flex-wrap gap-2">
          {articleCategories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${cat === c ? "border-saffron-500 bg-saffron-500 text-night-950 shadow-[0_8px_24px_-10px_rgba(239,163,58,0.7)]" : "border-night-600/60 bg-night-850/70 text-mist-300 hover:border-saffron-500/40 hover:text-saffron-300"}`}>
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<BookOpen size={28} />} title="مقاله‌ای نیست" desc="در این دسته هنوز مقاله‌ای منتشر نشده؛ دسته‌ی دیگری را امتحان کنید." action={<Btn variant="ghost" onClick={() => setCat("همه")}>همه‌ی مقالات</Btn>} />
        ) : (
          <>
            {/* مقاله ویژه */}
            <Reveal>
              <Link to={`blog/${first.slug}`} className="card-lift group grid overflow-hidden rounded-2xl border border-night-600/50 bg-night-850/80 lg:grid-cols-2">
                <CoverArt tint={first.tint} glyph={first.glyph} category={first.category} className="aspect-[16/9] lg:aspect-auto lg:min-h-[300px]" />
                <div className="flex flex-col justify-center p-7 sm:p-9">
                  <span className="text-[11px] font-black" style={{ color: first.tint }}>مقاله‌ی ویژه‌ی هفته</span>
                  <h2 className="mt-3 font-display text-3xl leading-snug text-mist-100 transition-colors group-hover:text-saffron-300 sm:text-4xl">{first.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-8 text-mist-400">{first.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-night-700 font-display text-mint-300">{first.author.charAt(0)}</span>
                    <div className="text-[11px] text-mist-500">
                      <p className="font-bold text-mist-200">{first.author}</p>
                      <p>{first.date} • {faNum(first.readMin)} دقیقه مطالعه</p>
                    </div>
                    <span className="ms-auto inline-flex items-center gap-1.5 text-sm font-bold text-saffron-400">
                      خواندن <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* گرید مقالات */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <Reveal key={a.slug} delay={i * 80}>
                  <Link to={`blog/${a.slug}`} className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80">
                    <CoverArt tint={a.tint} glyph={a.glyph} category={a.category} className="aspect-[16/9]" />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-xl leading-snug text-mist-100 transition-colors group-hover:text-saffron-300">{a.title}</h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-mist-400">{a.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-night-700/60 pt-3.5 text-[11px] text-mist-500">
                        <span>{a.author}</span>
                        <span>{a.date} • {faNum(a.readMin)} دقیقه</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
