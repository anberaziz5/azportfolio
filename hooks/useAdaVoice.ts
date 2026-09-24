import { useCallback, useEffect, useRef, useState } from "react";

function pickMime(): string {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) || "";
}

function rms(analyser: AnalyserNode, buf: Uint8Array): number {
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buf.length);
}

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const scored = voices.map((v) => {
    const n = `${v.name} ${v.lang}`.toLowerCase();
    let score = 0;
    if (v.lang.toLowerCase().startsWith("en")) score += 6;
    if (
      /female|woman|zira|samantha|victoria|karen|moira|tessa|susan|hazel|aria|jenny|sara|sonia|linda|fiona|veena|catherine|heera|raveena|google uk english female|microsoft jenny|microsoft aria|microsoft ana|microsoft emma/.test(
        n
      )
    ) {
      score += 12;
    }
    if (/neural|natural|premium|enhanced/.test(n)) score += 3;
    if (/male|david|mark|george|daniel|fred|ravi|aaron|guy/.test(n) && !/female/.test(n)) {
      score -= 10;
    }
    return { v, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0] && scored[0].score > 0 ? scored[0].v : voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
}

async function ensureVoices(): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (window.speechSynthesis.getVoices().length > 0) return;
  await new Promise<void>((resolve) => {
    const done = () => resolve();
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 400);
  });
}

function browserSpeak(text: string): Promise<void> {
  return new Promise((resolve) => {
    void (async () => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      await ensureVoices();
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const female = pickFemaleVoice();
      if (female) u.voice = female;
      u.rate = 1.02;
      u.pitch = female && /male/i.test(female.name) ? 1.25 : 1.12;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    })();
  });
}

export function useAdaVoice() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [level, setLevel] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const vadCleanupRef = useRef<(() => void) | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsChain = useRef(Promise.resolve());
  const groqTtsDisabled = useRef(false);
  const cancelled = useRef(false);
  const keepAlive = useRef(false);
  const levelTimer = useRef<number | null>(null);

  const stopTracks = useCallback(() => {
    vadCleanupRef.current?.();
    vadCleanupRef.current = null;
    if (levelTimer.current) {
      window.clearInterval(levelTimer.current);
      levelTimer.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLevel(0);
  }, []);

  const stopSpeaking = useCallback(() => {
    cancelled.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return Promise.resolve();
    cancelled.current = false;
    const job = ttsChain.current.then(async () => {
      if (cancelled.current) return;
      setSpeaking(true);
      try {
        if (!groqTtsDisabled.current) {
          const res = await fetch("/api/chat/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: clean }),
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            await new Promise<void>((resolve) => {
              const audio = new Audio(url);
              audioRef.current = audio;
              audio.onended = () => {
                URL.revokeObjectURL(url);
                resolve();
              };
              audio.onerror = () => {
                URL.revokeObjectURL(url);
                resolve();
              };
              audio.play().catch(() => resolve());
            });
            return;
          }
          const err = (await res.json().catch(() => ({}))) as { code?: string };
          if (err.code === "tts_terms") groqTtsDisabled.current = true;
        }
        await browserSpeak(clean);
      } catch {
        await browserSpeak(clean);
      } finally {
        setSpeaking(false);
      }
    });
    ttsChain.current = job.catch(() => undefined);
    return job;
  }, []);

  const flushSpeech = useCallback(() => ttsChain.current, []);

  const onAutoStopRef = useRef<((blob: Blob | null) => void) | null>(null);

  const stopListening = useCallback(async (): Promise<Blob | null> => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    setListening(false);
    vadCleanupRef.current?.();
    vadCleanupRef.current = null;
    if (!rec || rec.state === "inactive") {
      if (!keepAlive.current) stopTracks();
      return chunksRef.current.length ? new Blob(chunksRef.current, { type: rec?.mimeType || "audio/webm" }) : null;
    }
    const blob = await new Promise<Blob | null>((resolve) => {
      rec.onstop = () => {
        const type = rec.mimeType || "audio/webm";
        resolve(chunksRef.current.length ? new Blob(chunksRef.current, { type }) : null);
      };
      try {
        rec.stop();
      } catch {
        resolve(null);
      }
    });
    if (!keepAlive.current) stopTracks();
    return blob;
  }, [stopTracks]);

  const startListening = useCallback(async (onAutoStop?: (blob: Blob | null) => void) => {
    stopSpeaking();
    onAutoStopRef.current = onAutoStop ?? null;
    keepAlive.current = true;
    if (!streamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
      streamRef.current = stream;
    }
    const stream = streamRef.current;
    chunksRef.current = [];
    const mime = pickMime();
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorderRef.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.start(180);
    setListening(true);

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    let heard = false;
    let silentMs = 0;
    const started = Date.now();
    let stopping = false;
    if (levelTimer.current) window.clearInterval(levelTimer.current);
    levelTimer.current = window.setInterval(() => {
      const current = rms(analyser, buf);
      setLevel(current);
      if (stopping) return;
      if (current > 0.038) {
        heard = true;
        silentMs = 0;
      } else if (heard) {
        silentMs += 70;
        if (silentMs >= 550 && Date.now() - started > 420) {
          stopping = true;
          void stopListening().then((blob) => onAutoStopRef.current?.(blob));
        }
      }
      if (Date.now() - started > 14000) {
        stopping = true;
        void stopListening().then((blob) => onAutoStopRef.current?.(blob));
      }
    }, 70);
    vadCleanupRef.current = () => {
      if (levelTimer.current) {
        window.clearInterval(levelTimer.current);
        levelTimer.current = null;
      }
      void ctx.close();
    };
  }, [stopListening, stopSpeaking]);

  const endSession = useCallback(() => {
    keepAlive.current = false;
    stopSpeaking();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try { recorderRef.current.stop(); } catch { /* ignore */ }
    }
    recorderRef.current = null;
    setListening(false);
    stopTracks();
  }, [stopSpeaking, stopTracks]);

  const transcribe = useCallback(async (blob: Blob): Promise<string> => {
    const ext = blob.type.includes("mp4") ? "m4a" : "webm";
    const form = new FormData();
    form.append("file", blob, `clip.${ext}`);
    const res = await fetch("/api/chat/transcribe", { method: "POST", body: form });
    const data = (await res.json()) as { text?: string; error?: string };
    if (!res.ok || !data.text) throw new Error(data.error || "Could not transcribe");
    return data.text.trim();
  }, []);

  useEffect(() => {
    void ensureVoices();
    return () => {
      stopSpeaking();
      stopTracks();
      recorderRef.current?.stop();
    };
  }, [stopSpeaking, stopTracks]);

  return {
    listening,
    speaking,
    level,
    startListening,
    stopListening,
    transcribe,
    speak,
    flushSpeech,
    stopSpeaking,
    endSession,
  };
}
