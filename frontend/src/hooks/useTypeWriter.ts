/**
 * References:
 *  - https://dev.to/shivishbrahma/designing-a-typewriter-react-component-3kea
 *  - https://blog.logrocket.com/code-block-typewriter-effect-react/
 */

import { useEffect, useState } from 'react';

let index = 1;

export const useTypeWriter = ({
  multiText,
  loop = true,
  size = multiText.length,
  delayTyping = 50,
  delayErasing = 50,
  delayBeforeErase = 1000,
}: {
  multiText: string[];
  loop?: boolean;
  size?: number;
  delayTyping?: number;
  delayErasing?: number;
  delayBeforeErase?: number;
}) => {
  const [currentText, setCurrentText] = useState(multiText[0]);
  const [typeWriter, setTypeWriter] = useState('');
  const [isErase, setIsErase] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(
      () => {
        if (isTyping) {
          if (currentText) {
            setTypeWriter(currentText.slice(0, typeWriter.length + 1));
          }
        }

        if (isErase) {
          setTypeWriter(typeWriter.slice(0, typeWriter.length - 1));
        }
      },
      isTyping ? delayTyping : delayErasing,
    );

    return () => {
      clearTimeout(timerId);
    };
  }, [typeWriter, isTyping, isErase, currentText, delayTyping, delayErasing]);

  useEffect(() => {
    if (typeWriter.length === 0) {
      setIsErase(false);
      return;
    }

    if (currentText?.length !== typeWriter.length) return;

    const timerId = setTimeout(() => {
      if (index === size && !loop) {
        setIsErase(false);

        setCurrentText('');
      } else {
        setIsErase(true);

        setCurrentText(multiText[index++ % size]);
      }
    }, delayBeforeErase);

    return () => {
      clearTimeout(timerId);
    };
  }, [
    typeWriter,
    isTyping,
    currentText,
    multiText,
    loop,
    size,
    delayBeforeErase,
  ]);

  useEffect(() => {
    setIsTyping(!isErase);
  }, [isErase]);

  return {
    typeWriter,
  };
};
