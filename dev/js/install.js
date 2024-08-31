import u from "umbrellajs/umbrella.esm.js";

export function displayiosInstallPrompt() {
    // Detects if device is on iOS
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipod/.test(userAgent);//return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
        u("#install-prompt").toggleClass("visible");
    }
}
