"use client"

export default function TextEditor({ textElements, setTextElements }) {
  const addText = () => {
    const newId = Math.max(0, ...textElements.map(t => t.id)) + 1;
    setTextElements([...textElements, {
      id: newId,
      content: "New Text",
      position: "bottom",
      color: "#FFFFFF",
      fontSize: 24
    }]);
  };

  const updateText = (id, field, value) => {
    setTextElements(textElements.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={addText}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
      >
        + Add Text
      </button>

      {textElements.map(text => (
        <div key={text.id} className="p-4 border rounded-lg">
          <input
            type="text"
            value={text.content}
            onChange={(e) => updateText(text.id, 'content', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          
          <div className="flex gap-4">
            <select
              value={text.position}
              onChange={(e) => updateText(text.id, 'position', e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
            
            <input
              type="color"
              value={text.color}
              onChange={(e) => updateText(text.id, 'color', e.target.value)}
              className="w-10 h-10"
            />
          </div>
          
          <input
            type="range"
            min="12"
            max="72"
            value={text.fontSize}
            onChange={(e) => updateText(text.id, 'fontSize', parseInt(e.target.value))}
            className="w-full mt-2"
          />
          <span className="text-xs block text-center">{text.fontSize}px</span>
        </div>
      ))}
    </div>
  );
}