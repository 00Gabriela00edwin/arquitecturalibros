const functions = require("firebase-functions");
// 1. Importamos la NUEVA sintaxis de la versión 2.x
const { MercadoPagoConfig, Preference } = require('mercadopago');

// 2. Configuramos el cliente (Pega tu Access Token real aquí)
const client = new MercadoPagoConfig(
  {accessToken:'APP_USR-3377639008576316-122922-f1899f7f1103d52636d36baeb2b9e6cb-3100673963'});

exports.crearPago = functions.https.onCall(async (data, context) => {
  // 'data' trae lo que enviaste desde el botón naranja (titulo, precio, etc.)
  
  try {
    const preference = new Preference(client);

    // 3. Creamos la preferencia de pago
    const result = await preference.create({
      body: {
        items: [
         {
            title: data.titulo || "Libro Genérico", // Si no hay título, usa este
            
            // EL FIX: Si falla la conversión, usa 100 pesos por defecto
            unit_price: Number(data.precio) || 100, 
            
            // EL FIX: Si falla la cantidad, usa 1 unidad por defecto
            quantity:1,
            
            currency_id: "ARS"
          }

       
        ],
        back_urls: {
         success: "https://www.google.com",
          failure: "https://www.google.com",
          pending: "https://www.google.com"
      
        },
        auto_return: "approved",
      }
    });

    // 4. Devolvemos la URL de pago al Frontend (App.jsx)
    return { url: result.init_point };

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    // Esto enviará el error detallado a tu consola del navegador
    throw new functions.https.HttpsError('internal', 'Error al crear el pago', error);
  }
});