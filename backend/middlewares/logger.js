export default (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`;

    if (res.statusCode >= 400) {
      console.error("❌", log);
    } else {
      console.log("✅", log);
    }
  });

  next();
};