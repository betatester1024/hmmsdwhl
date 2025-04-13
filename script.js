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
        if (bList.length == 0) blacklist.push(content);
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

let blacklist = ["y","aa","ac","ad","ae","af","ag","ai","ah","aj","ak","am","aq","au","aw","ax","ay","az","bb","bc","bd","bg","bh","bj","bk","bn","bq","bs","bm","bp","bw","bz","cb","cc","cd","cf","cg","ci","cj","ck","cl","cm","cn","cp","cq","cs","ct","cu","cv","cw","cx","cz","db","dc","dg","dh","dd","df","dj","dk","dl","dn","dp","dq","dm","ds","dt","dv","dw","dx","dy","dz","eb","ec","ed","ee","ef","eg","eh","ei","ej","ek","em","eo","ep","eq","er","ew","ex","ey","et","ez","fb","fc","fd","ff","fg","fh","fj","fk","fl","fm","fn","fp","fq","fs","fu","ft","fv","fw","ao","av","fx","fy","fz","gc","gd","ge","gf","gh","gj","gk","gm","gp","gq","gn","gs","gt","gu","gv","gx","gy","gz","hb","hd","hc","hf","hg","hh","es","hj","eu","hk","hl","hm","hn","hp","hq","hr","ht","hv","hw","hx","hy","hz","ia","ic","ib","id","ie","if","ig","ih","ii","ij","ik","il","io","ip","iq","ir","it","iu","iv","iw","ix","iy","iz","jb","jc","jd","je","jf","jg","jh","ji","jj","jk","jl","jm","jn","jo","jq","jr","js","jt","jv","jw","jx","jy","jz","ka","kb","kc","kd","kf","ki","kj","kk","kl","km","kh","ko","kp","kq","kr","ks","kt","ku","kv","kw","kx","ky","kz","lc","lb","ld","lf","lg","lh","lj","lk","ll","lm","ln","lp","lq","lr","lt","ls","lu","lv","lw","lx","lz","mb","mc","md","mg","mh","mj","mf","mk","ml","mn","mm","mp","ms","mq","mt","mu","mv","mw","mx","mz","nb","nc","na","nf","ng","nh","nd","nj","nk","nm","hi","nn","np","nq","nl","nr","ns","nt","hs","nw","nx","ny","nz","oa","oe","og","oh","oi","oj","ok","ol","kg","om","oo","op","oq","os","mr","ou","ov","nv","ow","ox","oy","oz","pb","pc","pf","ph","pd","pj","pg","pk","pm","pn","pp","pq","ps","pt","pv","pw","px","py","pz","qb","qc","qd","qe","qf","qg","qh","qi","qj","qk","ql","qm","qn","qo","qp","qq","qr","qs","qt","qv","qw","qx","qy","qz","rb","rc","rd","rf","rg","rj","rh","rk","rl","rm","rq","rp","rs","rt","rn","rr","rv","rw","ry","rz","sb","sc","sd","se","sf","sg","sj","qa","sm","sr","ss","sv","sx","sy","sz","ta","tc","td","tb","te","tf","tg","ti","tl","tk","tj","tm","tn","tp","tq","ts","tt","tu","tv","tw","tx","ty","tz","ua","ub","ud","ue","uh","ui","uj","uk","ul","uf","um","uo","uq","us","ur","uu","ut","uv","ux","uy","uz","va","vb","vc","vd","ve","vf","vh","vg","vj","vk","vm","vl","vn","vo","vp","vq","vr","vs","vt","vu","vv","vw","vx","vy","wb","vz","wc","wd","wf","wg","wh","wj","wk","wn","wl","wm","wq","wr","wp","ws","wt","wu","ww","wv","wy","wz","xb","xc","xd","xe","xf","xg","xh","xi","xj","xk","xl","xm","xn","xo","xp","xq","xr","xs","xu","xv","xx","xy","xz","za","zb","zc","zd","ze","zf","zg","zh","zi","zj","zl","zm","zn","zo","zp","zq","zr","zt","zu","zv","zs","zw","zx","zz","abb","abc","aba","abd","abe","abg","abh","abi","abf","abj","abk","abl","abm","abn","abq","abr","abs","abt","abu","abp","abv","abw","abx","aby","ala","alb","alc","ald","ale","alf","alg","alh","ali","alj","all","alm","alk","aln","alp","alq","alr","als","alt","alu","alv","alw","alx","aly","alz","ana","anb","ane","anf","anc","and","anh","ani","ank","xa","anl","anm","ann","ano","zk","anp","anq","anr","ans","ant","anu","abz","anv","anw","anx","any","anz","apb","apd","ape","apc","apf","apg","aph","apj","apk","api","apl","apm","apn","apo","app","apq","apr","aps","apu","apv","apw","apx","apy","apt","apz","ara","arc","are","arg","arb","ard","arh","ari","arf","ark","aro","arm","arq","arn","arr","ars","aru","arw","arv","arx","ary","arz","asb","asc","asa","asd","ase","asf","asg","asi","asj","ask","asl","asm","asn","aso","asp","asq","asr","ass","ast","asu","asv","asw","asx","asy","asz","ata","atc","ate","atf","atg","ath","ati","atj","atk","atl","atm","atn","atp","atq","ats","atr","atu","atv","atw","atx","aty"];

async function findBlog() {
  for (let clen = 1; clen<=20; clen++) {
    let ch = [];
    for (let i=0; i<clen; i++) {ch.push(0)};
    while (ch[ch.length-1] < 26) {
      let assembled = "";
      for (let i=clen-1; i>=0; i--) assembled+= String.fromCharCode(97+ch[i]);
      console.log(assembled);
      let reject = false;
      for (let i=0; i<blacklist.length; i++) {
        if (assembled.startsWith(blacklist[i])) {
          reject = true;
          console.log("REJECTED "+assembled);
          break;
        }
      }
      if (killSwitch) return;
      if (!reject) {
        sendXMLRequest(assembled)
        await delay(100);
      }
      
      ch[0]++;
      let curr = 0;
      while (ch[curr] >= 26) {
        if (curr == ch.length-1) break;
        ch[curr] = 0;
        ch[curr+1]++;
        curr++;
      }
    }
  }
}