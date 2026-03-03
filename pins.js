// ============================================================
// pins.js — Definição dos pinos do USB Cable Checker
// ============================================================
// Baseado na placa física: Pinrow B (esquerda) e Pinrow A (direita)
// Ordem: B1→B12 de cima para baixo, A12→A1 de cima para baixo
// ============================================================

const PINS_B = [
  { id: "B1",  row: 1,  name: "GND",   description: "Ground" },
  { id: "B2",  row: 2,  name: "TX2+",  description: "SuperSpeed differential pair 3 TX" },
  { id: "B3",  row: 3,  name: "TX2-",  description: "SuperSpeed differential pair 3 TX" },
  { id: "B4",  row: 4,  name: "VBUS",  description: "Bus power" },
  { id: "B5",  row: 5,  name: "CC2",   description: "Configuration channel" },
  { id: "B6",  row: 6,  name: "D+",    description: "USB Data Positive" },
  { id: "B7",  row: 7,  name: "D-",    description: "USB Data Minus" },
  { id: "B8",  row: 8,  name: "SBU2",  description: "Side Band Use (SBU)" },
  { id: "B9",  row: 9,  name: "VBUS",  description: "Bus power" },
  { id: "B10", row: 10, name: "RX1-",  description: "SuperSpeed differential pair 2, RX" },
  { id: "B11", row: 11, name: "RX1+",  description: "SuperSpeed differential pair 2, RX" },
  { id: "B12", row: 12, name: "GND",   description: "Ground" },
];

const PINS_A = [
  { id: "A12", row: 12, name: "GND",   description: "Ground" },
  { id: "A11", row: 11, name: "RX2+",  description: "SuperSpeed differential pair 4, RX" },
  { id: "A10", row: 10, name: "RX2-",  description: "SuperSpeed differential pair 4, RX" },
  { id: "A9",  row: 9,  name: "VBUS",  description: "Bus power" },
  { id: "A8",  row: 8,  name: "SBU1",  description: "Side Band Use (SBU)" },
  { id: "A7",  row: 7,  name: "D-",    description: "USB Data Minus" },
  { id: "A6",  row: 6,  name: "D+",    description: "USB Data Positive" },
  { id: "A5",  row: 5,  name: "CC1",   description: "Configuration channel" },
  { id: "A4",  row: 4,  name: "VBUS",  description: "Bus power" },
  { id: "A3",  row: 3,  name: "TX1-",  description: "SuperSpeed differential pair 1 TX" },
  { id: "A2",  row: 2,  name: "TX1+",  description: "SuperSpeed differential pair 1 TX" },
  { id: "A1",  row: 1,  name: "GND",   description: "Ground" },
];

const PIN_SHIELD = { id: "Shield", row: 0, name: "Shield", description: "Cable shielding (blindagem)" };

// Todos os pinos em ordem de renderização
const ALL_PINS = [...PINS_B, ...PINS_A, PIN_SHIELD];

// IDs de todos os pinos (útil para inicialização)
const ALL_PIN_IDS = ALL_PINS.map(p => p.id);

// ============================================================
// Grupos de pinos — usados para color-coding na UI
// ============================================================
const PIN_GROUPS = {
  GND:    { pins: ["B1", "B12", "A12", "A1"],           color: "#6b7280", label: "Ground" },
  VBUS:   { pins: ["B4", "B9", "A9", "A4"],             color: "#ef4444", label: "Bus Power" },
  DATA:   { pins: ["B6", "B7", "A7", "A6"],             color: "#22c55e", label: "USB 2.0 Data" },
  CC:     { pins: ["B5", "A5"],                          color: "#eab308", label: "Config Channel" },
  SS_TX:  { pins: ["B2", "B3", "A3", "A2"],             color: "#3b82f6", label: "SuperSpeed TX" },
  SS_RX:  { pins: ["B10", "B11", "A11", "A10"],         color: "#6366f1", label: "SuperSpeed RX" },
  SBU:    { pins: ["B8", "A8"],                          color: "#a855f7", label: "Side Band Use" },
  SHIELD: { pins: ["Shield"],                            color: "#d1d5db", label: "Shield" },
};

// Mapa reverso: pinId → groupKey
const PIN_TO_GROUP = {};
for (const [groupKey, group] of Object.entries(PIN_GROUPS)) {
  for (const pinId of group.pins) {
    PIN_TO_GROUP[pinId] = groupKey;
  }
}
