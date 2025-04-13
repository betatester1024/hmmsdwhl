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

let blacklist = ["y","aa","ac","ad","ae","af","ag","ai","ah","aj","ak","am","aq","au","aw","ax","ay","az","bb","bc","bd","bg","bh","bj","bk","bn","bq","bs","bm","bp","bw","bz","cb","cc","cd","cf","cg","ci","cj","ck","cl","cm","cn","cp","cq","cs","ct","cu","cv","cw","cx","cz","db","dc","dg","dh","dd","df","dj","dk","dl","dn","dp","dq","dm","ds","dt","dv","dw","dx","dy","dz","eb","ec","ed","ee","ef","eg","eh","ei","ej","ek","em","eo","ep","eq","er","ew","ex","ey","et","ez","fb","fc","fd","ff","fg","fh","fj","fk","fl","fm","fn","fp","fq","fs","fu","ft","fv","fw","ao","av","fx","fy","fz","gc","gd","ge","gf","gh","gj","gk","gm","gp","gq","gn","gs","gt","gu","gv","gx","gy","gz","hb","hd","hc","hf","hg","hh","es","hj","eu","hk","hl","hm","hn","hp","hq","hr","ht","hv","hw","hx","hy","hz","ia","ic","ib","id","ie","if","ig","ih","ii","ij","ik","il","io","ip","iq","ir","it","iu","iv","iw","ix","iy","iz","jb","jc","jd","je","jf","jg","jh","ji","jj","jk","jl","jm","jn","jo","jq","jr","js","jt","jv","jw","jx","jy","jz","ka","kb","kc","kd","kf","ki","kj","kk","kl","km","kh","ko","kp","kq","kr","ks","kt","ku","kv","kw","kx","ky","kz","lc","lb","ld","lf","lg","lh","lj","lk","ll","lm","ln","lp","lq","lr","lt","ls","lu","lv","lw","lx","lz","mb","mc","md","mg","mh","mj","mf","mk","ml","mn","mm","mp","ms","mq","mt","mu","mv","mw","mx","mz","nb","nc","na","nf","ng","nh","nd","nj","nk","nm","hi","nn","np","nq","nl","nr","ns","nt","hs","nw","nx","ny","nz","oa","oe","og","oh","oi","oj","ok","ol","kg","om","oo","op","oq","os","mr","ou","ov","nv","ow","ox","oy","oz","pb","pc","pf","ph","pd","pj","pg","pk","pm","pn","pp","pq","ps","pt","pv","pw","px","py","pz","qb","qc","qd","qe","qf","qg","qh","qi","qj","qk","ql","qm","qn","qo","qp","qq","qr","qs","qt","qv","qw","qx","qy","qz","rb","rc","rd","rf","rg","rj","rh","rk","rl","rm","rq","rp","rs","rt","rn","rr","rv","rw","ry","rz","sb","sc","sd","se","sf","sg","sj","qa","sm","sr","ss","sv","sx","sy","sz","ta","tc","td","tb","te","tf","tg","ti","tl","tk","tj","tm","tn","tp","tq","ts","tt","tu","tv","tw","tx","ty","tz","ua","ub","ud","ue","uh","ui","uj","uk","ul","uf","um","uo","uq","us","ur","uu","ut","uv","ux","uy","uz","va","vb","vc","vd","ve","vf","vh","vg","vj","vk","vm","vl","vn","vo","vp","vq","vr","vs","vt","vu","vv","vw","vx","vy","wb","vz","wc","wd","wf","wg","wh","wj","wk","wn","wl","wm","wq","wr","wp","ws","wt","wu","ww","wv","wy","wz","xb","xc","xd","xe","xf","xg","xh","xi","xj","xk","xl","xm","xn","xo","xp","xq","xr","xs","xu","xv","xx","xy","xz","za","zb","zc","zd","ze","zf","zg","zh","zi","zj","zl","zm","zn","zo","zp","zq","zr","zt","zu","zv","zs","zw","zx","zz","abb","abc","aba","abd","abe","abg","abh","abi","abf","abj","abk","abl","abm","abn","abq","abr","abs","abt","abu","abp","abv","abw","abx","aby","ala","alb","alc","ald","ale","alf","alg","alh","ali","alj","all","alm","alk","aln","alp","alq","alr","als","alt","alu","alv","alw","alx","aly","alz","ana","anb","ane","anf","anc","and","anh","ani","ank","xa","anl","anm","ann","ano","zk","anp","anq","anr","ans","ant","anu","abz","anv","anw","anx","any","anz","apb","apd","ape","apc","apf","apg","aph","apj","apk","api","apl","apm","apn","apo","app","apq","apr","aps","apu","apv","apw","apx","apy","apt","apz","ara","arc","are","arg","arb","ard","arh","ari","arf","ark","aro","arm","arq","arn","arr","ars","aru","arw","arv","arx","ary","arz","asb","asc","asa","asd","ase","asf","asg","asi","asj","ask","asl","asm","asn","aso","asp","asq","asr","ass","ast","asu","asv","asw","asx","asy","asz","ata","atc","ate","atf","atg","ath","ati","atj","atk","atl","atm","atn","atp","atq","ats","atr","atu","atv","atw","atx","aty","arl","arp","ash","atd","atb","arj","atz","baa","bac","bad","baf","bag","bah","bai","baj","bak","ban","bao","baq","bas","bau","bav","baw","bax","bap","bay","baz","beb","bec","bed","bef","beg","beh","bei","bej","bek","ben","bel","bep","beq","bes","beu","bev","bem","bew","bex","beo","bey","bez","ber","bfc","bfd","bfe","bff","bfg","bfh","bfi","bfj","bfk","bfl","bfm","bfn","bfo","bfp","bfr","bfs","bft","bfu","bfv","bfw","bfy","bia","bfz","bfx","bie","bid","big","bih","bib","bii","bij","bik","bil","bim","bin","bio","biq","bis","biv","biw","bix","biy","biz","bla","biu","blb","blc","bld","blf","bli","blj","bll","blm","blh","blk","bln","blo","blp","bls","blt","blv","blq","blr","bly","blz","boa","blx","boc","bod","boe","bob","bof","bog","boh","boi","boj","bol","boo","bon","bok","bop","bor","bom","bot","boq","bou","bov","bow","box","boy","boz","bra","brb","brc","bre","brf","brd","brg","brh","brj","brk","brl","brm","brn","brp","brq","brr","brs","brt","bru","brv","brw","brx","bry","brz","bta","btb","btd","bte","btf","btg","bth","bti","btj","btk","btl","btm","btn","bto","btp","btq","btr","bts","btt","btu","btv","btw","btx","bty","btz","bua","bub","bue","buf","buh","bui","buj","buk","bug","buo","bup","buq","bur","bus","buu","buv","bux","buy","buz","bva","bvb","bvc","buw","bvd","bvf","bvg","bvh","bve","bvi","bvj","bvk","bvl","bvm","bvn","bvo","bvp","bvr","bvq","bvs","bvu","bvv","bvw","bvx","bvy","bvz","bxa","bxb","bxe","bxf","bxg","bxd","bxh","bxc","bxi","bxj","bxk","bxm","bxn","bxo","bfq","bxp","bxq","bxr","bxl","bxs","bxu","bxv","bxw","bxx","bxy","bxz","byb","byc","byd","bye","byf","byg","byh","byi","byj","byk","byl","bym","byn","byp","byo","byq","byr","bys","byu","byv","byw","byx","byy","byz","caa","cab","cad","blg","cae","caf","cag","cac","cah","cai","caj","cak","cam","can","cao","cap","caq","car","cas","blw","cau","cav","caw","cax","cay","caz","cea","ceb","cec","cee","cef","ceg","ced","ceh","cei","cej","cek","cem","cen","ceo","cep","ceq","ces","cev","cet","cex","cey","ceu","chb","chc","cew","chd","che","chf","cez","chg","chh","chj","chk","chm","chn","cho","chl","chp","chq","chr","chs","cht","chu","chv","chw","chx","chy","chz","coa","cob","coc","coe","cog","coh","coi","coj","cok","col","coo","cop","coq","cos","cot","cou","cov","cow","cox","coy","coz","cra","crb","crc","crd","crf","crg","crh","crj","crk","crm","crn","cro","crp","bum","crr","crl","crs","crt","cru","crv","crq","crw","crx","cry","crz","cyb","cyc","cyd","cya","cye","cyf","cyi","cyk","cyl","cyh","cyo","cyp","cyr","cys","cyt","cyu","cyv","cyw","cyx","cyq","cyy","cyz","daa","dab","dac","dad","dae","daf","dag","dah","daj","dak","dal","dam","dan","dao","dap","daq","dar","das","dau","dav","daw","dax","day","daz","deb","dec","ded","dat","def","deg","deh","dei","dej","dek","deo","del","der","des","det","deu","dev","dew","deq","dey","dez","dia","dex","dib","did","die","dif","dig","dih","dii","dik","dio","dij","diq","dir","dil","dim","dip","dit","diu","div","diw","dix","diy","dob","doc","dod","doa","dof","dog","doh","doi","doj","doo","dop","doq","dor","dos","dot","dou","dov","dow","dox","cer","doz","doy","drb","drc","drd","drf","drg","drh","drj","drk","dri","drl","drm","drn","dro","drp","drq","drr","drs","drt","dru","drw","drx","dry","drz","dua","dub","duc","dud","due","duf","dug","dui","duj","dul","dum","dun","duo","dup","duq","dur","dus","dut","duu","duv","duw","dux","duy","duz","eaa","eab","eac","ead","eae","eag","eah","eai","eak","eal","eam","eaj","ean","eao","eap","eaq","eat","eau","eav","eaw","eax","eay","eaz","ela","elc","elb","ele","elf","elg","elh","eli","elj","elk","cyj","cym","ell","elm","eln","elo","elp","elq","elr","els","elt","elu","elv","elw","elx","ely","elz","ena","enb","enc","end","enf","eng","enh","eni","enk","enl","enm","enn","enj","eno","enp","enq","enr","ens","enu","ent","enw","env","eny","enx","enz","evd","eve","evg","evh","evi","evc","evj","evk","evl","evf","evn","evo","evp","diz","evq","evr","evs","evt","evu","evv","evw","evy","evz","faa","evx","fab","dok","fad","fae","faf","fag","fah","fai","faj","fak","fal","fam","fan","fao","fap","faq","far","fas","fat","fau","fav","faw","fax","fay","faz","fea","feb","fec","fed","fef","feg","feh","fej","drv","fek","fel","feo","fep","feq","fen","fes","fet","feu","fev","few","duh","fex","fey","fez","fia","fic","fid","fib","fie","fig","fih","fii","fij","fik","fif","fil","fim","fin","fio","fip","eaf","fiq","fir","fit","fiu","fiv","fiw","fix","fiy","fiz","foa","fob","foc","fod","foe","fof","foh","foi","evb","foj","evm","fok","fol","fom","fon","foo","fop","foq","fos","fot","fou","fov","fox","foy","fow","foz","fra","fei","frb","frc","frd","frf","frg","fre","frh","frj","frk","frl","frm","frn","fro","frp","frq","frr","frs","frt","fru","frw","frx","frv","fry","gaa","gab","gad","frz","gaf","gag","gah","gai","gac","gak","gaj","gae","gam","gan","gao","gap","gaq","gar","gas","gat","gau","gav","gaw","gax","gay","gba","gbc","gbd","gbe","gbg","gbh","gaz","gbf","gbj","gbk","gbl","gbn","gbo","gbp","gbq","gbm","gbs","gbr","gbt","gbv","gbu","gbw","gbx","gby","gga","gbz","ggb","ggc","gge","ggf","ggg","ggh","ggi","ggj","ggk","ggm","ggn","ggo","ggp","ggl","ggq","ggr","ggs","ggt","ggu","ggv","ggw","ggx","fog","ggy","ggz","gia","gib","gic","gie","gid","gif","gig","gih","gii","gij","gik","gil","gim","gio","gip","giq","gir","gis","git","giu","giv","giw","gix","giy","giz","gla","glb","glc","gld","gle","glf","glh","glj","glg","glk","gll","glm","gln","glo","glp","glq","glr","gls","glt","glv","glw","glx","gly","glu","glz","goa","gob","goc","god","goe","gof","goh","goi","goj","gok","gol","gom","gon","goo","gop","goq","gor","gos","gou","gov","gox","goy","goz","gow","grb","grc","grd","gog","grf","grg","gri","grj","grk","grl","grm","grn","gro","grq","grp","grr","grs","grt","grw","grx","gry","grv","grz","gwa","gwb","gwc","gwe","gwf","gwg","gwh","gwj","gwk","gwl","gwm","gwn","gwo","gwp","gwq","gwr","gwt","gwv","gww","gwx","gwu","gwy","gwz","hab","haa","hac","ggd","had","hae","haf","hag","hah","hai","haj","hak","hal","ham","han","hao","hap","haq","has","hau","hav","haw","hax","hay","haz","heb","hed","hee","hec","hef","heg","heh","hej","hek","hei","hem","heo","heq","hes","hen","heu","hev","hew","hex","hey","hez","hoa","hob","hoc","hod","hoe","hof","hoh","hoi","hoj","hok","hol","hom","hon","hoo","hop","hoq","hor","hos","hot","hou","hov","how","hox","hoy","hoz","hua","hub","huc","hud","hue","huf","huh","hug","hui","huj","hul","hun","huo","hup","huq","hur","hus","huu","huv","huw","hux","huy","huz","imb","imc","imd","ime","imf","grh","img","imh","gwd","imi","imj","gws","imk","imm","imn","imo","hep","het","imp","imq","imr","ims","imt","imu","imw","imv","imx","imy","imz","inb","ine","huk","ind","ini","inj","ink","inn","inq","inu","inv","hut","inw","inx","iny","inz","isa","isc","isb","isd","ise","isf","isg","isj","ish","isk","isl","ism","isn","iso","isp","isq","isr","iss","ist","isu","isv","isw","isx","isz","jaa","jab","isy","jac","jad","jae","jaf","jag","jai","jak","jal","jah","jam","jan","jaj","jao","jap","jaq","jar","jas","jat","jau","jav","jaw","jax","jaz","jpa","jpb","jpc","jpd","jpf","jpg","jph","jpi","jpj","jpk","jpl","jpm","jpn","jpo","jpp","jpq","jpr","jps","jpt","jpu","jpv","jpw","jpx","jpz","jua","jub","juc","jue","juf","jug","juh","jui","juj","iml","juk","jul","jum","juo","jup","juq","jur","jus","jut","juu","juv","juw","jux","juy","juz","kea","kec","ked","kee","kef","keg","keh","kei","kej","kek","kel","kem","ken","keo","kep","keq","ker","kes","ket","keu","kev","kew","kex","key","kez","kna","knb","knc","knd","kne","knf","kng","knh","knk","knl","knm","knn","knj","kno","knp","knq","knr","kns","knu","knv","knw","knx","knt","kny","laa","lab","lac","lad","knz","laf","lag","lah","lai","lae","laj","lak","lal","lan","lao","lap","lar","laq","las","lat","lav","law","lax","laz","lea","leb","lec","led","lee","lef","leg","leh","lei","lej","lel","lek","lem","leo","lep","leq","ler","let","leu","les","lev","lew","lex","ley","lez","lia","lib","lid","lif","lie","lig","lih","lii","lij","lik","lim","lin","lio","jpy","lip","liq","lir","lis","lit","liu","liv","liw","lix","liy","loa","loc","liz","lod","loe","lof","loh","log","loi","loj","lok","lol","lom","lon","loo","lop","lor","loq","los","lou","low","lox","loy","lya","lyb","loz","lyc","lyd","lye","lyf","lyg","lyi","lyj","lyk","lyh","lyl","lym","lyn","lyo","lyp","lyq","lyr","lyt","lyu","lyv","lay","lyw","lyy","lys","lyz","maa","mab","mac","mae","maf","mag","mah","mai","maj","mak","mal","mam","map","mao","maq","mas","maw","mav","mar","max","may","maz","mea","mau","meb","med","mee","mef","mec","meg","mei","mej","mek","meh","mel","men","meo","meq","mes","meu","lob","mev","mew","mep","mex","mey","mez","mia","mib","mic","mid","mie","mif","mih","mii","mij","mig","mil","mio","mik","miq","mir","mip","mis","miu","miv","mix","miy","miw","miz","moa","mob","moc","moe","mof","mog","moh","moi","moj","mol","mom","mon","moo","mop","moq","mok","mor","mos","mou","mov","mow","mox","moy","moz","mya","myb","myd","myf","myh","myi","myj","myk","myl","mym","myn","myo","myp","myq","myr","myu","myv","myw","myy","myz","nea","myx","nec","neb","ned","nef","neg","neh","nek","nel","nem","nen","nep","nei","nej","neq","nes","neo","net","neu","nev","nex","ney","nez","nia","lyx","nib","nid","nie","nif","nih","nig","nii","nij","nik","nil","nim","nio","nip","niq","nir","nis","nit","niu","niv","niw","nix","niy","niz","noa","nob","noc","nod","noe","nof","nog","noh","noi","noj","met","nok","nol","nom","non","nop","noq","nor","nos","nou","nov","now","nox","noy","noz","nua","nub","nuc","nud","nue","nuf","nug","nuh","nui","nuj","myg","nuk","nul","num","nun","nuo","new","nup","nuq","nus","nut","nin","nuu","nuv","nuw","nux","nuy","nuz","oba","obb","obc","obd","obe","obf","obg","obh","obi","obk","obl","obm","obn","obo","obp","obq","obr","obs","obt","obu","occ","obw","oby","ocb","obv","oca","obx","ocd","obz","ocf","ocg","och","oci","ocj","ock","ocl","ocm","ocn","oco","ocp","ocq","ocr","oct","ocu","ocv","ocw","ocx","ocy","ocz","odc","odd","ode","odf","odg","odh","ocs","odj","odk","odl","odm","odi","odo","odp","odq","odr","ods","odt","odu","odv","odw","ody","odz","ofa","ofb","ofd","ofe","off","odx","ofg","ofh","ofi","ofc","ofj","ofk","ofl","ofm","ofn","ofp","ofq","ofr","ofs","ofo","ofv","ofu","ofw","ofx","ofy","ofz","onb","ond","one","onf","ong","oni","onj","onk","odn","onn","ono","onq","onr","ons","onu","onv","onw","onx","ony","onz","ora","orb","onh","ord","orf","org","ori","orj","ork","orl","orm","orn","oro","orp","orq","orr","ors","ort","oru","orv","orw","orx","ory","orc","orz","ota","otb","otc","otd","ote","otf","otg","oti","otj","otk","otl","otm","otn","oto","otp","otq","otr","ots","otu","otv","otw","otx","oty","otz","paa","pab","pac","pad","pae","paf","pag","pah","pai","paj","pak","pal","pam","pap","pao","paq","pas","pat","pau","paw","pax","pay","pav","paz","peb","pec","ped","pef","peg","peh","pee","pei","pek","pej","peq","per","pel","pes","peu","pev","pew","pep","pex","pey","pez","pia","pib","pic","pid","pie","pif","pig","pih","pii","pij","pik","pim","pin","pio","pip","piq","pem","pis","piu","piv","piw","pix","piy","plb","pld","plc","plf","plg","plh","pli","plj","plk","pll","plm","pln","plo","plp","plr","pls","plt","plu","plv","plw","ply","plz","poa","pod","pob","pof","poc","pog","poh","poi","poj","pok","pol","pom","pon","poo","pop","poq","por","pov","pow","pox","poy","poz","pra","prb","prc","prd","pre","prf","prg","prh","prj","prk","prl","prm","prn","pro","prp","prq","prr","prs","pru","prv","prt","prw","prx","pry","prz","pua","pub","puc","pud","puf","puh","puj","pug","puk","pul","pum","pun","puo","puq","pur","pus","put","puu","plq","puv","puw","pux","puy","puz","qua","qub","quc","qud","pue","pui","quf","qug","quh","quj","quk","qul","qum","qun","quo","qup","quq","qur","qus","qut","quv","quw","qux","quu","quy","quz","raa","rab","rae","raf","rag","rac","rah","rad","rai","rak","ral","ram","ran","rao","raq","rap","rar","ras","rau","rav","ray","raw","raz","rax","rec","red","ref","reg","reh","rei","rej","rek","rel","rem","ren","rep","reo","raj","req","rer","res","ret","reu","rev","rew","rey","rez","rex","rid","rib","rif","rie","rig","rih","rii","rik","rim","rin","ril","rip","riq","ris","rir","rit","riu","riv","riw","rix","riz","roa","rob","riy","rod","roc","roe","rof","rog","roh","roi","roj","rok","rol","rom","ron","roo","rop","roq","ror","rot","rou","rov","row","rox","roy","rua","rub","ria","rud","rij","rue","ruf","rug","ruh","rui","ruj","ruk","rul","rum","ruo","rup","ruq","rur","rut","roz","ruu","ruv","ruw","rux","ruy","ruz","rxa","rxb","rxc","rxd","rxe","rxf","rxg","rxh","rxj","rxl","rxm","rxn","rxi","rxo","rxq","rxr","rxt","rxp","rxu","rxv","rxw","rxy","rxz","saa","sab","sac","sae","saf","sag","sah","sai","saj","sak","sal","sam","san","sao","sap","saq","sar","sas","sat","sau","sav","saw","sax","say","saz","sha","shb","shc","shd","rxk","shf","shg","shj","shk","shm","shl","sho","shp","shr","rxx","shq","shs","shu","shn","shw","shv","shx","shy","sht","shz","sia","sib","sif","sic","sig","sie","sii","sih","sik","sij","sil","sin","sio","sip","siq","sis","siu","siv","siw","six","siy","siz","ska","skb","skc","skd","ske","skf","skg","skh","ski","skj","skk","skl","skm","skn","sko","skp","sir","skq","skr","sks","skt","sku","skv","skw","skx","skz","sla","slb","slc","sld","slf","slg","slh","sli","slj","slk","sll","slm","sln","slo","slp","slq","slr","sls","slt","slv","slw","slx","sly","slz","sna","snb","snc","snd","sne","snf","sng","snh","snj","snk","snl","snm","snn","snp","snq","snr","sns","snt","snu","snv","snw","snx","sny","snz","sob","soc","soa","sof","sog","soe","sod","soi","soh","soj","son","soo","sop","soq","sor","sok","sos","sot","sol","sov","sow","soy","sox","spb","spc","spd","spe","spf","sph","spi","spj","spk","spl","spn","spo","spg","spp","spq","spr","sps","spt","spm","spu","spv","spw","spx","spy","spz","sqa","sqb"];

async function findBlog() {
  for (let clen = 1; clen<=20; clen++) {
    let ch = [];
    for (let i=0; i<clen; i++) {ch.push(0)};
    while (ch[ch.length-1] < 16) {
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
      while (ch[curr] >= 16) {
        if (curr == ch.length-1) break;
        ch[curr] = 0;
        ch[curr+1]++;
        curr++;
      }
    }
  }
}