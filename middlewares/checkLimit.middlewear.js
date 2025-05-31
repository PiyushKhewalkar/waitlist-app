import User from "../models/user.model.js";
import { planLimits } from "../utils/planLimits.js";

export const checkLimit = (type) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id; // assuming you attach `user` to `req` after auth
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const plan = user.plan || "free";
      const limits = planLimits[plan];

      const currentUsage = user.usage?.[type] || 0;
      const allowedLimit = limits?.[type] || 0;

      if (currentUsage >= allowedLimit) {
        return res.status(403).json({
          error: `Your plan limit reached for ${type}. Upgrade your plan to continue.`,
        });
      }

      next(); // Allow the next handler (e.g., create page or save email)
    } catch (err) {
      console.error("Limit check error:", err);
      res.status(500).json({ error: "Server error while checking limits." });
    }
  };
};
