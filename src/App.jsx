import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import './App.css';

// --- DATOS SIMULADOS (10 Libros de Arquitectura) ---
const booksData = [
  { id: 1, title: "Forma y Espacio", author: "Francis D.K. Ching", price: 45000, desc: "El manual clásico de introducción a la arquitectura, analizando la forma, el espacio y el orden.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Forma+Espacio" },
  { id: 2, title: "La Arquitectura de la Ciudad", author: "Aldo Rossi", price: 38000, desc: "Un análisis fundamental sobre la construcción urbana y la memoria colectiva.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Ciudad+Rossi" },
  { id: 3, title: "Pensar la Arquitectura", author: "Peter Zumthor", price: 52000, desc: "Reflexiones personales sobre la atmósfera, la materialidad y la belleza.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Zumthor" },
  { id: 4, title: "Delirio de Nueva York", author: "Rem Koolhaas", price: 41000, desc: "Un manifiesto retroactivo para Manhattan. Caos y congestión como belleza.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Delirio+NY" },
  { id: 5, title: "S,M,L,XL", author: "OMA", price: 95000, desc: "Una novela gráfica de arquitectura. Proyectos, ensayos y diarios.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=SMLXL" },
  { id: 6, title: "Complejidad y Contradicción", author: "Robert Venturi", price: 36000, desc: "Un ataque a la pureza del modernismo. 'Menos es aburrido'.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Venturi" },
  { id: 7, title: "La Poética del Espacio", author: "Gaston Bachelard", price: 29000, desc: "Filosofía sobre cómo habitamos los espacios y los sueños.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Poetica" },
  { id: 8, title: "Atmósferas", author: "Peter Zumthor", price: 31000, desc: "Entornos arquitectónicos: las cosas a mi alrededor.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Atmosferas" },
  { id: 9, title: "Hacia una Arquitectura", author: "Le Corbusier", price: 40000, desc: "Los 5 puntos de la nueva arquitectura y la máquina de habitar.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Le+Corbusier" },
  { id: 10, title: "Historia de la Arquitectura", author: "Spiro Kostof", price: 60000, desc: "Un recorrido completo desde las cavernas hasta el siglo XX.", img: "https://placehold.co/400x600/e0e0e0/1a1a1a?text=Historia" },
];

// --- COMPONENTES ---

// 1. Navbar
const Navbar = ({ cartCount }) => (
  <nav className="navbar">
    <div className="container nav-content">
      <Link to="/" className="logo">Archi-Books.</Link>
      <div className="nav-links">
        <Link to="/">Libros</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/cart" className="cart-icon">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </div>
  </nav>
);

// 2. Footer
const Footer = () => (
  <footer className="footer">
    <div className="container footer-content">
      <div>
        <h3>Archi-Books.</h3>
        <p>Curaduría de libros para mentes estructurales.</p>
      </div>
      <div>
        <h4>Contacto</h4>
        <p>info@archibooks.com</p>
        <p>Av. Corrientes 1234, Buenos Aires</p>
      </div>
      <div>
        <h4>Redes</h4>
        <div className="socials">
          <Instagram size={20} /> <Facebook size={20} /> <Twitter size={20} />
        </div>
      </div>
    </div>
  </footer>
);

// 3. Página de Inicio (Home)
const Home = ({ addToCart }) => (
  <>
    <header className="hero">
      <div className="container">
        <h1>Construye tu conocimiento</h1>
        <p>La mejor selección de textos de teoría y práctica arquitectónica.</p>
      </div>
    </header>
    
    <section className="container">
      <h2>Catálogo Seleccionado</h2>
      <br />
      <div className="book-grid">
        {booksData.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.img} alt={book.title} className="book-image" />
            <div className="book-info">
              <div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
              </div>
              <div>
                <p className="book-price">${book.price.toLocaleString()}</p>
                <div style={{display: 'flex', gap: '10px'}}>
                  <Link to={`/book/${book.id}`} className="btn-primary" style={{textAlign:'center', background:'transparent', color:'black', border:'1px solid black'}}>Ver Detalle</Link>
                  <button onClick={() => addToCart(book)} className="btn-primary">Comprar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
);

// 4. Página de Detalle de Producto
const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const book = booksData.find(b => b.id === parseInt(id));

  if (!book) return <div className="container main-content">Libro no encontrado</div>;

  return (
    <div className="container main-content">
      <div className="product-detail">
        <img src={book.img} alt={book.title} className="detail-img" />
        <div>
          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{book.title}</h1>
          <h3 style={{color: '#666', marginBottom: '2rem'}}>{book.author}</h3>
          <p style={{fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem'}}>{book.desc}</p>
          <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>${book.price.toLocaleString()}</h2>
          <button onClick={() => addToCart(book)} className="btn-primary" style={{maxWidth: '200px'}}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Página de Carrito
const Cart = ({ cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const navigate = useNavigate();

  return (
    <div className="container main-content cart-page">
      <h1>Tu Proyecto de Compra</h1>
      <br />
      {cart.length === 0 ? (
        <p>El carrito está vacío. <Link to="/" style={{textDecoration:'underline'}}>Volver al catálogo.</Link></p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.author}</p>
                </div>
                <div>${item.price.toLocaleString()}</div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Total Estimado: ${total.toLocaleString()}</h3>
            <p style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>Impuestos incluidos</p>
            <button className="btn-primary" onClick={() => alert("Redirigiendo a Pasarela de Pago...")}>
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 6. Página About (Nosotros)
const About = () => (
  <div className="container main-content">
    <h1>Sobre Nosotros</h1>
    <p style={{maxWidth: '600px', marginTop: '20px'}}>
      Somos un colectivo de arquitectos y diseñadores dedicados a difundir la literatura que construye pensamiento. 
      Creemos que un buen libro es el cimiento de cualquier gran obra.
    </p>
  </div>
);

// --- COMPONENTE PRINCIPAL (APP) ---
function App() {
  const [cart, setCart] = useState([]);

  // Función para agregar al carrito
  const addToCart = (book) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === book.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    alert("Libro agregado al carrito");
  };

  // Función para actualizar cantidad
  const updateQuantity = (id, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Función para eliminar
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />
      
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/book/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/cart" element={
          <Cart 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
          />
        } />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;