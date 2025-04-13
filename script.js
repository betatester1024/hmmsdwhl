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


function sendXMLRequest(content) {
  var http = new XMLHttpRequest();
  var url = 'https://www.tumblr.com/api/v2/typeahead/resting'+content;
  var params = 'fields[blogs]=?avatar,name,url,?blog_view_url,?title,?followed,?theme&query_source=search_box';
  http.open('GET', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        let jData = JSON.parse(http.responseText);
        let bList = jData.response.results[3].blogs;
        // console.log(bList);
        if (bList.length == 0) {
          blacklist.push(content);
          console.log(content, "FAIL!");
        }
        else console.log(content, "RESULT!")
        for (let b of bList) {
          if (b.title.toLowerCase() == "ginkgo") {
            console.log("YES!");
            console.log(b);
            killSwitch = true;
          }
          // else console.log(b.title.toLowerCase());
        }
      }
  }
  http.send(params);

}

let killSwitch = false;
const delay = (time) => new Promise((resolve, reject) => setTimeout(resolve, time))

let blacklist = [];

async function findBlog() {
  for (let clen = 1; clen<=20; clen++) {
    let ch = [];
    for (let i=0; i<clen; i++) {ch.push(0)};
    while (ch[ch.length-1] < 26) {
      let assembled = "";
      for (let i=clen-1; i>=0; i--) assembled+= String.fromCharCode(97+ch[i]);
      // console.log(assembled);
      let reject = false;
      let reason = ""
      for (let i=0; i<blacklist.length; i++) {
        if (assembled.startsWith(blacklist[i])) {
          reject = true;
          reason = blacklist[i]
          console.log("REJECTED "+assembled + " because "+blacklist[i]);
          break;
        }
      }
      if (killSwitch) return;
      if (!reject) {
        sendXMLRequest(assembled)
        await delay(100);
      }
      else {
        ch[clen-reason.length]++;
        console.log("INCR", clen-reason.length)
        let curr2 = clen-reason.length;
        while (ch[curr2] >= 26) {
          if (curr2 == ch.length-1) break;
          ch[curr2] = 0;
          ch[curr2+1]++;
          curr2++;
        }
        for (let i=clen-reason.length-1; i>=0; i--) {
          ch[i] = 0;
        }
        assembled = "";
        for (let i=clen-1; i>=0; i--) assembled+= String.fromCharCode(97+ch[i]);
        console.log("next="+assembled);
        continue;
      }
      ch[0]++;
      let curr = 0;
      while (ch[curr] >= 16) {
        if (curr == ch.length-1) break;
        ch[curr] = 0;
        ch[curr+1]++;
        curr++;
      }
    }
  }
}