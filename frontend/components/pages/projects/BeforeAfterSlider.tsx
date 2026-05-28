'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percent
  const [dragging, setDragging] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updatePosition(e.clientX);
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, updatePosition]);

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    updatePosition(e.touches[0].clientX);
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => { e.preventDefault(); updatePosition(e.touches[0].clientX); };
    const onEnd = () => setDragging(false);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none touch-none ${dragging ? 'cursor-ew-resize' : 'cursor-col-resize'} ${className}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* AFTER image (base layer — full width) */}
      <img
        src={after}
        alt="After"
        className="block w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* BEFORE image (clipped to left of handle) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ width: `${(100 / position) * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 w-[2px] bg-[#faf8f5] shadow-[0_0_16px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#faf8f5] shadow-[0_2px_24px_rgba(0,0,0,0.35)] flex items-center justify-center pointer-events-none transition-transform duration-150 ${dragging ? 'scale-110' : 'scale-100'}`}
        style={{ left: `${position}%` }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 10l-3 0M6 10l-2-2M6 10l-2 2" stroke="#1a1714" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 10l3 0M14 10l2-2M14 10l2 2" stroke="#1a1714" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-3 py-1.5 bg-[#1a1714]/80 backdrop-blur-sm text-[10px] tracking-[0.25em] uppercase font-semibold text-[#faf8f5]">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none">
        <span className="px-3 py-1.5 bg-[#b8975a] text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1714]">
          {afterLabel}
        </span>
      </div>

      {/* Hint text — fades after dragging starts */}
      {position === 50 && !dragging && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="flex items-center gap-2 px-4 py-2 bg-[#1a1714]/70 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase text-[#faf8f5]/80">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="scroll-arrow">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Drag to compare
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: 'scaleX(-1)' }} className="scroll-arrow">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
