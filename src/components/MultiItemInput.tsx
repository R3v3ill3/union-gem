import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface MultiItemInputProps {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

const MultiItemInput: React.FC<MultiItemInputProps> = ({
  id,
  label,
  items,
  onChange,
  placeholder = 'Add an item',
  required = false,
  className = '',
  error,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex">
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-grow px-3 py-2 border ${
            error ? 'border-red-500' : 'border-neutral-300'
          } rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={18} />
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {items.length > 0 && (
        <ul className="mt-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center py-1 px-2 my-1 bg-neutral-100 rounded"
            >
              <span className="flex-grow text-sm">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-neutral-500 hover:text-red-500 focus:outline-none"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiItemInput;