import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none mb-1">
          Layouts
        </label>
        <button
          className="border rounded px-3 py-1 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => {
            setLayout([[0], [1], [2], ['text']]);
            setTopMargin(0);
            setBottomMargin(80);
          }}
        >
          1 column, 3 lines with a bottom text
        </button>
        <button
          className="border rounded px-3 py-1 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => {
            setLayout([['text'], [0], [1], [2], ['text']]);
            setTopMargin(10);
            setBottomMargin(40);
          }}
        >
          1 column, 3 lines with a top and bottom text
        </button>
        <button
          className="border rounded px-3 py-1 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => {
            setLayout([[0], [1], [2], [3], ['text']])
            setTopMargin(0);
            setBottomMargin(30);
          }}
        >
          1 column, 4 lines with a bottom text
        </button>
        <button
          className="border rounded px-3 py-1 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => {
            setLayout([['text'], [0], [1], [2], [3]])
            setTopMargin(30);
            setBottomMargin(0);
          }}
        >
          1 column, 4 lines with a top text
        </button>
      </div>

      <button
        className="mt-2 flex justify-between items-center gap-2 text-xs text-neutral-500 uppercase font-black tracking-wider leading-none"
        type="button"
        onClick={() => setShowAdvanced(v => !v)}
      >
        <FaChevronRight
          className={`transition-transform duration-200 ${showAdvanced ? 'rotate-90' : 'rotate-0'}`}
        />
        {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
      </button>
      
      {showAdvanced && (
        <div className="flex gap-4 mt-4">
          <div className="flex-1 flex flex-col gap-y-2">
            <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Padding</label>
            <input
              type="number"
              min={0}
              max={100}
              value={padding}
              onChange={e => setPadding(Number(e.target.value))}
              className="h-8 text-center border border-neutral-300 rounded px-3 py-2 w-fit text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
            />
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Top Margin</label>
            <input
              type="number"
              min={0}
              max={300}
              value={topMargin}
              onChange={e => setTopMargin(Number(e.target.value))}
              className="h-8 text-center border border-neutral-300 rounded px-3 py-2 w-fit text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
            />
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Bottom Margin</label>
            <input
              type="number"
              min={0}
              max={300}
              value={bottomMargin}
              onChange={e => setBottomMargin(Number(e.target.value))}
              className="h-8 text-center border border-neutral-300 rounded px-3 py-2 w-fit text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}