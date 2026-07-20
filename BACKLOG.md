# Backlog del Producto: QWERTYMusic Studio

Este documento organiza el desarrollo del proyecto en Épicas, Tickets y Sprints, siguiendo metodologías ágiles para asegurar entregas continuas y controladas del MVP (Minimum Viable Product).

## Épicas

*   **ÉPICA 1: Infraestructura Base (Core Shell)**
*   **ÉPICA 2: El Intérprete Musical (Parser & DSL)**
*   **ÉPICA 3: Motor de Audio en Tiempo Real**
*   **ÉPICA 4: UI Interactiva (Modo Intérprete y Composición)**
*   **ÉPICA 5: Transcriptor de Audio a DSL (Fase 2 / Post-MVP)**

---

## Planificación de Sprints (MVP)

### Sprint 1: Setup y Andamiaje (1 Semana)
**Objetivo:** Tener la aplicación compilando y ejecutándose en escritorio con comunicación básica Front-Back.
*   **TKT-1.1:** Inicializar proyecto con Tauri (Rust) y Vite (React, TypeScript). (COMPLETADO)
*   **TKT-1.2:** Configurar TailwindCSS y limpieza de boilerplate.
*   **TKT-1.3:** Crear prueba de concepto IPC (Inter-Process Communication): Enviar un string desde React y recibir una respuesta desde Rust.

### Sprint 2: Motor de Audio Continuo (Live Play) (1.5 Semanas)
**Objetivo:** Rust mantiene el audio vivo en segundo plano y puede encender/apagar múltiples notas en tiempo real.
*   **TKT-2.1:** Refactorizar `cpal` para mantener un stream de audio continuo sin morir.
*   **TKT-2.2:** Crear un manejador de estado (State) en Rust para rastrear qué frecuencias están activas (Sintetizador base).
*   **TKT-2.3:** Exponer comandos `note_on(freq)` y `note_off(freq)` a través de Tauri.

### Sprint 3: Teclado Interactivo UI (Estilo Keybr/Synth) (2 Semanas)
**Objetivo:** El usuario puede tocar música en tiempo real usando el teclado de su computadora, viendo las teclas iluminarse.
*   **TKT-3.1:** Capturar eventos globales `keydown` y `keyup` en React sin lag.
*   **TKT-3.2:** Construir la interfaz del teclado visual con TailwindCSS (teclas que reaccionan/iluminan al presionarse).
*   **TKT-3.3:** Mapear lógicamente las teclas QWERTY a frecuencias exactas (Hz) musicales.
*   **TKT-3.4:** Conectar UI interactiva con el backend (`note_on` y `note_off`) para audio en vivo.

### Sprint 4: Parser Léxico y Sintaxis DSL (Composición Escrita) (1.5 Semanas)
**Objetivo:** El sistema puede leer texto estructurado y separarlo en música.
*   **TKT-4.1:** Diseñar Tokenizer en Rust para leer notas (ej. 'a', 'c', 'e') y duraciones numéricas (ej. `a4`).
*   **TKT-4.2:** Implementar agrupación de acordes con corchetes (ej. `[ace]4`).
*   **TKT-4.3:** Interpretar la partitura de texto y enviarla al motor de audio (sequencer básico).

### Sprint 5: Modo Composición Visual y Nodos (2 Semanas)
**Objetivo:** Unir todo en un Canvas de Nodos conectables para componer piezas complejas.
*   **TKT-5.1:** Integrar `@xyflow/react` para el Canvas base.
*   **TKT-5.2:** Crear Nodos visuales para notas, acordes y secuencias.
