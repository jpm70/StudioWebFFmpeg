if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        // Evita interceptar archivos de otros dominios que causan problemas (como Tailwind)
        if (!event.request.url.startsWith(self.location.origin)) return;

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
            }).catch(() => fetch(event.request))
        );
    });
} else {
    // Registro manual para evitar el error de "Invalid Scope"
    const currentScript = document.currentScript.src;
    if (window.crossOriginIsolated === false) {
        navigator.serviceWorker.register(currentScript, { scope: "./" }).then((reg) => {
            reg.addEventListener("updatefound", () => location.reload());
            if (reg.active) location.reload();
        });
    }
}