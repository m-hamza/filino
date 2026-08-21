/** ماژول جزئیات مقاله — فهرست مطالب چسبان، بلوک‌های محتوا، نویسنده و مقالات مرتبط */
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, Lightbulb, ListTree, Quote } from "lucide-react";
import { Link } from "../../store/router";
import { articleBySlug, articles } from "../../data/articles";
import type { ArticleBlock } from "../../data/articles";
import { faNum } from "../../lib/format";
import { useApp } from "../../store/AppContext";
import { Btn, CoverArt, EmptyState, Reveal } from "../../components/ui";

function BlockView({ b }: { b: ArticleBlock }) {
  const { toast } = useApp();
  const [copied, setCopied] = useState(false);
  switch (b.t) {
    case "p": return <p className="text-[15px] leading-9 text-mist-300">{b.text}</p>;
    case "h2": return <h2 id={b.text} className="scroll-mt-28 border-s-4 border-saffron-500 ps-4 font-display text-2xl text-mist-100 sm:text-3xl">{b.text}</h2>;
    case "list":
      return (
        <ul className="space-y-2.5">
          {b.items.map((it) => (
            <li key={it} className="flex items-start gap-3 rounded-lg border border-night-600/40 bg-night-850/50 px-4 py-3 text-sm leading-7 text-mist-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron-500" />{it}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="relative rounded-xl border border-saffron-500/25 bg-saffron-500/6 px-6 py-5">
          <Quote size={22} className="absolute -top-3 start-5 rounded-md bg-saffron-500 p-1 text-night-950" />
          <p className="font-display text-xl leading-relaxed text-mist-100">{b.text}</p>
          {b.by && <footer className="mt-2 text-xs text-mist-500">— {b.by}</footer>}
        </blockquote>
      );
    case "tip":
      return (
        <p className="flex items-start gap-3 rounded-xl border border-mint-500/25 bg-mint-500/8 px-5 py-4 text-sm leading-7 text-mist-200">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-mint-400" />
          <span><b className="text-mint-300">نکته: </b>{b.text}</span>
        </p>
      );
    case "code":
      return (
        <div className="overflow-hidden rounded-xl border border-night-600/60 bg-night-950">
          <div className="flex items-center justify-between border-b border-night-700/60 px-4 py-2.5">
            <span className="font-mono text-[11px] font-bold text-mint-400">{b.lang}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(b.code).catch(() => undefined);
                setCopied(true);
                toast("کد کپی شد", "info");
                window.setTimeout(() => setCopied(false), 1600);
              }}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold text-mist-400 transition hover:bg-night-800 hover:text-saffron-300"
            >
              {copied ? <Check size={12} className="text-mint-400" /> : <Copy size={12} />}
              {copied ? "کپی شد" : "کپی"}
            </button>
          </div>
          <pre dir="ltr" className="overflow-x-auto p-4 text-start font-mono text-[12px] leading-6 text-mist-200"><code>{b.code}</code></pre>
        </div>
      );
  }
}

export function ArticlePage({ slug }: { slug: string }) {
  const article = articleBySlug(slug);
  const { toast } = useApp();
  const idx = articles.findIndex((a) => a.slug === slug);
  const toc = useMemo(() => (article ? article.content.filter((b): b is Extract<ArticleBlock, { t: "h2" }> => b.t === "h2") : []), [article]);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState icon={<BookOpen size={28} />} title="مقاله پیدا نشد" desc="این مقاله حذف شده یا آدرس اشتباه است." action={<Btn onClick={() => (window.location.hash = "#/blog")}>بازگشت به بلاگ</Btn>} />
      </main>
    );
  }

  const prev = articles[idx - 1];
  const next = articles[idx + 1];
  const related = articles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-mist-500">
        <Link to="" className="transition hover:text-saffron-300">خانه</Link><span>/</span>
        <Link to="blog" className="transition hover:text-saffron-300">مقالات</Link><span>/</span>
        <span className="font-bold text-mist-300">{article.category}</span>
      </nav>

      {/* سربرگ مقاله */}
      <header className="mb-8">
        <span className="rounded-full px-3.5 py-1.5 text-xs font-black" style={{ background: `${article.tint}16`, color: article.tint }}>{article.category}</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.35] text-mist-100 sm:text-5xl">{article.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-night-700 font-display text-lg text-saffron-300">{article.author.charAt(0)}</span>
            <div className="text-[11px] text-mist-500">
              <p className="text-sm font-bold text-mist-100">{article.author}</p>
              <p>{article.role}</p>
            </div>
          </div>
          <span className="text-xs text-mist-500">{article.date}</span>
          <span className="text-xs text-mist-500">{faNum(article.readMin)} دقیقه مطالعه</span>
          <button
            onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => undefined); toast("لینک مقاله کپی شد", "info"); }}
            className="ms-auto flex items-center gap-1.5 rounded-lg border border-night-600/60 bg-night-850 px-3.5 py-2 text-xs font-bold text-mist-300 transition hover:border-saffron-500/50 hover:text-saffron-300"
          >
            <Copy size={13} /> کپی لینک
          </button>
        </div>
      </header>

      <CoverArt tint={article.tint} glyph={article.glyph} category={article.category} className="mb-10 aspect-[16/6] rounded-2xl border border-night-600/50" />

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        {/* محتوا */}
        <article className="min-w-0 max-w-3xl space-y-6">
          {article.content.map((b, i) => <BlockView key={i} b={b} />)}

          {/* نویسنده */}
          <div className="mt-10 flex flex-wrap items-center gap-4 rounded-xl border border-night-600/50 bg-night-850/70 p-6">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-night-700 font-display text-2xl text-saffron-300">{article.author.charAt(0)}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl text-mist-100">{article.author}</p>
              <p className="text-xs text-mist-500">{article.role} — نویسنده‌ی {faNum(23)} مقاله در فایلینو</p>
            </div>
          </div>

          {/* قبلی/بعدی */}
          <div className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link to={`blog/${prev.slug}`} className="group rounded-xl border border-night-600/50 bg-night-850/60 p-4 transition hover:border-saffron-500/40">
                <span className="flex items-center gap-1.5 text-[10px] text-mist-500"><ArrowRight size={12} /> مقاله‌ی قبلی</span>
                <p className="mt-1.5 truncate text-sm font-bold text-mist-200 transition group-hover:text-saffron-300">{prev.title}</p>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`blog/${next.slug}`} className="group rounded-xl border border-night-600/50 bg-night-850/60 p-4 text-left transition hover:border-saffron-500/40">
                <span className="flex items-center justify-end gap-1.5 text-[10px] text-mist-500">مقاله‌ی بعدی <ArrowLeft size={12} /></span>
                <p className="mt-1.5 truncate text-end text-sm font-bold text-mist-200 transition group-hover:text-saffron-300">{next.title}</p>
              </Link>
            )}
          </div>
        </article>

        {/* فهرست مطالب */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-night-600/50 bg-night-850/70 p-5">
            <h4 className="mb-4 flex items-center gap-2 font-display text-lg text-mist-100"><ListTree size={17} className="text-saffron-400" /> فهرست مطالب</h4>
            <ol className="space-y-1 border-s border-night-700">
              {toc.map((h, i) => (
                <li key={i}>
                  <button
                    onClick={() => document.getElementById(h.text)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="block w-full border-s-2 border-transparent py-1.5 pe-2 ps-3.5 text-start text-[13px] leading-6 text-mist-400 transition hover:border-saffron-500 hover:text-saffron-300"
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* مرتبط‌ها */}
      <div className="mt-16">
        <Reveal>
          <h2 className="mb-6 font-display text-3xl text-mist-100">مقالات مرتبط</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {related.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link to={`blog/${a.slug}`} className="card-lift group flex items-center gap-4 rounded-xl border border-night-600/50 bg-night-850/70 p-5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl font-display text-4xl transition-transform duration-300 group-hover:scale-110" style={{ background: `${a.tint}14`, color: a.tint }}>{a.glyph}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold" style={{ color: a.tint }}>{a.category}</p>
                  <h3 className="mt-1 line-clamp-2 font-bold leading-7 text-mist-100 transition group-hover:text-saffron-300">{a.title}</h3>
                  <p className="mt-1 text-[10px] text-mist-500">{a.date} • {faNum(a.readMin)} دقیقه</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
