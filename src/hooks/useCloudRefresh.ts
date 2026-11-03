import { useEffect, useRef } from "react";

// Re-read shared data when returning from another device or browser tab.
export function useCloudRefresh(refresh: () => unknown) {
  const latest = useRef(refresh);
  latest.current = refresh;
  useEffect(() => {
    const update = () => {
      if (document.visibilityState === "visible") void latest.current();
    };
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
}
