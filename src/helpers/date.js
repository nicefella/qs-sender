
function convertUnixTimestampToFormattedDate(unixTimestamp) {
     const date = new Date(unixTimestamp); // Convert to milliseconds
     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
     const year = date.getFullYear();
     return `${day}.${month}.${year}`;
}
module.exports = {
     convertUnixTimestampToFormattedDate
};
