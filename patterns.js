// ============================================================
// patterns.js — Padrões de cabos USB
// ============================================================
//
// COMO ADICIONAR UM NOVO PADRÃO:
// 1. Copie o template abaixo
// 2. Preencha o pin-map com true/false para cada pino
// 3. Adicione ao array PATTERNS
// 4. Pronto! O sistema detecta e exibe automaticamente.
//
// TEMPLATE:
// {
//   id: "meu-padrao",
//   name: "Nome do Padrão",
//   category: "functional",  // "functional" | "low-quality" | "defective"
//   icon: "⚡",
//   pins: {
//     B1: false, B2: false, B3: false, B4: false, B5: false, B6: false,
//     B7: false, B8: false, B9: false, B10: false, B11: false, B12: false,
//     A12: false, A11: false, A10: false, A9: false, A8: false, A7: false,
//     A6: false, A5: false, A4: false, A3: false, A2: false, A1: false,
//     Shield: false,
//   },
//   interchangeable: [],       // Ex: [["A5", "B5"]] para pares intercambiáveis
//   message: "Descrição curta do diagnóstico.",
//   details: "Detalhes técnicos adicionais.",
// },
// ============================================================

// ────────────────────────────────────────────────────────────
// Intercambiabilidade global:
// CC1 (A5) ↔ CC2 (B5) — depende da orientação do cabo no conector.
// Aplicada automaticamente a TODOS os padrões pelo engine.
// ────────────────────────────────────────────────────────────
const GLOBAL_INTERCHANGEABLE = [["A5", "B5"]];

// ────────────────────────────────────────────────────────────
// Padrões de cabos
// ────────────────────────────────────────────────────────────
const PATTERNS = [

    // ── Padrão 1: Charge-Only ─────────────────────────────────
    {
        id: "charge-only",
        name: "Charge-Only",
        category: "functional",
        icon: "⚡",
        pins: {
            B1: true, B2: false, B3: false, B4: false, B5: false, B6: false,
            B7: false, B8: false, B9: true, B10: false, B11: false, B12: false,
            A12: false, A11: false, A10: false, A9: false, A8: false, A7: false,
            A6: false, A5: false, A4: false, A3: false, A2: false, A1: false,
            Shield: false,
        },
        interchangeable: [],
        message: "Cabo simples exclusivo para carregamento, sem qualquer capacidade de transferir dados.",
        details: "GND + VBUS apenas. Sem vias CC, D+/D-, TX/RX ou SBU.",
    },

    // ── Padrão 2: USB 2.0 (Type-C to Type-C Integral) ────────
    {
        id: "usb20-typec",
        name: "Cabo USB 2.0 (Type-C) Padrão",
        category: "functional",
        icon: "🔌",
        pins: {
            B1: true, B2: false, B3: false, B4: true, B5: false, B6: false,
            B7: false, B8: false, B9: true, B10: false, B11: false, B12: true,
            A12: true, A11: false, A10: false, A9: true, A8: false, A7: true,
            A6: true, A5: true, A4: true, A3: false, A2: false, A1: true,
            Shield: true,
        },
        interchangeable: [],
        message: "Cabo USB 2.0 (Type-C) Padrão — Suporta carregamento inteligente via PD (Configuration Channel) e dados até 480 Mbps.",
        details: "GND + VBUS + CC + D+/D-. Sem vias SuperSpeed (TX/RX) ou SBU.",
    },

    // ── Padrão 3: SuperSpeed Single-Lane (USB 3.0/3.1/3.2 Gen 1) ──
    {
        id: "superspeed-single",
        name: "SuperSpeed Single-Lane (USB 3.0+)",
        category: "functional",
        icon: "🚀",
        pins: {
            B1: true, B2: false, B3: false, B4: true, B5: false, B6: false,
            B7: false, B8: false, B9: true, B10: true, B11: true, B12: true,
            A12: true, A11: false, A10: false, A9: true, A8: false, A7: true,
            A6: true, A5: true, A4: true, A3: true, A2: true, A1: true,
            Shield: true,
        },
        interchangeable: [],
        message: "Cabo SuperSpeed Single-Lane (USB 3.0+) — Suporta carga rápida, dados legados e transferências de alta velocidade até 10 Gbps em uma única via física.",
        details: "GND + VBUS + CC + D+/D- + TX1/RX1 (um par SuperSpeed). Sem SBU ou segundo par SS.",
    },

    // ── Padrão 4: Full-Featured / Dual-Lane ──────────────────
    {
        id: "full-featured",
        name: "Full-Featured / Dual-Lane (USB4/Thunderbolt)",
        category: "functional",
        icon: "💎",
        pins: {
            B1: true, B2: true, B3: true, B4: true, B5: false, B6: false,
            B7: false, B8: true, B9: true, B10: true, B11: true, B12: true,
            A12: true, A11: true, A10: true, A9: true, A8: true, A7: true,
            A6: true, A5: true, A4: true, A3: true, A2: true, A1: true,
            Shield: true,
        },
        interchangeable: [],
        message: "Cabo Full-Featured de Altíssima Velocidade — Possui suporte total simultâneo a Carga, Dados Multiplexados Multi-via, Áudio e Vídeo multicanal.",
        details: "Todos os pinos ativos: GND + VBUS + CC + D+/D- + TX1/TX2 + RX1/RX2 + SBU1/SBU2 + Shield.",
    },

    // ── Padrão 5: Anomalia Grave (Curto-circuito/Stub) ────────
    {
        id: "defeito-stub",
        name: "DEFEITO FATAL — Curto-circuito (Stub)",
        category: "defective",
        icon: "💀",
        pins: {
            B1: true, B2: false, B3: false, B4: true, B5: false, B6: true,
            B7: true, B8: false, B9: true, B10: false, B11: false, B12: true,
            A12: true, A11: false, A10: false, A9: true, A8: false, A7: true,
            A6: true, A5: true, A4: true, A3: false, A2: false, A1: true,
            Shield: true,
        },
        interchangeable: [],
        message: "DEFEITO FATAL — Curto-circuito Ilegal (Stub) detectado no barramento secundário (B6/B7 ativos paralelamente a A6/A7). Risco crítico de perda de pacote ou instabilidade por eco de sinal.",
        details: "D+/D- ativados em AMBAS as colunas (B6/B7 + A6/A7). Em cabos corretos apenas um lado deve estar ativo.",
    },

];
