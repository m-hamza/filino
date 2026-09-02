/** ماژول صفحه اصلی — ترکیب هیرو و بخش‌های ماژولار */
import { Hero } from "./Hero";
import { HomeSections } from "./HomeSections";

export function HomePage() {
  return (
    <main>
      <Hero />
      <HomeSections />
    </main>
  );
}
