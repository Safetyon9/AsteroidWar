import type React from "react";

export type GameSettings = {
  controls: "keyboard" | "mouse" | "mobile";
  ship: "eagle1" | "eagle2" | "predator" | "falcon";
  language: "english" | "italian";
  volume: number;
  subtitles: boolean;
};

export const DEFAULT_SETTINGS: GameSettings = {
  controls: "keyboard",
  ship: "eagle1",
  language: "english",
  volume: 0.1,
  subtitles: true,
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
};