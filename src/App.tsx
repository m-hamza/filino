/** اپلیکیشن اصلی قالب فایلینو — مسیریابی ماژول‌ها و چیدمان سراسری */
import { useEffect } from "react";
import { AppProvider } from "./store/AppContext";
import { useRoute } from "./store/router";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { AuthModal } from "./components/layout/AuthModal";
import { ToastHost } from "./components/ui";
import { HomePage } from "./modules/home/HomePage";
import { ShopPage } from "./modules/shop/ShopPage";
import { ProductPage } from "./modules/product/ProductPage";
import { BlogPage } from "./modules/blog/BlogPage";
import { ArticlePage } from "./modules/blog/ArticlePage";
import { PanelPage, type PanelTabId } from "./modules/panel/PanelPage";
import { AboutPage, ContactPage, FaqPage, NotFoundPage } from "./modules/pages/StaticPages";

const TITLES: Record<string, string> = {
  home: "فایلینو | مارکت محصولات دیجیتال وردپرس",
  shop: "فروشگاه | فایلینو",
  product: "جزئیات محصول | فایلینو",
  blog: "مقالات | فایلینو",
  article: "مقاله | فایلینو",
  panel: "پنل کاربری | فایلینو",
  about: "درباره ما | فایلینو",
  contact: "تماس با ما | فایلینو",
  faq: "سوالات متداول | فایلینو",
};

const PANEL_TABS: PanelTabId[] = ["dashboard", "downloads", "orders", "tickets", "settings"];

function Router() {
  const route = useRoute();
  const [section = "home", param] = route.parts;

  useEffect(() => {
    const key = section === "blog" && param ? "article" : section;
    document.title = TITLES[key] ?? TITLES.home;
  }, [section, param]);

  switch (section) {
    case "home": return <HomePage />;
    case "shop": return <ShopPage />;
    case "product": return <ProductPage slug={param ?? ""} />;
    case "blog": return param ? <ArticlePage slug={param} /> : <BlogPage />;
    case "panel": return <PanelPage tab={PANEL_TABS.includes(param as PanelTabId) ? (param as PanelTabId) : "dashboard"} />;
    case "about": return <AboutPage />;
    case "contact": return <ContactPage />;
    case "faq": return <FaqPage />;
    default: return <NotFoundPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Router />
        </div>
        <Footer />
      </div>
      <CartDrawer />
      <AuthModal />
      <ToastHost />
    </AppProvider>
  );
}
