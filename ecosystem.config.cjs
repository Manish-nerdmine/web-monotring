module.exports = {
    apps: [
        {
            name: "dark-web-monitoring",
            script: "pnpm",
            args: "run dev -- --host 13.50.233.20 --port 5173",
            interpreter: "none"
        }
    ]
}
