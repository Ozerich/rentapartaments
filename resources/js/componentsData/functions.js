function getFullDate() {
   let d = new Date();
   let year = d.getFullYear();
   let month = d.getMonth()<10?'0'+d.getMonth():d.getMonth();
   let date = d.getDate();
   return `${date}.${month}.${year}`;
}

export {getFullDate}
