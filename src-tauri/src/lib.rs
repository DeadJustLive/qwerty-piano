use std::sync::Mutex;
use std::collections::HashMap;
use std::fs::File;
use std::io::{Read, Cursor};
use rodio::{Decoder, Player, DeviceSinkBuilder, mixer::Mixer};

struct AudioState {
    mixer: Mixer,
    active_players: Mutex<HashMap<u32, Player>>,
    sample_data: Vec<u8>,
}

fn start_audio_engine() -> Mixer {
    let (tx, rx) = std::sync::mpsc::channel();
    
    std::thread::spawn(move || {
        let handle = DeviceSinkBuilder::open_default_sink().expect("No default audio device");
        tx.send(handle.mixer().clone()).unwrap();
        
        loop {
            std::thread::sleep(std::time::Duration::from_secs(10));
        }
    });
    
    rx.recv().unwrap()
}

#[tauri::command]
fn note_on(frequency: f32, state: tauri::State<AudioState>) {
    println!("Recibido note_on: {} Hz", frequency);
    let freq_key = (frequency * 1000.0) as u32;
    let mut players = state.active_players.lock().unwrap();
    
    if let Some(existing_player) = players.get(&freq_key) {
        existing_player.stop();
    }
    
    let cursor = Cursor::new(state.sample_data.clone());
    
    if let Ok(source) = Decoder::new(cursor) {
        let player = Player::connect_new(&state.mixer);
        
        let ratio = frequency / 261.63;
        player.set_speed(ratio);
        player.append(source);
        
        players.insert(freq_key, player);
    } else {
        eprintln!("No se pudo decodificar el buffer FLAC.");
    }
}

#[tauri::command]
fn note_off(frequency: f32, state: tauri::State<AudioState>) {
    let freq_key = (frequency * 1000.0) as u32;
    let mut players = state.active_players.lock().unwrap();
    
    if let Some(player) = players.remove(&freq_key) {
        std::thread::spawn(move || {
            for i in (0..=50).rev() {
                let vol = (i as f32) / 50.0;
                player.set_volume(vol * vol); 
                std::thread::sleep(std::time::Duration::from_millis(10));
            }
            player.stop();
        });
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mixer = start_audio_engine();
    
    let sample_path = "/home/nodead/Documentos/samplesPiano/SalamanderGrandPiano/Samples/C4v10.flac";
    let mut sample_data = Vec::new();
    if let Ok(mut file) = File::open(sample_path) {
        file.read_to_end(&mut sample_data).expect("No se pudo leer el archivo FLAC");
        println!("Sample cargado en memoria RAM ({} bytes)", sample_data.len());
    } else {
        eprintln!("CRÍTICO: No se pudo encontrar el sample en {}", sample_path);
    }

    let audio_state = AudioState {
        mixer,
        active_players: Mutex::new(HashMap::new()),
        sample_data,
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(audio_state)
        .invoke_handler(tauri::generate_handler![note_on, note_off])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


