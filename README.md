# Reservas Los Compadres Rooftop

Aplicación web para gestionar reservas de Los Compadres Rooftop, en Facatativá, Colombia. Permite a los clientes crear una reserva y continuar la confirmación por WhatsApp; el equipo del restaurante cuenta con un panel para consultar reservas y administrar fechas.

## Funcionalidades

- **Crear una reserva:** selección de número de personas, ocasión, fecha, hora, pedido anticipado y datos de contacto.
- **Pedido anticipado:** opcional para grupos de menos de seis personas y obligatorio para grupos de seis o más, con al menos un plato por persona.
- **Disponibilidad:** muestra fechas dentro de los próximos 30 días, excluye los martes y las fechas bloqueadas. Los horarios se limitan a dos reservas por franja.
- **Confirmación:** guarda la reserva con estado `pendiente` en Supabase y abre WhatsApp con los datos de la reserva y el mensaje preparado para el restaurante.
- **Mis Reservas:** búsqueda por teléfono, consulta del detalle, cambio de fecha u hora y cancelación.
- **Panel de administración (`/admin`):** agenda diaria, confirmación o cancelación de reservas, bloqueo de fechas e historial mensual con descarga CSV.

## Tecnologías

- React 19 y React Router
- Vite
- Tailwind CSS 4
- Supabase para persistencia
- Vercel para despliegue (incluye reescritura de rutas SPA en `vercel.json`)

## Requisitos

- Node.js compatible con Vite 8
- npm
- Un proyecto de Supabase para guardar reservas y fechas bloqueadas

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto:

   ```env
   VITE_SUPABASE_URL=https://<project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
   VITE_ADMIN_PASSWORD=<admin-password>
   VITE_APP_NAME=Los Compadres Rooftop
   ```

   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` conectan el cliente con Supabase. `VITE_ADMIN_PASSWORD` configura la contraseña del acceso al panel; si se omite, el código usa un valor predeterminado. `VITE_APP_NAME` personaliza el nombre que aparece en el pie de página.

3. En el editor SQL de Supabase, ejecuta [`supabase/schema.sql`](supabase/schema.sql) para crear las tablas y políticas que espera la aplicación.

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Vite muestra en la terminal las direcciones locales disponibles.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite y permite conexiones desde la red local. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de `dist/`. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |

## Rutas de la aplicación

| Ruta | Página |
| --- | --- |
| `/` | Flujo de creación de reservas. |
| `/mis-reservas` | Búsqueda de reservas por teléfono. |
| `/mis-reservas/:id` | Detalle, edición de fecha u hora y cancelación. |
| `/admin` | Panel de administración. |

## Datos y configuración

- `src/constants/settings.js`: nombre, ubicación, WhatsApp, horarios y hora de cierre de cocina.
- `src/constants/menu.js`: categorías, platos y precios del pedido anticipado.
- `src/constants/payment.js`: valor de la garantía, decoración de cumpleaños y datos de pago.
- `src/context/ReservationContext.jsx`: estado compartido y validación de los pasos de reserva.
- `src/services/reservasService.js`: operaciones con las tablas `reservas` y `fechas_bloqueadas`.
- `src/utils/`: formato de fechas y horas, y construcción del mensaje de WhatsApp.
- `supabase/schema.sql`: esquema SQL, índices y políticas de acceso.

## Despliegue

El proyecto puede desplegarse en Vercel conectando el repositorio. Configura las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD` y `VITE_APP_NAME` en las variables de entorno del proyecto antes de compilar. `vercel.json` redirige las rutas de la aplicación a `index.html`.

## Nota de seguridad

Las variables con prefijo `VITE_` se incorporan al código que recibe el navegador. Por eso, la contraseña del panel configurada con `VITE_ADMIN_PASSWORD` no constituye autenticación segura para un entorno público. La clave anon de Supabase también se usa desde el navegador; revisa las políticas de Row Level Security antes de publicar, ya que el SQL incluido define actualmente políticas públicas para las operaciones indicadas en el esquema.
