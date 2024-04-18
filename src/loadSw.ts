export const loadSw = async () => {
  if ("serviceWorker" in navigator) {
    const swName =
      import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw";

    const registration = await navigator.serviceWorker
      .register(swName, {
        type: import.meta.env.MODE === "production" ? "classic" : "module",
      })
      .catch((error) => {
        console.error("Could not register a Service Worker ", error);
      });
    console.log("Registered a Service Worker ", registration);

    // Wait for the Service Worker to activate
    if (!registration) {
      console.error("No Service Worker registration");
    } else if (registration.active) {
      console.log("Service Worker is already active");
      return registration;
    } else if (registration.installing) {
      console.log("Waiting for Service Worker to activate");

      return await new Promise(() => {
        registration.installing?.addEventListener("statechange", (e) => {
          const event = e as Event & { target: { state: string } };
          console.log("Service Worker state changed", e, event.target?.state);

          if (e.target && event.target.state === "activated") {
            // if (registration.active) {
            //   console.log("Service Worker is now active");
            //   resolve(registration);
            // } else {
            // Workaround as service worker is not yet activated
            console.log("Service Worker is still not active, reloading");
            window.location.reload();
            // }
          }
        });
      });
    } else {
      console.error("Unexpected Service Worker state", registration);
    }
  } else {
    console.error("Service Workers are not supported in this browser.");
  }
};
