export type VoiceState = 'idle' | 'recording' | 'processing' | 'completed' | 'error';
export interface VoiceTranscriptionService { transcribe(uri: string): Promise<string>; }
export const VoiceService: VoiceTranscriptionService = { async transcribe() { throw new Error('Voice transcription is not connected yet.'); } };
