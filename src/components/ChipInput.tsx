import React, { useState, useRef } from "react";

type ChipInputProps = {
  chips: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
};

const Tag: React.FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <div className="flex items-center justify-center px-2 py-1 my-1 mr-1 text-blue-500 bg-blue-100 border border-blue-500 rounded-lg animate-slideRightAndFade">
    <span className="text-sm font-bold">{label}</span>
    <button className="ml-1 focus:outline-none" onClick={onRemove}>
      &#x2715;
    </button>
  </div>
);

const ChipInput: React.FC<ChipInputProps> = ({
  chips,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      const updatedChips = chips.slice(0, -1);
      onChange(updatedChips);
      return;
    }

    if ((e.key === "Enter" || e.key === ",") && inputValue) {
      if (e.key === ",") {
        // remove the comma
        setInputValue((prev) => prev.slice(0, -1));
      }
      // check if the chip already exists
      if (chips.includes(inputValue)) {
        setInputValue("");
        return;
      }

      const updatedChips = [...chips, inputValue];
      onChange(updatedChips);
      setInputValue("");
    }
  };

  const handleChipRemove = (chip: string) => {
    const updatedChips = chips.filter((c) => c !== chip);
    onChange(updatedChips);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center w-full px-2 py-2 text-sm font-normal bg-white border border-gray-600 rounded-lg shadow-sm h-max dark:bg-black dark:text-white dark:shadow-none">
        {chips.map((chip) => (
          <Tag
            key={chip}
            label={chip}
            onRemove={() => handleChipRemove(chip)}
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          className="h-full bg-transparent outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400"
          onChange={handleInputChange}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === ",") {
              e.preventDefault();
            }
          }}
          onKeyUp={handleInputKeyPress}
        />
      </div>
    </div>
  );
};

export default ChipInput;
