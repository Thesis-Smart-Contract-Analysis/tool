/**
 * References:
 *  - https://dev.to/shivishbrahma/designing-a-typewriter-react-component-3kea
 *  - https://blog.logrocket.com/code-block-typewriter-effect-react/
 */

import { useEffect, useState } from 'react';

let index = 1;

export const useTypeWritter = ({
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
  const [typeWritter, setTypeWritter] = useState('');
  const [isErase, setIsErase] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(
      () => {
        if (isTyping) {
          if (currentText) {
            setTypeWritter(currentText.slice(0, typeWritter.length + 1));
          }
        }

        if (isErase) {
          setTypeWritter(typeWritter.slice(0, typeWritter.length - 1));
        }
      },
      isTyping ? delayTyping : delayErasing
    );

    return () => {
      clearTimeout(timerId);
    };
  }, [typeWritter, isTyping, isErase, currentText, delayTyping, delayErasing]);

  useEffect(() => {
    if (typeWritter.length === 0) {
      setIsErase(false);
      return;
    }

    if (currentText?.length !== typeWritter.length) return;

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
    typeWritter,
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
    typeWritter,
  };
};
