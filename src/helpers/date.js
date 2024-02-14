
const makeAnErkekDate = (YumusakDate) => {
     const parts = YumusakDate.split('.'); // 2023-01-23 // 01.02.2023
     const mydate = new Date(parts[2], parts[1] - 1, parts[0]);
     return mydate.toDateString();
};

module.exports = {
     makeAnErkekDate
};
