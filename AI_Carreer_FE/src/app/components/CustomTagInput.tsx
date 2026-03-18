import { useState } from "react";
import { Plus, X } from "lucide-react";

interface CustomTagInputProps {
  /** Preset options shown as chips */
  presets: string[];
  /** Currently selected values */
  selected: string[];
  onChange: (values: string[]) => void;
  /** Allow selecting multiple values */
  multi?: boolean;
  placeholder?: string;
}

export function CustomTagInput({
  presets,
  selected,
  onChange,
  multi = true,
  placeholder = "Nhập tùy chỉnh...",
}: CustomTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const toggle = (item: string) => {
    if (multi) {
      const next = selected.includes(item)
        ? selected.filter((v) => v !== item)
        : [...selected, item];
      onChange(next);
    } else {
      onChange(selected[0] === item ? [] : [item]);
    }
  };

  const addCustom = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (multi) {
      if (!selected.includes(trimmed)) onChange([...selected, trimmed]);
    } else {
      onChange([trimmed]);
    }
    setInputValue("");
  };

  const remove = (item: string) => {
    onChange(selected.filter((v) => v !== item));
  };

  // Custom tags = selected values not in presets
  const customTags = selected.filter((v) => !presets.includes(v));

  return (
    <div className="space-y-3">
      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {presets.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
              selected.includes(item)
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-600 hover:border-blue-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Custom tags */}
      {customTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 border-2 border-orange-300 rounded-full text-sm"
            >
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:text-orange-900">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!inputValue.trim()}
          className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-all disabled:opacity-40"
        >
          <Plus className="size-4" />
          Thêm
        </button>
      </div>
    </div>
  );
}
