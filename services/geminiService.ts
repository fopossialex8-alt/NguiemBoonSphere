
import { GoogleGenAI, Modality, Type, LiveServerMessage } from "@google/genai";

let audioContext: AudioContext | null = null;

async function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  return audioContext;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playCameroonianAudio = async (textFr: string, textNgiem?: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prompt minimaliste pour réduire le temps de calcul et de latence
    const prompt = `Dit vite: "A-hoo! ${textFr}. ${textNgiem || ''}." Voix royale de sage.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const ctx = await getAudioContext();
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Audio engine error:", error);
    return false;
  }
};

export const fetchLatestSanitaryNews = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Actualités PPA Cameroun résumé court.",
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: [] };
  } catch (e) {
    return { text: "Le village veille. Vigilance habituelle requise.", sources: [] };
  }
};

export const findNearbyVetServices = async (lat?: number, lng?: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Services vétérinaires Cameroun ouest.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: (lat !== undefined && lng !== undefined) ? { latitude: lat, longitude: lng } : undefined
          }
        }
      },
    });
    return { 
      text: response.text || "Consultez la carte des sages.", 
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (e) {
    return { text: "Contactez les délégués régionaux.", links: [] };
  }
};

export const askCulturalContext = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Context error:", error);
    throw error;
  }
};

export const generateTermImage = async (term: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional realistic veterinary scene in Cameroon for: ${term}. Highly detailed.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

/**
 * Generates a qualification quiz for a specific role using Gemini 3 Flash and structured JSON.
 */
export const generateQuiz = async (role: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Génère un quiz de qualification de 3 questions pour le rôle de ${role} dans le contexte de la lutte contre la Peste Porcine Africaine (PPA) au Cameroun, en utilisant la culture Ngiembɔɔn.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.NUMBER }
                },
                required: ["id", "question", "options", "correctIndex"]
              }
            }
          },
          required: ["questions"]
        }
      },
    });
    const jsonStr = response.text || '{"questions": []}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return { questions: [] };
  }
};

export const connectToLiveGuardian = async (options: {
  onTranscript: (text: string, isUser: boolean) => void;
  onInterrupted: () => void;
  onAudioStateChange: (isTalking: boolean) => void;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  let nextStartTime = 0;
  const sources = new Set<AudioBufferSourceNode>();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const l = inputData.length;
          const int16 = new Int16Array(l);
          for (let i = 0; i < l; i++) {
            int16[i] = inputData[i] * 32768;
          }
          const pcmData = new Uint8Array(int16.buffer);
          sessionPromise.then(session => {
            session.sendRealtimeInput({
              media: {
                data: encode(pcmData),
                mimeType: 'audio/pcm;rate=16000'
              }
            });
          });
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        if (message.serverContent?.outputTranscription) {
          options.onTranscript(message.serverContent.outputTranscription.text, false);
        } else if (message.serverContent?.inputTranscription) {
          options.onTranscript(message.serverContent.inputTranscription.text, true);
        }
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
          options.onAudioStateChange(true);
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContext.destination);
          source.addEventListener('ended', () => {
            sources.delete(source);
            if (sources.size === 0) options.onAudioStateChange(false);
          });
          source.start(nextStartTime);
          nextStartTime += audioBuffer.duration;
          sources.add(source);
        }
        if (message.serverContent?.interrupted) {
          for (const s of sources) s.stop();
          sources.clear();
          nextStartTime = 0;
          options.onInterrupted();
        }
      },
      onerror: (e) => console.error("Live Error:", e),
      onclose: () => {
        stream.getTracks().forEach(t => t.stop());
        inputAudioContext.close();
        outputAudioContext.close();
      }
    },
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction: "Tu es Nshʉ̀, le Sage Notable Ngiembɔɔn. Tu guides les éleveurs contre la PPA avec profondeur et respect."
    }
  });
  return sessionPromise;
};
