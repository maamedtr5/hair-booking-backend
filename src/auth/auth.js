// auth.js
export function verifyUserPermissions(req, res, next) {
  const userId = parseInt(req.params.userId || req.body.userId);
  const authenticatedUserId = req.user?.id; // assuming user info in req.user

  if (userId !== authenticatedUserId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}