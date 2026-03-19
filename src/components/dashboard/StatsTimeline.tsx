"use client";

import { useEffect, useState } from "react";
import { generateMockTemperatureData, generateMockTimeline } from "@/lib/mockData";
import { Activity, Clock, TrendingUp } from "lucide-react";

export default function StatsTimeline() {
  const [tempData, setTempData] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    setTempData(generateMockTemperatureData(4)); // Last 4 hours
    setTimeline(generateMockTimeline());
  }, []);

  // Simple SVG Line Chart generation
  const minTemp = 35.5;
  const maxTemp = 37.5;
  
  const getCoordinates = (index: number, value: number, width: number, height: number, total: number) => {
    const x = (index / (total - 1)) * width;
    const y = height - ((value - minTemp) / (maxTemp - minTemp)) * height;
    return `${x},${y}`;
  };

  const polylinePoints = tempData.length > 0
    ? tempData.map((d, i) => getCoordinates(i, d.value, 800, 200, tempData.length)).join(" ")
    : "";

  return (
    <div className="depth-card bg-white h-full flex flex-col xl:flex-row border border-gray-100 overflow-hidden rounded-2xl">
       {/* Left side: Temperature Chart */}
       <div className="flex-[2] p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-gray-100/50 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-2xl font-bold tracking-tight text-[var(--text)] flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    Temperature Trend
                 </h3>
                 <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Live aggregated data (Last 4 hours)</p>
              </div>
           </div>
           
           <div className="flex-1 relative w-full bg-gray-50/40 rounded-3xl border border-gray-100 p-6 flex items-end justify-center min-h-[250px]">
              {tempData.length > 0 ? (
                <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* The Line */}
                  <polyline 
                    fill="none" 
                    stroke="var(--text)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    points={polylinePoints} 
                    className="drop-shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  />
                  
                  {/* Gradient Fill under the line */}
                  <polygon 
                    fill="url(#gradient)" 
                    points={`0,200 ${polylinePoints} 800,200`} 
                    opacity="0.1"
                  />
                  
                  {/* Data Points */}
                  {tempData.map((d, i) => {
                     const coords = getCoordinates(i, d.value, 800, 200, tempData.length);
                     const [cx, cy] = coords.split(",");
                     return i % 4 === 0 ? (
                       <g key={i}>
                         <circle cx={cx} cy={cy} r="6" fill="white" stroke="var(--text)" strokeWidth="3" className="hover:r-8 transition-all cursor-pointer" />
                         <text x={cx} y={Number(cy) - 15} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6b7280">{d.value}°</text>
                       </g>
                     ) : null;
                  })}
                  
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--text)" stopOpacity="1" />
                      <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[var(--text)] animate-spin" />
                </div>
              )}
           </div>
       </div>

       {/* Right side: Activity Timeline */}
       <div className="flex-1 p-6 md:p-8 bg-gray-50/30 flex flex-col h-[500px] xl:h-auto">
           <div className="mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200/50">
                 <Activity className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">Activity Timeline</h3>
                 <p className="text-sm font-medium text-[var(--text-muted)]">Event log history</p>
              </div>
           </div>
           
           <div className="relative pl-6 border-l-2 border-gray-200/60 space-y-8 mt-2 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
              {timeline.map((event, i) => (
                 <div key={event.id} className="relative group hover:-translate-y-0.5 transition-transform">
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${event.type === 'Alert' ? 'bg-red-500' : event.type === 'Movement' ? 'bg-indigo-500' : 'bg-gray-400'}`} />
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                       <h4 className="font-bold text-[var(--text)] mb-1">{event.type}</h4>
                       <p className="text-sm font-medium text-[var(--text-muted)] mb-3">{event.description}</p>
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                         <span className="flex items-center gap-1">
                           <Clock className="w-3.5 h-3.5" />
                           {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         {event.duration > 0 && (
                            <span className="ml-auto px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 border border-gray-200/60 shadow-inner">
                               {event.duration}m duration
                            </span>
                         )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
       </div>
    </div>
  );
}
