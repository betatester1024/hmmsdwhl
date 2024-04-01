let apr1 = false;

function byId(id) {
  return document.getElementById(id);
}

let gotLoc = false;
let currLoc = {x:-2.0, y:0.0};

function accessLoc() {
    navigator.geolocation.getCurrentPosition((position) => {
    currLoc.x = position.coords.latitude;
    gotLoc = true;
    currLoc.y = position.coords.longitude;
    recalculateTime();
    // byId("")
  }, (err)=>{
    byId("info").style.color = "red";
  });
}
function globalOnload(a) {
  if (a) apr1 = true;
  accessLoc();
  let i=0;
  for (let ele of document.getElementsByClassName("animateIn")) {
    animateEle(ele, i);
    i++;
  }
  for (let ele of document.getElementsByClassName("animateIn_noCSS")) {
    animateEle(ele, i);
    i++;
  }
  recalculateTime();
  setInterval(recalculateTime, 2000);
}

function animateEle(ele, i) {
  setTimeout(()=>{ele.style.opacity = 1; ele.style.top = "0%";}, i*100);
}
function recalculateTime() {
  let timeOfWriting = 1711728083552n;
  let yearMs = BigInt(365*24*60*60*1000);
  let startTime = timeOfWriting - 4543000000n*yearMs; // 4.543 years before time of writing
  let finalTime = timeOfWriting + 7500000000n*yearMs; // 7.5 billion years after time of writing
  // Updates in real-time!
  let tLeft = (finalTime - BigInt(Date.now()));
  let dayMs = BigInt(24*60*60*1000);
  let sunsetsLeft = tLeft/dayMs; 
  
  if (apr1) sunsetsLeft = 0;
//   
  let roundsExactly = tLeft % dayMs == 0;// if rounds exactly, do not add 1.
  // has yours passed yet? 
  // let timeNow = new Date();
  let setTime = SunCalc.getTimes(new Date(), currLoc.x, currLoc.y).sunset;
  if (Date.now() < setTime.getTime() && !roundsExactly) {// not yet sunset
    // console.log("not yet sunset!");
    sunsetsLeft++;
  }
  
  if (gotLoc) {
    if (Date.now() > setTime.getTime()) {
      byId("info").innerText = "A sunset has occured at your location today."
    }
    else byId("info").innerText = "A sunset has not yet occured at your location today."
  }
  // else if (Date.now() < roundsExactly) 
    // sunsetsLeft;
  // if (timeNow)
  if (apr1) finalTime = setTime.getTime();
  if (apr1) {
    let tm = new Date();
    tm.setHours(0);
    tm.setMinutes(0);
    tm.setSeconds(0);
    tm.setMilliseconds(0);
    startTime = tm.getTime();
  }
  let percentThru = (Date.now() - Number(startTime))/(Number(finalTime) - Number(startTime));
  console.log(percentThru)
  byId("progressInner").style.width = Math.min(1,percentThru)*100+"%";
  if (percentThru > 0.8) byId("progressInner").style.backgroundColor = "var(--system-red)";
  byId("progressText").innerText = sunsetsLeft.toLocaleString() +(gotLoc?" left":" (estimated)");
}