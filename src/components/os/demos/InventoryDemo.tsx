"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScene } from "../store";

const ITEMS = [
  { sku: "Basmati Rice 5kg", stock: 420, rate: 3.2 },
  { sku: "Sunflower Oil 1L", stock: 300, rate: 2.9 },
  { sku: "Masala Chai 250g", stock: 510, rate: 2.1 },
  { sku: "Detergent 2kg", stock: 260, rate: 1.6 },
];
const LOW = 0.2;

// Drag "sales this week" — shelves drain, low stock raises a purchase order.
export default function InventoryDemo({ live = true }: { live?: boolean }) {
  const [sales, setSales] = useState(20);

  const rows = ITEMS.map((it) => {
    const left = Math.max(0, Math.round(it.stock - sales * it.rate));
    return { ...it, left, pct: left / it.stock };
  });
  const low = rows.filter((r) => r.pct < LOW);

  // the 3D shelves drain with the slider
  useEffect(() => {
    useScene.setState({ stock: ITEMS.map((it) => Math.max(0, it.stock - sales * it.rate) / it.stock) });
  }, [sales]);

  return (
    <div className="h-full flex flex-col gap-4 p-5 text-[12px]">
      <div className="flex-1 flex flex-col justify-center gap-3">
        {rows.map((r) => {
          const isLow = r.pct < LOW;
          return (
            <div key={r.sku} className="grid grid-cols-[120px_1fr_56px] sm:grid-cols-[150px_1fr_64px] items-center gap-3">
              <span className="text-white/70 truncate">{r.sku}</span>
              <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: live ? `${r.pct * 100}%` : "0%", transitionDuration: live ? undefined : "0s", background: isLow ? "#ed821c" : "var(--accent)" }}
                />
              </div>
              <span className={`tabular-nums text-right ${isLow ? "text-[#ed821c]" : "text-white/50"}`}>{r.left}</span>
            </div>
          );
        })}
      </div>

      <div className="min-h-[34px]">
        <AnimatePresence>
          {low.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 border border-[#ed821c]/40 bg-[#ed821c]/10 px-3 py-2 text-[#f5b26b]"
              role="status"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ed821c] animate-pulse" />
              low stock · auto-reorder raised for {low.map((l) => l.sku.split(" ")[0]).join(", ")}
              <span className="ml-auto text-white/40">PO-{2400 + low.length}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <label className="flex items-center gap-4">
        <span className="os-label shrink-0">sales this week</span>
        <input
          type="range"
          min={0}
          max={160}
          value={sales}
          onChange={(e) => setSales(+e.target.value)}
          className="flex-1 accent-[var(--accent)]"
        />
        <span className="tabular-nums text-white/60 w-10 text-right">{sales * 10}</span>
      </label>
    </div>
  );
}
