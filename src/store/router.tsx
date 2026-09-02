/** ماژول روتر سبک هش‌بنیاد — بدون وابستگی، مناسب هاست استاتیک */
import { useEffect, useState, type ReactNode, type MouseEvent } from "react";

export interface Route {
  path: string;            // مثل shop یا product/aftab-store-theme
  parts: string[];         // ["product", "aftab-store-theme"]
  query: URLSearchParams;  // پارامترهای ?cat=...
}

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [pathPart, queryPart = ""] = raw.split("?");
  const path = pathPart.replace(/\/+$/, "");
  return {
    path,
    parts: path ? path.split("/") : [],
    query: new URLSearchParams(queryPart),
  };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#/${to.replace(/^\/+/, "")}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Link({ to, className, children, onClick, ariaLabel }: LinkProps) {
  const href = `#/${to.replace(/^\/+/, "")}`;
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    onClick?.();
  };
  return (
    <a href={href} onClick={handle} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
