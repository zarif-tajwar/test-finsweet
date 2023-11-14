export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const scaleValue = (
  input: number,
  inputRange: number[],
  outputRange: number[],
  forceInteger = false
) => {
  if (
    !Array.isArray(inputRange) ||
    inputRange.length !== 2 ||
    !Array.isArray(outputRange) ||
    outputRange.length !== 2
  ) {
    throw new Error('Input and output ranges must be arrays with two elements.');
  }

  const [minInput, maxInput] = inputRange;
  const [minOutput, maxOutput] = outputRange;

  let scaledValue;

  if (minInput === maxInput && minOutput === maxOutput) {
    scaledValue = minOutput;
  } else {
    scaledValue =
      ((input - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) + minOutput;
  }

  if (forceInteger) {
    scaledValue = Math.round(scaledValue);
  }

  return Math.max(Math.min(scaledValue, maxOutput), minOutput);
};
