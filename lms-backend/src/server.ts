import app from "./app.js";
import { env } from "./config/env.js";

const PORT = parseInt(env.PORT, 10) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔐 Auth URL: ${env.BETTER_AUTH_URL}`);
  console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
});
