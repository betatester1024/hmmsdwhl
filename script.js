
function byId(id) {
  return document.getElementById(id);
}

let gotLoc = false;
let currLoc = {x:-2.0, y:0.0};
function globalOnload() {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("got pos!");
    currLoc.x = position.coords.latitude;
    gotLoc = true;
    currLoc.y = position.coords.longitude;
    recalculateTime();
    // byId("")
  });
  recalculateTime();
  setInterval(recalculateTime, 2000);
}

function recalculateTime() {
  let timeOfWriting = 1711728083552n;
  let yearMs = BigInt(365*24*60*60*1000);
  let startTime = timeOfWriting - 4543000000n*yearMs; // 4.543 years before time of writing
  let finalTime = timeOfWriting + 7500000000n*yearMs; // 7.5 billion years after time of writing
  // Updates in real-time!
  let tLeft = (finalTime - BigInt(Date.now()));
  let dayMs = BigInt(24*60*60*100);
  let sunsetsLeft = tLeft/dayMs; 
  let roundsExactly = tLeft % dayMs == 0;// if rounds exactly, do not add 1.
  // has yours passed yet? 
  let timeNow = new Date();
  console.log(roundsExactly);
  let setTime = SunCalc.getTimes(new Date(), currLoc.x, currLoc.y).sunset;
  console.log(setTime.getTime(), Date.now())
  if (Date.now() < setTime.getTime() && !roundsExactly) {// not yet sunset
    // console.log("not yet sunset!");
    sunsetsLeft++;
  }
  
  if (gotLoc) {
    if (Date.now > setTime.getTime()) {
      byId("info").innerText = "A sunset has occured at your location today."
    }
    else byId("info").innerText = "A sunset has not yet occured at your location today."
  }
  // else if (Date.now() < roundsExactly) 
    // sunsetsLeft;
  // if (timeNow)
  let percentThru = (Date.now() - Number(startTime))/(Number(finalTime) - Number(startTime));
  console.log(percentThru)
  byId("progressInner").style.width = percentThru*100+"%";
  byId("progressText").innerText = sunsetsLeft.toLocaleString() +(gotLoc?" left":" (estimated)");
}