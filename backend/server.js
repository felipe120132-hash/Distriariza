require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');
const { verifyToken } = require('./middleware/auth');

// ── Rutas existentes ──────────────────────────────────────────────────────────
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const resenaRoutes = require('./routes/resenaRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const imagenRoutes = require('./routes/imagenRoutes');
const app = express();
app.set('trust proxy', 1);

// ── Seguridad: Cabeceras HTTP ─────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Deshabilitado para permitir carga de imágenes externas
}));

// ── Rate Limiting Global ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 300,                  // 300 peticiones por ventana
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'https://distriariza.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Archivos estáticos ────────────────────────────────────────────────────────
app.use('/productos', express.static(path.join(__dirname, 'public/productos')));

// ── Crear tabla reseñas automáticamente al arrancar ───────────────────────────
const crearTablaResenas = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS resenas (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            producto_id   INT          NOT NULL,
            producto_nombre VARCHAR(255),
            autor         VARCHAR(100) NOT NULL,
            calificacion  TINYINT      NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
            comentario    TEXT         NOT NULL,
            creado_en     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
        )
    `;
    try {
        await db.query(sql);
        console.log('✅ Tabla resenas lista');
    } catch (error) {
        console.error('❌ Error creando tabla resenas:', error.message);
    }
};

crearTablaResenas();

// ── Ruta de emergencia para cargar catálogo (PROTEGIDA) ───────────────────────
app.get('/api/load-catalog', verifyToken, async (req, res) => {
    try {
        console.log('Iniciando sembrado de base de datos...');

        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE productos');
        await db.query('TRUNCATE TABLE categorias');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        const [resLiq]    = await db.query("INSERT INTO categorias (nombre) VALUES ('Líquidos Vitales')");
        const [resAlim]   = await db.query("INSERT INTO categorias (nombre) VALUES ('Alimentos')");
        const [resEq]     = await db.query("INSERT INTO categorias (nombre) VALUES ('Equipos')");
        const [resAcc]    = await db.query("INSERT INTO categorias (nombre) VALUES ('Accesorios')");
        const [resPlantas]= await db.query("INSERT INTO categorias (nombre) VALUES ('Plantas')");
        const [resJaulas] = await db.query("INSERT INTO categorias (nombre) VALUES ('Jaulas para Hámster')");

        const liqId     = resLiq.insertId;
        const alimId    = resAlim.insertId;
        const eqId      = resEq.insertId;
        const accId     = resAcc.insertId;
        const plantasId = resPlantas.insertId;
        const jaulasId  = resJaulas.insertId;

        const productos = [
            // ── LÍQUIDOS VITALES ──────────────────────────────────────────────
            { nombre: 'Acuaprime 30ml',             desc: 'Protección instantánea para tus peces. Elimina el cloro y neutraliza metales pesados del agua del grifo, ideal para acuarios pequeños.', precio: 3000,   cat: liqId,     img: 'acuaprime-30.jpeg' },
            { nombre: 'Acuaprime 120ml',            desc: 'El aliado perfecto para cambios de agua seguros. Elimina cloro y cloraminas al instante, protegiendo la mucosa natural de tus peces.', precio: 6500,   cat: liqId,     img: 'acuaprime-120.jpeg' },
            { nombre: 'Acuaprime 240ml',            desc: 'Máxima seguridad para acuarios medianos. Fórmula avanzada que neutraliza tóxicos del agua del grifo, garantizando un ambiente saludable.', precio: 11500,  cat: liqId,     img: 'acuaprime-240.jpeg' },
            { nombre: 'Acuaprime Litro',            desc: 'Rendimiento profesional para grandes volúmenes. La solución más económica para mantener el agua de tus tanques libre de cloro y metales.', precio: 29000,  cat: liqId,     img: 'acuaprime-litro.jpeg' },
            { nombre: 'Cycle 30ml',                 desc: 'Activa la vida en tu acuario. Bacterias benéficas que aceleran el ciclo biológico, eliminando amoníaco y nitritos tóxicos desde el primer día.', precio: 3000,   cat: liqId,     img: 'cycle-30.jpeg' },
            { nombre: 'Cycle 120ml',                desc: 'Ecosistema equilibrado y seguro. Suplemento biológico esencial para mantener la filtración natural y prevenir enfermedades en tus peces.', precio: 6500,   cat: liqId,     img: 'cycle-120.jpeg' },
            { nombre: 'Cycle 240ml',                desc: 'Control biológico robusto para acuarios establecidos. Asegura una población de bacterias saludable para degradar desechos orgánicos eficientemente.', precio: 11500,  cat: liqId,     img: 'cycle-240.jpeg' },
            { nombre: 'Cycle Litro',                desc: 'Poder biológico para criadores y expertos. Millones de bacterias vivas para estabilizar rápidamente sistemas de filtración a gran escala.', precio: 29000,  cat: liqId,     img: 'cycle-litro.jpeg' },
            { nombre: 'Antialgas 20ml',             desc: 'Mantén tu acuario cristalino. Controla y previene la propagación de algas indeseadas causadas por la luz solar, sin dañar tus plantas.', precio: 4500,   cat: liqId,     img: 'alga-clear-20.jpeg' },
            { nombre: 'Test Plus Ultra PH 20ml',    desc: 'Precisión total para un agua perfecta. Monitorea el nivel de PH con máxima exactitud para asegurar el bienestar de tus especies.', precio: 5500,   cat: liqId,     img: 'test-ph.jpeg' },
            { nombre: 'Clarify 20ml',               desc: 'Agua transparente en minutos. Agrupa las micropartículas de suciedad para que el filtro las retire, dejando el agua impecable.', precio: 3000,   cat: liqId,     img: 'clarify-20.jpeg' },
            { nombre: 'Clarify 60ml',               desc: 'Claridad extrema para acuarios exigentes. Elimina la turbidez mecánica y orgánica, devolviendo el brillo natural a tu acuario.', precio: 6500,   cat: liqId,     img: 'clarify-60.jpeg' },
            { nombre: 'Antihongos 30ml',            desc: 'Protección contra infecciones externas. Previene y trata la formación de hongos en peces heridos o estresados, facilitando su curación.', precio: 1300,   cat: liqId,     img: 'antihongos-30.jpeg' },
            { nombre: 'Azul de Metileno 30ml',      desc: 'Tratamiento clásico para la salud acuática. Eficaz contra parásitos y hongos comunes, un básico en el botiquín de todo acuarista.', precio: 1300,   cat: liqId,     img: 'azul-metileno-30.jpeg' },
            { nombre: 'Tratamiento de Agua ICK 30ml', desc: 'Alivio rápido contra el punto blanco. Combate el parásito ICK y reduce la irritación en la piel de tus peces de forma segura.', precio: 1300,   cat: liqId,     img: 'ICK-30.jpeg' },
            { nombre: 'Antialgas',                  desc: 'Control total sobre las algas. Evita la acumulación de suciedad verde en cristales y adornos, manteniendo la estética de tu acuario.', precio: 3000,   cat: liqId,     img: 'antialgas.jpeg' },

            // ── ALIMENTOS ─────────────────────────────────────────────────────
            { nombre: 'Nutri 5 Pellets',            desc: 'Nutrición balanceada para peces activos. Pellets premium que fortalecen el sistema inmune y resaltan los colores naturales de tus mascotas.', precio: 6000,   cat: alimId,    img: 'nutri5-pellets.jpeg' },
            { nombre: 'Betta Pellets 30gr',         desc: 'El festín ideal para tu Betta. Formulado con proteínas de alta calidad para mantener a tus peces Betta vibrantes y llenos de energía.', precio: 5500,   cat: alimId,    img: 'betta.jpeg' },
            { nombre: 'Alimento para Peces de Fondo 30gr', desc: 'Dieta completa para habitantes del suelo. Rico en moringa y omega 3, perfecto para cuchas y peces que buscan comida en el sustrato.', precio: 5500,   cat: alimId,    img: 'alimento-fondo-30.jpeg' },
            { nombre: 'Nutrí 5 Libra',              desc: 'Ahorro y calidad en cada grano. Comida en pellets para toda clase de peces, garantizando un crecimiento sano y agua limpia.', precio: 27000,  cat: alimId,    img: 'nutri5-libra.jpeg' },
            { nombre: 'Comida con Caroteno (peces pequeños)', desc: 'Color intenso para tus peces pequeños. Enriquecida con carotenos naturales que potencian el brillo y la vitalidad de tus especies.', precio: 27000,  cat: alimId,    img: 'caroteno-pequenos.jpeg' },
            { nombre: 'Comida con Caroteno (peces grandes)', desc: 'Resalta la belleza de tus peces grandes. Alimento altamente nutritivo que intensifica la coloración roja y naranja de forma natural.', precio: 27000,  cat: alimId,    img: 'caroteno-grandes.jpeg' },
            { nombre: 'Comida Vegetal (peces grandes)', desc: 'El aporte de fibra necesario. Comida a base de algas y vegetales para una digestión óptima en peces grandes y herbívoros.', precio: 27000,  cat: alimId,    img: 'vegetal-grandes.jpeg' },
            { nombre: 'Comida Vegetal (peces de fondo)', desc: 'Frescura vegetal para tus peces de fondo. Tabletas nutritivas que no ensucian el agua, ideales para una dieta variada y saludable.', precio: 27000,  cat: alimId,    img: 'vegetal-fondo.jpeg' },
            { nombre: 'Comida para Kois',           desc: 'Energía pura para tus Kois. Alimento flotante de fácil digestión, diseñado para el crecimiento y bienestar de tus peces en estanque.', precio: 27000,  cat: alimId,    img: 'comida-kois.jpeg' },
            { nombre: 'Comida para Tortuga',        desc: 'Nutrición completa para reptiles acuáticos. Con calcio y vitaminas esenciales para un caparazón fuerte y una vida larga y saludable.', precio: 27000,  cat: alimId,    img: 'comida-tortuga.jpeg' },
            { nombre: 'Tropical 1ml',               desc: 'Comida flotante de alto rendimiento. Ideal para alimentación masiva en bultos de 10 libras, asegurando salud al mejor precio.', precio: 70000,  cat: alimId,    img: 'tropical-1ml.jpeg' },
            { nombre: 'Tropical 3ml',               desc: 'Nutrición económica y efectiva. Granulado flotante para peces medianos, perfecto para mantener la vitalidad de tu población acuática.', precio: 70000,  cat: alimId,    img: 'tropical-3ml.jpeg' },
            { nombre: 'Tropical 5ml',               desc: 'El alimento ideal para grandes ejemplares. Diseñado para peces de gran tamaño como Coys, proporcionando saciedad y nutrición total.', precio: 70000,  cat: alimId,    img: 'tropical-5ml.jpeg' },
            { nombre: 'Nutri 5 Hojuela 20gr',       desc: 'La dieta diaria preferida. Hojuelas ligeras y nutritivas que flotan más tiempo, ideales para peces de todos los niveles del acuario.', precio: 2500,   cat: alimId,    img: 'nutri5-hojuela-20.jpeg' },
            { nombre: 'Nutri 5 Hojuela Libra',      desc: 'Máxima nutrición en formato familiar. Hojuelas de alta palatabilidad que aseguran que todos tus peces se alimenten correctamente.', precio: 27000,  cat: alimId,    img: 'nutri5-hojuela-libra.jpeg' },
            { nombre: 'Desparasitante',             desc: 'Salud natural desde el interior. Desparasitante 100% eficaz y seguro, ideal para mantener a tus peces libres de parásitos internos.', precio: 3500,   cat: alimId,    img: 'desparasitante.jpeg' },
            { nombre: 'Incros 14gr',                desc: 'Fórmula especializada de alta gama. Hojuelas enriquecidas que garantizan colores vivos y salud superior.', precio: 58000,  cat: alimId,    img: 'incros-14.jpeg' },
            { nombre: 'Incros 30gr',                desc: 'Fórmula especializada de alta gama. Hojuelas enriquecidas que garantizan colores vivos y salud superior.', precio: 105000, cat: alimId,    img: 'incros-30.jpeg' },
            { nombre: 'Incros 100gr',               desc: 'Fórmula especializada de alta gama. Hojuelas enriquecidas que garantizan colores vivos y salud superior.', precio: 82000,  cat: alimId,    img: 'incros-100.jpeg' },
            { nombre: 'Ocelatus 20gr',              desc: 'Nutrición específica para resaltar el brillo. Hojuelas premium diseñadas para especies delicadas.', precio: 41400,  cat: alimId,    img: 'ocelatus-20.jpeg' },
            { nombre: 'Ocelatus 100gr',             desc: 'Nutrición específica para resaltar el brillo. Hojuelas premium diseñadas para especies delicadas.', precio: 43300,  cat: alimId,    img: 'ocelatus-100.jpeg' },
            { nombre: 'Goldfish 20gr',              desc: 'El cuidado perfecto para tus Goldfish. Hojuelas que promueven un crecimiento sano y una coloración intensa.', precio: 55000,  cat: alimId,    img: 'goldfish-20.jpeg' },
            { nombre: 'Comida Vacacional 3 Días (Peces Fin de Semana)',  desc: 'Tus peces alimentados, incluso en vacaciones. Bloques de liberación lenta que proporcionan comida constante mientras no estás.', precio: 6200, cat: alimId, img: 'vacacional-3dias-fds.jpeg' },
            { nombre: 'Comida Vacacional 15 Días (Peces Fin de Semana)', desc: 'Tus peces alimentados, incluso en vacaciones. Bloques de liberación lenta que proporcionan comida constante mientras no estás.', precio: 6200, cat: alimId, img: 'vacacional-15dias-fds.jpeg' },
            { nombre: 'Comida Vacacional 3 Días (Nutri 5)',  desc: 'Tus peces alimentados, incluso en vacaciones. Bloques de liberación lenta que proporcionan comida constante mientras no estás.', precio: 5200,   cat: alimId,    img: 'vacacional-3dias-nutri5.jpeg' },
            { nombre: 'Comida Vacacional 15 Días (Nutri 5)', desc: 'Tus peces alimentados, incluso en vacaciones. Bloques de liberación lenta que proporcionan comida constante mientras no estás.', precio: 5200,   cat: alimId,    img: 'vacacional-15dias-nutri5.jpeg' },

            // ── EQUIPOS ───────────────────────────────────────────────────────
            { nombre: 'Filtro 600L',                desc: 'Potencia silenciosa para un agua pura. Sistema de filtración 3 en 1 que oxigena, limpia y circula el agua eficientemente.', precio: 19000,  cat: eqId,      img: 'filtro-600.jpeg' },
            { nombre: 'Filtro 800L',                desc: 'Potencia silenciosa para un agua pura. Sistema de filtración 3 en 1 que oxigena, limpia y circula el agua eficientemente.', precio: 21000,  cat: eqId,      img: 'filtro-800.jpeg' },
            { nombre: 'Filtro 1500L',               desc: 'Potencia silenciosa para un agua pura. Sistema de filtración 3 en 1 que oxigena, limpia y circula el agua eficientemente.', precio: 28000,  cat: eqId,      img: 'filtro-1500.jpeg' },
            { nombre: 'Filtro 1700L',               desc: 'Potencia silenciosa para un agua pura. Sistema de filtración 3 en 1 que oxigena, limpia y circula el agua eficientemente.', precio: 31000,  cat: eqId,      img: 'filtro-1700.jpeg' },
            { nombre: 'Filtro 2450L',               desc: 'Potencia silenciosa para un agua pura. Sistema de filtración 3 en 1 que oxigena, limpia y circula el agua eficientemente.', precio: 34000,  cat: eqId,      img: 'filtro-2450.jpeg' },
            { nombre: 'Motor de 1 Salida',          desc: 'Oxigenación constante y silenciosa. Bomba de aire compacta que asegura niveles óptimos de oxígeno para tus peces.', precio: 12000,  cat: eqId,      img: 'motor-1salida.jpeg' },
            { nombre: 'Termostato 25W',             desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 12500,  cat: eqId,      img: 'termostato25.jpeg' },
            { nombre: 'Termostato 50W',             desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 12500,  cat: eqId,      img: 'termostato50.jpeg' },
            { nombre: 'Termostato 75W',             desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 12500,  cat: eqId,      img: 'termostato75.jpeg' },
            { nombre: 'Termostato 100W',            desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 13000,  cat: eqId,      img: 'termostato100.jpeg' },
            { nombre: 'Termostato 150W',            desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 13000,  cat: eqId,      img: 'termostato150.jpeg' },
            { nombre: 'Termostato 200W',            desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 14500,  cat: eqId,      img: 'termostato200.jpeg' },
            { nombre: 'Termostato 300W',            desc: 'Clima perfecto para tus peces tropicales. Calentador sumergible de precisión que mantiene la temperatura estable siempre.', precio: 14500,  cat: eqId,      img: 'termostato300.jpeg' },
            { nombre: 'Comedero Automático de 3 Tiempos',                    desc: 'Alimentación programada sin preocupaciones. Dispensa la cantidad justa de comida en el horario que elijas.', precio: 43000,  cat: eqId,      img: 'comedero3tiempos.jpeg' },
            { nombre: 'Comedero Automático Digital',                         desc: 'Alimentación programada sin preocupaciones. Dispensa la cantidad justa de comida en el horario que elijas.', precio: 45000, cat: eqId, img: 'comedero-digital.jpeg' },
            { nombre: 'Comedero Automático Digital con Medidor de Temperatura', desc: 'Alimentación programada sin preocupaciones. Incluye sensor de temperatura para un control total del entorno.', precio: 55000, cat: eqId, img: 'comedero-digital-temp.jpeg' },

            // ── PLANTAS ARTIFICIALES ──────────────────────────────────────────
            { nombre: 'Planta Artificial SC673-3A', desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 9000,   cat: plantasId, img: 'planta-sc673-3a.jpeg' },
            { nombre: 'Planta Artificial SC-2252',  desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 9000,   cat: plantasId, img: 'planta-sc2252.jpeg' },
            { nombre: 'Planta Artificial SC673-37', desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 6500,   cat: plantasId, img: 'planta-sc673-37.jpeg' },
            { nombre: 'Planta Artificial E-Series x2', desc: 'Pack de 2 plantas artificiales. Crea un paisaje submarino colorido y lleno de vida de forma inmediata.', precio: 6300,   cat: plantasId, img: 'planta-eseries.jpeg' },
            { nombre: 'Planta Artificial SC-2251',  desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 15000,  cat: plantasId, img: 'planta-sc2251.jpeg' },
            { nombre: 'Planta Artificial F-10 (x10)', desc: 'Set de 10 plantas pequeñas. Perfectas para detallar el fondo de tu acuario y crear zonas de juego para tus peces.', precio: 7500,   cat: plantasId, img: 'planta-f10.jpeg' },
            { nombre: 'Planta Artificial B-Series', desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 6300,   cat: plantasId, img: 'planta-bseries.jpeg' },
            { nombre: 'Planta Artificial SC-346',   desc: 'Decoración vibrante y sin esfuerzo. Plantas de gran realismo que crean escondites naturales y un entorno alegre.', precio: 6300,   cat: plantasId, img: 'planta-sc346.jpeg' },

            // ── ACCESORIOS ────────────────────────────────────────────────────
            { nombre: 'Piedras de Colores',         desc: 'Personaliza el fondo de tu mundo acuático. Piedras decorativas seguras que no alteran el PH del agua.', precio: 2000,   cat: accId,     img: 'piedras-colores.jpeg' },
            { nombre: 'Carbón Activado 50gr',       desc: 'El secreto del agua cristalina. Pellets de alta porosidad que absorben impurezas, olores y coloraciones.', precio: 2500,   cat: accId,     img: 'carbon-50.jpeg' },
            { nombre: 'Carbón Activado 200gr',      desc: 'El secreto del agua cristalina. Pellets de alta porosidad que absorben impurezas, olores y coloraciones.', precio: 5200,   cat: accId,     img: 'carbon-200.jpeg' },
            { nombre: 'Figura Flotante Gato-Luna NH-PVC10', desc: 'Magia y aventura bajo el agua. Adornos flotantes seguros que transforman tu acuario en un paisaje único.', precio: 6300,   cat: accId,     img: 'figura-gato-luna.jpeg' },
            { nombre: 'Figura Flotante Buzo NH-PVC8', desc: 'Magia y aventura bajo el agua. Adornos flotantes seguros que transforman tu acuario en un paisaje único.', precio: 6500,   cat: accId,     img: 'figura-buzo.jpeg' },
            { nombre: 'Estructura de Resina',       desc: 'Crea mundos mágicos bajo el agua. Decoraciones detalladas y seguras que transforman tu acuario en un paisaje histórico.', precio: 17000,  cat: accId,     img: 'estructura-resina.jpeg' },
            { nombre: 'Piña de Resina',             desc: 'Un toque divertido para tu acuario. Figura de resina estilo caricatura, segura para todos tus peces.', precio: 16000,  cat: accId,     img: 'pina-resina.jpeg' },
            { nombre: 'Caballo de Mar Fluorescente', desc: 'Color y brillo en la oscuridad. Figura fluorescente que aporta un toque exótico y mágico a tu decoración.', precio: 8000,   cat: accId,     img: 'caballo-mar.jpeg' },
            { nombre: 'Aspiradora',                 desc: 'Limpieza profunda sin estrés. Herramienta esencial para retirar desechos del sustrato de forma manual e impecable.', precio: 11000,  cat: accId,     img: 'aspiradora.jpeg' },
            { nombre: 'Manguera Siliconada (100m)', desc: 'Flexibilidad y durabilidad garantizada. Manguera de alta calidad para aireación y sistemas de filtración.', precio: 42000,  cat: accId,     img: 'manguera-siliconada.jpeg' },
            { nombre: 'Acuarios Importados',       desc: 'Elegancia y calidad en vidrio. Acuarios con acabados premium y máxima transparencia para disfrutar de tu hobby.', precio: 100000,  cat: accId,     img: 'acuarios_importados.jpeg' },

            // ── JAULAS PARA HÁMSTER ───────────────────────────────────────────
            { nombre: 'Jaula para Hámster 257', desc: 'Un castillo de diversión para tu hámster. Diseño espacioso y ventilado, incluye accesorios para su bienestar.', precio: 32000,  cat: jaulasId,  img: 'jaula-257.jpeg' },
            { nombre: 'Jaula para Hámster S-11', desc: 'Un castillo de diversión para tu hámster. Diseño espacioso y ventilado, incluye accesorios para su bienestar.', precio: 35000,  cat: jaulasId,  img: 'jaula-s11.jpeg' },
            { nombre: 'Jaula para Hámster 268', desc: 'Un castillo de diversión para tu hámster. Diseño espacioso y ventilado, incluye accesorios para su bienestar.', precio: 35000, cat: jaulasId, img: 'jaula-268.jpeg' },
            { nombre: 'Jaula para Hámster 45',  desc: 'Un castillo de diversión para tu hámster. Diseño espacioso y ventilado, incluye accesorios para su bienestar.', precio: 43000,  cat: jaulasId,  img: 'jaula-45.jpeg' },
        ];

        const valores = productos.map(p => [p.nombre, p.desc, p.precio, p.cat, p.img, 1000]);
        await db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock) VALUES ?', [valores]);

        res.json({ message: `Catálogo cargado: ${productos.length} productos insertados.` });
    } catch (error) {
        console.error('Error en el cargador:', error);
        res.status(500).json({ error: 'Error al cargar el catálogo' });
    }
});

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/productos', imagenRoutes);

// ── Fallback para React Router ────────────────────────────────────────────────
app.get('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// ── Error global ──────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});