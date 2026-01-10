import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SelectCustomizadoProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const SelectCustomizado = ({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  disabled = false,
  size = "md",
}: SelectCustomizadoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const sizeClasses = {
    sm: "text-sm py-0",
    md: "text-base py-0",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    
    if ((atTop && e.touches[0].clientY > element.getBoundingClientRect().top) ||
        (atBottom && e.touches[0].clientY < element.getBoundingClientRect().bottom)) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between ${
          sizeClasses[size]
        } bg-transparent text-gray-300 focus:outline-none transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
          )}
          <span className={selectedOption ? "text-gray-300" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-purple-400 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div 
          className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-purple-500/30 bg-card/95 backdrop-blur-xl shadow-xl max-h-60 overflow-y-auto"
          onScroll={handleDropdownScroll}
          onTouchMove={handleTouchMove}
          onWheel={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-500/20 transition-colors ${
                option.value === value ? "bg-purple-500/10" : ""
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                {option.icon && (
                  <option.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    option.value === value ? "text-purple-400" : "text-gray-300"
                  }`}
                >
                  {option.label}
                </span>
              </div>
              {option.value === value && (
                <Check className="w-4 h-4 text-purple-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectCustomizado;
