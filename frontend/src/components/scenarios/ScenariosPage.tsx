import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Clock, AlertTriangle, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, ComposedChart,
} from 'recharts';
import Plot from 'react-plotly.js';
import {
  mockBunkerSensitivity, mockPortDelaySensitivity, mockTippingPoints,
} from '../../data/mockData';
import { useBunkerSensitivity, useDelaySensitivity, useTippingPoints } from '../../api/hooks';
import { formatCurrency, formatCurrencyFull } from '../../utils/formatters';

export default function ScenariosPage() {
  const { data: apiBunker } = useBunkerSensitivity();
  const { data: apiDelay } = useDelaySensitivity();
  const { data: apiTipping } = useTippingPoints();
  const bunkerSensitivity = apiBunker || mockBunkerSensitivity;
  const delaySensitivity = apiDelay || mockPortDelaySensitivity;
  const tippingPoints = apiTipping || mockTippingPoints;

  const [bunkerMult, setBunkerMult] = useState(1.0);
  const [delayDays, setDelayDays] = useState(0);

  // Interpolate values from sensitivity data
  const interpBunker = (mult: number) => {
    const d = bunkerSensitivity;
    const idx = d.findIndex(p => p.parameter_value >= mult);
    if (idx <= 0) return d[0];
    const prev = d[idx - 1], next = d[idx];
    const t = (mult - prev.parameter_value) / (next.parameter_value - prev.parameter_value);
    return {
      parameter_value: mult,
      total_profit: Math.round(prev.total_profit + t * (next.total_profit - prev.total_profit)),
      avg_tce: Math.round(prev.avg_tce + t * (next.avg_tce - prev.avg_tce)),
      assignments: t < 0.5 ? prev.assignments : next.assignments,
    };
  };

  const interpDelay = (days: number) => {
    const d = delaySensitivity;
    const idx = d.findIndex(p => p.parameter_value >= days);
    if (idx <= 0) return d[0];
    const prev = d[idx - 1], next = d[idx];
    const t = (days - prev.parameter_value) / (next.parameter_value - prev.parameter_value);
    return {
      parameter_value: days,
      total_profit: Math.round(prev.total_profit + t * (next.total_profit - prev.total_profit)),
      avg_tce: Math.round(prev.avg_tce + t * (next.avg_tce - prev.avg_tce)),
      assignments: t < 0.5 ? prev.assignments : next.assignments,
    };
  };

  const bCurrent = interpBunker(bunkerMult);
  const dCurrent = interpDelay(delayDays);

  // 2D heatmap data: bunker x delay -> profit
  const bunkerRange = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5];
  const delayRange = [0, 2, 4, 6, 8, 10, 12, 15];
  const heatZ = bunkerRange.map(b => delayRange.map(d => {
    const bp = interpBunker(b);
    const dp = interpDelay(d);
    const base = bunkerSensitivity.find(p => p.parameter_value === 1.0)!.total_profit;
    const bRatio = bp.total_profit / base;
    const dRatio = dp.total_profit / base;
    return Math.round(base * bRatio * dRatio / base);
  }));

  return (
    <div className="space-y-5 max-w-[1280px]">
      {/* Slider controls */}
      <div className="grid grid-cols-2 gap-5">
        {/* Bunker slider */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="w-4 h-4 text-ocean-500" />
            <h3 className="text-sm font-semibold text-navy-900">Bunker Price Sensitivity</h3>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <input type="range" min={80} max={150} step={1} value={bunkerMult * 100}
              onChange={e => setBunkerMult(Number(e.target.value) / 100)}
              className="flex-1 h-2 rounded-lg appearance-none bg-sky-100 accent-ocean-500" />
            <span className="text-lg font-bold text-navy-900 w-16 text-right font-mono">{Math.round(bunkerMult * 100)}%</span>
          </div>
          <div className="flex justify-between text-[10px] text-text-secondary mb-4"><span>80%</span><span>100%</span><span>150%</span></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cloud rounded-lg p-3">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Profit</p>
              <p className={`text-lg font-bold font-mono ${bCurrent.total_profit < 1000000 ? 'text-coral-500' : 'text-teal-500'}`}>
                {formatCurrency(bCurrent.total_profit)}
              </p>
            </div>
            <div className="bg-cloud rounded-lg p-3">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Avg TCE</p>
              <p className="text-lg font-bold font-mono text-ocean-600">{formatCurrencyFull(bCurrent.avg_tce)}/d</p>
            </div>
          </div>
        </motion.div>

        {/* Port delay slider */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-ocean-500" />
            <h3 className="text-sm font-semibold text-navy-900">Port Delay Sensitivity</h3>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <input type="range" min={0} max={15} step={0.5} value={delayDays}
              onChange={e => setDelayDays(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none bg-sky-100 accent-ocean-500" />
            <span className="text-lg font-bold text-navy-900 w-16 text-right font-mono">+{delayDays}d</span>
          </div>
          <div className="flex justify-between text-[10px] text-text-secondary mb-4"><span>0 days</span><span>7.5</span><span>15 days</span></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cloud rounded-lg p-3">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Profit</p>
              <p className={`text-lg font-bold font-mono ${dCurrent.total_profit < 1000000 ? 'text-coral-500' : 'text-teal-500'}`}>
                {formatCurrency(dCurrent.total_profit)}
              </p>
            </div>
            <div className="bg-cloud rounded-lg p-3">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Avg TCE</p>
              <p className="text-lg font-bold font-mono text-ocean-600">{formatCurrencyFull(dCurrent.avg_tce)}/d</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Line charts */}
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5">
          <h3 className="text-sm font-semibold text-navy-900 mb-3">Profit vs Bunker Price</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={bunkerSensitivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE3ED" />
              <XAxis dataKey="parameter_value" tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: '#6B7B8D' }} />
              <YAxis tickFormatter={(v: number) => formatCurrency(v)} tick={{ fontSize: 10, fill: '#6B7B8D' }} />
              <Tooltip formatter={(v: number) => formatCurrencyFull(v)} labelFormatter={(l: number) => `${Math.round(l * 100)}% of base`} />
              <Area dataKey="total_profit" fill="#D6EAF8" stroke="none" fillOpacity={0.5} />
              <Line dataKey="total_profit" stroke="#1B6CA8" strokeWidth={2.5} dot={false} name="Profit" />
              <ReferenceLine x={1.18} stroke="#E74C5E" strokeDasharray="4 4" label={{ value: 'Tipping', position: 'top', fontSize: 9, fill: '#E74C5E' }} />
              <ReferenceLine x={bunkerMult} stroke="#0B2545" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5">
          <h3 className="text-sm font-semibold text-navy-900 mb-3">Profit vs Port Delay</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={delaySensitivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE3ED" />
              <XAxis dataKey="parameter_value" tickFormatter={(v: number) => `+${v}d`} tick={{ fontSize: 10, fill: '#6B7B8D' }} />
              <YAxis tickFormatter={(v: number) => formatCurrency(v)} tick={{ fontSize: 10, fill: '#6B7B8D' }} />
              <Tooltip formatter={(v: number) => formatCurrencyFull(v)} labelFormatter={(l: number) => `+${l} days delay`} />
              <Area dataKey="total_profit" fill="#D6EAF8" stroke="none" fillOpacity={0.5} />
              <Line dataKey="total_profit" stroke="#134074" strokeWidth={2.5} dot={false} name="Profit" />
              <ReferenceLine x={5.5} stroke="#E74C5E" strokeDasharray="4 4" label={{ value: 'Tipping', position: 'top', fontSize: 9, fill: '#E74C5E' }} />
              <ReferenceLine x={delayDays} stroke="#0B2545" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tipping point cards */}
      <div className="grid grid-cols-2 gap-5">
        {tippingPoints.map((tp, i) => (
          <motion.div key={tp.parameter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
            className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-coral-500" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                {tp.parameter === 'Bunker Price' ? <Fuel className="w-4 h-4 text-amber-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-900 mb-1">{tp.parameter} Tipping Point: <span className="text-coral-500">{tp.parameter === 'Bunker Price' ? `${Math.round(tp.value * 100)}%` : `+${tp.value}d`}</span></p>
                <p className="text-xs text-text-secondary leading-relaxed">{tp.description}</p>
                <div className="flex gap-4 mt-2 text-[11px]">
                  <span className="text-teal-500 font-mono">Before: {formatCurrency(tp.profit_before)}</span>
                  <TrendingDown className="w-3.5 h-3.5 text-coral-500" />
                  <span className="text-coral-500 font-mono">After: {formatCurrency(tp.profit_after)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2D scenario heatmap */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white rounded-xl border border-[#DCE3ED] shadow-card p-5">
        <h3 className="text-sm font-semibold text-navy-900 mb-3">2D Scenario Heatmap: Bunker Price x Port Delay</h3>
        <Plot
          data={[{
            z: heatZ,
            x: delayRange.map(d => `+${d}d`),
            y: bunkerRange.map(b => `${Math.round(b * 100)}%`),
            type: 'heatmap',
            colorscale: [[0, '#E74C5E'], [0.3, '#F5A623'], [0.6, '#48A9E6'], [1, '#0FA67F']],
            hovertemplate: 'Bunker: %{y}<br>Delay: %{x}<br>Profit: $%{z:,.0f}<extra></extra>',
            showscale: true,
            colorbar: {
              title: { text: 'Profit ($)', font: { size: 10, color: '#6B7B8D' } },
              thickness: 12,
              tickformat: '$,.0f',
              tickfont: { size: 9, color: '#6B7B8D' },
              outlinewidth: 0,
            },
          }]}
          layout={{
            height: 300,
            margin: { l: 60, r: 30, t: 10, b: 40 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif', size: 11, color: '#0B2545' },
            xaxis: { title: { text: 'Extra Port Delay', font: { size: 10, color: '#6B7B8D' } }, tickfont: { size: 9, color: '#6B7B8D' } },
            yaxis: { title: { text: 'Bunker Price', font: { size: 10, color: '#6B7B8D' } }, tickfont: { size: 9, color: '#6B7B8D' } },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%' }}
        />
      </motion.div>
    </div>
  );
}
