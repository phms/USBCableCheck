// ============================================================
// app.js — Orquestrador do USB Cable Checker
// ============================================================
// Renderiza a UI, gerencia estado dos toggles e chama o engine.
// Tudo roda 100% no browser — basta abrir index.html.
// ============================================================

(function () {
    "use strict";

    // ── Estado ──────────────────────────────────────────────────
    const state = {};
    ALL_PIN_IDS.forEach(id => (state[id] = false));

    // ── Referências do DOM ──────────────────────────────────────
    const pinGrid = document.getElementById("pin-grid");
    const resultsBody = document.getElementById("results-body");
    const pinCountEl = document.getElementById("pin-count");
    const btnReset = document.getElementById("btn-reset");
    const presetSelect = document.getElementById("preset-select");
    const legendEl = document.getElementById("legend");

    // ── Renderiza o Grid de Pinos ───────────────────────────────
    function renderPinGrid() {
        pinGrid.innerHTML = "";

        // Para cada posição vertical (0..11), pareia B[i] com A[i]
        // B vai B1→B12 (top→bottom), A vai A12→A1 (top→bottom) — como na placa real
        for (let i = 0; i < 12; i++) {
            const pinB = PINS_B[i];  // B1, B2, ..., B12
            const pinA = PINS_A[i];  // A12, A11, ..., A1

            const rowEl = document.createElement("div");
            rowEl.className = "pin-row";

            // ── Left: B label ───────
            const leftLabel = document.createElement("div");
            leftLabel.className = "pin-label-left";

            const bNumber = document.createElement("span");
            bNumber.className = "pin-number";
            bNumber.textContent = pinB ? pinB.row : "";

            const bName = document.createElement("span");
            bName.className = "pin-name";
            bName.textContent = pinB ? pinB.name : "";
            if (pinB) bName.setAttribute("data-group", PIN_TO_GROUP[pinB.id] || "");

            leftLabel.appendChild(bNumber);
            leftLabel.appendChild(bName);

            // ── Center: LED pair ────
            const ledPair = document.createElement("div");
            ledPair.className = "led-pair";

            // B LED
            if (pinB) {
                const ledB = document.createElement("button");
                ledB.className = "led-toggle";
                ledB.id = "led-" + pinB.id;
                ledB.setAttribute("data-pin", pinB.id);
                ledB.setAttribute("data-group", PIN_TO_GROUP[pinB.id] || "");
                ledB.title = pinB.id + " — " + pinB.name + " — " + pinB.description;
                ledPair.appendChild(ledB);
            }

            // Divider
            const divider = document.createElement("div");
            divider.className = "center-divider";
            ledPair.appendChild(divider);

            // A LED
            if (pinA) {
                const ledA = document.createElement("button");
                ledA.className = "led-toggle";
                ledA.id = "led-" + pinA.id;
                ledA.setAttribute("data-pin", pinA.id);
                ledA.setAttribute("data-group", PIN_TO_GROUP[pinA.id] || "");
                ledA.title = pinA.id + " — " + pinA.name + " — " + pinA.description;
                ledPair.appendChild(ledA);
            }

            // ── Right: A label ──────
            const rightLabel = document.createElement("div");
            rightLabel.className = "pin-label-right";

            const aName = document.createElement("span");
            aName.className = "pin-name";
            aName.textContent = pinA ? pinA.name : "";
            if (pinA) aName.setAttribute("data-group", PIN_TO_GROUP[pinA.id] || "");

            const aNumber = document.createElement("span");
            aNumber.className = "pin-number";
            aNumber.textContent = pinA ? pinA.row : "";

            rightLabel.appendChild(aName);
            rightLabel.appendChild(aNumber);

            // Assemble row
            rowEl.appendChild(leftLabel);
            rowEl.appendChild(ledPair);
            rowEl.appendChild(rightLabel);
            pinGrid.appendChild(rowEl);
        }
    }

    // ── Renderiza a Legenda ─────────────────────────────────────
    function renderLegend() {
        legendEl.innerHTML = "";
        for (const [key, group] of Object.entries(PIN_GROUPS)) {
            const item = document.createElement("div");
            item.className = "legend-item";

            const dot = document.createElement("span");
            dot.className = "legend-dot";
            dot.style.background = group.color;

            const label = document.createElement("span");
            label.textContent = group.label;

            item.appendChild(dot);
            item.appendChild(label);
            legendEl.appendChild(item);
        }
    }

    // ── Popula Presets ──────────────────────────────────────────
    function renderPresets() {
        PATTERNS.forEach(pattern => {
            const opt = document.createElement("option");
            opt.value = pattern.id;
            opt.textContent = pattern.icon + " " + pattern.name;
            presetSelect.appendChild(opt);
        });
    }

    // ── Toggle um Pino ──────────────────────────────────────────
    function togglePin(pinId) {
        state[pinId] = !state[pinId];
        updateLED(pinId);
        evaluate();
    }

    // ── Atualiza visual de um LED ───────────────────────────────
    function updateLED(pinId) {
        const led = document.getElementById("led-" + pinId);
        if (!led) return;
        if (state[pinId]) {
            led.classList.add("active");
        } else {
            led.classList.remove("active");
        }
    }

    // ── Atualiza todos os LEDs ──────────────────────────────────
    function updateAllLEDs() {
        ALL_PIN_IDS.forEach(updateLED);
    }

    // ── Conta pinos ativos ──────────────────────────────────────
    function countActive() {
        return ALL_PIN_IDS.filter(id => state[id]).length;
    }

    // ── Avalia o estado atual ───────────────────────────────────
    function evaluate() {
        const active = countActive();
        pinCountEl.textContent = active + " / 25 pinos ativos";

        const { matches, suggestions, warnings } = matchPatterns(state, PATTERNS);
        renderResults(matches, suggestions, warnings, active);
    }

    // ── Renderiza Resultados ────────────────────────────────────
    function renderResults(matches, suggestions, warnings, activeCount) {
        resultsBody.innerHTML = "";

        if (activeCount === 0) {
            resultsBody.innerHTML = `
        <div class="result-empty">
          <span class="empty-icon">🔌</span>
          Ligue os pinos acima para testar um cabo
        </div>
      `;
            return;
        }

        // Matches exatos
        if (matches.length > 0) {
            matches.forEach(m => {
                const card = createMatchCard(m.pattern, true);
                resultsBody.appendChild(card);
            });
        }

        // Sugestões parciais (se não houver match exato)
        if (matches.length === 0 && suggestions.length > 0) {
            const divider = document.createElement("div");
            divider.className = "suggestions-divider";
            divider.textContent = "Sugestões mais próximas";
            resultsBody.appendChild(divider);

            suggestions.forEach(s => {
                const card = createSuggestionCard(s);
                resultsBody.appendChild(card);
            });
        }

        // Warnings
        if (warnings.length > 0) {
            const section = document.createElement("div");
            section.className = "warnings-section";

            warnings.forEach(w => {
                const item = document.createElement("div");
                item.className = "warning-item";
                item.innerHTML = `
          <span class="warning-icon">${w.icon}</span>
          <span class="warning-text">${w.message}</span>
        `;
                section.appendChild(item);
            });

            resultsBody.appendChild(section);
        }

        // Nenhum resultado e nenhum warning
        if (matches.length === 0 && suggestions.length === 0 && warnings.length === 0) {
            resultsBody.innerHTML = `
        <div class="result-empty">
          <span class="empty-icon">❓</span>
          Padrão não reconhecido
        </div>
      `;
        }
    }

    // ── Cria card de match exato ────────────────────────────────
    function createMatchCard(pattern, exact) {
        const card = document.createElement("div");
        card.className = "match-card category-" + pattern.category;

        card.innerHTML = `
      <div class="match-header">
        <span class="match-icon">${pattern.icon}</span>
        <span class="match-name">${pattern.name}</span>
        <span class="match-badge badge-exact">Match</span>
      </div>
      <div class="match-message">${pattern.message}</div>
      ${pattern.details ? '<div class="match-details">' + pattern.details + '</div>' : ''}
    `;

        return card;
    }

    // ── Cria card de sugestão parcial ───────────────────────────
    function createSuggestionCard(suggestion) {
        const card = document.createElement("div");
        card.className = "suggestion-card";

        card.innerHTML = `
      <div class="suggestion-header">
        <span>${suggestion.pattern.icon}</span>
        <span>${suggestion.pattern.name}</span>
        <span class="suggestion-confidence">${suggestion.confidence}% similar</span>
      </div>
      <div class="suggestion-message">${suggestion.pattern.message}</div>
    `;

        return card;
    }

    // ── Reset ───────────────────────────────────────────────────
    function resetAll() {
        ALL_PIN_IDS.forEach(id => (state[id] = false));
        updateAllLEDs();
        presetSelect.value = "";
        evaluate();
    }

    // ── Carregar Preset ─────────────────────────────────────────
    function loadPreset(patternId) {
        if (!patternId) return;
        const pattern = PATTERNS.find(p => p.id === patternId);
        if (!pattern) return;

        ALL_PIN_IDS.forEach(id => (state[id] = Boolean(pattern.pins[id])));
        updateAllLEDs();
        evaluate();
    }

    // ── Event Listeners ─────────────────────────────────────────
    document.addEventListener("click", function (e) {
        const led = e.target.closest(".led-toggle");
        if (led) {
            const pinId = led.getAttribute("data-pin");
            if (pinId) togglePin(pinId);
            return;
        }

        const shortcut = e.target.closest(".shortcut-toggle");
        if (shortcut) {
            const group = shortcut.getAttribute("data-shortcut");
            if (group) toggleGroup(group);
        }
    });

    // ── Toggle de Grupo (atalhos GND/VBUS) ─────────────────────
    function toggleGroup(groupKey) {
        const pins = PIN_GROUPS[groupKey].pins;
        // Se todos estão ativos → desliga todos, senão → liga todos
        const allActive = pins.every(id => state[id]);
        const newValue = !allActive;
        pins.forEach(id => {
            state[id] = newValue;
            updateLED(id);
        });
        updateShortcutVisuals();
        evaluate();
    }

    // ── Atualiza visual dos atalhos ─────────────────────────────
    function updateShortcutVisuals() {
        ["GND", "VBUS"].forEach(groupKey => {
            const btn = document.getElementById("shortcut-" + groupKey.toLowerCase());
            if (!btn) return;
            const pins = PIN_GROUPS[groupKey].pins;
            const allActive = pins.every(id => state[id]);
            btn.classList.toggle("active", allActive);
        });
    }

    // Patch: atualizar shortcuts quando qualquer pino muda
    const originalEvaluate = evaluate;
    evaluate = function () {
        originalEvaluate();
        updateShortcutVisuals();
    };

    btnReset.addEventListener("click", resetAll);

    presetSelect.addEventListener("change", function () {
        loadPreset(this.value);
    });

    // ── Inicialização ───────────────────────────────────────────
    renderPinGrid();
    renderLegend();
    renderPresets();
    evaluate();

})();
