export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const checkCircleLine = (line) => {
  const winningConditionRegex = /X?O{5}[^X]|[^X]O{5}X?/;
  return winningConditionRegex.test(line);
}

export const checkExLine = (line) => {
  const winningConditionRegex = /O?X{5}[^O]|[^O]X{5}O?/;
  return winningConditionRegex.test(line);
}