// ============================================================
// engine.js — Motor de matching de padrões
// ============================================================
// Compara o estado atual dos pinos contra os padrões cadastrados.
// Suporta intercambiabilidade automática (CC1 ↔ CC2).
// Retorna TODOS os padrões que casam + sugestões parciais.
// ============================================================

/**
 * Gera todas as permutações de intercambiabilidade para um pin-map.
 * 
 * Para cada par [pinA, pinB] intercambiável:
 * - Se o padrão tem pinA=true e pinB=false, gera variante com pinA=false e pinB=true
 * - Se o padrão tem pinB=true e pinA=false, gera variante com pinB=false e pinA=true
 * 
 * @param {Object} pinMap - O mapa de pinos {pinId: boolean}
 * @param {Array} interchangeablePairs - Array de pares [pinA, pinB]
 * @returns {Array} Array de pin-maps (incluindo o original)
 */
function expandInterchangeable(pinMap, interchangeablePairs) {
    let variants = [{ ...pinMap }];

    for (const [pinA, pinB] of interchangeablePairs) {
        const newVariants = [];
        for (const variant of variants) {
            newVariants.push(variant);
            // Se exatamente um dos dois está ativo, gera a variante trocada
            if (variant[pinA] !== variant[pinB]) {
                const swapped = { ...variant };
                swapped[pinA] = variant[pinB];
                swapped[pinB] = variant[pinA];
                newVariants.push(swapped);
            }
        }
        variants = newVariants;
    }

    return variants;
}

/**
 * Verifica se dois pin-maps são idênticos.
 */
function pinMapsMatch(stateMap, patternMap) {
    for (const pinId of ALL_PIN_IDS) {
        if (Boolean(stateMap[pinId]) !== Boolean(patternMap[pinId])) {
            return false;
        }
    }
    return true;
}

/**
 * Calcula a distância de Hamming entre dois pin-maps.
 * (Número de pinos que diferem)
 */
function hammingDistance(stateMap, patternMap) {
    let distance = 0;
    for (const pinId of ALL_PIN_IDS) {
        if (Boolean(stateMap[pinId]) !== Boolean(patternMap[pinId])) {
            distance++;
        }
    }
    return distance;
}

/**
 * Detecta anomalias no estado dos pinos.
 * Retorna array de warnings.
 */
function detectAnomalies(stateMap) {
    const warnings = [];

    // Pares diferenciais que devem estar simétricos
    const diffPairs = [
        { plus: "B2", minus: "B3", label: "TX2+/TX2-" },
        { plus: "B10", minus: "B11", label: "RX1-/RX1+" },
        { plus: "A11", minus: "A10", label: "RX2+/RX2-" },
        { plus: "A2", minus: "A3", label: "TX1+/TX1-" },
        { plus: "B6", minus: "B7", label: "B: D+/D-" },
        { plus: "A6", minus: "A7", label: "A: D+/D-" },
    ];

    for (const pair of diffPairs) {
        if (Boolean(stateMap[pair.plus]) !== Boolean(stateMap[pair.minus])) {
            warnings.push({
                type: "asymmetric-pair",
                icon: "⚠️",
                message: `Par diferencial assimétrico: ${pair.label} — apenas um lado ativo. Possível via rompida.`,
            });
        }
    }

    // GND parcial
    const gnds = ["B1", "B12", "A12", "A1"];
    const activeGnds = gnds.filter(p => stateMap[p]);
    if (activeGnds.length > 0 && activeGnds.length < gnds.length) {
        warnings.push({
            type: "partial-gnd",
            icon: "⚠️",
            message: `GND parcial: apenas ${activeGnds.join(", ")} ativo(s). Falta de terra pode causar instabilidade.`,
        });
    }

    // VBUS parcial
    const vbus = ["B4", "B9", "A9", "A4"];
    const activeVbus = vbus.filter(p => stateMap[p]);
    if (activeVbus.length > 0 && activeVbus.length < 2) {
        warnings.push({
            type: "partial-vbus",
            icon: "🔴",
            message: `VBUS insuficiente: apenas ${activeVbus.join(", ")} ativo(s). Risco de alimentação instável.`,
        });
    }

    // Nenhum pino ativo
    const anyActive = ALL_PIN_IDS.some(p => stateMap[p]);
    if (!anyActive) {
        warnings.push({
            type: "dead-cable",
            icon: "💀",
            message: "Nenhum pino ativo — Cabo morto / nenhum cabo conectado.",
        });
    }

    return warnings;
}

/**
 * Motor principal de matching.
 * 
 * @param {Object} currentState - Estado atual {pinId: boolean}
 * @param {Array} patterns - Array de padrões do patterns.js
 * @returns {{ matches: Array, suggestions: Array, warnings: Array }}
 */
function matchPatterns(currentState, patterns) {
    const matches = [];
    const scored = [];

    for (const pattern of patterns) {
        // Combina intercambiabilidade do padrão + global
        const allPairs = [...(pattern.interchangeable || []), ...GLOBAL_INTERCHANGEABLE];
        const variants = expandInterchangeable(pattern.pins, allPairs);

        let matched = false;
        for (const variant of variants) {
            if (pinMapsMatch(currentState, variant)) {
                matches.push({
                    pattern,
                    confidence: 100,
                });
                matched = true;
                break;
            }
        }

        if (!matched) {
            // Calcula distância mínima entre todas as variantes
            let minDistance = Infinity;
            for (const variant of variants) {
                const d = hammingDistance(currentState, variant);
                if (d < minDistance) minDistance = d;
            }
            scored.push({
                pattern,
                distance: minDistance,
                confidence: Math.max(0, Math.round((1 - minDistance / ALL_PIN_IDS.length) * 100)),
            });
        }
    }

    // Ordena sugestões por menor distância (maior proximidade)
    scored.sort((a, b) => a.distance - b.distance);

    // Top 3 sugestões (somente se nenhum match exato ou para complemento)
    const suggestions = scored.slice(0, 3).filter(s => s.confidence >= 50);

    // Detecta anomalias
    const warnings = detectAnomalies(currentState);

    return { matches, suggestions, warnings };
}
