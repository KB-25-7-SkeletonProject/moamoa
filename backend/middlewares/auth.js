export default (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = auth.split(" ")[1];

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.userId = userId;

  next();
};