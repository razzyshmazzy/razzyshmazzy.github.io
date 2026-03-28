'use client';

import { useEffect, useCallback } from 'react';
import { runBF, BF_CODE, BF_SOURCE_DISPLAY } from '@/lib/bf';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BFModal({ open, onClose }: Props) {
  const output = runBF(BF_CODE);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!open) return null;

  return (
    <div
      id="bf-modal"
      className="show"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'bf-modal') onClose();
      }}
    >
      <div id="bf-box">
        <h2>brainf*ck Easter Egg</h2>
        <pre id="bf-code-display">{BF_SOURCE_DISPLAY}</pre>
        <div id="bf-output-modal">{output}</div>
        <button id="bf-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
