'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AlgorithmTableProps } from './types';
import { Table, MapPin, Target } from 'lucide-react';

export default function AlgorithmTable({
  graph,
  currentStep,
  startNode,
  endNode,
}: AlgorithmTableProps) {
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
      .attr('class', 'bg-slate-800/50 border-b border-white/10')
      .selectAll('th')
      .data(['Node', 'Distance', 'Previous', 'Status'])
      .enter()
      .append('th')
      .attr('class', 'px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wider')
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
        let classes = 'border-b border-white/5 transition-all duration-300 ';
        if (currentStep?.currentNode === d.id) {
          classes += 'bg-amber-500/20';
        } else if (currentStep?.visited.includes(d.id)) {
          classes += 'bg-purple-500/10';
        } else {
          classes += 'hover:bg-white/5';
        }
        return classes;
      });

    // Node column
    rows
      .append('td')
      .attr('class', (d) => {
        let classes = 'px-4 py-3 font-mono font-bold flex items-center gap-2 ';
        if (d.id === startNode) classes += 'text-emerald-400';
        else if (d.id === endNode) classes += 'text-rose-400';
        else classes += 'text-slate-300';
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
        if (dist === undefined) return '<span class="text-slate-500">—</span>';
        if (dist === Infinity)
          return '<span class="text-slate-500">∞</span>';
        return `<span class="text-cyan-400 font-bold">${dist}</span>`;
      });

    // Previous column
    rows
      .append('td')
      .attr('class', 'px-4 py-3 font-mono')
      .html((d) => {
        const prev = currentStep?.previous[d.id];
        if (prev === undefined) return '<span class="text-slate-500">—</span>';
        if (prev === null)
          return '<span class="text-slate-500">null</span>';
        return `<span class="text-purple-400">${prev}</span>`;
      });

    // Status column
    rows
      .append('td')
      .attr('class', 'px-4 py-3')
      .html((d) => {
        if (currentStep?.currentNode === d.id) {
          return '<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full text-xs">Processing</span>';
        }
        if (currentStep?.visited.includes(d.id)) {
          return '<span class="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-full text-xs">Visited</span>';
        }
        if (currentStep?.pq.some(([, n]) => n === d.id)) {
          return '<span class="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded-full text-xs">In Queue</span>';
        }
        return '<span class="bg-slate-700/50 text-slate-400 border border-slate-600/30 px-2 py-1 rounded-full text-xs">Unvisited</span>';
      });

  }, [graph, currentStep, startNode, endNode]);

  if (!graph) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 rounded-lg">
            <Table className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Algorithm Table</h2>
        </div>
        <p className="text-slate-500 text-center py-8">
          Generate a graph to see the algorithm table
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 rounded-lg">
          <Table className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Algorithm Table</h2>
        <span className="text-xs text-slate-500 ml-auto">{graph.nodes.length} nodes</span>
      </div>
      <div
        ref={tableRef}
        className="overflow-x-auto max-h-48 overflow-y-auto rounded-lg"
      />
    </div>
  );
}
