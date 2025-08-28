  export const calculateRideDuration = (fromPincode, toPincode) => {
  const diff = Math.abs(parseInt(toPincode) - parseInt(fromPincode));
  return diff % 24;
};

