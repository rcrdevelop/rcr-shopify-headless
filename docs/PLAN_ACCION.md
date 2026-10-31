# Plan de Acción #03: Tienda Ecommerce Headless (Shopify + Firebase)

- **Componente actual en Portafolio:** `src/pages/projects/components/ShopifyStore.vue`
- **Subdominio objetivo:** `shop.rcrdevelop.com` (o `shopify-headless-rcr.web.app`)
- **Stack Original Declarado:** Shopify Liquid + Dawn Theme + Headless
- **Stack Real en Firebase:** Storefront Headless en Vue 3 / Quasar SPA + Shopify Storefront GraphQL API (o Motor Catálogo Firestore en modo standalone) + Checkout Persistente

---

## 1. Análisis de Limitantes Técnicas en Firebase y Solución Arquitectónica

| Limitante Técnica                                                             | Impacto Real                                                                                                                                                                              | Solución para Firebase + Subdominio                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shopify Liquid (`.liquid`) solo corre dentro de los servidores de Shopify** | No puedes alojar un tema `.liquid` directamente en Firebase Hosting porque Liquid es renderizado por el motor propietario de Shopify ( que requiere pagar $39 USD/mes por tienda activa). | **Arquitectura Dual Inteligente:** 1) En `shop.rcrdevelop.com` alojas un **Storefront Headless ultrarrápido** en Firebase Hosting que consume la **Shopify Storefront API** (puedes usar una tienda **Shopify Partner Development Store**, que es **100% gratuita de por vida** para partners) o un adaptador Firestore local. 2) Además, mantienes el repositorio del tema **Dawn/Horizon en Liquid** listo para instalar o descargar como demostración técnica. |
| **Checkout de Shopify en tiendas de desarrollo (Partner Dev Store)**          | En una tienda gratuita de Shopify Partner, el checkout real pide contraseña de tienda o tarjeta de prueba (`Bogus Gateway`).                                                              | Implementar en el frontend de Firebase un **Drawer de Carrito Completo + Flujo de Checkout Simulado / Stripe Test Mode** dentro de la propia SPA, con opción de alternar entre _"Checkout Nativo en SPA"_ y _"Redirección a Shopify Storefront Checkout"_.                                                                                                                                                                                                        |
| **SEO en SPA para Ecommerce**                                                 | Si se vende a clientes reales, los crawlers y redes sociales necesitan metadatos OpenGraph por producto.                                                                                  | Usar una Cloud Function ligera en Firebase Hosting para inyectar etiquetas `<meta property="og:*">` dinámicas en rutas `/product/:slug` o pre-renderizar las páginas de producto en el build.                                                                                                                                                                                                                                                                     |

---

## 2. Arquitectura del Proyecto (Patrón Adapter: Shopify API / Firestore)

```text
src/services/commerceAdapter.ts
  ├── ShopifyStorefrontProvider (GraphQL: products, collections, cartCreate, cartLinesAdd)
  └── FirebaseCommerceProvider (Firestore: stores/{storeId}/products, orders, coupons)
```

Este patrón te permite demostrar en el subdominio `shop.rcrdevelop.com` tanto una integración real con **Shopify Headless** como un **Ecommerce completo sobre Firebase** sin pagar mensualidad de Shopify.

---

## 3. Plan de Implementación Paso a Paso

### Fase 1: Experiencia de Compra Completa (Semana 1)

1. **Catálogo Avanzado**:
   - Filtros por categoría (`Hombre`, `Mujer`, `Calzado`, `Accesorios`), talla, color, rango de precios y ordenamiento.
   - Vista rápida de producto (_Quick View Modal_), galería con zoom, selector de variantes (talla/color con control de stock) y productos relacionados.
2. **Carrito Lateral (Slide-over Cart) & Wishlist**:
   - Persistencia en `localStorage` + sincronización en Firestore, cálculo de envío gratis con barra de progreso (_"Te faltan $20 para envío gratis"_), cupones de descuento (`DEMO20`) y cálculo de impuestos.

### Fase 2: Checkout & Panel Admin de Tienda (Semana 2)

1. **Checkout en 3 Pasos**:
   - Datos de envío → Método de envío → Pago de prueba (tarjeta demo en 1 clic) → Generación de Orden con número de seguimiento y recibo descargable.
2. **Switch "Vista Cliente / Vista Admin" en vivo**:
   - Un botón flotante en `shop.rcrdevelop.com` que permite al visitante cambiar al **Panel de Vendedor** para ver cómo su pedido recién creado aparece en tiempo real en el tablero de órdenes y métricas de ventas.

### Fase 3: Despliegue en Subdominio (`shop.rcrdevelop.com`)

1. Crear cuenta gratuita en **Shopify Partners** (`partners.shopify.com`) y crear una _Development Store_ con el token público `Storefront API Access Token` (solo lectura de catálogo y carrito).
2. Desplegar el Storefront en el target `shop` de Firebase Hosting conectado a `shop.rcrdevelop.com`.

---

## 4. Estrategia de Monetización (Template vs SaaS)

### Opción A: Venta de Temas y Storefront Templates ($79 - $199 USD)

- **Producto 1:** Tema Shopify 2.0 (JSON Templates + Liquid Sections modulares) para vender en ThemeForest o Gumroad.
- **Producto 2:** "Headless Shopify + Firebase Starter Kit" en Vue 3 para marcas que buscan puntuación 100/100 en Google PageSpeed.

### Opción B: SaaS "Catálogo Express + Pedidos por WhatsApp/Stripe" ($19 - $49 USD/mes)

- Muchas tiendas en Latinoamérica y España encuentran Shopify caro o complejo.
- Con el `FirebaseCommerceProvider`, puedes vender la misma plataforma como un **SaaS de Tienda Online + Pedidos a WhatsApp / Pasarela de Pago** alojado en tu infraestructura de Firebase por una fracción del costo.
