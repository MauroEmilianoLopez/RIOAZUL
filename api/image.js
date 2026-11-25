const IMAGE_PATHS = {
  "logo.png": "/images/logo.png",
  "inicio.jpg": "/images/inicio.jpg",
  "foto1.jpg": "/images/chicas/foto1.jpg",
  "foto2.jpg": "/images/chicas/foto2.jpg",
  "foto3.jpg": "/images/chicas/foto3.jpg",
  "foto4.jpg": "/images/chicas/foto4.jpg",
  "foto5.jpg": "/images/chicas/foto5.jpg",
  "foto6.jpg": "/images/chicas/foto6.jpg",
  "foto7.jpg": "/images/chicas/foto7.jpg",
  "foto8.jpg": "/images/chicas/foto8.jpg",
  "foto9.jpg": "/images/chicas/foto9.jpg",
};

module.exports = async function handler(req, res) {
  const imageName = Array.isArray(req.query.name) ? req.query.name[0] : req.query.name;
  const imagePath = IMAGE_PATHS[imageName];

  if (!imagePath) {
    res.status(404).send("Imagen no encontrada");
    return;
  }

  try {
    const upstream = await fetch("https://www.cabanasrioazul.com.ar" + imagePath);

    if (!upstream.ok) {
      res.status(upstream.status).send("No se pudo obtener la imagen");
      return;
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const image = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.status(200).send(image);
  } catch {
    res.status(502).send("Error al cargar la imagen");
  }
};
