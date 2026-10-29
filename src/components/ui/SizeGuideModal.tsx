import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryLabel?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, categoryLabel = 'Streetwear Apparel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Ruler className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bebas text-2xl tracking-wider uppercase text-neutral-100">
                Ayaan NX Fit & Size Guide
              </h3>
              <p className="text-xs text-neutral-400">Garment specifications in inches (measure laid flat)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tabular-nums border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Chest (Pit-to-Pit)</th>
                <th className="py-3 px-3">Shoulder Width</th>
                <th className="py-3 px-3">Body Length</th>
                <th className="py-3 px-3">Waist (Pants)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-body">
              <tr className="hover:bg-neutral-800/40">
                <td className="py-3 px-3 font-semibold text-amber-400">XS</td>
                <td className="py-3 px-3">22.0"</td>
                <td className="py-3 px-3">20.5"</td>
                <td className="py-3 px-3">26.5"</td>
                <td className="py-3 px-3">28" - 30"</td>
              </tr>
              <tr className="hover:bg-neutral-800/40">
                <td className="py-3 px-3 font-semibold text-amber-400">S</td>
                <td className="py-3 px-3">23.5"</td>
                <td className="py-3 px-3">21.5"</td>
                <td className="py-3 px-3">27.5"</td>
                <td className="py-3 px-3">30" - 32"</td>
              </tr>
              <tr className="hover:bg-neutral-800/40 bg-neutral-800/20">
                <td className="py-3 px-3 font-semibold text-amber-400">M (Standard Model)</td>
                <td className="py-3 px-3">25.0"</td>
                <td className="py-3 px-3">22.5"</td>
                <td className="py-3 px-3">28.5"</td>
                <td className="py-3 px-3">32" - 34"</td>
              </tr>
              <tr className="hover:bg-neutral-800/40">
                <td className="py-3 px-3 font-semibold text-amber-400">L</td>
                <td className="py-3 px-3">26.5"</td>
                <td className="py-3 px-3">23.5"</td>
                <td className="py-3 px-3">29.5"</td>
                <td className="py-3 px-3">34" - 36"</td>
              </tr>
              <tr className="hover:bg-neutral-800/40">
                <td className="py-3 px-3 font-semibold text-amber-400">XL</td>
                <td className="py-3 px-3">28.0"</td>
                <td className="py-3 px-3">24.5"</td>
                <td className="py-3 px-3">30.5"</td>
                <td className="py-3 px-3">36" - 38"</td>
              </tr>
              <tr className="hover:bg-neutral-800/40">
                <td className="py-3 px-3 font-semibold text-amber-400">XXL</td>
                <td className="py-3 px-3">29.5"</td>
                <td className="py-3 px-3">25.5"</td>
                <td className="py-3 px-3">31.5"</td>
                <td className="py-3 px-3">38" - 40"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400 leading-relaxed">
          <p className="font-semibold text-neutral-200 mb-1">Indian Fit & Drape Guidelines:</p>
          <p>
            • <strong>Baggy Jeans:</strong> Cut with relaxed skater rise. True to size will yield a comfortable wide-leg pool over sneakers.<br />
            • <strong>Linen Kurta-Shirts:</strong> Tailored with an airy tropical ease. No pulling at the chest or shoulders.<br />
            • <strong>Ladies Co-ords & Kurtis:</strong> Pre-shrunk fabrics with tailored waistlines and fluid flare.<br />
            • <strong>Traditional Bandhgalas:</strong> Structured internal canvas. Order your regular chest measurement for a razor-sharp festive profile.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 text-neutral-950 font-medium text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
