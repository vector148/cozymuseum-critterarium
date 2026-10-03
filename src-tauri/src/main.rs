#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    let app = tauri::Builder::default()
        .setup(|app| {
            let executable_dir = std::env::current_exe()?
                .parent()
                .ok_or("Desktop executable has no parent directory")?
                .to_path_buf();
            let mut command = Command::new(executable_dir.join("node.exe"));
            command
                .arg(executable_dir.join("scripts").join("desktop-server.mjs"))
                .current_dir(&executable_dir)
                .stdout(Stdio::piped())
                .stderr(Stdio::null());
            #[cfg(target_os = "windows")]
            {
                use std::os::windows::process::CommandExt;
                command.creation_flags(0x08000000);
            }
            let mut child = command.spawn()?;
            let stdout = child.stdout.take().ok_or("Desktop server has no output pipe")?;
            let window = app.get_webview_window("critterarium")
                .ok_or("Critterarium window is missing")?;
            std::thread::spawn(move || {
                for line in BufReader::new(stdout).lines().flatten() {
                    if let Some(address) = line.strip_prefix("CRITTERARIUM_READY ") {
                        if let Ok(url) = tauri::Url::parse(address.trim()) {
                            if url.host_str() == Some("127.0.0.1") {
                                let _ = window.navigate(url);
                                let _ = window.show();
                            }
                        }
                        break;
                    }
                }
            });
            app.manage(Mutex::new(child));
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("Could not start CozyMuseum Critterarium");

    app.run(|app_handle, event| {
        if let tauri::RunEvent::Exit = event {
            if let Some(state) = app_handle.try_state::<Mutex<Child>>() {
                if let Ok(mut child) = state.lock() {
                    let _ = child.kill();
                    let _ = child.wait();
                }
            }
        }
    });
}
