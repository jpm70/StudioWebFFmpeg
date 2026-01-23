if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (e) => {
        // Solo interceptar peticiones de nuestro propio dominio para evitar errores de CORS
        if (!e.request.url.startsWith(self.location.origin)) return;

        e.respondWith(
            fetch(e.request).then((r) => {
                if (r.status === 0) return r;
                const h = new Headers(r.headers);
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
            }).catch(() => fetch(e.request))
        );
    });
} else {
    // Registro con Scope explícito para GitHub Pages
    if (window.crossOriginIsolated === false) {
        navigator.serviceWorker.register("coi-serviceworker.js", { scope: "./" }).then((reg) => {
            reg.addEventListener("updatefound", () => location.reload());
            if (reg.active) location.reload();
        });
    }
}