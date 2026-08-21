/** ابزارهای قالب‌بندی اعداد و قیمت فارسی — ماژول مشترک همه‌ی بخش‌ها */

const fa = new Intl.NumberFormat("fa-IR");

/** عدد → رقم فارسی با جداکننده */
export function faNum(n: number | string): string {
  const num = typeof n === "string" ? Number(n.replace(/[٬,]/g, "")) : n;
  return Number.isFinite(num) ? fa.format(num) : String(n);
}

/** قیمت → «۱٬۲۸۰٬۰۰۰ تومان» */
export function price(n: number): string {
  return `${faNum(n)} تومان`;
}

/** درصد تخفیف */
export function offPercent(price: number, old: number): number {
  return Math.round((1 - price / old) * 100);
}

/** تاریخ شمسی نمایشی از روی Date (ساده) */
export function faDate(d: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(d);
  } catch {
    return "";
  }
}

/** تبدیل ۰-۱۰۰ به زمان countdown باقی‌مانده */
export function pad2(n: number): string {
  return n.toLocaleString("fa-IR", { minimumIntegerDigits: 2 });
}
