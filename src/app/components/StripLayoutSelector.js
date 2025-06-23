import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

// Helper function to compare arrays
const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (Array.isArray(a[i])) {
      if (!arraysEqual(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) return false;
  }
  return true;
};

export default function StripLayoutSelector({
  layout,
  padding,
  topMargin,
  bottomMargin,
  setLayout,
  setPadding,
  setTopMargin,
  setBottomMargin,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Layout configurations for comparison
  const layoutOptions = {
    option1: [[0], [1], [2], ['text']],
    option2: [['text'], [0], [1], [2], ['text']],
    option3: [[0], [1], [2], [3], ['text']],
    option4: [['text'], [0], [1], [2], [3]]
  };

  const isLayoutActive = (layoutToCompare) => {
    return arraysEqual(layout, layoutToCompare);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="text-xs text-neutral-600 uppercase font-bold tracking-wider">
          Choose Layout
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Layout Option 1 */}
          <button
            className={`border rounded-lg p-3 bg-white transition-all text-sm text-left h-full ${
              isLayoutActive(layoutOptions.option1)
                ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]'
                : 'border-neutral-200 hover:bg-neutral-50 shadow-xs'
            }`}
            onClick={() => {
              setLayout(layoutOptions.option1);
              setTopMargin(0);
              setBottomMargin(80);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 gap-1 mb-2 w-full">
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-2 bg-neutral-300 rounded-sm mt-2"></div>
              </div>
              <span className="text-xs text-neutral-600">1 column, 3 lines + bottom text</span>
            </div>
          </button>

          {/* Layout Option 2 */}
          <button
            className={`border rounded-lg p-3 bg-white transition-all text-sm text-left h-full ${
              isLayoutActive(layoutOptions.option2)
                ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]'
                : 'border-neutral-200 hover:bg-neutral-50 shadow-xs'
            }`}
            onClick={() => {
              setLayout(layoutOptions.option2);
              setTopMargin(10);
              setBottomMargin(40);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 gap-1 mb-2 w-full">
                <div className="h-2 bg-neutral-300 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm mt-1"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-2 bg-neutral-300 rounded-sm mt-1"></div>
              </div>
              <span className="text-xs text-neutral-600">1 column, 3 lines + top/bottom text</span>
            </div>
          </button>

          {/* Layout Option 3 */}
          <button
            className={`border rounded-lg p-3 bg-white transition-all text-sm text-left h-full ${
              isLayoutActive(layoutOptions.option3)
                ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]'
                : 'border-neutral-200 hover:bg-neutral-50 shadow-xs'
            }`}
            onClick={() => {
              setLayout(layoutOptions.option3);
              setTopMargin(0);
              setBottomMargin(30);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 gap-1 mb-2 w-full">
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-2 bg-neutral-300 rounded-sm mt-1"></div>
              </div>
              <span className="text-xs text-neutral-600">1 column, 4 lines + bottom text</span>
            </div>
          </button>

          {/* Layout Option 4 */}
          <button
            className={`border rounded-lg p-3 bg-white transition-all text-sm text-left h-full ${
              isLayoutActive(layoutOptions.option4)
                ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]'
                : 'border-neutral-200 hover:bg-neutral-50 shadow-xs'
            }`}
            onClick={() => {
              setLayout(layoutOptions.option4);
              setTopMargin(30);
              setBottomMargin(0);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 gap-1 mb-2 w-full">
                <div className="h-2 bg-neutral-300 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm mt-1"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
                <div className="h-3 bg-indigo-400 rounded-sm"></div>
              </div>
              <span className="text-xs text-neutral-600">1 column, 4 lines + top text</span>
            </div>
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4">
        <button
          className="w-full flex justify-between items-center gap-2 text-xs text-neutral-600 uppercase font-bold tracking-wider hover:text-neutral-800 transition-colors"
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
        >
          <span>{showAdvanced ? 'Hide advanced options' : 'Show advanced options'}</span>
          <FaChevronRight
            className={`transition-transform duration-200 text-neutral-400 ${showAdvanced ? 'rotate-90' : 'rotate-0'}`}
          />
        </button>
        
        {showAdvanced && (
          <div className="flex gap-4 mt-4">
            <div className="flex-1 flex flex-col gap-y-2">
              <label className="text-xs text-neutral-600 uppercase font-bold tracking-wider">Padding</label>
              <input
                type="number"
                min={0}
                max={100}
                value={padding}
                onChange={e => setPadding(Number(e.target.value))}
                className="h-9 text-center border border-neutral-200 rounded-md px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-y-2">
              <label className="text-xs text-neutral-600 uppercase font-bold tracking-wider">Top Margin</label>
              <input
                type="number"
                min={0}
                max={300}
                value={topMargin}
                onChange={e => setTopMargin(Number(e.target.value))}
                className="h-9 text-center border border-neutral-200 rounded-md px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-y-2">
              <label className="text-xs text-neutral-600 uppercase font-bold tracking-wider">Bottom Margin</label>
              <input
                type="number"
                min={0}
                max={300}
                value={bottomMargin}
                onChange={e => setBottomMargin(Number(e.target.value))}
                className="h-9 text-center border border-neutral-200 rounded-md px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}