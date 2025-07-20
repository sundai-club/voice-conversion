# Voice Conversion Microphone Selector

A lightweight Electron app for selecting and managing microphones with a clean, native interface.

## Features

- **Microphone Detection**: Automatically detects all available audio input devices
- **Visual Selection**: Click any microphone to select it as the active device
- **Default Selection**: Automatically selects the system default microphone on first run
- **Persistent Settings**: Remembers your microphone selection across app restarts
- **System Tray Integration**: Lives in your system tray for quick access
- **Modern UI**: Clean, native-looking interface with smooth animations

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sundai-club/voice-conversion.git
   cd voice-conversion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Usage

- Click the microphone icon in your system tray to open the microphone list
- Click any microphone in the list to select it as your active device
- Your selection is automatically saved and restored when you restart the app
- Use the refresh button (↻) to reload the microphone list if devices change

## Development

- `npm start` - Start the Electron app
- `npm run dev` - Start in development mode (if available)

## Requirements

- Node.js 14+ 
- Electron-compatible operating system (macOS, Windows, Linux)
- Microphone permissions granted to the application

## License

MIT License