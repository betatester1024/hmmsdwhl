function byId(id) {
  return document.getElementById(id);
}

function globalOnload() {
  let timeOfWriting = 1711728083552n;
  let yearMs = BigInt(365*24*60*60*1000);
  let startTime = timeOfWriting - 4543000000n*yearMs; // 4.543 years before time of writing
  let finalTime = timeOfWriting + 7500000000n*yearMs; // 7.5 billion years after time of writing
  // Updates in real-time!
  let sunsetsLeft = (finalTime - BigInt(Date.now()))/BigInt(24*60*60*100);// timeLeft = finalTime - now)/ 
  // has yours passed yet? 
  let timeNow = new Date();
  if (timeNow )
  let percentThru = (Date.now() - Number(startTime))/(Number(finalTime) - Number(startTime));
  console.log(percentThru)
  byId("progressInner").style.width = percentThru*100+"%";
  byId("progressText").innerText = ""
}