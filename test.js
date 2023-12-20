const array = ['name', 'age', 'year']
const array2 = [['name', 1], ['age', 1], ['year', 1]]
console.log(Object.fromEntries(array.map(el => [el, 1])));
console.log(Object.fromEntries(array2));