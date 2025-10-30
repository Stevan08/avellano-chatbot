import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhookRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use("/webhook", webhookRoutes);
app.use("/client", clientRoutes);

app.get("/", (req, res) => {
  res.send("Servidor Avellano corriendo 🚀");
});

// Render define process.env.PORT automáticamente
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
