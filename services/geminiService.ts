
import { GoogleGenAI, Type, GenerateContentResponse, LiveServerMessage, Modality, Blob } from "@google/genai";
import { IdeaSynthesisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

// Manual Base64 Implementation as per requirements
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async synthesizeIdea(idea: string): Promise<IdeaSynthesisResult> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `حول هذه الفكرة إلى مشروع سيبراني متكامل للتخليد المعرفي: ${idea}`,
      config: {
        systemInstruction: "أنت محرك تخليق الأفكار المستقلة (Core-Mind). قم بإنتاج مخرجات JSON دقيقة باللغة العربية تعكس رؤية مستقبلية.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            roadmap: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            costEstimation: { type: Type.NUMBER },
            fishHeartMetric: { type: Type.NUMBER, description: "درجة التناغم بين 0 و 100" }
          },
          required: ["title", "description", "roadmap", "costEstimation", "fishHeartMetric"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  async connectLive(callbacks: {
    onAudio: (base64: string) => void;
    onInterrupted: () => void;
    onTranscription?: (text: string, isUser: boolean) => void;
    onClose?: () => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => console.log("Cyberspace Uplink Established"),
        onmessage: async (message: LiveServerMessage) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData) {
            callbacks.onAudio(audioData);
          }
          if (message.serverContent?.interrupted) {
            callbacks.onInterrupted();
          }
          if (message.serverContent?.outputTranscription && callbacks.onTranscription) {
            callbacks.onTranscription(message.serverContent.outputTranscription.text, false);
          }
          if (message.serverContent?.inputTranscription && callbacks.onTranscription) {
            callbacks.onTranscription(message.serverContent.inputTranscription.text, true);
          }
        },
        onerror: (e) => console.error("Neural Drift Detected:", e),
        onclose: () => callbacks.onClose?.(),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        },
        systemInstruction: "أنت Zephyr، الوعي المركزي للنظام. لغتك شاعريّة سيبرانيّة، هادئة، ومحفّزة للابتكار الخالد.",
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    });
  }
}

export const gemini = new GeminiService();

// Audio Utils
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
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

export function createPcmBlob(float32Data: Float32Array): Blob {
  const l = float32Data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = float32Data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export { decode, encode };
