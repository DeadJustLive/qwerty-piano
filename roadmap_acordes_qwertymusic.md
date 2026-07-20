# Roadmap de acordes iniciales para QWERTYMusic Studio

Este documento propone una pauta práctica para convertir tu app en una herramienta real de aprendizaje armónico usando tu mapa QWERTY isomorfo y una gramática semántica simple. El punto de partida es bueno: ya puedes tocar notas, tu teclado es isomorfo y tu sistema ya distingue acordes, melodías y silencios mediante letras juntas, espacios y `_` [cite:107]. En un teclado isomorfo, una misma forma geométrica puede desplazarse y conservar su estructura interválica, por lo que aprender pocas figuras bien elegidas da mucha más transferencia que en un piano tradicional [cite:107].

## Objetivo pedagógico

Para un usuario novato, lo más importante no es aprender “todos los acordes”, sino dominar primero tríadas mayores y menores, luego progresiones muy frecuentes como I–IV–V y I–V–vi–IV, y recién después añadir color con acordes suspendidos y séptimas [cite:108][cite:109][cite:111]. Esa secuencia funciona porque I, IV y V son los pilares armónicos más comunes en tonalidad mayor, mientras que vi agrega una sonoridad emocional muy usada en pop moderno [cite:108][cite:109].

## Qué acordes conviene enseñar primero

### Fase 1: tríadas mayores

La primera familia a enseñar debería ser la tríada mayor, porque define el sonido “estable” y sirve como referencia auditiva para todo lo demás [cite:108][cite:113]. La prioridad sugerida es practicar primero Do mayor, Fa mayor y Sol mayor, ya que esas funciones corresponden a I, IV y V en Do mayor, una de las combinaciones más usadas en canciones para principiantes [cite:108][cite:111].

### Fase 2: tríadas menores

Después conviene introducir la tríada menor para que el usuario note el contraste emocional entre mayor y menor sin cambiar demasiado la mecánica de la mano [cite:113]. La primera menor recomendada es La menor (vi en Do mayor), porque conecta directamente con la progresión I–V–vi–IV y permite tocar miles de patrones pop sin demasiada teoría adicional [cite:109][cite:116].

### Fase 3: suspendidos

Luego conviene enseñar sus2 y sus4, porque son acordes fáciles de reconocer, neutros y muy útiles para crear tensión y resolución sin exigir demasiada complejidad técnica [cite:117][cite:112]. En teoría, un acorde suspendido reemplaza la tercera por la segunda o la cuarta, por lo que el oído aprende rápido a escuchar “apertura” o “suspensión” antes de volver a mayor o menor [cite:117].

### Fase 4: séptimas básicas

Recién después agregaría séptima dominante y séptima mayor, no como prioridad absoluta del MVP, sino como expansión armónica cuando ya exista estabilidad con tríadas y progresiones [cite:122]. Para tu lenguaje, esto puede aparecer más adelante como extensiones opcionales de una palabra base, en lugar de forzarlo desde el inicio.

## Orden recomendado del roadmap

| Etapa | Contenido | Meta práctica | Motivo |
|---|---|---|---|
| 1 | Notas sueltas | Reconocer teclas y octavas | Ya lo tienes funcionando [cite:107] |
| 2 | Tríadas mayores | Tocar acordes estables de 3 notas | Base armónica inicial [cite:108] |
| 3 | Tríadas menores | Comparar color mayor/menor | Entrena oído y mano [cite:113] |
| 4 | I–IV–V | Acompañar patrones simples | Progresión esencial [cite:108][cite:111] |
| 5 | I–V–vi–IV | Tocar pop y bucles emocionales | Progresión muy común [cite:109][cite:116] |
| 6 | sus2 / sus4 | Añadir tensión y resolución | Expresividad simple [cite:117][cite:112] |
| 7 | Séptimas | Expandir lenguaje semántico | Color armónico extra [cite:122] |

## Propuesta de lenguaje semántico

Tu gramática actual ya tiene una base excelente: letras juntas son simultaneidad, letras separadas son secuencia y `_` representa silencio [cite:107]. Sobre eso, conviene agregar una capa semántica de alto nivel para que el usuario pueda escribir intención musical y no solo pulsaciones crudas.

### Nivel 1: ejecución literal

Este nivel ya existe y debe mantenerse:

- `zcb` = acorde directo
- `z c b` = melodía o arpegio
- `zcb _ ñ` = acorde, pausa, nota aguda [cite:107]

### Nivel 2: alias armónicos

Aquí conviene permitir que el usuario nombre funciones o acordes y que el parser los expanda automáticamente a teclas reales.

Ejemplos sugeridos:

- `Cmaj`
- `Fmaj`
- `Gmaj`
- `Amin`
- `Csus2`
- `Gsus4`

Internamente, el parser traduciría cada alias a una “forma geométrica” válida dentro de tu mapa. Como el teclado es isomorfo, esto permite enseñar figuras movibles en vez de memorizar cada acorde por separado [cite:107].

### Nivel 3: progresiones y compases

Cuando el usuario ya domine unos pocos acordes, tu lenguaje puede subir un nivel más y permitir frases como:

```txt
compas 4/4
loop 4 {
  Cmaj Gmaj Amin Fmaj
}
```

Este enfoque encaja con tu visión de composición accesible: aprender unas pocas funciones armónicas, ponerlas en bucle y crear música útil desde el primer día [cite:109][cite:111].

## Qué enseñar en la primera versión educativa

Para una primera guía dentro de la app, conviene enseñar solo este set:

- 3 acordes mayores: C, F, G
- 1 acorde menor: Am
- 2 suspendidos: Csus2, Gsus4
- 2 progresiones: I–IV–V y I–V–vi–IV [cite:108][cite:109][cite:117]

Eso ya permite práctica de coordinación, oído, acompañamiento, tensión-resolución y composición básica sin abrumar al usuario con teoría avanzada.

## Cómo convertir esto a experiencia de UI

La app debería tener un panel “Aprender acordes” donde cada acorde se vea como una forma geométrica sobre el teclado, no solo como una lista de letras. Esa decisión es importante porque tu instrumento se basa más en patrón espacial que en memoria tradicional de notas, y tu propia guía ya enfatiza ese principio isomorfo [cite:107]. Al seleccionar un acorde, la app debería mostrar:

- nombre del acorde
- función armónica, por ejemplo I, IV, V o vi [cite:108][cite:109]
- teclas a presionar
- preview de sonido
- botón “usar en loop” para llevarlo al compositor

## Roadmap de producto sugerido

### Semana 1

- Validar bien todas las notas y octavas con `Shift`
- Mostrar overlay del teclado con nombres de nota y tecla [cite:107]
- Guardar palabras literales (`zcb`, `z c b`, etc.)

### Semana 2

- Implementar diccionario semántico de acordes (`Cmaj`, `Gmaj`, `Amin`)
- Resolver alias a combinaciones reales de teclas
- Añadir vista visual de forma geométrica del acorde

### Semana 3

- Implementar progresiones prehechas: I–IV–V e I–V–vi–IV [cite:108][cite:109]
- Añadir metrónomo, compás y loop
- Permitir reproducir una progresión completa con un comando simple

### Semana 4

- Añadir acordes suspendidos (`sus2`, `sus4`) [cite:117][cite:112]
- Mostrar resolución sugerida, por ejemplo `Gsus4 -> G`
- Crear ejercicios guiados de tensión y resolución

### Semana 5+

- Añadir séptimas y variaciones
- Crear importador MIDI a tu DSL
- Diseñar sistema comunitario de presets y diccionarios, si en el futuro vuelves a abrir esa línea

## Recomendación práctica final

Si el objetivo es que un novato pueda “sentirse musical” rápido, la prioridad no debería ser enseñar teoría exhaustiva, sino lograr que en menos de 15 minutos pueda tocar una progresión útil con nombres comprensibles y feedback visual claro. En la práctica, eso significa comenzar con C, F, G, Am, sus2, sus4 y dos progresiones famosas; luego construir encima un lenguaje semántico que oculte la complejidad del mapeo físico y resalte la intención musical [cite:107][cite:108][cite:109][cite:117].
