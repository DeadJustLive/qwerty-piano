import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

const midiToFreq = (midi: number) => 440.0 * Math.pow(2, (midi - 69) / 12);

const getNoteName = (midi: number) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = notes[midi % 12];
  return `${note}${octave}`;
};

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-']
];

const KEY_MAP: Record<string, { label: string; baseMidi: number; hand: 'L'|'R' }> = {
  'q': { label: 'Q', baseMidi: 68, hand: 'L' }, 'w': { label: 'W', baseMidi: 69, hand: 'L' },
  'e': { label: 'E', baseMidi: 70, hand: 'L' }, 'r': { label: 'R', baseMidi: 71, hand: 'L' },
  't': { label: 'T', baseMidi: 72, hand: 'L' }, 'y': { label: 'Y', baseMidi: 73, hand: 'R' },
  'u': { label: 'U', baseMidi: 74, hand: 'R' }, 'i': { label: 'I', baseMidi: 75, hand: 'R' },
  'o': { label: 'O', baseMidi: 76, hand: 'R' }, 'p': { label: 'P', baseMidi: 77, hand: 'R' },
  
  'a': { label: 'A', baseMidi: 58, hand: 'L' }, 's': { label: 'S', baseMidi: 59, hand: 'L' },
  'd': { label: 'D', baseMidi: 60, hand: 'L' }, 'f': { label: 'F', baseMidi: 61, hand: 'L' },
  'g': { label: 'G', baseMidi: 62, hand: 'L' }, 'h': { label: 'H', baseMidi: 63, hand: 'R' },
  'j': { label: 'J', baseMidi: 64, hand: 'R' }, 'k': { label: 'K', baseMidi: 65, hand: 'R' },
  'l': { label: 'L', baseMidi: 66, hand: 'R' }, 'ñ': { label: 'Ñ', baseMidi: 67, hand: 'R' },
  
  'z': { label: 'Z', baseMidi: 48, hand: 'L' }, 'x': { label: 'X', baseMidi: 49, hand: 'L' },
  'c': { label: 'C', baseMidi: 50, hand: 'L' }, 'v': { label: 'V', baseMidi: 51, hand: 'L' },
  'b': { label: 'B', baseMidi: 52, hand: 'L' }, 'n': { label: 'N', baseMidi: 53, hand: 'R' },
  'm': { label: 'M', baseMidi: 54, hand: 'R' }, ',': { label: ',', baseMidi: 55, hand: 'R' },
  '.': { label: '.', baseMidi: 56, hand: 'R' }, '-': { label: '-', baseMidi: 57, hand: 'R' },
};

type Song = {
  id: string;
  title: string;
  description: string;
  sequence: string[];
};

const LIBRARY: Song[] = [
  {
    id: 'acordes_mayores',
    title: "1. Acordes Mayores Básicos",
    description: "Aprende la base de toda canción: Do, Fa y Sol a dos manos.",
    // Do Mayor: C3(Z), E3(B), G3(,)
    // Fa Mayor: F3(N), A3(-), C4(D)
    // Sol Mayor: G3(,), B3(S), D4(G)
    sequence: ["ZB,", "_", "N-D", "_", ",SG", "_", "ZB,", "_"]
  },
  {
    id: 'estrellita',
    title: "2. Estrellita Dónde Estás",
    description: "Melodía (derecha) acompañada con notas bajas (izquierda).",
    // C4(D), G4(Ñ), A4(W), F4(K), E4(J), D4(G)
    // C3(Z), F3(N), G3(,)
    sequence: ["ZD", "D", ",Ñ", "Ñ", "NW", "W", "ZÑ", "_", "NK", "K", "ZJ", "J", ",G", "G", "ZD", "_"]
  },
  {
    id: 'golden_hour',
    title: "3. Golden Hour (Aproximación JVKE)",
    description: "Un arpegio repetitivo para poner a prueba tu velocidad a dos manos.",
    sequence: ["S", "H", "Ñ", "H", "L", "H", "_", "S", "H", "Ñ", "H", "L", "H", "_"]
  },
  {
    id: 'para_elisa',
    title: "4. Para Elisa (Beethoven)",
    description: "Clásico con polifonía real (Inicio). ¡Usa ambas manos!",
    // E5(O), D#5(I), B4(R), D5(U), C5(T), A4(W), G#4(Q)
    // A2(? no tenemos tan grave, usaremos A3: -), E3(B)
    sequence: ["O", "I", "O", "I", "O", "R", "U", "T", "-W", "_", "Z", "B", "-R", "_", "B", "W", "Q", "T", "_"]
  },
  {
    id: 'nocturno',
    title: "5. Nocturno (Desafío Polifónico)",
    description: "La mano izquierda (azul) mantiene un bajo ondulante constante mientras la derecha (naranja) canta una melodía. ¡Pura coordinación!",
    // Left hand: Z (C3), D (C4), B (E3) and C (D3), G (D4), B (E3). Constante arpegio de acompañamiento.
    // Right hand: J (E4), Ñ (G4), O (E5) melodía.
    sequence: [
      "ZJ", "D", "BÑ", "D", "ZO", "D", "BÑ", "D", 
      "CJ", "G", "BÑ", "G", "CO", "G", "BÑ", "G",
      "ZJ", "D", "BÑ", "D", "ZO", "D", "BÑ", "D"
    ]
  }
];

function App() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [ignoredKeys, setIgnoredKeys] = useState<Set<string>>(new Set()); 
  const [appMode, setAppMode] = useState<'FREE' | 'PLAY'>('FREE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songCursor, setSongCursor] = useState(0);
  const [customSequence, setCustomSequence] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  
  // Diccionario Dinámico de Usuario (Semántico)
  const [userDict, setUserDict] = useState<Record<string, string>>({
    'cmaj': 'ZB,',
    'fmaj': 'N-D',
    'gmaj': ',SG',
    'amin': '-DJ',
    'csus2': 'ZC,',
    'gsus4': ',DG',
    'pop': 'cmaj _ gmaj _ amin _ fmaj',
  });
  const [newDictKey, setNewDictKey] = useState("");
  const [newDictValue, setNewDictValue] = useState("");

  const autoPlayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAutoPlaying && currentSong && songCursor < currentSong.sequence.length) {
      const beatDuration = 60000 / bpm;
      
      autoPlayTimerRef.current = window.setTimeout(() => {
        const word = currentSong.sequence[songCursor]; // Case-sensitive
        
        if (songCursor > 0) {
          const prevWord = currentSong.sequence[songCursor - 1];
          if (prevWord !== "_") {
            prevWord.split('').forEach(char => {
               const baseKey = char.toLowerCase();
               const isShift = char.toUpperCase() === char && char.toLowerCase() !== char;
               const keyDef = KEY_MAP[baseKey];
               if (keyDef) {
                 const finalMidi = isShift ? keyDef.baseMidi + 12 : keyDef.baseMidi;
                 invoke("note_off", { frequency: midiToFreq(finalMidi) }).catch(console.error);
               }
            });
          }
        }

        if (word !== "_") {
          const newActive = new Set<string>();
          word.split('').forEach(char => {
             const baseKey = char.toLowerCase();
             const isShift = char.toUpperCase() === char && char.toLowerCase() !== char;
             const keyDef = KEY_MAP[baseKey];
             if (keyDef) {
               const finalMidi = isShift ? keyDef.baseMidi + 12 : keyDef.baseMidi;
               invoke("note_on", { frequency: midiToFreq(finalMidi) }).catch(console.error);
               newActive.add(`${baseKey}-${isShift}`);
             }
          });
          setActiveKeys(newActive);
        } else {
          setActiveKeys(new Set());
        }
        
        setSongCursor(c => c + 1);
      }, beatDuration);
      
    } else if (songCursor >= (currentSong?.sequence.length || 0)) {
      setIsAutoPlaying(false);
      setActiveKeys(new Set());
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, songCursor, currentSong, bpm]);

  // Lógica de avance centralizada (funciona tanto para teclado físico como para mouse)
  useEffect(() => {
    if (appMode === 'PLAY' && currentSong && songCursor < currentSong.sequence.length && !isAutoPlaying) {
      const requiredWord = currentSong.sequence[songCursor]; // Case-sensitive
      
      if (requiredWord === "_") {
        setSongCursor(c => c + 1);
        return;
      }

      const requiredKeys = requiredWord.split('');
      
      const isMet = (char: string) => {
        const baseKey = char.toLowerCase();
        const isShift = char.toUpperCase() === char && char.toLowerCase() !== char;
        const keyId = `${baseKey}-${isShift}`;
        return activeKeys.has(keyId) && !ignoredKeys.has(keyId);
      };

      if (requiredKeys.every(isMet)) {
        setSongCursor(c => c + 1);
        setIgnoredKeys(new Set(activeKeys)); 
      }
    }
  }, [activeKeys, appMode, currentSong, songCursor, ignoredKeys, isAutoPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si está escribiendo en el textarea
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;
      if (e.repeat) return;
      if (isAutoPlaying) return;

      const baseKey = e.key.toLowerCase();
      const isShift = e.shiftKey;
      const keyDef = KEY_MAP[baseKey];
      
      if (keyDef) {
        const activeId = `${baseKey}-${isShift}`;
        const finalMidi = isShift ? keyDef.baseMidi + 12 : keyDef.baseMidi;
        
        setActiveKeys(prev => new Set(prev).add(activeId));
        invoke("note_on", { frequency: midiToFreq(finalMidi) }).catch(console.error);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;
      if (isAutoPlaying) return;

      const baseKey = e.key.toLowerCase();
      const keyDef = KEY_MAP[baseKey];
      
      if (keyDef) {
        // Al soltar una tecla, la quitamos de activeKeys Y de ignoredKeys
        setActiveKeys(prev => {
          const next = new Set(prev);
          if (next.has(`${baseKey}-false`)) {
            invoke("note_off", { frequency: midiToFreq(keyDef.baseMidi) }).catch(console.error);
            next.delete(`${baseKey}-false`);
          }
          if (next.has(`${baseKey}-true`)) {
            invoke("note_off", { frequency: midiToFreq(keyDef.baseMidi + 12) }).catch(console.error);
            next.delete(`${baseKey}-true`);
          }
          return next;
        });
        
        setIgnoredKeys(prev => {
          const next = new Set(prev);
          next.delete(`${baseKey}-false`);
          next.delete(`${baseKey}-true`);
          return next;
        });
      }
    };

    const handleBlur = () => {
      // Si la ventana pierde el foco, soltamos todas las notas para que no se queden "pegadas"
      activeKeys.forEach(activeId => {
        const [baseKey, isShiftStr] = activeId.split('-');
        const isShift = isShiftStr === 'true';
        const keyDef = KEY_MAP[baseKey];
        if (keyDef) {
          const finalMidi = isShift ? keyDef.baseMidi + 12 : keyDef.baseMidi;
          invoke("note_off", { frequency: midiToFreq(finalMidi) }).catch(console.error);
        }
      });
      setActiveKeys(new Set());
      setIgnoredKeys(new Set());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [activeKeys]); // Dependencia necesaria para que handleBlur lea activeKeys correctamente

  const loadSong = (song: Song) => {
    setCurrentSong(song);
    setSongCursor(0);
    setIgnoredKeys(new Set(activeKeys)); // Las teclas actuales no cuentan para la nueva canción
    setIsAutoPlaying(false);
    setAppMode('PLAY');
    setIsModalOpen(false);
  };

  const loadCustomSong = () => {
    const rawTokens = customSequence.trim().split(/\s+/).filter(Boolean);
    
    const resolveToken = (token: string, depth: number = 0): string[] => {
      if (depth > 5) return [token]; // Evitar loops infinitos de recursividad
      const lowerToken = token.toLowerCase();
      if (userDict[lowerToken]) {
        const translation = userDict[lowerToken].split(/\s+/).filter(Boolean);
        const isUpperWord = token === token.toUpperCase() && token !== token.toLowerCase();
        
        const resolved = translation.flatMap(t => resolveToken(t, depth + 1));
        return isUpperWord ? resolved.map(t => t.toUpperCase()) : resolved;
      }
      return [token];
    };

    const sequence = rawTokens.flatMap(t => resolveToken(t));

    if (sequence.length > 0) {
      loadSong({
        id: 'custom_song',
        title: "Tu Creación (Custom)",
        description: "Composición traducida a partir de tu idioma.",
        sequence
      });
    }
  };

  const handlePointerDown = (baseKey: string) => {
    if (isAutoPlaying) return;
    const keyDef = KEY_MAP[baseKey];
    if (keyDef) {
      setActiveKeys(prev => new Set(prev).add(`${baseKey}-false`));
      invoke("note_on", { frequency: midiToFreq(keyDef.baseMidi) }).catch(console.error);
    }
  };

  const handlePointerUp = (baseKey: string) => {
    if (isAutoPlaying) return;
    const keyDef = KEY_MAP[baseKey];
    if (keyDef) {
      setActiveKeys(prev => {
        const next = new Set(prev);
        if (next.has(`${baseKey}-false`)) {
          invoke("note_off", { frequency: midiToFreq(keyDef.baseMidi) }).catch(console.error);
          next.delete(`${baseKey}-false`);
        }
        return next;
      });
      setIgnoredKeys(prev => {
        const next = new Set(prev);
        next.delete(`${baseKey}-false`);
        return next;
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white font-sans overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
      
      <div className="absolute top-6 right-6 z-20">
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">☰ Biblioteca</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-emerald-400">Modos y Práctica</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div onClick={() => { setAppMode('FREE'); setIsModalOpen(false); }} className="p-4 rounded-xl border border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10 cursor-pointer transition-colors">
                <h3 className="text-xl font-bold text-white">🎹 Estilo Libre</h3>
                <p className="text-gray-400 text-sm mt-1">Toca sin restricciones. Sin partituras, solo explora el instrumento.</p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-800">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">🎵 Compositor (Idioma Musical & Macros)</h3>
                
                <div className="flex flex-col gap-4">
                  {/* Diccionario de Usuario */}
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Tu Diccionario / Macros</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(userDict).map(([key, val]) => (
                        <div key={key} className="bg-gray-800 px-2 py-1 rounded text-xs flex items-center gap-2 border border-gray-700">
                          <span className="text-emerald-400 font-bold">{key}</span> 
                          <span className="text-gray-500">→</span> 
                          <span className="text-gray-300 tracking-widest">{val}</span>
                          <button onClick={() => {
                            const newD = {...userDict}; delete newD[key]; setUserDict(newD);
                          }} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 ml-1 rounded px-1 transition-colors">×</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        value={newDictKey} onChange={e => setNewDictKey(e.target.value.replace(/\s+/g, ''))} 
                        placeholder="Macro (ej: 1 o sueño)" 
                        className="bg-gray-950 border border-gray-700 rounded p-2 text-white text-xs w-1/3 focus:border-emerald-500 focus:outline-none"
                      />
                      <input 
                        value={newDictValue} onChange={e => setNewDictValue(e.target.value)} 
                        placeholder="Secuencia (ej: ZGNJ _ B)" 
                        className="bg-gray-950 border border-gray-700 rounded p-2 text-white text-xs flex-1 focus:border-emerald-500 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          if(newDictKey && newDictValue) {
                            setUserDict(d => ({...d, [newDictKey.toLowerCase()]: newDictValue}));
                            setNewDictKey(""); setNewDictValue("");
                          }
                        }}
                        className="bg-gray-700 hover:bg-emerald-600 px-4 rounded text-xs font-bold text-white transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">Diccionario semántico disponible (Semana 1 a 4).<br/>Escribe <strong>pop</strong> para invocar la progresión completa I-V-vi-IV automáticamente.</p>
                  <textarea 
                    value={customSequence}
                    onChange={(e) => setCustomSequence(e.target.value)}
                    placeholder="Escribe funciones (ej: Cmaj Amin pop) o notas literales."
                    className="bg-gray-950 border border-gray-700 rounded-xl p-4 text-white font-mono text-sm resize-none focus:border-emerald-500 focus:outline-none h-24"
                  />
                  <button 
                    onClick={loadCustomSong}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    Traducir y Tocar
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-800 mb-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Librería de Secuencias</div>
              {LIBRARY.map(song => (
                <div key={song.id} onClick={() => loadSong(song)} className="p-4 rounded-xl border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 cursor-pointer transition-colors flex justify-between items-center group">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300">{song.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{song.description}</p>
                  </div>
                  <span className="text-cyan-600 group-hover:text-cyan-400 text-xl font-bold">▶</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="z-10 w-full max-w-4xl px-8 mb-8 mt-12 transition-all" style={{ opacity: appMode === 'PLAY' ? 1 : 0, pointerEvents: appMode === 'PLAY' ? 'auto' : 'none' }}>
        {appMode === 'PLAY' && currentSong && (
          <div className="bg-gray-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-3">
                {currentSong.title}
                {isAutoPlaying && <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-1 rounded-md animate-pulse">Auto-Playing...</span>}
              </h2>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                  <label className="text-xs text-gray-400 font-bold">BPM: {bpm}</label>
                  <input 
                    type="range" min="60" max="600" value={bpm} 
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-20 md:w-24 accent-emerald-500"
                  />
                </div>
                <button 
                  onClick={() => {
                    setIsAutoPlaying(!isAutoPlaying);
                    if (songCursor >= currentSong.sequence.length) setSongCursor(0);
                  }} 
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-bold ${
                    isAutoPlaying 
                      ? 'bg-red-900/50 hover:bg-red-800 text-red-300 border-red-700' 
                      : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border-emerald-700'
                  }`}
                >
                  {isAutoPlaying ? "Detener" : "▶ Auto-Play"}
                </button>
                <button onClick={() => { setSongCursor(0); setIsAutoPlaying(false); }} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700">Reiniciar</button>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap items-center justify-center min-h-[4rem]">
              {currentSong.sequence.map((word, index) => {
                const isPast = index < songCursor;
                const isCurrent = index === songCursor;
                const isFuture = index > songCursor;
                const isRest = word === "_";
                
                const leftChars = word.split('').filter(k => KEY_MAP[k.toLowerCase()]?.hand === 'L').join('');
                const rightChars = word.split('').filter(k => KEY_MAP[k.toLowerCase()]?.hand === 'R').join('');
                
                return (
                  <div 
                    key={index}
                    className={`
                      flex flex-col items-center justify-center px-3 h-14 rounded-xl border-2 transition-all duration-300
                      ${isRest ? 'bg-transparent border-dashed px-2 w-8' : ''}
                      ${isCurrent && !isRest ? 'bg-emerald-500/10 border-emerald-400 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
                      ${isCurrent && isRest ? 'border-gray-500 opacity-100 scale-110' : ''}
                      ${isPast ? 'bg-gray-800/50 border-gray-700 opacity-50' : ''}
                      ${isFuture && !isRest ? 'bg-gray-900 border-gray-800' : ''}
                      ${isFuture && isRest ? 'border-gray-800 opacity-50' : ''}
                    `}
                  >
                    {!isRest && (
                      <div className="flex items-center gap-1.5 text-xl">
                        {leftChars && <span className={`font-black tracking-widest ${isCurrent ? 'text-blue-400' : isPast ? 'text-blue-900/50' : 'text-blue-300/80'}`}>{leftChars}</span>}
                        {leftChars && rightChars && <span className="text-gray-600/50 text-sm">|</span>}
                        {rightChars && <span className={`font-black tracking-widest ${isCurrent ? 'text-orange-400' : isPast ? 'text-orange-900/50' : 'text-orange-300/80'}`}>{rightChars}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {songCursor === currentSong.sequence.length && (
                <div className="ml-4 text-emerald-400 font-bold animate-pulse">¡Completado! 🎉</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative p-8 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-3 transition-transform">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3" style={{ marginLeft: `${rowIndex * 1.5}rem` }}>
            {row.map((baseKey) => {
              const keyDef = KEY_MAP[baseKey];
              if (!keyDef) return null;

              const isBaseActive = activeKeys.has(`${baseKey}-false`);
              const isShiftActive = activeKeys.has(`${baseKey}-true`);
              
              const currentWord = (appMode === 'PLAY' && currentSong && currentSong.sequence[songCursor]) ? currentSong.sequence[songCursor] : "";
              const isNextKey = !isAutoPlaying && currentWord !== "_" && (
                currentWord.includes(baseKey) || currentWord.includes(baseKey.toUpperCase())
              );
              
              const isLeft = keyDef.hand === 'L';
              const styles = {
                activeBg: isLeft ? 'bg-blue-500 border-blue-400 shadow-blue-500/50' : 'bg-orange-500 border-orange-400 shadow-orange-500/50',
                shiftText: isLeft ? 'text-blue-500/70' : 'text-orange-500/70',
                nextText: isLeft ? 'text-blue-400' : 'text-orange-400',
                nextGlow: isLeft ? 'shadow-blue-500/30 border-blue-500/50 ring-blue-500/50' : 'shadow-orange-500/30 border-orange-500/50 ring-orange-500/50',
                idleBorder: isLeft ? 'border-blue-900/30' : 'border-orange-900/30',
                sharpNote: isLeft ? 'text-blue-400' : 'text-orange-400'
              };
              
              return (
                <div 
                  key={baseKey}
                  onPointerDown={() => handlePointerDown(baseKey)}
                  onPointerUp={() => handlePointerUp(baseKey)}
                  onPointerLeave={() => handlePointerUp(baseKey)}
                  className={`
                    relative w-[4.5rem] h-20 rounded-xl flex flex-col justify-between items-center p-2 transition-all duration-150 select-none cursor-pointer
                    ${isShiftActive 
                      ? `${styles.activeBg} text-gray-900 scale-95 shadow-lg` 
                      : isBaseActive
                        ? `${styles.activeBg} text-gray-900 scale-95 shadow-lg`
                        : isNextKey
                          ? `bg-gray-800 ${styles.nextText} ${styles.nextGlow} border-b-4 ring-2 animate-pulse`
                          : `bg-gray-800 text-gray-300 shadow-md border-b-4 border-gray-950 hover:bg-gray-700 ${styles.idleBorder}`
                    }
                    border-x border-t
                  `}
                >
                  <div className="w-full flex justify-between items-start">
                    <span className={`text-[9px] font-bold ${isShiftActive ? 'text-gray-900' : styles.shiftText}`}>
                      ⇧ {getNoteName(keyDef.baseMidi + 12)}
                    </span>
                  </div>
                  <span className={`text-2xl font-black ${isBaseActive || isShiftActive ? 'text-gray-900' : isNextKey ? styles.nextText : 'text-gray-200'}`}>
                    {keyDef.label}
                  </span>
                  <div className="w-full flex justify-center">
                    <span className={`text-[10px] font-mono tracking-tighter px-1.5 rounded-sm ${
                      isBaseActive || isShiftActive 
                        ? 'bg-black/20 text-gray-900 font-bold' 
                        : getNoteName(keyDef.baseMidi).includes('#') 
                          ? `bg-black/50 ${styles.sharpNote}` 
                          : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {getNoteName(keyDef.baseMidi)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
