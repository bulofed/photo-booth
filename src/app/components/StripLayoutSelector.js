export default function StripLayoutSelector({ stripRows, stripCols, setStripRows, setStripCols }) {
  return (
    <div className="mb-6 flex flex-col">
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-y-2">
          <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Rows</label>
          <input
            type="number"
            min={1}
            max={6}
            value={stripRows}
            onChange={e => setStripRows(Number(e.target.value))}
            className="h-8 border border-neutral-300 rounded px-3 py-2 w-fit text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
          />
        </div>
        <div className="flex-1 flex flex-col gap-y-2">
          <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Columns</label>
          <input
            type="number"
            min={1}
            max={6}
            value={stripCols}
            onChange={e => setStripCols(Number(e.target.value))}
            className="h-8 border border-neutral-300 rounded px-3 py-2 w-fit text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
          />
        </div>
      </div>
    </div>
  );
}
