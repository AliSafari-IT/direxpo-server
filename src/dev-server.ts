import express from "express";
import { createDirexpoRouter } from "./router.js";

const app = express();
app.use(express.json());

const { router } = createDirexpoRouter({ outputDir: ".output" });
app.use("/api", router);

const PORT = 5199;
app.listen(PORT, () => {
  console.log(`direxpo-server running on http://localhost:${PORT}`);
});
