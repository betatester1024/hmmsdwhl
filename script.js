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
        if (bList.length <= 3) {
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

let blacklist = ["y","aa","ac","ad","ae","af","ag","ah","ai","ak","am","ao","bb","bc","bd","bg","bh","bj","bk","bm","bn","bp","cb","cc","cd","aj","cf","cg","ci","cj","ck","cl","cn","cp","db","dc","dd","df","dg","dh","dj","dk","dl","dm","dn","dp","eb","ed","ee","eg","eh","ef","ei","ej","ek","em","eo","ep","fb","fc","fd","ff","cm","fg","fh","fj","fk","fl","fm","fn","fp","gc","gd","ge","gf","gh","gj","gk","ec","gn","gp","hb","hc","hd","hf","hg","hh","hi","hj","hk","hl","hn","hm","ia","ic","id","ib","hp","ie","ig","ih","if","ij","ii","ik","il","ip","gm","jc","jb","jd","jf","jh","jg","ji","jj","je","jk","jl","jm","jo","kd","kf","kb","jn","kg","kc","kh","ka","ki","kj","kk","kl","km","ko","io","kp","lb","lc","ld","lg","lf","lh","lj","ll","lm","lk","lp","mb","mc","md","mf","mg","mh","mk","ml","mm","mn","mj","mp","na","nb","nc","nd","ng","nf","nh","ln","nj","nk","nl","nm","nn","np","oa","oe","oh","og","oi","oj","ok","ol","oo","op","pb","pc","pd","pf","pg","pj","pk","pm","ph","pn","pp","qa","qb","qc","qd","qe","qf","qg","qh","qi","qj","qk","ql","qm","qn","qo","qp","rb","rc","rd","om","rf","rh","rg","rj","rk","rl","rm","rp","sb","sc","sd","sf","se","sg","rn","sj","sm","ta","tb","tc","te","tf","tg","td","ti","tj","tk","tl","tm","tn","tp","ua","ud","ue","uf","uh","ui","uj","uk","ul","um","va","uo","vb","vc","vd","ve","vf","vg","vh","vj","vk","vl","vm","vn","vo","wc","wb","wd","ub","wf","wh","wk","wg","wl","wm","wj","wn","xa","wp","xb","xc","xd","xe","xf","xg","xh","xi","xj","xk","xl","xm","xn","xo","xp","vp","za","zb","zc","zd","zf","zg","zh","ze","zi","zj","zk","zm","zn","zp","aba","zo","abb","abc","abd","abe","abf","abg","abi","abj","abk","abl","abm","abn","ala","abp","alb","alc","ald","alf","alg","ale","alh","ali","alj","alk","all","zl","alm","aln","alp","ana","anb","anc","and","ane","anf","anh","abh","ani","ank","anl","anm","ann","ano","anp","apb","apc","apd","ape","apg","aph","api","apf","apj","apk","apl","apm","apn","apo","baa","app","bac","bad","baf","bag","bah","bai","baj","bak","ban","bao","bap","beb","bec","bed","bef","beg","beh","bej","bek","bel","bem","beo","bep","bfd","bfc","bff","bfg","bfh","bfi","bfj","bfl","bfn","bfp","bia","ben","bib","bid","bie","bih","bii","bij","big","bik","bil","bfk","bim","bin","bfm","bio","bei","blb","blc","bld","blg","blh","bli","blj","blk","bfe","bll","blm","bln","blo","blp","boa","blf","boc","bob","bod","boe","bof","bfo","bog","boh","boi","boj","bok","bol","bom","bon","boo","bla","bop","bqa","bqb","bqc","bqd","bqe","bqf","bqg","bqh","bqi","bqj","bqk","bql","bqm","bqn","caa","cab","cac","cae","cad","caf","bqo","cag","bqp","cah","cai","caj","cak","cam","cao","cea","can","ceb","cec","ced","cef","ceg","cee","ceh","cei","cej","cek","cem","ceo","cep","chb","chc","chd","che","chf","chg","chh","chj","chl","chk","chm","chn","cho","chp","coa","cob","coc","coe","cap","cog","coh","coj","coi","col","coo","cop","cqa","cqb","cok","cqc","cqd","cqe","cen","cqf","cqg","cqh","cqi","cqj","cqk","cql","cqm","cqn","cqp","daa","dab","dac","dad","cqo","dae","daf","dag","dah","daj","dak","dal","dam","dan","dao","dap","deb","dec","def","ded","deg","deh","dei","dej","dek","del","deo","dia","dib","did","die","dif","dig","dih","dii","dij","dik","dil","dim","dio","dip","dob","doc","dod","dof","dog","doh","doi","doj","dok","doo","dop","dqa","dqb","dqc","dqd","dqe","dqf","dqh","dqi","dqg","dqk","dqj","dql","dqm","dqn","dqo","dqp","eaa","eab","eac","ead","eaf","eae","eah","eag","eai","eaj","eak","eal","eam","ean","eao","doa","eap","ela","elb","elc","ele","elf","elg","elh","eli","elj","elk","ell","elm","eln","elo","elp","ena","enb","enc","end","enf","eng","enh","eni","enj","enk","enm","enn","eno","enp","enl","eqa","eqb","eqc","eqd","eqe","eqf","eqg","eqh","eqi","eqj","eqk","eql","eqm","eqn","eqo","eqp","faa","fab","fad","fae","faf","fag","fah","fai","faj","fak","fal","fam","fan","fao","fap","fea","fec","fed","feb","feg","feh","fei","fef","fej","fek","fel","fen","fep","feo","fia","fib","fic","fid","fie","fif","fig","fih","fii","fij","fik","fil","fim","fin","fio","fip","foa","fob","foc","fod","foe","fof","fog","foh","foi","foj","fok","fol","fom","fon","foo","fop","fqa","fqb","fqc","fqd","fqe","fqf","fqg","fqh","fqi","fqj","fqk","fql","fqm","fqn","fqo","fqp","gaa","gab","gac","gad","gae","gaf","gag","gah","gai","gaj","gak","gam","gan","gao","gap","gba","gbc","gbd","gbe","gbf","gbg","gbh","gbj","gbk","gbl","gbm","gbn","gbo","gbp","gga","ggb","ggc","ggd","gge","ggf","ggg","ggh","ggi","ggj","ggk","ggl","ggn","ggo","ggm","ggp","gia","gib","gic","gid","gif","gig","gih","gii","gie","gij","gik","gil","gim","gio","gla","glb","glc","gld","gip","gle","glf","glg","glh","glj","glk","gll","glm","gln","glo","glp","goa","gob","goc","god","goe","gog","goh","goi","gof","goj","gol","gok","gom","goo","gon","gop","gqa","gqb","gqc","gqd","gqe","gqf","gqg","gqh","gqi","gqj","gqk","gql","gqm","gqn","gqo","gqp","hab","hac","haa","had","hae","haf","hag","hah","hai","haj","hak","hal","ham","han","hao","hap","hed","hef","hee","heg","hec","heh","hei","hej","hek","hen","heo","hep","hoa","hob","hoc","hod","heb","hof","hoe","hoh","hoi","hoj","hem","hok","hol","hom","hon","hoo","hop","hqa","hqb","hqc","hqd","hqe","hqf","hqg","hqh","hqi","hqj","hqk","hql","hqn","hqp","imb","imc","imd","ime","imf","img","imh","imi","imj","imk","iml","imm","imn","imo","imp","hqm","inb","hqo","ind","ine","ini","inj","ink","inn","iqa","iqb","iqc","iqd","iqe","iqf","iqg","iqh","iqi","iqj","iqk","iql","iqm","iqo","iqp","jaa","jab","jac","jad","iqn","jae","jag","jah","jaf","jai","jaj","jak","jal","jam","jao","jap","jan","jpa","jpb","jpc","jpd","jpf","jpg","jph","jpi","jpj","jpk","jpl","jpm","jpn","jpo","jpp","kea","kec","ked","kee","kef","keg","keh","kei","kej","kek","kel","kem","ken","kna","kep","knb","knc","knd","kne","knf","kng","knh","knj","knk","knm","keo","knn","knl","kno","knp","kqa","kqb","kqe","kqd","kqg","kqc","kqh","kqf","kqi","kqj","kql","kqk","kqm","kqn","kqo","lab","laa","lac","kqp","lad","lae","laf","lag","lah","lai","laj","lak","lal","lan","lao","lap","lea","leb","lec","led","lee","leg","lef","leh","lei","lej","lel","lem","lek","leo","lep","lia","lib","lid","lie","lif","lig","lih","lii","lij","lim","lin","lip","lik","loa","lio","lob","loc","lod","lof","log","loe","loh","loj","loi","lok","lol","lom","lon","loo","lop","lqa","lqb","lqc","lqd","lqe","lqf","lqh","lqi","lqj","lqk","lql","lqg","lqm","lqn","lqo","lqp","mab","mac","mae","maa","maf","mag","mah","mai","maj","mal","mam","mak","mao","map","mea","meb","med","mee","mec","mef","meg","meh","mei","mej","mek","mel","men","mep","mia","mib","mic","mid","meo","mie","mif","mig","mih","mii","mij","mik","mio","mip","moa","mob","moc","mof","moe","moh","mog","moi","moj","mok","mol","mon","moo","mop","mqa","mqb","mil","mom","mqc","mqd","mqe","mqf","mqg","mqh","mqi","mqk","mql","mqn","mqo","mqp","nea","mqm","nec","ned","nef","neb","neg","neh","mqj","nei","nej","nek","nel","nem","nen","neo","nep","nia","nib","nid","nie","nif","nig","nih","nii","nij","nil","nim","nin","nio","nip","noa","nik","nob","noc","nod","noe","nof","nog","noh","noi","noj","nok","nol","nom","nqa","non","nqc","nop","nqd","nqb","nqe","nqf","nqg","nqh","nqi","nqj","nqk","nql","nqm","nqn","nqo","nqp","oba","obb","obc","obd","obf","obg","obh","obe","obi","obk","obl","obn","obm","obo","obp","oca","ocb","ocd","ocg","och","ocf","occ","oci","ocj","ock","ocl","ocm","ocn","oco","ocp","odc","odd","ode","odf","odg","odh","odi","odj","odk","odl","odm","odn","odo","odp","ofa","ofb","ofc","ofd","ofe","ofg","off","ofh","ofi","ofj","ofk","ofl","ofm","ofn","ofo","ofp","onb","ond","one","ong","onf","onh","oni","onk","onn","onj","ono","oqa","oqc","oqe","oqf","oqb","oqg","oqd","oqh","oqj","oqk","oql","oqi","oqm","oqn","oqo","oqp","paa","pab","pac","pae","paf","pag","pah","pad","pai","paj","pal","pam","pak","pao","pap","peb","pec","ped","pee","pef","peg","peh","pej","pei","pek","pel","pem","pep","pia","pib","pic","pid","pie","pif","pig","pih","pii","pij","pik","pim","pin","pio","pip","plb","plc","pld","plf","plg","plh","pli","plj","plk","pll","plm","pln","plo","plp","poa","pob","poc","pod","pof","pog","poh","poi","poj","pok","pol","pom","pon","poo","pop","pqa","pqb","pqc","pqd","pqe","pqf","pqg","pqh","pqi","pqj","pqk","pql","pqm","pqn","pqp","qqa","qqb","qqc","qqd","qqe","qqf","qqg","qqh","pqo","qqi","qqj","qqk","qql","qqm","qqn","qqo","raa","rab","rac","rad","rae","raf","rag","qqp","rah","rai","raj","rak","ral","ram","ran","rao","rap","rec","red","ref","reg","reh","rei","rej","rek","rel","rem","ren","reo","rep","ria","rib","rid","rie","rif","rig","rih","rii","rij","rik","ril","rim","rin","rip","roa","rob","roc","rod","roe","rof","rog","roh","roi","roj","rok","rol","rom","ron","roo","rqa","rqb","rop","rqc","rqd","rqe","rqf","rqg","rqh","rqi","rqj","rqk","rql","rqm","rqn","rqo","rqp","saa","sab","sac","sae","saf","sag","sah","sai","saj","sak","sam","san","sao","sap","sal","sha","shb","shc","shd","shf","shg","shj","shk","shl","shm","shn","sho","shp","sib","sic","sia","sif","sig","sih","sii","sie","sij","sil","sin","sik","sip","ska","skb","skc","skd","ske","skf","skg","sio","skh","ski","skj","skk","skl","skm","skn","sko","sla","slb","skp","slc","sld","slf","slg","aq","au","av","aw","ax","ay","az","bq","bs","bw","bz","cq","cs","ct","cu","cv","cw","cx","cz","dq","ds","dt","dv","dw","dx","dy","dz","eq","er","es","et","eu","ew","ex","ey","ez","fs","fq","ft","fu","fv","fw","fx","fy","fz","gs","gt","gq","gu","gv","gx","gy","gz","hq","hr","hs","ht","hw","hx","hy","hv","hz","iq","ir","it","iu","iv","iw","iy","iz","jq","ix","jr","js","jt","jv","jw","jx","jy","jz","kq","kr","ks","kt","ku","kv","kw","kx","ky","kz","lq","ls","lu","lr","lx","lt","lw","lz","lv","mq","mr","ms","mt","mv","mw","mx","mu","mz","nq","nr","ns","nt","nv","nw","nx","ny","nz","oq","os","ou","ov","ow","oy","oz","ox","pq","ps","pt","pv","pw","px","py","pz","qq","qr","qs","qt","qv","qw","qx","qy","qz","rq","rr","rs","rt","rv","rw","ry","rz","sr","ss","sv","sx","sy","sz","tq","ts","tt","tu","tv","tw","ty","tx","tz","uq","ur","us","ut","uu","uv","ux","uy","uz","vq","vr","vs","vt","vu","vv","vx","vy","vw","vz","wq","ws","wt","wr","wu","wv","ww","wy","wz","xq","xr","xs","xu","xv","xx","xy","xz","zq","zs","zt","zr","zu","zv","zw","zx","zz","abq","abr","abs","abt","abu","abv","abw","aby","abz","alq","abx","alr","als","alt","alu","alv","alw","alx","aly","alz","anq","anr","ans","ant","anu","anv","anw","anx","any","anz","apq","apr","apt","aps","apu","apv","apw","apx","apy","apz","ara","arb","arc","ard","are","arf","arg","arh","ari","arj","ark","arl","arm","arn","aro","arp","arq","arr","ars","aru","arv","arw","arx","ary","arz","asa","asb","asc","asd","ase","asf","asg","ash","asi","asj","ask","asl","asm","asn","aso","asp","asq","asr","ass","ast","asu","asv","asw","asx","asz","ata","atb","atc","asy","atd","ate","atf","atg","ath","ati","atj","atk","atl","atm","atn","atp","atq","atr","ats","atu","atw","atv","atx","aty","atz","baq","bas","bau","bav","baw","bax","bay","baz","beq","ber","bes","beu","bev","bex","bey","bew","bez","bfq","bfr","bfs","bft","bfu","bfv","bfw","bfx","bfy","bfz","biq","bis","biu","biv","biw","bix","biy","biz","blq","blr","bls","blt","blv","blw","blx","bly","blz","boq","bor","bot","bou","bov","bow","box","boy","boz","bra","brb","brc","brd","bre","brf","brg","brh","brj","brk","brl","brm","brn","brp","brr","brq","brs","brt","bru","brv","brw","brx","bry","brz","bta","btb","btd","bte","btf","btg","bth","bti","btj","btk","btl","btm","btn","bto","btp","btq","btr","bts","btt","btu","btv","btw","btx","bty","btz","bua","bub","bue","buf","bug","buh","bui","buj","buk","bum","buo","bup","buq","bus","buv","buu","buw","bur","buy","buz","bva","bux","bvc","bvd","bvb","bvg","bve","bvf","bvh","bvj","bvk","bvl","bvi","bvn","bvm","bvo","bvp","bvr","bvq","bvs","bvv","bvu","bvy","bvw","bxa","bxb","bxc","bxd","bvx","bvz","bxe","bxf","bxg","bxh","bxi","bxj","bxk","bxl","bxm","bxo","bxp","bxn","bxq","bxr","bxs","bxu","bxv","bxw","bxx","bxy","bxz","byb","byc","byd","bye","byf","byg","byh","byi","byj","byl","bym","byk","byn","byo","byp","byr","bys","byq","byu","byv","byw","byx","byy","byz","caq","car","cas","cau","cav","caw","cax","cay","caz","ceq","cer","ces","ceu","cet","cev","cew","cex","cey","cez","chr","chq","chs","cht","chu","chv","chw","chy","chx","chz","coq","cos","cot","cou","cov","cow","cox","coy","coz","cra","crb","crc","crd","crf","crg","crj","crh","crk","crm","crn","cro","crp","crl","crs","crq","crt","crr","cru","crv","crw","crx","cry","crz","cya","cyb","cyc","cyd","cye","cyf","cyh","cyi","cyj","cyk","cyl","cym","cyo","cyp","cyq","cyr","cys","cyt","cyu","cyv","cyw","cyx","cyy","cyz","daq","dar","das","dat","dau","dav","daw","dax","day","daz","deq","der","des","det","deu","dev","dew","dex","dey","dez","diq","dir","dit","diu","div","diw","dix","diy","diz","doq","dor","dos","dou","dov","dox","dow","doz","doy","drb","drc","dot","drd","drf","drg","drh","dri","drj","drk","drl","drm","drn","drp","drq","dro","drs","drt","dru","drr","drv","drw","drx","drz","dua","dry","dub","duc","dud","due","duf","dug","duh","dui","duj","dul","dum","dun","duo","dup","duq","dur","dus","dut","duu","duv","duw","dux","duy","duz","eaq","eat","eau","eav","eaw","eax","eay","eaz","elq","elr","els","elt","elu","elv","elw","elx","ely","elz","enq","enr","ens","ent","enu","env","enw","enx","eny","enz","evb","evc","evd","eve","evf","evg","evh","evi","evj","evk","evl","evm","evn","evo","evp","evq","evr","evs","evt","evu","evv","evw","evx","evy","evz","faq","far","fat","fau","fav","fas","faw","fax","fay","faz","feq","fes","fet","feu","fev","few","fex","fey","fez","fiq","fir","fit","fiu","fiv","fiw","fix","fiy","fiz","foq","fos","fot","fou","fov","fow","fox","foy","fra","frb","foz","frc","frd","frf","frg","frh","fre","frl","frj","frn","fro","frm","frp","frq","frk","frr","frs","frt","fru","frv","frw","frx","fry","frz","gaq","gar","gas","gau","gav","gaw","gax","gay","gat","gaz","gbq","gbr","gbs","gbt","gbu","gbv","gbw","gbx","gby","ggq","ggs","gbz","ggt","ggr","ggu","ggv","ggw","ggx","ggy","ggz","giq","gir","gis","git","giu","giv","giw","giy","gix","glq","glr","giz","gls","glt","glv","glw","glu","glx","gly","glz","goq","gor","gos","gov","gou","gow","gox","goy","goz","grb","grc","grd","grg","grf","grh","gri","grk","grj","grl","grm","grn","gro","grp","grq","grr","grs","grt","grv","grw","grx","gry","grz","gwa","gwb","gwc","gwd","gwe","gwf","gwg","gwh","gwj","gwk","gwl","gwm","gwn","gwo","gwp","gwq","gwr","gws","gwt","gwu","gwv","gww","gwx","gwy","gwz","haq","has","hau","hav","haw","hax","hay","haz","heq","hes","het","heu","hev","hew","hex","hey","hez","hoq","hor","hos","hot","hou","hov","how","hox","hoy","hoz","hua","hub","huc","hud","hue","huf","hug","huh","hui","huj","huk","hul","hun","huo","hup","huq","hur","hus","hut","huu","huv","huw","hux","huy","huz","imq","imr","ims","imt","imu","imv","imw","imx","imy","imz","inq","inu","inv","inw","inx","iny","inz","isb","isc","isd","isa","ise","isf","ish","isg","isj","isl","ism","isn","isk","iso","isp","isr","iss","isq","ist","isu","isv","isw","isx","isy","isz","jaq","jar","jas","jat","jav","jau","jaw","jax","jaz","jpq","jpr","jps","jpt","jpu","jpv","jpw","jpz","jpx","jua","jpy","jub","juc","jue","juf","jug","jui","juj","juh","juk","jul","jum","juo","jup","juq","jur","jus","jut","juu","juv","juw","jux","juy","juz","keq","ker","kes","ket","kev","kew","keu","kex","key","kez","knq","knr","kns","knt","knu","knv","knw","knx","kny","knz","laq","lar","las","lat","lav","law","lax","lay","laz","leq","ler","les","let","leu","lev","lew","lex","ley","lez","liq","lir","lis","lit","liv","lix","liw","liy","liz","loq","los","liu","lou","low","lox","loy","loz","lya","lor","lyb","lyc","lyd","lye","lyf","lyg","lyh","lyi","lyj","lyk","lyl","lym","lyn","lyo","lyp","lyq","lys","lyt","lyu","lyv","lyw","lyr","lyx","lyy","lyz","maq","mas","mau","mav","max","may","mar","maz","meq","maw","mes","met","meu","mev","mew","mex","mey","mez","miq","mir","mis","miu","miv","miw","miy","mix","miz","moq","mor","mos","mou","mov","mow","moy","moz","mox","mya","myb","myd","myf","myg","myh","myi","myj","myl","mym","myn","myo","myp","myq","myr","myu","myk","myv","myw","myx","myy","myz","neq","nes","net","neu","nev","new","nex","ney","nez","niq","nir","nis","nit","niu","niv","niw","nix","niy","niz","noq","nor","nos","nou","nov","now","nox","noy","noz","nua","nub","nuc","nud","nue","nuf","nug","nuh","nui","nuj","nuk","nul","num","nun","nuo","nup","nuq","nus","nut","nuu","nuv","nuw","nux","nuy","nuz","obq","obr","obs","obt","obv","obw","obu","obx","oby","obz","ocq","ocr","ocs","ocu","ocv","oct","ocw","ocx","ocy","ocz","odq","ods","odr"];

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
      while (ch[curr] >= 26) {
        if (curr == ch.length-1) break;
        ch[curr] = 0;
        ch[curr+1]++;
        curr++;
      }
    }
  }
}