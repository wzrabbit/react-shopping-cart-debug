import { useState, useEffect, useRef } from "react";
import { IdQuantity } from "../types";

type UseQuantityUpdaterProps = {
  productId: number;
  initialValue: number;
  minValue: number;
  quantityUpdateCallbacks: ((data: IdQuantity) => void)[];
};

const removeNonDigits = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

const useQuantityUpdater = ({
  productId,
  initialValue,
  minValue,
  quantityUpdateCallbacks,
}: UseQuantityUpdaterProps) => {
  const [inputValue, setInputValue] = useState(initialValue.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonMode, setIsButtonMode] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    const newInputValue = Math.max(Number(inputValue), minValue);
    setIsButtonMode(() => !isFocused && newInputValue === 0);
  }, [isFocused, inputValue, minValue]);

  const updateInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    firstRun.current = false;
    const newInputValue = removeNonDigits(event.target.value);
    setIsFocused(() => true);
    setInputValue(() => newInputValue);
  };

  const incrementInputValue = (incrementValue: number) => {
    firstRun.current = false;
    setInputValue((previousInputValue) =>
      Math.max(Number(previousInputValue) + incrementValue, minValue).toString()
    );
  };

  useEffect(() => {
    if (isFocused || firstRun.current) {
      return;
    }

    quantityUpdateCallbacks.forEach((callback) =>
      callback({ id: productId, quantity: Number(inputValue) })
    );
  }, [inputValue, isFocused, productId, quantityUpdateCallbacks]);

  const initializeInputValue = () => {
    firstRun.current = false;
    setInputValue(() => "1");
  };

  return {
    inputValue,
    isButtonMode,
    setIsFocused,
    updateInputValue,
    initializeInputValue,
    incrementInputValue,
  };
};

export default useQuantityUpdater;
