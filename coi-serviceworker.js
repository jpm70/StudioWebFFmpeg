/*! coi-serviceworker v0.1.7 - MIT License - https://github.com/gzuidhof/coi-serviceworker */
if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;

        event.respondWith(
            fetch(event.request).then((response) => {
                if (response.status === 0) return response;

                const newHeaders = new Headers(response.headers);
                newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });
            }).catch(e => fetch(event.request))
        );
    });
} else {
    // Si estamos en el navegador, registrar el worker
    const script = document.currentScript;
    if (window.crossOriginIsolated === false) {
        navigator.serviceWorker.register(script.src).then((reg) => {
            reg.addEventListener("updatefound", () => location.reload());
            if (reg.active) location.reload();
        });
    }
}