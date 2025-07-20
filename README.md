# Voice Conversion Microphone Processor

A powerful Electron app that creates a virtual microphone with real-time audio processing capabilities.

## Features

- **Microphone Detection**: Automatically detects all available audio input devices
- **Visual Selection**: Click any microphone to select it as the active device
- **Virtual Microphone**: Creates a virtual audio device that processes the selected microphone's audio stream
- **Real-time Processing**: Audio processing pipeline for voice conversion and effects
- **Default Selection**: Automatically selects the system default microphone on first run
- **Persistent Settings**: Remembers your microphone selection across app restarts
- **System Tray Integration**: Lives in your system tray for quick access
- **Modern UI**: Clean, native-looking interface with smooth animations and virtual mic controls

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sundai-club/voice-conversion.git
   cd voice-conversion
   ```

2. Install dependencies:
   ```bash
   brew install blackhole-2ch # reboot after this one!
   npm install
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Usage

- Click the microphone icon in your system tray to open the microphone list
- Click any microphone in the list to select it as your active device
- Click "Start Virtual Microphone" to begin processing audio from the selected device
- The virtual microphone will appear as a new audio input device in your system
- Your selection is automatically saved and restored when you restart the app
- Use the refresh button (↻) to reload the microphone list if devices change

## Virtual Microphone

The app creates a virtual audio pipeline that:
- Captures audio from your selected physical microphone
- Processes the audio stream in real-time (voice conversion, effects, etc.)
- Routes the processed audio to a virtual audio device
- Makes the processed audio available as a system-wide microphone input

### Virtual Audio Device Setup

To use this as a system-wide virtual microphone, you need to install a virtual audio driver:

**macOS:**
- **BlackHole** (Free): Download from [GitHub](https://github.com/ExistentialAudio/BlackHole)
- **Loopback** (Paid): Professional audio routing tool

**Windows:**
- **VB-Audio VoiceMeeter** (Free): Virtual audio mixer
- **Virtual Audio Cable** (Free): Simple virtual audio routing

**Linux:**
- **PulseAudio**: Built-in virtual sink support
- **JACK**: Professional audio routing system

See `VIRTUAL_AUDIO_SETUP.md` for detailed installation instructions.

## Development

- `npm start` - Start the Electron app
- `npm run dev` - Start in development mode (if available)

## Requirements

- Node.js 14+ 
- Electron-compatible operating system (macOS, Windows, Linux)
- Microphone permissions granted to the application

## License

MIT License