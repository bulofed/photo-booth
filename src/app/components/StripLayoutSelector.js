export default function StripLayoutSelector({ stripRows, stripCols, setStripRows, setStripCols }) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <label className="mb-2 font-medium">Photo strip layout:</label>
      <div className="flex gap-4">
        <div>
          <label className="mr-2">Rows:</label>
          <input
            type="number"
            min={1}
            max={6}
            value={stripRows}
            onChange={e => setStripRows(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16 text-center"
          />
        </div>
        <div>
          <label className="mr-2">Columns:</label>
          <input
            type="number"
            min={1}
            max={6}
            value={stripCols}
            onChange={e => setStripCols(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16 text-center"
          />
        </div>
      </div>
    </div>
  );
}
