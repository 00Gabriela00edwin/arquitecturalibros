const functions = require("firebase-functions");
const { MercadoPagoConfig, Preference } = require('mercadopago');

// CONFIGURACIÓN
// Pega tu Access Token de prueba aquí abajo entre las comillas
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3377639008576316-122922-f1899f7f1103d52636d36baeb2b9e6cb-3100673963' });

exports.crearPago = functions.https.onCall(async (data, context) => {
  try {
    // Aquí recibimos los libros desde el carrito
    const items = data.items;

    const body = {
      items: items.map((libro) => ({
        title: libro.titulo,       // Asegúrate que tu libro tenga 'titulo'
        unit_price: Number(libro.precio), // El precio
        currency_id: 'ARS',
        quantity: 1,
      })),
      back_urls: {
        success: "http://localhost:5173", // A donde vuelve si sale bien
        failure: "http://localhost:5173", // A donde vuelve si falla
        pending: "http://localhost:5173",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return {
      init_point: result.init_point, // Este es el Link de pago
    };

  } catch (error) {
    console.error("Error MercadoPago:", error);
    throw new functions.https.HttpsError('internal', 'No se pudo crear el pago');
  }
});