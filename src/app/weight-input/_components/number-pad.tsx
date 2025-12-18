'use client';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './number-pad.css';

type NumberPadProps = {
  onInput: (digit: string) => void;
  onDelete: () => void;
  onDecimal: () => void;
};

export function NumberPad({ onInput, onDelete, onDecimal }: NumberPadProps) {
  const handleKeyPress = (button: string) => {
    if (button === '{bksp}') {
      onDelete();
    } else if (button === '.') {
      onDecimal();
    } else {
      onInput(button);
    }
  };

  return (
    <Keyboard
      onKeyPress={handleKeyPress}
      layout={{
        default: ['7 8 9', '4 5 6', '1 2 3', '{bksp} 0 .'],
      }}
      display={{
        '{bksp}': '⌫',
      }}
      theme="hg-theme-default hg-layout-numeric custom-number-pad"
    />
  );
}