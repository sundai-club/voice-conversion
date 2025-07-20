const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

class ElevenLabsService {
  constructor() {
    this.client = null;
    this.currentStream = null;
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    this.client = new ElevenLabsClient({
      apiKey: apiKey,
    });
  }

  async convertTextToSpeech(text, onChunk) {
    if (!this.client) {
      throw new Error('ElevenLabs client not initialized');
    }

    try {
      console.log(`Converting text to speech: "${text}"`);

      // Convert text to speech and get the audio as a readable stream
      const response = await this.client.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        },
        output_format: 'mp3_44100_128'
      });

      // Check if response is a stream
      if (response && typeof response.pipe === 'function') {
        // It's a stream
        this.currentStream = response;
        
        response.on('data', (chunk) => {
          try {
            if (onChunk && chunk && chunk.length > 0) {
              onChunk(chunk);
            }
          } catch (error) {
            console.error('Error processing audio chunk:', error);
          }
        });

        response.on('end', () => {
          console.log('TTS stream ended');
          this.currentStream = null;
        });

        response.on('error', (error) => {
          console.error('TTS stream error:', error);
          this.currentStream = null;
          // Don't propagate the error to prevent crashes
        });
      } else if (response && response.audio) {
        // It might be a direct response with audio data
        console.log('Received direct audio response');
        if (onChunk) {
          onChunk(Buffer.from(response.audio));
        }
      } else {
        // Handle as a blob/buffer
        console.log('Handling response as buffer');
        const chunks = [];
        
        // Collect all chunks
        for await (const chunk of response) {
          try {
            if (chunk && chunk.length > 0) {
              chunks.push(chunk);
              if (onChunk) {
                onChunk(chunk);
              }
            }
          } catch (error) {
            console.error('Error processing async chunk:', error);
            break; // Stop processing on error
          }
        }
      }

      return response;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  }

  stop() {
    if (this.currentStream) {
      this.currentStream.destroy();
      this.currentStream = null;
    }
  }
}

module.exports = ElevenLabsService;