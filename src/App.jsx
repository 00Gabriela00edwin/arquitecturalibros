import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Instagram, Facebook, Twitter, CheckCircle, Loader } from 'lucide-react';
import './App.css';
// IMPORTAMOS LA BASE DE DATOS Y FUNCIONES DE FIREBASE
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import BotonPago from './BotonPago';

// --- COMPONENTES ---

// Navbar
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

// Footer (CORREGIDO: Con tu crédito integrado)
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
    
    {/* SECCIÓN DE CRÉDITOS INTEGRADA */}
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.1)', // Línea divisoria sutil
      marginTop: '30px',
      paddingTop: '20px',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#aaa'
    }}>
      <p>
        © {new Date().getFullYear()} Archi-Books. 
        Diseño y Desarrollo por <strong>Gabriela Edwin</strong>
      </p>
    </div>
  </footer>
);

// Home
const Home = ({ books, addToCart, loading }) => (
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
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>
          <Loader className="spin" size={40} />
          <p>Cargando biblioteca...</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.img} alt={book.title} className="book-image" />
              <div className="book-info">
                <div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
                <div>
                  <p className="book-price">${book.price ? book.price.toLocaleString() : '0'}</p>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <Link to={`/book/${book.id}`} className="btn-primary" style={{textAlign:'center', background:'transparent', color:'black', border:'1px solid black'}}>Ver Detalle</Link>
                    <button onClick={() => addToCart(book)} className="btn-primary">Comprar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </>
);

// Detalle de Producto
const ProductDetail = ({ books, addToCart }) => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);

  if (!book) return <div className="container main-content">Cargando libro o no encontrado...</div>;

  return (
    <div className="container main-content">
      <div className="product-detail">
        <img src={book.img} alt={book.title} className="detail-img" />
        <div>
          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{book.title}</h1>
          <h3 style={{color: '#666', marginBottom: '2rem'}}>{book.author}</h3>
          <p style={{fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem'}}>{book.desc}</p>
          <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>${book.price ? book.price.toLocaleString() : '0'}</h2>
          <button onClick={() => addToCart(book)} className="btn-primary" style={{maxWidth: '200px'}}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// Carrito
const Cart = ({ cart, updateQuantity, removeFromCart, clearCart }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      clearCart(); 
      navigate('/success');
    }, 2500);
  };

  if (isRedirecting) {
    return (
      <div className="container main-content redirect-message">
        <Loader size={48} style={{animation: 'spin 4s linear infinite', marginBottom:'1rem'}} />
        <h2>Redirigiendo a la pasarela de pagos segura...</h2>
        <p>No cierres esta ventana.</p>
      </div>
    );
  }

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
            <button className="btn-primary" onClick={handleCheckout}>
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Página de Éxito
const CheckoutSuccess = () => (
  <div className="container main-content success-page">
    <CheckCircle size={80} className="success-icon" />
    <h1>¡Gracias por tu compra!</h1>
    <p>La transacción ha sido procesada correctamente.</p>
    <Link to="/" className="btn-primary" style={{display: 'inline-block'}}>
      Volver a la tienda
    </Link>
  </div>
);

// About
const About = () => (
  <div className="container main-content">
    <h1>Sobre Nosotros</h1>
    <p style={{maxWidth: '600px', marginTop: '20px'}}>
      Somos un colectivo de arquitectos y diseñadores dedicados a difundir la literatura que construye pensamiento. 
    </p>
  </div>
);

// --- APP PRINCIPAL ---
function App() {
  const [cart, setCart] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, "books");
        const snapshot = await getDocs(booksCollection);
        const booksList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksList);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando libros:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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
  };

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

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<Home books={books} loading={loading} addToCart={addToCart} />} />
        <Route path="/book/:id" element={<ProductDetail books={books} addToCart={addToCart} />} />
        <Route path="/cart" element={
          <Cart 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            clearCart={clearCart}
          />
        } />
        <Route path="/success" element={<CheckoutSuccess />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* --- ZONA DE PRUEBAS DE PAGO --- */}
      <div style={{ backgroundColor: '#fff3cd', padding: '20px', textAlign: 'center', borderTop: '1px solid #ffeeba' }}>
        <p style={{ fontWeight: 'bold', color: '#856404', marginBottom: '10px' }}>
           ⚠️ MODO PRUEBA DE INTEGRACIÓN:
        </p>
        <BotonPago />
        <p style={{fontSize: '0.8rem', color: '#856404', marginTop: '10px'}}>
           (Este botón es visible solo para demostración. No realiza cobros reales).
        </p>
      </div>

      {/* --- FOOTER (Con tu crédito ya incluido dentro) --- */}
      <Footer />

    </div>
  );
}

export default App;