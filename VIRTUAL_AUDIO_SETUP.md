# Virtual Audio Device Setup

To use this app as a system-wide virtual microphone, you need to install a virtual audio driver that creates system-level audio devices.

## macOS Setup

### Option 1: BlackHole (Recommended - Free)
1. Download BlackHole from: https://github.com/ExistentialAudio/BlackHole or `brew install blackhole-2ch`
2. Install the .pkg file
3. BlackHole will appear as an audio device in System Preferences > Sound

### Option 2: Loopback (Paid)
1. Download Loopback from Rogue Amoeba
2. Create a virtual audio device
3. Configure it to receive audio from this app

## Windows Setup

### Option 1: VB-Audio VoiceMeeter (Free)
1. Download from: https://vb-audio.com/Voicemeeter/
2. Install VoiceMeeter Banana or Potato
3. Configure virtual audio cables

### Option 2: Virtual Audio Cable (Free)
1. Download from: https://vb-audio.com/Cable/
2. Install Virtual Audio Cable
3. CABLE Input will appear as a recording device

## Linux Setup

### Option 1: PulseAudio Virtual Sink
```bash
# Create virtual sink
pactl load-module module-null-sink sink_name=virtual_mic sink_properties=device.description="Virtual_Microphone"

# Create loopback from virtual sink to default source
pactl load-module module-loopback source=virtual_mic.monitor sink=@DEFAULT_SINK@
```

### Option 2: JACK Audio
1. Install JACK Audio Connection Kit
2. Create virtual audio devices
3. Route audio through JACK connections

## How to Use

1. Install one of the virtual audio drivers above
2. Start this Voice Conversion app
3. Select your physical microphone
4. Click "Start Virtual Microphone"
5. The app will process audio and output to the configured virtual device
6. Other applications can then use the virtual device as an audio input

## Supported Virtual Audio Drivers

- **BlackHole** (macOS) - Creates virtual audio devices
- **Loopback** (macOS) - Professional virtual audio routing
- **VoiceMeeter** (Windows) - Virtual audio mixer with multiple inputs/outputs
- **Virtual Audio Cable** (Windows) - Simple virtual audio cable
- **PulseAudio** (Linux) - Built-in virtual audio support
- **JACK** (Linux) - Professional audio routing system

## Integration Notes

The app automatically detects available virtual audio devices and can route processed audio to them. Make sure your virtual audio driver is installed and configured before starting the virtual microphone feature.