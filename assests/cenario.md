Aqui está o seu guia de referência organizado de forma direta, objetiva e categorizada para facilitar consultas rápidas de diagnóstico:

### ✅ Cabos Funcionais (Operação Normal)

Estes cenários indicam que o cabo está íntegro dentro de sua proposta de fabricação (mesmo que seja um cabo simples).

* **Apenas Carregamento Simples:** `GND` + `VBUS`
* **Apenas Carregamento Rápido (PD):** `GND` + `VBUS` + `CC1/CC2` *(Sem vias de dados)*
* **Carga + Dados Básicos (USB 2.0):** `GND` + `VBUS` + `D+` + `D-`
* **Carga Rápida + Dados Básicos (USB 2.0):** `GND` + `VBUS` + `CC1/CC2` + `D+` + `D-` *(Cenário mais comum em cabos originais de celular)*
* **Carga + Dados de Alta Velocidade (USB 3.0+):** `GND` + `VBUS` + `CC2` + `D+` + `D-` + Pares completos de `TX/RX`
* **Carga + Dados + Áudio Analógico:** `GND` + `VBUS` + `D+` + `D-` + `SBU1/SBU2` *(Sem pinos TX/RX)*
* **Cabo Completo (Full-Featured):** **Todos** os LEDs acesos (Suporta Carga, Dados, Áudio e Vídeo).

---

### ⚠️ Cabos Funcionais, mas de Baixa Qualidade

* **Sem Blindagem (Unshielded):** Pinos de dados/energia acesos, mas **LED "Shield" apagado**. O cabo funciona, mas está suscetível a ruídos, interferências e desconexões repentinas.

---

### ❌ Cabos com Defeito (Descarte Recomendado)

Estes cenários indicam vias rompidas, defeito de fabricação ou danos no conector. A assimetria (falta de um par) é o principal indicador de falha.

* **Cabo Morto / Totalmente Rompido:** Nenhum LED acende ou apenas uma luz isolada pisca/acende.
* **Falha de Alimentação (Risco de Curto):** Qualquer pino `VBUS` ou `GND` **apagado**. O cabo não passa energia e a falta de terra pode danificar equipamentos.
* **Falha de Dados Básicos (USB 2.0):** `D+` aceso e `D-` apagado (ou vice-versa). O cabo carrega, mas o PC exibe "Dispositivo USB não reconhecido".
* **Falha de Dados de Alta Velocidade:** Falta de assimetria nos pares diferenciais (Ex: `TX1+` aceso, mas `TX1-` apagado). A comunicação de alta velocidade falha.


### Esquema de entradas e saídas

#### Padrão 1: Charge-Only (Cabo genérico restrito a carregamento)
```json
{
  "B1": true, "B2": false, "B3": false, "B4": false, "B5": false, "B6": false, "B7": false, "B8": false, "B9": true, "B10": false, "B11": false, "B12": false,
  "A12": false, "A11": false, "A10": false, "A9": false, "A8": false, "A7": false, "A6": false, "A5": false, "A4": false, "A3": false, "A2": false, "A1": false,
  "Shield": false
}
```

Retorno: "Charge-Only - Cabo simples exclusivo para carregamento, sem qualquer capacidade de transferir dados."

#### Padrão 2: Cabo Padrão USB 2.0 (Type-C to Type-C Integral)
```json

{
  "B1": true, "B2": false, "B3": false, "B4": true, "B5": false, "B6": false, "B7": false, "B8": false, "B9": true, "B10": false, "B11": false, "B12": true,
  "A12": true, "A11": false, "A10": false, "A9": true, "A8": false, "A7": true, "A6": true, "A5": true, "A4": true, "A3": false, "A2": false, "A1": true,
  "Shield": true
}
```

Retorno: "Cabo USB 2.0 (Type-C) Padrão - Suporta carregamento inteligente via PD (Configuration Channel) e dados até 480 Mbps."

#### Padrão 3: Cabo SuperSpeed Single-Lane (USB 3.0 / 3.1 / 3.2 Gen 1)
```json

{
  "B1": true, "B2": false, "B3": false, "B4": true, "B5": false, "B6": false, "B7": false, "B8": false, "B9": true, "B10": true, "B11": true, "B12": true,
  "A12": true, "A11": false, "A10": false, "A9": true, "A8": false, "A7": true, "A6": true, "A5": true, "A4": true, "A3": true, "A2": true, "A1": true,
  "Shield": true
}
```

Retorno: "Cabo SuperSpeed Single-Lane (USB 3.0+) - Suporta carga rápida, dados legados e transferências de alta velocidade até 10 Gbps em uma única via física."

#### Padrão 4: Cabo Full-Featured / Dual-Lane (USB4 / Thunderbolt / 3.2 Gen 2x2)
```json

{
  "B1": true, "B2": true, "B3": true, "B4": true, "B5": false, "B6": false, "B7": false, "B8": true, "B9": true, "B10": true, "B11": true, "B12": true,
  "A12": true, "A11": true, "A10": true, "A9": true, "A8": true, "A7": true, "A6": true, "A5": true, "A4": true, "A3": true, "A2": true, "A1": true,
  "Shield": true
}
```

Retorno: "Cabo Full-Featured de Altíssima Velocidade - Possui suporte total simultâneo a Carga, Dados Multiplexados Multi-via, Áudio e Vídeo multicanal."

#### Padrão 5: Detecção de Anomalia Grave (Curto-circuito em Dados/Stub)
```json

{
  "B1": true, "B2": false, "B3": false, "B4": true, "B5": false, "B6": true, "B7": true, "B8": false, "B9": true, "B10": false, "B11": false, "B12": true,
  "A12": true, "A11": false, "A10": false, "A9": true, "A8": false, "A7": true, "A6": true, "A5": true, "A4": true, "A3": false, "A2": false, "A1": true,
  "Shield": true
}

Retorno: "DEFEITO FATAL - Curto-circuito Ilegal (Stub) detectado no barramento secundário (B6/B7 ativos paralelamente a A6/A7). Risco crítico de perda de pacote ou instabilidade por eco de sinal."

Nota para implementação: O pino "A5" pode ser substituído como ativo pelo "B5" em qualquer cenário listado, a depender exclusivamente da orientação rotacional (qual lado para cima) em que o cabo foi inserido no conector para o teste.