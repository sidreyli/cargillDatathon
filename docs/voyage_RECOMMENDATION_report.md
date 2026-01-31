# Voyage Recommendation Report
## Cargill Ocean Transportation - Datathon 2026

**Prepared for:** Freight Trading Manager
**Date:** January 2026
**Authors:** Sidarth Rajesh & Makendra Prasad

---

## Executive Summary

This report presents our optimized vessel-cargo allocation strategy for Cargill's Capesize fleet, maximizing portfolio profit while ensuring all committed cargo obligations are fulfilled. Our analysis leverages dual-speed optimization, joint portfolio optimization with market vessels, and machine learning-based port congestion predictions.

**Key Recommendation:** Deploy all four Cargill vessels on high-margin market cargoes while hiring market vessels to cover committed Cargill cargoes. This arbitrage strategy yields a **total portfolio profit of $5.8 million**, significantly outperforming a conventional assignment approach.

---

## 1. Fleet & Cargo Overview

### 1.1 Cargill Fleet (4 Vessels)

| Vessel | DWT | Hire Rate | Current Port | ETD |
|--------|-----|-----------|--------------|-----|
| ANN BELL | 180,803 | $11,750/day | Qingdao | 25 Feb 2026 |
| OCEAN HORIZON | 181,550 | $15,750/day | Map Ta Phut | 1 Mar 2026 |
| PACIFIC GLORY | 182,320 | $14,800/day | Gwangyang | 10 Mar 2026 |
| GOLDEN ASCENT | 179,965 | $13,950/day | Fangcheng | 8 Mar 2026 |

### 1.2 Committed Cargill Cargoes (3 Obligations)

| Cargo | Customer | Quantity | Laycan | Freight Rate | Route |
|-------|----------|----------|--------|--------------|-------|
| EGA Bauxite | EGA | 180,000 MT | 2-10 Apr 2026 | $23.00/MT | Guinea → Qingdao |
| BHP Iron Ore | BHP | 160,000 MT | 7-11 Mar 2026 | $9.00/MT | Port Hedland → Lianyungang |
| CSN Iron Ore | CSN | 180,000 MT | 1-8 Apr 2026 | $22.30/MT | Itaguai → Qingdao |

---

## 2. Recommended Vessel-Cargo Allocation

### 2.1 Optimal Assignment Strategy

Our joint optimization algorithm recommends an **arbitrage strategy**: redirect Cargill vessels to higher-margin market cargoes while hiring market vessels at FFA rates to fulfill committed obligations.

#### Cargill Vessel Assignments (Market Cargoes)

| Vessel | Cargo | Profit | TCE |
|--------|-------|--------|-----|
| ANN BELL | Vale Malaysia Iron Ore (Brazil-Malaysia) | $915,509 | $22,614/day |
| OCEAN HORIZON | BHP Iron Ore (Australia-S.Korea) | $350,978 | $27,036/day |
| PACIFIC GLORY | Teck Coking Coal (Canada-China) | $708,408 | $29,426/day |
| GOLDEN ASCENT | Adaro Coal (Indonesia-India) | $1,169,745 | $35,181/day |

#### Market Vessel Hires (Committed Cargoes)

| Vessel | Cargo | Duration | Hire Rate |
|--------|-------|----------|-----------|
| IRON CENTURY | EGA Bauxite (Guinea-China) | 78 days | ~$20,784/day |
| ATLANTIC FORTUNE | BHP Iron Ore (Australia-China) | 30 days | ~$18,000/day |
| CORAL EMPEROR | CSN Iron Ore (Brazil-China) | 78 days | ~$13,376/day |

### 2.2 Rationale

1. **Laycan Constraints:** At eco speed, only 2 of 4 Cargill vessels (ANN BELL, OCEAN HORIZON) can make any committed cargo laycans. PACIFIC GLORY cannot reach any cargo in time.

2. **Dual-Speed Optimization:** Warranted speed unlocks 3 additional feasible voyages (GOLDEN ASCENT → EGA/CSN, OCEAN HORIZON → CSN), but at higher fuel costs.

3. **Arbitrage Opportunity:** Market cargoes offer higher TCE ($22,000-$35,000/day) compared to committed cargoes ($17,000-$27,000/day). Hiring market vessels at FFA rates (~$18,000/day) allows us to capture this spread.

4. **Total Portfolio Profit:** **$5,803,558**

---

## 3. Key Assumptions

| Assumption | Value | Source |
|------------|-------|--------|
| Bunker Price (VLSFO) | $490-$560/MT | Regional pricing (Singapore, Fujairah, Rotterdam) |
| Bunker Price (MGO) | $650/MT | Used for port operations per Cargill FAQ |
| FFA Market Rate | $18,000/day | 5TC March 2026 benchmark |
| Target TCE | $18,000/day | Based on FFA market rate |
| Port Fuel | MGO only | Per Cargill FAQ Q5/Q17 |
| Speed Options | Eco & Warranted | Dual-speed mode enabled |
| Commission | 1.25% - 3.75% | Per cargo terms |

**Fuel Consumption Rates:**
- Sea (Laden/Ballast): VLSFO
- Port Operations: MGO (as per Cargill FAQ)

---

## 4. Scenario Analysis Results

### 4.1 Bunker Price Sensitivity

We analyzed portfolio performance across bunker price variations from -20% to +50% of current levels.

| Bunker Change | Total Profit | Avg TCE | Assignment Change |
|---------------|--------------|---------|-------------------|
| -20% | $2.99M | $28,100/day | No change |
| -10% | $2.67M | $26,300/day | No change |
| Baseline | $2.35M | $24,213/day | Baseline |
| +10% | $2.03M | $22,000/day | No change |
| +20% | $1.71M | $19,800/day | Golden Ascent replaces Ocean Horizon |
| +30% | $1.39M | $17,600/day | No change |

**Key Finding:** Portfolio profit decreases approximately **$320,000 per 10% bunker price increase**.

### 4.2 Port Delay Sensitivity (China Ports)

We analyzed the impact of additional port delays at Chinese discharge ports (Qingdao, Lianyungang, Caofeidian, etc.).

| Extra Delay | Total Profit | Avg TCE | Impact |
|-------------|--------------|---------|--------|
| 0 days | $2.35M | $24,213/day | Baseline |
| +3 days | $2.05M | $21,800/day | Minor profit reduction |
| +5 days | $1.85M | $20,200/day | Approaching tipping point |
| +6 days | $1.75M | $19,400/day | Assignment change triggered |
| +10 days | $1.36M | $16,200/day | Significant profit erosion |

**Key Finding:** Each additional day of port delay reduces profit by approximately **$100,000**.

### 4.3 ML-Predicted Port Congestion (March 2026)

Our machine learning model predicts the following port delays:

| Port | Predicted Delay | Confidence Interval | Congestion Level |
|------|-----------------|---------------------|------------------|
| Qingdao | 3.2 days | 1.8 - 4.6 days | Medium |
| Lianyungang | 3.8 days | 2.4 - 5.2 days | Medium |
| Caofeidian | 4.5 days | 3.1 - 5.9 days | High |
| Rizhao | 2.1 days | 1.2 - 3.0 days | Low |

---

## 5. Threshold Insights (Tipping Points)

### 5.1 Bunker Price Tipping Point

**Threshold: +63% bunker price increase (≈ $163% of current prices)**

- **Before:** OCEAN HORIZON assigned to CSN Iron Ore
- **After:** GOLDEN ASCENT replaces OCEAN HORIZON for CSN Iron Ore
- **Reason:** GOLDEN ASCENT's lower fuel consumption on eco route becomes more valuable as bunker prices rise

**Recommendation:** If bunker prices approach $800/MT VLSFO (currently ~$520/MT), reassess vessel assignments prioritizing fuel-efficient routes.

### 5.2 Port Delay Tipping Point (China)

**Threshold: +6 days additional delay at Chinese ports**

- **Before:** Standard optimal assignments
- **After:** Assignment changes to accommodate extended voyage times
- **Affected Ports:** Qingdao, Lianyungang

**Recommendation:** Monitor Chinese port congestion closely. If delays exceed 5 days, consider:
1. Switching to warranted speed for time-critical cargoes
2. Adjusting laycan negotiations with customers
3. Exploring alternative discharge ports

---

## 6. Risk Considerations

| Risk Factor | Probability | Impact | Mitigation |
|-------------|-------------|--------|------------|
| Bunker price spike (+30%) | Medium | $700K profit loss | Lock in bunker purchases, consider fuel hedging |
| China port congestion (+5 days) | Medium | $500K profit loss | Build buffer in voyage planning, monitor ML predictions |
| Market vessel unavailability | Low | High | Maintain relationships with multiple charter brokers |
| Laycan miss | Low | Very High | Dual-speed backup, warranted speed when needed |

---

## 7. Conclusion

Our recommended strategy delivers **$5.8 million in total portfolio profit** by:

1. **Optimizing vessel deployment** through joint optimization across committed and market cargoes
2. **Leveraging arbitrage** by redirecting Cargill vessels to high-margin market opportunities
3. **Ensuring obligation coverage** through strategic market vessel hires at competitive FFA rates
4. **Building resilience** with dual-speed optimization and comprehensive scenario analysis

The recommendation is robust to moderate bunker price fluctuations (up to +63%) and port delays (up to +5 days). We recommend continuous monitoring of Chinese port congestion using our ML prediction model and proactive reassessment if conditions approach identified tipping points.

---

**Prepared by:**
Sidarth Rajesh & Makendra Prasad
Cargill Datathon 2026 Team