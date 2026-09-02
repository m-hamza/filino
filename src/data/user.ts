/** ماژول داده: پنل کاربری — سفارش‌ها، دانلودها، تیکت‌ها و آمار */

const IMG = {
  themeShop: "https://image.qwenlm.ai/generated-images/56f73ab6-53ac-4655-aaad-84b3d971df63/_result.png",
  pluginCache: "https://image.qwenlm.ai/generated-images/c5735449-d4c1-4756-9689-5f1582199479/_result.png",
  pluginSeo: "https://image.qwenlm.ai/generated-images/d86db6a6-0aab-43a8-a7a3-cd7dba40ed48/_result.png",
  uikit: "https://image.qwenlm.ai/generated-images/d6c057e7-90c1-4bf8-8a24-35d2f5076abf/_result.png",
  mockup: "https://image.qwenlm.ai/generated-images/b652b846-2d24-4e01-a050-10754ed795c7/_result.png",
};

export interface OrderItem {
  slug: string;
  name: string;
  cover: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  method: string;
  status: "تکمیل شده" | "در انتظار پرداخت";
  items: OrderItem[];
  total: number;
}

export interface DownloadItem {
  slug: string;
  name: string;
  cover: string;
  version: string;
  sizeMb: number;
  updated: string;
  licenseExpiry: string;
  downloadsLeft: number;
}

export interface TicketMessage {
  from: "user" | "support";
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  subject: string;
  product?: string;
  status: "باز" | "در حال بررسی" | "پاسخ داده شده" | "بسته شده";
  updated: string;
  messages: TicketMessage[];
}

export const mockUser = {
  name: "علیرضا احمدی",
  email: "alireza@example.com",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  wallet: 2_450_000,
  joined: "مهر ۱۴۰۲",
};

export const mockOrders: Order[] = [
  {
    id: "FN-10482",
    date: "۱۸ آذر ۱۴۰۴",
    method: "درگاه زرین‌پال",
    status: "تکمیل شده",
    total: 1_920_000,
    items: [
      { slug: "aftab-store-theme", name: "قالب فروشگاهی آفتاب", cover: IMG.themeShop, price: 1_280_000 },
      { slug: "tizpa-cache-plugin", name: "افزونه کش تیزپا", cover: IMG.pluginCache, price: 640_000 },
    ],
  },
  {
    id: "FN-10311",
    date: "۰۲ آذر ۱۴۰۴",
    method: "کیف پول فایلینو",
    status: "تکمیل شده",
    total: 890_000,
    items: [{ slug: "negar-ui-kit", name: "کیت رابط کاربری نگار", cover: IMG.uikit, price: 890_000 }],
  },
  {
    id: "FN-10198",
    date: "۱۵ آبان ۱۴۰۴",
    method: "درگاه زرین‌پال",
    status: "تکمیل شده",
    total: 450_000,
    items: [{ slug: "vitrin-device-mockup", name: "موکاپ دستگاه ویترین", cover: IMG.mockup, price: 450_000 }],
  },
  {
    id: "FN-10057",
    date: "۲۸ مهر ۱۴۰۴",
    method: "کارت به کارت",
    status: "در انتظار پرداخت",
    total: 720_000,
    items: [{ slug: "neshan-seo-plugin", name: "افزونه سئوی نشان", cover: IMG.pluginSeo, price: 720_000 }],
  },
];

export const mockDownloads: DownloadItem[] = [
  { slug: "aftab-store-theme", name: "قالب فروشگاهی آفتاب", cover: IMG.themeShop, version: "3.2.0", sizeMb: 18.4, updated: "۱۸ آذر ۱۴۰۴", licenseExpiry: "۱۸ خرداد ۱۴۰۵", downloadsLeft: 8 },
  { slug: "tizpa-cache-plugin", name: "افزونه کش تیزپا", cover: IMG.pluginCache, version: "4.1.3", sizeMb: 3.1, updated: "۱۲ آذر ۱۴۰۴", licenseExpiry: "۱۸ خرداد ۱۴۰۵", downloadsLeft: 10 },
  { slug: "negar-ui-kit", name: "کیت رابط کاربری نگار", cover: IMG.uikit, version: "2.0.0", sizeMb: 42, updated: "۲۸ آبان ۱۴۰۴", licenseExpiry: "مادام‌العمر", downloadsLeft: 99 },
  { slug: "vitrin-device-mockup", name: "موکاپ دستگاه ویترین", cover: IMG.mockup, version: "1.4.0", sizeMb: 96, updated: "۲۰ آبان ۱۴۰۴", licenseExpiry: "مادام‌العمر", downloadsLeft: 5 },
];

export const mockTickets: Ticket[] = [
  {
    id: "TK-2201",
    subject: "مشکل در فعال‌سازی لایسنس قالب آفتاب",
    product: "قالب فروشگاهی آفتاب",
    status: "پاسخ داده شده",
    updated: "۱۹ آذر ۱۴۰۴",
    messages: [
      { from: "user", text: "سلام، بعد از آپدیت به نسخه ۳.۲ لایسنسم غیرفعال شده. خطای «کلید نامعتبر» می‌دهد.", date: "۱۹ آذر، ۱۰:۲۴" },
      { from: "support", text: "سلام و وقت بخیر 🌿 لایسنس شما بعد از آپدیت نیاز به فعال‌سازی مجدد داشت. از پیشخوان → فایلینو → لایسنس، دکمه‌ی «اتصال مجدد» را بزنید. مشکل برطرف می‌شود.", date: "۱۹ آذر، ۱۰:۵۱" },
      { from: "user", text: "انجام شد، درست شد. ممنون از سرعت عمل‌تون!", date: "۱۹ آذر، ۱۱:۰۳" },
    ],
  },
  {
    id: "TK-2187",
    subject: "درخواست فاکتور رسمی برای خرید سازمانی",
    status: "بسته شده",
    updated: "۰۵ آذر ۱۴۰۴",
    messages: [
      { from: "user", text: "برای خرید کیت نگار فاکتور رسمی با شناسه ملی نیاز داریم. امکانش هست؟", date: "۰۴ آذر، ۱۶:۴۰" },
      { from: "support", text: "بله حتماً؛ فاکتور رسمی صادر و به ایمیل شما ارسال شد. از این به بعد در بخش سفارش‌ها هم قابل دانلود است.", date: "۰۵ آذر، ۰۹:۱۲" },
    ],
  },
  {
    id: "TK-2214",
    subject: "پیشنهاد افزودن دمو برای فروشگاه دوره آموزشی",
    product: "قالب فروشگاهی آفتاب",
    status: "باز",
    updated: "۲۰ آذر ۱۴۰۴",
    messages: [
      { from: "user", text: "سلام، اگر یک دمو مخصوص فروش دوره و فایل آموزشی اضافه بشه عالی می‌شه. خیلی از مشتری‌هام این نیاز رو دارن.", date: "۲۰ آذر، ۲۱:۱۵" },
    ],
  },
];
