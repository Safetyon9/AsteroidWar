import type React from "react";

export type GameSettings = {
  controls: "keyboard" | "mouse" | "mobile";
  ship: 0 | 1 | 2 | 3;
  language: "english";
  volume: number;
};

export const DEFAULT_SETTINGS: GameSettings = {
  controls: "keyboard",
  ship: 0,
  language: "english",
  volume: 0.1,
};

export type EmailPanelProps = {
  visible: boolean;
  onClose: () => void;
};

export type SettingsPanelProps = {
  visible: boolean;
  onClose: () => void;
  bgMusicRef: React.RefObject<BackgroundMusicRef | null>;
};

export type BackgroundMusicRef = {
  setCustomVolume: (x: number) => void;
};

export type BackgroundMusicProps = {
    song: string;
    initialVolume: number;
};