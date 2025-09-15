import type { GameSettings } from "../types/settingsType.ts";

const SETTINGS_KEY= "game_settings";

export function saveSettings(settings: GameSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): GameSettings | null {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : null;
}