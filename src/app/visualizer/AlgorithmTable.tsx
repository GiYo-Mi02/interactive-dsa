'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AlgorithmTableProps } from './types';
import { Table, MapPin, Target } from 'lucide-react';

interface ExtendedAlgorithmTableProps extends AlgorithmTableProps {
  isDark?: boolean;
}

export default function AlgorithmTable({
  graph,
  currentStep,
  startNode,
  endNode,
  isDark = true,
}: ExtendedAlgorithmTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current || !graph) return;

    // Clear previous content
    d3.select(tableRef.current).selectAll('*').remove();

    // Create table using D3
    const table = d3
      .select(tableRef.current)
      .append('table')
      .attr('class', 'w-full text-sm');

    // Header
    const thead = table.append('thead');
    thead
      .append('tr')
      .attr('class', isDark ? 'bg-slate-800/50 border-b border-white/10' : 'bg-slate-100 border-b border-slate-200')
      .selectAll('th')
      .data(['Node', 'Distance', 'Previous', 'Status'])
      .enter()
      .append('th')
      .attr('class', `px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`)
      .text((d) => d);

    // Body
    const tbody = table.append('tbody');

    const rows = tbody
      .selectAll('tr')
      .data(graph.nodes)
      .enter()
      .append('tr')
      .attr('id', (d) => `table-row-${d.id}`)
      .attr('class', (d) => {
        let classes = 'transition-all duration-300 ';
        classes += isDark ? 'border-b border-white/5 ' : 'border-b border-slate-100 ';
        if (currentStep?.currentNode === d.id) {
          classes += isDark ? 'bg-amber-500/20' : 'bg-amber-100';
        } else if (currentStep?.visited.includes(d.id)) {
          classes += isDark ? 'bg-purple-500/10' : 'bg-purple-50';
        } else {
          classes += isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50';
        }
        return classes;
      });

    // Node column
    rows
      .append('td')
      .attr('class', (d) => {
        let classes = 'px-4 py-3 font-mono font-bold flex items-center gap-2 ';
        if (d.id === startNode) classes += isDark ? 'text-emerald-400' : 'text-emerald-600';
        else if (d.id === endNode) classes += isDark ? 'text-rose-400' : 'text-rose-600';
        else classes += isDark ? 'text-slate-300' : 'text-slate-700';
        return classes;
      })
      .html((d) => {
        let icon = '';
        if (d.id === startNode) icon = '<span class="w-3 h-3 bg-emerald-400 rounded-full inline-block mr-2"></span>';
        else if (d.id === endNode) icon = '<span class="w-3 h-3 bg-rose-400 rounded-full inline-block mr-2"></span>';
        return icon + d.id;
      });

    // Distance column
    rows
      .append('td')
      .attr('class', 'px-4 py-3 font-mono')
      .html((d) => {
        const dist = currentStep?.distances[d.id];
        if (dist === undefined) return `<span class="${isDark ? 'text-slate-500' : 'text-slate-400'}">—</span>`;
        if (dist === Infinity)
          return `<span class="${isDark ? 'text-slate-500' : 'text-slate-400'}">∞</span>`;
        return `<span class="${isDark ? 'text-cyan-400' : 'text-cyan-600'} font-bold">${dist}</span>`;
      });

    // Previous column
    rows
      .append('td')
      .attr('class', 'px-4 py-3 font-mono')
      .html((d) => {
        const prev = currentStep?.previous[d.id];
        if (prev === undefined) return `<span class="${isDark ? 'text-slate-500' : 'text-slate-400'}">—</span>`;
        if (prev === null)
          return `<span class="${isDark ? 'text-slate-500' : 'text-slate-400'}">null</span>`;
        return `<span class="${isDark ? 'text-purple-400' : 'text-purple-600'}">${prev}</span>`;
      });

    // Status column
    rows
      .append('td')
      .attr('class', 'px-4 py-3')
      .html((d) => {
        if (currentStep?.currentNode === d.id) {
          return `<span class="${isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300'} border px-2 py-1 rounded-full text-xs">Processing</span>`;
        }
        if (currentStep?.visited.includes(d.id)) {
          return `<span class="${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-300'} border px-2 py-1 rounded-full text-xs">Visited</span>`;
        }
        if (currentStep?.pq.some(([, n]) => n === d.id)) {
          return `<span class="${isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-300'} border px-2 py-1 rounded-full text-xs">In Queue</span>`;
        }
        return `<span class="${isDark ? 'bg-slate-700/50 text-slate-400 border-slate-600/30' : 'bg-slate-100 text-slate-500 border-slate-300'} border px-2 py-1 rounded-full text-xs">Unvisited</span>`;
      });

  }, [graph, currentStep, startNode, endNode, isDark]);

  if (!graph) {
    return (
      <div className={`backdrop-blur-xl rounded-2xl border p-6 ${
        isDark 
          ? 'bg-slate-900/60 border-white/10' 
          : 'bg-white/70 border-slate-200 shadow-lg'
      }`}>
        <div className={`flex items-center gap-3 border-b pb-4 mb-4 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className={`p-2 rounded-lg ${
            isDark 
              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
              : 'bg-gradient-to-br from-cyan-100 to-purple-100'
          }`}>
            <Table className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Algorithm Table</h2>
        </div>
        <p className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Generate a graph to see the algorithm table
        </p>
      </div>
    );
  }

  return (
    <div className={`backdrop-blur-xl rounded-2xl border p-6 ${
      isDark 
        ? 'bg-slate-900/60 border-white/10' 
        : 'bg-white/70 border-slate-200 shadow-lg'
    }`}>
      <div className={`flex items-center gap-3 border-b pb-4 mb-4 ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className={`p-2 rounded-lg ${
          isDark 
            ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
            : 'bg-gradient-to-br from-cyan-100 to-purple-100'
        }`}>
          <Table className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        </div>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Algorithm Table</h2>
        <span className={`text-xs ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{graph.nodes.length} nodes</span>
      </div>
      <div
        ref={tableRef}
        className="overflow-x-auto max-h-48 overflow-y-auto rounded-lg"
      />
    </div>
  );
}
