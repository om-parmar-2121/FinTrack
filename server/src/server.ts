import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/config.js";

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

startServer().catch((error: any) => {
  console.error("Failed to start server:", error?.message || error);
  process.exit(1);
});
