// src/controllers/webhookController.js
import axios from "axios";

const WHATSAPP_API_BASE = "https://graph.facebook.com/v22.0"; // base API
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

// Verificación inicial del webhook
export const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("GET /webhook", { mode, token, challenge: Boolean(challenge) });

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  } else {
    console.warn("❌ Webhook verificación fallida", { mode, token, VERIFY_TOKEN });
    return res.sendStatus(403);
  }
};

// Recepción y respuesta automática
export const receiveMessage = async (req, res) => {
  try {
    const body = req.body;
    console.log("POST /webhook body:", JSON.stringify(body).slice(0, 1000));

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const message = entry?.changes?.[0]?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body || message?.button?.text || "";

      console.log("Mensaje recibido de:", from, "texto:", text);

      if (!PHONE_NUMBER_ID || !TOKEN) {
        console.error("Faltan PHONE_NUMBER_ID o WHATSAPP_TOKEN en las env vars");
      } else {
        // URL correcta: base + /{PHONE_NUMBER_ID}/messages
        const url = `${WHATSAPP_API_BASE}/${PHONE_NUMBER_ID}/messages`;
        await axios.post(
          url,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: "👋 ¡Hola! Bienvenido(a) a Avellano. Prueba exitosa 🚀" },
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // evita bloqueos largos
          }
        );
        console.log("Mensaje de prueba enviado a", from);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error en receiveMessage:", error?.response?.data || error.message || error);
    return res.sendStatus(500);
  }
};
