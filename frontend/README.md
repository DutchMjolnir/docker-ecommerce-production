# Nova — tienda de tecnología

Frontend de e-commerce en español construido con Next.js App Router, TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev
```

La tienda puede ejecutarse sin Laravel: muestra seis productos de demostración, guarda el carrito en `localStorage` y permite completar un checkout local. Para conectar el backend, define `API_URL` en el entorno del servidor con la URL base de la API, incluyendo el prefijo `/api` cuando corresponda (por ejemplo, `http://localhost:8000/api`). La aplicación consulta `API_URL/products`, `API_URL/products/{id}`, `API_URL/login`, `API_URL/register` y `API_URL/orders`.

Las sesiones guardan el token de autenticación en una cookie `auth_token` `httpOnly`. El historial requiere una sesión válida; las acciones de pedido y pago se conectan a los endpoints Laravel disponibles.

## Rutas

- `/` — catálogo y productos destacados.
- `/products/[id]` — detalle del producto.
- `/cart` — carrito persistido localmente.
- `/login` y `/register` — formularios de autenticación.
- `/checkout` — datos de envío y confirmación de compra.
- `/orders` — historial de compra protegido por sesión.

## Comprobaciones

```bash
npm run lint
npm run build
```
