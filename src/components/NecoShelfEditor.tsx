'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BASELINE_SHELVES,
  SHELVES_CHANGED_EVENT,
  SHELVES_STORAGE_KEY,
  snapShelfToEdges,
  type Shelf,
} from '@/lib/shelves';

const MIN_WIDTH = 4;

export default function NecoShelfEditor() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [draft, setDraft] = useState<Shelf | null>(null);
  const [copied, setCopied] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const draftRef = useRef<Shelf | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHELVES_STORAGE_KEY);
      if (raw === null) {
        setShelves(BASELINE_SHELVES);
      } else {
        setShelves(JSON.parse(raw));
      }
    } catch {
      setShelves(BASELINE_SHELVES);
    }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(SHELVES_STORAGE_KEY, JSON.stringify(shelves));
    } catch {}
    window.dispatchEvent(
      new CustomEvent<Shelf[]>(SHELVES_CHANGED_EVENT, { detail: shelves })
    );
  }, [shelves]);

  useEffect(() => {
    if (!editing) return;

    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-neco-toolbar]')) return;
      e.preventDefault();
      const pageY = e.clientY + window.scrollY;
      dragStartRef.current = { x: e.clientX, y: pageY };
      const next = { y: pageY, x1: e.clientX, x2: e.clientX };
      draftRef.current = next;
      setDraft(next);
    };

    const onMove = (e: MouseEvent) => {
      const start = dragStartRef.current;
      if (!start) return;
      const next: Shelf = {
        y: start.y,
        x1: Math.min(start.x, e.clientX),
        x2: Math.max(start.x, e.clientX),
      };
      draftRef.current = next;
      setDraft(next);
    };

    const onUp = () => {
      dragStartRef.current = null;
      const d = draftRef.current;
      draftRef.current = null;
      setDraft(null);
      if (d && d.x2 - d.x1 >= MIN_WIDTH) {
        const snapped = snapShelfToEdges(
          {
            y: Math.round(d.y),
            x1: Math.round(d.x1),
            x2: Math.round(d.x2),
          },
          window.innerWidth
        );
        setShelves((prev) => [...prev, snapped]);
      }
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [editing]);

  const copyToClipboard = useCallback(() => {
    const json = JSON.stringify(shelves, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [shelves]);

  const removeShelf = useCallback((index: number) => {
    setShelves((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    if (confirm('Clear all shelves?')) setShelves([]);
  }, []);

  const resetToBaseline = useCallback(() => {
    if (confirm('Discard current shelves and restore the saved baseline?')) {
      setShelves(BASELINE_SHELVES);
    }
  }, []);

  const showLines = open || editing;

  return (
    <>
      {showLines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            pointerEvents: 'none',
            zIndex: 9000,
          }}
        >
          {shelves.map((s, i) => (
            <ShelfLine key={i} shelf={s} />
          ))}
          {draft && <ShelfLine shelf={draft} draft />}
        </div>
      )}

      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            cursor: 'crosshair',
            zIndex: 9998,
          }}
        />
      )}

      <div
        data-neco-toolbar
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 10000,
          background: 'rgba(15, 15, 15, 0.95)',
          border: '1px solid #333',
          borderRadius: 8,
          color: '#d0d0d0',
          fontFamily: 'monospace',
          fontSize: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          userSelect: 'none',
        }}
      >
        {!open ? (
          <button onClick={() => setOpen(true)} style={btnStyle}>
            shelves ({shelves.length})
          </button>
        ) : (
          <div style={{ padding: 12, minWidth: 280, maxWidth: 360 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <strong>Neco shelves</strong>
              <button
                onClick={() => {
                  setOpen(false);
                  setEditing(false);
                }}
                style={iconBtnStyle}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button
                onClick={() => setEditing((e) => !e)}
                style={{
                  ...btnStyle,
                  flex: 1,
                  background: editing ? '#ff3366' : '#222',
                  color: editing ? '#000' : '#d0d0d0',
                  borderColor: editing ? '#ff3366' : '#333',
                }}
              >
                {editing ? 'Done' : 'Click & drag to add'}
              </button>
              <button
                onClick={copyToClipboard}
                style={btnStyle}
                disabled={!shelves.length}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {shelves.length === 0 ? (
              <div
                style={{
                  opacity: 0.6,
                  fontStyle: 'italic',
                  padding: '8px 0',
                }}
              >
                No shelves yet. Enable editing and drag horizontally to draw a line.
              </div>
            ) : (
              <div
                style={{
                  maxHeight: 240,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {shelves.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 6px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 4,
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      y={s.y} · x=[{s.x1}, {s.x2}] · w={s.x2 - s.x1}
                    </span>
                    <button
                      onClick={() => removeShelf(i)}
                      style={iconBtnStyle}
                      aria-label="Delete"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button
                onClick={resetToBaseline}
                style={{ ...btnStyle, flex: 1 }}
                title="Restore the shelves saved in src/lib/shelves.ts"
              >
                Reset to saved
              </button>
              <button
                onClick={clearAll}
                style={{ ...btnStyle, flex: 1, color: '#ff6b6b' }}
                disabled={!shelves.length}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#222',
  border: '1px solid #333',
  color: '#d0d0d0',
  padding: '6px 10px',
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: 12,
};

const iconBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#888',
  cursor: 'pointer',
  fontSize: 16,
  padding: '0 4px',
  lineHeight: 1,
};

function ShelfLine({ shelf, draft = false }: { shelf: Shelf; draft?: boolean }) {
  const color = draft ? '#ffffff' : '#ff3366';
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: shelf.y - 1,
          left: shelf.x1,
          width: shelf.x2 - shelf.x1,
          height: 2,
          background: color,
          boxShadow: `0 0 6px ${color}`,
          opacity: draft ? 0.7 : 0.9,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: shelf.y - 4,
          left: shelf.x1 - 4,
          width: 8,
          height: 8,
          background: color,
          borderRadius: '50%',
          boxShadow: `0 0 4px ${color}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: shelf.y - 4,
          left: shelf.x2 - 4,
          width: 8,
          height: 8,
          background: color,
          borderRadius: '50%',
          boxShadow: `0 0 4px ${color}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: shelf.y - 24,
          left: shelf.x1,
          fontSize: 10,
          color: '#fff',
          background: 'rgba(0,0,0,0.85)',
          padding: '2px 6px',
          borderRadius: 3,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        y={Math.round(shelf.y)} · x=[{Math.round(shelf.x1)}, {Math.round(shelf.x2)}]
      </div>
    </>
  );
}
