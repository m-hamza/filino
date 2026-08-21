/** ماژول کارت محصول — استفاده‌شده در خانه، فروشگاه و محصولات مرتبط */
import { memo, useState } from "react";
import { Heart, ShoppingCart, Tag } from "lucide-react";
import { categoryLabel } from "../data/products";
import type { Product } from "../data/products";
import { price, faNum, offPercent } from "../lib/format";
import { useApp } from "../store/AppContext";
import { Link } from "../store/router";
import { Rating } from "./ui";

export const ProductCard = memo(function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { addToCart, cart, setCartOpen, toast } = useApp();
  const [liked, setLiked] = useState(false);
  const inCart = cart.some((i) => i.slug === product.slug);
  const off = product.oldPrice ? offPercent(product.price, product.oldPrice) : 0;

  return (
    <article className="card-lift group relative flex flex-col overflow-hidden rounded-xl border border-night-600/50 bg-night-850/80">
      {/* تصویر کاور */}
      <Link to={`product/${product.slug}`} className="relative block overflow-hidden" ariaLabel={product.name}>
        <img
          src={product.cover}
          alt={product.name}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-transparent to-transparent opacity-60" />
        {product.badge && (
          <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-saffron-500 px-2.5 py-1 text-[10px] font-black text-night-950 shadow-lg">
            {product.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-coral-500 px-2 py-1 text-[10px] font-black text-white">
            <Tag size={11} />
            ٪{faNum(off)} تخفیف
          </span>
        )}
        <span className="absolute bottom-3 start-3 rounded-full border border-night-600/60 bg-night-950/70 px-2.5 py-1 text-[10px] font-bold text-mist-300 backdrop-blur-sm">
          {categoryLabel(product.category)}
        </span>
      </Link>

      {/* علاقه‌مندی */}
      <button
        onClick={() => { setLiked(!liked); toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", "info"); }}
        aria-label="علاقه‌مندی"
        className={`absolute top-3 end-3 z-10 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-sm transition-all duration-300 ${off > 0 ? "top-11" : ""} ${liked ? "border-coral-500/50 bg-coral-500/20 text-coral-300" : "border-night-600/60 bg-night-950/60 text-mist-400 hover:text-coral-300"}`}
      >
        <Heart size={14} className={liked ? "fill-coral-400" : ""} />
      </button>

      {/* بدنه */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link to={`product/${product.slug}`}>
          <h3 className={`font-bold leading-7 text-mist-100 transition-colors group-hover:text-saffron-300 ${compact ? "text-sm" : "text-[15px]"}`}>
            {product.name}
          </h3>
        </Link>
        {!compact && <p className="line-clamp-2 text-xs leading-6 text-mist-400">{product.short}</p>}
        <div className="mt-auto flex items-center justify-between pt-1">
          <Rating value={product.rating} count={product.ratingCount} />
          <span className="text-[11px] text-mist-500">{faNum(product.sales)}+ فروش</span>
        </div>
        <div className="flex items-end justify-between border-t border-night-700/60 pt-3">
          <div>
            {product.oldPrice && (
              <span className="block text-[11px] text-mist-500 line-through decoration-coral-500/60">{price(product.oldPrice)}</span>
            )}
            <span className="text-sm font-black text-mist-100">
              {faNum(product.price)} <span className="text-[10px] font-medium text-mist-400">تومان</span>
            </span>
          </div>
          <button
            onClick={() => {
              if (inCart) { setCartOpen(true); return; }
              addToCart(product.slug);
              toast(`«${product.name}» به سبد اضافه شد`);
            }}
            className={`cut-sm inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all duration-300 active:scale-95 ${inCart ? "bg-mint-500 text-night-950" : "bg-saffron-500 text-night-950 hover:bg-saffron-400"}`}
          >
            <ShoppingCart size={14} />
            {inCart ? "در سبد" : "خرید"}
          </button>
        </div>
      </div>
    </article>
  );
});
