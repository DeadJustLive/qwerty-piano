# Wayland Workaround para WebKitGTK

Al ejecutar Tauri en modo desarrollo bajo Wayland, WebKitGTK puede arrojar un error de protocolo (Error 71) al intentar renderizar contenido o conectarse al display de Wayland (específicamente, un problema con DMA-BUF o el modo de composición).

**Solución comprobada (19-07-2026):**
Ejecutar el comando de desarrollo de Tauri prefijado con la variable de entorno para desactivar el renderizador problemático o forzar XWayland.

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 npm run tauri dev
```
O, como alternativa:
```bash
GDK_BACKEND=x11 npm run tauri dev
```
