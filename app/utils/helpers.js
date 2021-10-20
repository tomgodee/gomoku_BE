export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

// 35% chance to go down at maximum 10%
// 65% chance to go up at maximum 15%
export const getRandomProfit = () => {
  const randomNumber = Math.random() - 0.35;
  if (randomNumber < 0) return Number((randomNumber * (10 / 0.35)).toFixed(2));
  else return Number((randomNumber * (15 / 0.65)).toFixed(2));
}
