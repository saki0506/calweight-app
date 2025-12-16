import { Delete } from 'lucide-react';

type NumberPadProps = {
  onInput: (digit: string) => void;
  onDelete: () => void;
  onDecimal: () => void;
};

export function NumberPad({ onInput, onDelete, onDecimal }: NumberPadProps) {
  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['delete', '0', '.'],
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      onDelete();
    } else if (key === '.') {
      onDecimal();
    } else {
      onInput(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {keys.flat().map((key, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleKeyPress(key)}
          className="h-10 md:h-12 text-lg md:text-xl font-medium text-gray-700 bg-gray-100 rounded-lg 
                     hover:bg-gray-200 active:bg-gray-300 transition-colors
                     flex items-center justify-center"
        >
          {key === 'delete' ? <Delete className="h-4 w-4 md:h-5 md:w-5" /> : key}
        </button>
      ))}
    </div>
  );
}