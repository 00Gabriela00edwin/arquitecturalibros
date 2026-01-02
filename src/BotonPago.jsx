import React, { useState } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from './firebase';

const BotonPago = () => {
  const [cargando, setCargando] = useState(false);

  const handleComprar = async () => {
    setCargando(true);
    const functions = getFunctions(app);
    const crearPago = httpsCallable(functions, 'crearPago');

    try {
      console.log("1. Iniciando proceso de pago...");

      // CORRECCIÓN 1: Enviamos los datos planos (sin array "items")
      // para que coincidan con "data.titulo" y "data.precio" del backend.
      const datosCompra = {
        titulo: "Libro Arquitectura Moderna",
        precio: 5000,
        cantidad: 1
      };

      const respuesta = await crearPago(datosCompra);
      console.log("2. Respuesta del servidor:", respuesta.data);

      // CORRECCIÓN 2: Tu backend devuelve la propiedad "url", no "init_point".
      // (Dentro del backend sí era init_point, pero te lo envió envuelto en "url")
      const linkDePago = respuesta.data.url;

      if (linkDePago) {
        // ÉXITO: Redirigimos a Mercado Pago
        window.location.href = linkDePago; 
      } else {
        console.error("No llegó el link de pago", respuesta.data);
        alert("Error: El servidor no devolvió el link.");
      }

    } catch (error) {
      console.error("Error al conectar con la función:", error);
      alert("Hubo un error al intentar pagar. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <button 
      onClick={handleComprar} 
      disabled={cargando}
      style={{
        backgroundColor: '#FF8C00',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
      }}
    >
      {cargando ? 'Cargando MP...' : 'Comprar Libro de Prueba'}
    </button>
  );
};

export default BotonPago;