
const obj = {
    name: 'lam',
    profile: {
        subName: 'vu',
        age: 21,
        birthdate: {
            isOver: true,
            // isGay: null
        }
    }
}

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};



// 

console.log(updateNestedObjectParser(obj));