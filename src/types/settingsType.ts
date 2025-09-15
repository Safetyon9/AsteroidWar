export type GameSettings = {
  controls: "keyboard" | "mouse" | "mobile";
  ship: "eagle" | "falcon";
  language: "english" | "italian";
  volume: number;
  subtitles: boolean;
};

export const DEFAULT_SETTINGS: GameSettings = {
  controls: "keyboard",
  ship: "eagle",
  language: "english",
  volume: 100,
  subtitles: true,
};