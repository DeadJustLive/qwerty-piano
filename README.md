# 🎹 QWERTYMusic Studio

QWERTYMusic Studio es un software innovador que transforma tu teclado estándar de computadora (QWERTY) en un **instrumento musical isomorfo y polifónico real**. Está diseñado no para simular un teclado MIDI tradicional, sino para crear un instrumento musical completamente nuevo basado en la ergonomía y comodidad natural de teclear, eliminando las barreras de entrada tradicionales para aprender teoría musical.

Construido para latencia ultra-baja y fluidez utilizando **Tauri (Rust)** como motor de audio de alto rendimiento y **React/Vite** para una interfaz visual impresionante.

## ✨ Características Principales

* **🎹 Teclado Isomorfo Optimizado:** Distribución cromática única adaptada para la disposición QWERTY (español), que te permite tocar acordes y escalas manteniendo las mismas formas de la mano sin importar la tonalidad base.
* **🚀 Motor de Audio de Latencia Cero:** Aprovecha `rodio` en Rust cargando los samples pesados (FLAC) directamente en la RAM. Multihilo con soporte de polifonía total y envolventes ADSR (Release Fade-outs suaves).
* **🖐️ Polifonía a Dos Manos (Asincrónico):** Sistema de colores que separa intuitivamente tu teclado en Mano Izquierda (Azul) y Mano Derecha (Naranja), permitiéndote leer partituras dividiendo mentalmente el trabajo.
* **📖 Aprendizaje Interactivo (Auto-Play):** Un "Modo Práctica" avanzado donde debes pulsar las teclas correctas para avanzar (espera pasiva). Incluye un motor de **Auto-Play** que toca las partituras por ti a velocidades (BPM) personalizables.
* **🎼 Creador de Partituras (Custom Sequences):** Un DSL (Domain Specific Language) ligero que te permite escribir tus propias canciones con simples letras (ej. `Z C B _ J K`) donde el espacio denota un acorde simultáneo y `_` representa silencios.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS, Vite.
- **Backend/Core:** Rust, Tauri, Rodio (Audio Engine).
- **SoundFonts:** Soporte para samples FLAC de alta calidad (Ej. Salamander Grand Piano).

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/tools/install) y Cargo.
- Dependencias de sistema para Tauri/Audio en Linux:
  ```bash
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev alsa-utils libasound2-dev
  ```

### Iniciar en Desarrollo

1. Clona este repositorio.
2. Instala las dependencias del frontend:
   ```bash
   npm install
   ```
3. Ejecuta el entorno de desarrollo (Tauri + Vite):
   ```bash
   # Nota en entornos Linux/Wayland si tienes problemas gráficos:
   WEBKIT_DISABLE_DMABUF_RENDERER=1 npm run tauri dev
   ```

### Construir para Producción (Build)

```bash
npm run tauri build
```
Esto generará un archivo ejecutable optimizado (`.AppImage`, `.deb`, o `.exe` según tu OS) en la carpeta `src-tauri/target/release/bundle`.

## 🎵 Cómo Tocar (El Sistema Isomorfo)

El teclado está dividido en **dos manos**. La fila Z-B es una escala cromática ascendente. Con la tecla `Shift` puedes saltar una octava instantáneamente. ¡Explora las geometrías de los acordes!

* **Mano Izquierda (Azul):** `Q-T`, `A-G`, `Z-B`
* **Mano Derecha (Naranja):** `Y-P`, `H-Ñ`, `N-Guión`

## 🤝 Contribución
¡Siéntete libre de hacer un fork del proyecto y enviar Pull Requests! Especialmente si deseas añadir nuevos ejercicios de teoría musical a la `LIBRARY` o incorporar formatos como MIDI / MusicXML.

## 📄 Licencia
Este proyecto es de código abierto. MIT License.
