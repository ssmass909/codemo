import { useEffect, type RefObject } from "react";

export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, action: (...args: any[]) => any) {
  useEffect(() => {
    const mouseDownListener: (e: MouseEvent) => void = (e) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        action();
      }
    };
    document.addEventListener("mousedown", mouseDownListener);
    () => {
      document.removeEventListener("mousedown", mouseDownListener);
    };
  }, []);
}
