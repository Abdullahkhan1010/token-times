import { useEffect } from "react";
import { PATH_ROUTE_MAP, ROUTE_PATH_MAP } from "../data/seoData";

/**
 * Hook to synchronize active page state with browser URL history (pushState & popstate)
 * Supports dynamic asset routes like /pricing/btc, /pricing/eth, /pricing/xrp
 */
export function useRouteSync(activePage, setActivePage, setSelectedCryptoAsset) {
  // Sync state on back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname.toLowerCase();

      if (currentPath.startsWith("/pricing/")) {
        const asset = currentPath.replace("/pricing/", "").split("/")[0].toUpperCase();
        if (["BTC", "ETH", "XRP"].includes(asset)) {
          setSelectedCryptoAsset?.(asset);
        } else {
          setSelectedCryptoAsset?.("BTC");
        }
        setActivePage("CryptoDetail");
        return;
      }

      if (currentPath === "/pricing" || currentPath === "/pricing/") {
        setSelectedCryptoAsset?.("BTC");
        setActivePage("CryptoDetail");
        return;
      }

      const matchedPage = PATH_ROUTE_MAP[window.location.pathname] || "Home";
      setActivePage(matchedPage);
    };

    // On initial mount, set page based on current URL path
    const initialPath = window.location.pathname.toLowerCase();
    if (initialPath.startsWith("/pricing/")) {
      const asset = initialPath.replace("/pricing/", "").split("/")[0].toUpperCase();
      if (["BTC", "ETH", "XRP"].includes(asset)) {
        setSelectedCryptoAsset?.(asset);
      } else {
        setSelectedCryptoAsset?.("BTC");
      }
      setActivePage("CryptoDetail");
    } else if (initialPath === "/pricing" || initialPath === "/pricing/") {
      setSelectedCryptoAsset?.("BTC");
      setActivePage("CryptoDetail");
    } else if (initialPath && PATH_ROUTE_MAP[window.location.pathname]) {
      setActivePage(PATH_ROUTE_MAP[window.location.pathname]);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setActivePage, setSelectedCryptoAsset]);

  // Sync browser URL whenever activePage state changes
  const changePage = (newPage, options = {}) => {
    setActivePage(newPage);

    let targetPath = ROUTE_PATH_MAP[newPage] || "/";

    if (newPage === "CryptoDetail" || newPage === "Crypto Detail" || newPage === "Pricing") {
      const asset = (options?.symbol || options?.asset || "btc").toLowerCase();
      if (setSelectedCryptoAsset) {
        setSelectedCryptoAsset(asset.toUpperCase());
      }
      targetPath = `/pricing/${asset}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: newPage, ...options }, "", targetPath);
    }

    // Scroll smoothly to top on major page switch, unless preserved
    if (!options?.preserveScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return changePage;
}
