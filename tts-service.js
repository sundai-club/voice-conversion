const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

class TTSService {
  constructor() {
    this.tempDir = path.join(__dirname, 'temp');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async createAudioFileFromText(text, voiceId = 'JBFqnCBsd6RMkjVDRZzb') {
    return new Promise(async (resolve, reject) => {
      try {
        // Use default voice if voiceId is null or empty
        const actualVoiceId = voiceId || 'JBFqnCBsd6RMkjVDRZzb';
        
        console.log('Generating audio for text:', text.substring(0, 100) + '...');
        console.log('Using voice ID:', actualVoiceId);
        
        const audio = await elevenlabs.textToSpeech.convert(actualVoiceId, {
          modelId: 'eleven_multilingual_v2',
          text,
          outputFormat: 'mp3_44100_128',
          voiceSettings: {
            stability: 0,
            similarityBoost: 0,
            useSpeakerBoost: true,
            speed: 1.0,
          },
        });

        const fileName = `${uuid()}.mp3`;
        const filePath = path.join(this.tempDir, fileName);
        
        // Handle ReadableStream from ElevenLabs API
        if (audio && typeof audio === 'object' && typeof audio.getReader === 'function') {
          console.log('Converting ReadableStream to file...');
          
          try {
            // Convert ReadableStream to Buffer
            const reader = audio.getReader();
            const chunks = [];
            let totalBytes = 0;
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunks.push(new Uint8Array(value));
                totalBytes += value.byteLength;
              }
            }
            
            if (chunks.length === 0) {
              console.error('No audio data received from TTS service');
              reject(new Error('No audio data received'));
              return;
            }
            
            // Combine all chunks into a single buffer
            const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
            const audioBuffer = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of chunks) {
              audioBuffer.set(chunk, offset);
              offset += chunk.length;
            }
            
            // Write buffer to file
            fs.writeFile(filePath, Buffer.from(audioBuffer), (err) => {
              if (err) {
                console.error('Error writing audio file:', err);
                reject(err);
              } else {
                console.log('Audio file created:', filePath, `(${totalBytes} bytes)`);
                resolve(filePath);
              }
            });
            
          } catch (error) {
            console.error('Error processing ReadableStream:', error);
            reject(error);
          }
          
          
        } else {
          // If it's a buffer or array buffer, write directly
          let audioBuffer;
          
          if (audio instanceof ArrayBuffer) {
            audioBuffer = Buffer.from(audio);
          } else if (Buffer.isBuffer(audio)) {
            audioBuffer = audio;
          } else {
            // Try to convert to buffer
            audioBuffer = Buffer.from(audio);
          }
          
          fs.writeFile(filePath, audioBuffer, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('Audio file created:', filePath);
              resolve(filePath);
            }
          });
        }
        
      } catch (error) {
        console.error('Error generating audio:', error);
        reject(error);
      }
    });
  }

  async playToVirtualMic(audioFilePath) {
    return new Promise((resolve, reject) => {
      console.log('Audio file ready for virtual microphone playback:', audioFilePath);
      
      // Note: The actual playback to virtual microphone will be handled by the renderer process
      // This service just generates the audio file and returns the path
      // The renderer will use Web Audio API to play it through the virtual microphone setup
      
      console.log('Audio file generated successfully, ready for virtual mic streaming');
      
      // Clean up temp file after a delay to allow for playback
      setTimeout(() => {
        fs.unlink(audioFilePath, (err) => {
          if (err) console.warn('Failed to clean up temp file:', err);
        });
      }, 30000); // 30 seconds should be enough for most audio files
      
      resolve(audioFilePath);
    });
  }

  async generateAndPlayAudio(text, voiceId = null) {
    try {
      const audioFilePath = await this.createAudioFileFromText(text, voiceId);
      const readyFilePath = await this.playToVirtualMic(audioFilePath);
      console.log('Audio generation completed successfully');
      return readyFilePath;
    } catch (error) {
      console.error('Error in generateAndPlayAudio:', error);
      throw error;
    }
  }

  cleanup() {
    // Clean up temp directory
    if (fs.existsSync(this.tempDir)) {
      const files = fs.readdirSync(this.tempDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.tempDir, file));
      });
      fs.rmdirSync(this.tempDir);
    }
  }
}

module.exports = TTSService;