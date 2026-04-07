import db from "../db.json";

export default (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = auth.split(" ")[1];

  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  req.userId = userId;
  req.user = user;

  next();
};