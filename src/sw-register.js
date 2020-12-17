if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .catch((err) => console.error(err))
}