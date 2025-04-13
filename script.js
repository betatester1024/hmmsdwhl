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

let blacklist = ["aa","ac","ad","ae","af","ag","ah","ai","aj","ak","am","ao","bb","bc","bd","bg","bh","bj","bk","bm","bn","bp","cb","cc","cd","cf","cg","ci","cj","cl","cm","cn","cp","db","dc","dd","df","dh","dg","dj","dk","dl","dm","dn","dp","eb","ec","ed","ee","ef","eg","eh","ei","ej","ek","em","eo","ep","fb","fc","fd","ff","fg","fh","fj","fk","fm","fn","fp","gc","gd","ge","gf","gh","gj","gk","gm","gn","gp","hb","hd","hf","hc","hg","hh","hi","hj","hk","hl","hm","hp","ia","ib","ic","id","if","ig","ih","ie","ii","ij","ik","il","io","ip","jb","jc","jd","je","jf","jg","jh","ji","jj","jl","jk","jn","jo","ka","kb","kc","kd","kf","kg","kh","kj","kl","km","kk","ko","kp","lb","ki","lc","ld","lf","lg","lh","lj","lk","lm","ln","ll","lp","md","mb","mf","mg","mj","mh","mk","ml","mm","mn","mp","na","nb","nc","nd","ck","nf","ng","nh","nj","nk","nl","nm","nn","oa","og","oh","oe","oi","oj","ok","ol","om","oo","pb","pc","pd","pg","ph","pj","pk","pm","pp","bac","bad","baf","bag","bah","fl","bai","baj","bak","ban","bao","hn","bap","gba","gbc","gbe","gbf","gbg","jm","gbh","gbj","gbk","gbl","gbm","gbn","gbo","gbp","mcb","mcd","mcc","mce","mcf","mc","mcg","oci","ocj","mch","ocl","ock","ocm","ocn","oco","ocp","odc","odd","ode","odf","odg","odh","odi","odj","odk","odl","odm","odo","odn","np","peb","pec","odp","ped","pee","peg","peh","pef","pei","pej","pek","pel","pem","op","pf","pep","pn","baa","baaa","caab","caac","caad","caae","caaf","caag","caah","caai","caaj","caak","caam","caan","caao","caap","caba","cabb","cabc","cabd","cabe","cabf","cabg","cabh","cabi","cabj","cabk","cabl","cabm","cabn","cabo","cabp","caca","cacb","cacc","cacf","cacg","cacd","cach","cace","caci","cacj","cack","cacl","cacm","cacn","cacp","cada","cadb","gbd","cadc","cadd","cade","cadf","cadg","caco","cadh","cadi","cadj","cadk","cadl","cadm","cadn","cado","cadp","caeb","caec","caed","caee","caef","caeg","caeh","caea","caei","caej","caek","cael","caen","caeo","caep","cafa","cafb","cafc","mca","cafd","cafe","caff","cafg","cafh","cafi","cafj","cafk","cafl","cafm","cafn","cafo","cafp","caga","cagb","cagc","cagd","cage","cagf","cagg","cagh","cagi","cagj","cagk","cagl","cagm","cagn","cago","cagp","caha","cahb","cahc","cahd","cahe","cahf","cahg","cahh","cahi","cahj","cahk","cahl","cahm","cahn","cahp","caia","caic","caid","caie","caif","caig","caih","caii","caij","caik","cail","caim","cain","caio","caip","caja","cajb","cajc","cajd","caje","cajf","cajg","cajh","caji","cajj","cajk","cajl","cajm","cajo","cajp","caka","cakb","cakc","cakd","cake","cakg","cakh","cakf","caki","cakj","cakk","cakl","cakm","cakn","cako","caal","cakp","calc","cald","cale","calf","calg","calh","cali","calj","calk","call","caln","calo","calp","cama","camb","camc","camd","came","camg","camh","cami","camj","camk","caml","camm","camn","camo","camp","cana","canb","canc","cand","cane","canf","cang","cani","canh","canj","cank","cann","cano","canm","canp","caoa","caob","caoc","caem","caod","caoe","caof","caog","caoh","caho","caoi","caib","caoj","caok","caol","cajn","caom","calb","caon","caoo","camf","caop","capa","capb","canl","capc","capd","cape","capf","capg","caph","capi","capj","capk","capl","capm","capn","capo","capp","obaa","obab","obac","obad","obae","obaf","obag","obah","obai","obaj","obak","obal","obam","oban","obao","obap","obba","obbb","obbc","obbd","obbe","obbf","obbg","obbi","obbj","obbk","obbh","obbl","obbm","obbn","obbo","obbp","obcb","obcc","obcd","obcf","obce","obcg","obch","obcj","obck","obcl","obci","obcm","obco","obcp","obcn","obda","obdb","obdc","obdd","obde","obdf","obdg","obdh","obdi","obdk","obdl","obdm","obdn","obdo","obdp","obea","obdj","obec","obeb","obed","obee","obeg","obca","obef"];

async function findBlog() {
  for (let clen = 1; clen<=20; clen++) {
    let ch = [];
    for (let i=0; i<clen; i++) {ch.push(0)};
    while (ch[ch.length-1] < 16) {
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
        while (ch[curr2] >= 16) {
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