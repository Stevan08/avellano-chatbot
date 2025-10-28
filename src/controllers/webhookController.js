// src/controllers/webhookController.js
import axios from "axios";

const WHATSAPP_API = "https://graph.facebook.com/v22.0/814709418394166/messages"
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Verificación inicial del webhook
export const verifyWebhook = (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verifyToken) {
    console.log("Webhook verificado correctamente ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

// ✅ Recepción y respuesta automática
export const receiveMessage = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const message = entry?.changes?.[0]?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body || "";

      console.log("Mensaje recibido:", text);

      // Respuesta de prueba
      await axios.post(
        `${WHATSAPP_API}/${PHONE_NUMBER_ID}/messages`,
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
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en receiveMessage:", error);
    res.sendStatus(500);
  }
};
