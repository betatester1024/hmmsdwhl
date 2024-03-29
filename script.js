function byId(id) {
  return document.getElementById(id);
}

function globalOnload() {
  let timeOfWriting = 1711728083552;
  let startTime = timeOfWriting - 4543000000*365*24*60*60*1000; // 4.543 years before time of writing
  let finalTime = timeOfWriting + 7500000000*365*24*60*60*1000; // 7.5 billion years after time of writing
  // Updates in real-time!
  let percentThru = (Date.now() - startTime)/(finalTime - startTime);
  byId("progressInner").style.width = percentThru*100+"%";
  
}