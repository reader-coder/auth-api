const adminMiddleware = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized. You are not an admin!",
    });
  }
  next();
};

export default adminMiddleware;
