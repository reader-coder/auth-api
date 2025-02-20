export const errorExtractor = (error) => {
  const errorArray = [];
  Object.entries(error.errors).forEach((item) =>
    errorArray.push(item[1].message)
  );
  return errorArray;
};
