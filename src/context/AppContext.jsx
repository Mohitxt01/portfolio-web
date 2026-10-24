import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { deviceTier, prefersReducedMotion, onReducedMotionChange, hasFinePointer } from '../lib/env.js';
import { setAudioEnabled, sfx } from '../lib/audio.js';

const AppContext = createContext(null);

const STORE_KEY = 'mt.prefs.v1';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

function savePrefs(p) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(p));
  } catch {
    /* private mode — preferences just won't persist */
  }
}

export function AppProvider({ children }) {
  const stored = useRef(loadPrefs()).current;

  // Boot intro runs once per tab, not on every soft navigation.
  const [booted, setBooted] = useState(() => {
    if (prefersReducedMotion()) return true;
    try {
      return sessionStorage.getItem('mt.booted') === '1';
    } catch {
      return false;
    }
  });

  const [sound, setSound] = useState(() => stored.sound === true);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [tier, setTier] = useState(deviceTier);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fine = useMemo(hasFinePointer, []);

  /* Honour a mid-session change to the OS motion setting. */
  useEffect(
    () =>
      onReducedMotionChange((on) => {
        setReduced(on);
        setTier(deviceTier());
      }),
    []
  );

  useEffect(() => {
    setAudioEnabled(sound);
    savePrefs({ ...stored, sound });
  }, [sound, stored]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced', reduced);
    document.documentElement.dataset.tier = tier;
  }, [reduced, tier]);

  const finishBoot = useCallback(() => {
    setBooted(true);
    try {
      sessionStorage.setItem('mt.booted', '1');
    } catch {
      /* non-fatal */
    }
  }, []);

  /* Toasts auto-dismiss; a ref guards against overlapping timers. */
  const toastTimer = useRef(null);
  const notify = useCallback((message, kind = 'info') => {
    clearTimeout(toastTimer.current);
    setToast({ message, kind, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const play = useCallback(
    (name) => {
      if (!sound) return;
      sfx[name]?.();
    },
    [sound]
  );

  const value = useMemo(
    () => ({
      booted,
      finishBoot,
      sound,
      setSound,
      toggleSound: () => setSound((s) => !s),
      reduced,
      setReduced,
      toggleReduced: () => setReduced((r) => !r),
      tier,
      fine,
      paletteOpen,
      setPaletteOpen,
      toast,
      notify,
      play,
    }),
    [booted, finishBoot, sound, reduced, tier, fine, paletteOpen, toast, notify, play]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
