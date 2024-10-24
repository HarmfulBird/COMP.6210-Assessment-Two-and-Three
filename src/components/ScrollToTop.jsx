import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A functional component that scrolls the window to the top whenever the pathname changes.
 * @returns {null}
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}