import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const REMEMBER_KEY = 'todolist-remember-me';

const safe = (fn, fallback = null) => {
    try { return fn(); } catch { return fallback; }
};

// "Se souvenir de moi" : true (défaut) = localStorage, false = sessionStorage
export const setRememberMe = (remember) => {
    safe(() => localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0'));
};

const shouldRemember = () => safe(() => localStorage.getItem(REMEMBER_KEY), '1') !== '0';

// Stockage de session choisi dynamiquement. La lecture regarde les deux
// emplacements pour retrouver une session existante, quel qu'il soit.
const authStorage = {
    getItem: (key) =>
        safe(() => localStorage.getItem(key)) ?? safe(() => sessionStorage.getItem(key)),
    setItem: (key, value) => {
        const [target, other] = shouldRemember()
            ? [localStorage, sessionStorage]
            : [sessionStorage, localStorage];
        safe(() => target.setItem(key, value));
        safe(() => other.removeItem(key));
    },
    removeItem: (key) => {
        safe(() => localStorage.removeItem(key));
        safe(() => sessionStorage.removeItem(key));
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { storage: authStorage }
});
