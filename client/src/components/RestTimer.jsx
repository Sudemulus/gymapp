"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const PRESETS = [60, 90, 120];
const DEFAULT_DURATION = 90;

function playBeep(ctx) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.6);
}

const RestTimer = forwardRef(function RestTimer(_props, ref) {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  function start(customDuration) {
    // AudioContext must be created/resumed inside a user-gesture call stack
    // (this click/submit handler) or the browser will silently block playback later.
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass();
      else if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    }

    setRemaining(customDuration ?? duration);
    setRunning(true);
    setJustFinished(false);
  }

  useImperativeHandle(ref, () => ({ start }));

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setJustFinished(true);
          if (audioCtxRef.current) playBeep(audioCtxRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    return () => audioCtxRef.current?.close();
  }, []);

  function handleStop() {
    setRunning(false);
    setRemaining(0);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        justFinished
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-300">Dinlenme Kronometresi</span>
        <div className="flex gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDuration(preset)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                duration === preset
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {preset}s
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`text-3xl font-bold tabular-nums ${
            justFinished ? "text-emerald-400" : "text-slate-100"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => start()}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Başlat
          </button>
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            Durdur
          </button>
        </div>
      </div>

      {justFinished && (
        <p className="mt-2 text-sm font-medium text-emerald-400">
          Süre bitti, sıradaki sete hazırsın.
        </p>
      )}
    </div>
  );
});

export default RestTimer;
