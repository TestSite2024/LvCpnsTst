/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
//import {startParticles, stopParticles, startConfetti, stopConfetti} from './particles.js';

var userOS;    // will either be iOS, Android or unknown
var userOSver; // this is a string, use Number(userOSver) to convert
var params;
var pageindex=0;
var triggered=false;
var nosound=true;
var color;
var fname, tname;
var col = ['#FF0000','#ff9900','#38b6ff','#566FFAFF','#79D600FF','#ff7272','#ff00cf'];
var loc = ["index.html","inside.html","food.html","outside.html","adventure.html","sensual.html","love.html"];
var catText = ["Inside the House","Food Related","Outside the House","Adventurous","Sensual","Love Vouchers"];
var wholecoupon;
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    let pSBCr = null;
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!pSBCr) pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
};
/* function randomInRangeint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}; */

function getlocAddress(i){
    return loc[i];
}
function getcolor(index,current){
    if (!current) {
        return col[index];
    } else {
        return col[pageindex];
    }
}
function getCat(index){
    return catText[index];
}

function findOS()
{
  var ua = navigator.userAgent;
  var uaindex;
  // determine OS
  if ( ua.match(/iPad/) || ua.match(/iPod/) || ua.match(/iPhone/) )
  {
    userOS = 'iOS';
    uaindex = ua.indexOf( 'OS ' );
  }
  else if ( ua.match(/Android/) )
  {
    userOS = 'Android';
    uaindex = ua.indexOf( 'Android ' );
  }
  else
  {
    userOS = 'unknown';
  }

  // determine version
  if ( userOS === 'iOS'  &&  uaindex > -1 )
  {
    userOSver = ua.substring(uaindex + 3, uaindex+3+2);
  }
  else if ( userOS === 'Android'  &&  uaindex > -1 )
  {
    userOSver = ua.substring( uaindex + 8, uaindex + 8 + 3 );
  }
  else
  {
    userOSver = 'unknown';
  }
}
function getOS(){
    return userOS;
}
function getOSver(){
    return userOSver.slice(0,2);
}
function play_finishsound(){
    if (!nosound) {
        /* soundHandle.src = 'audio/celebrate.mp3';
        soundHandle.volume=0.5;
        soundHandle.play(); */
        createjs.Sound.volume = 0.2;
        createjs.Sound.play("celebrate");
    }
}
function message_popup(text,coupon){
    document.getElementById('id01').style.display='block';
    document.getElementById('form').style.backgroundColor =color;
    document.getElementById('title').textContent=catText[pageindex-1];
    document.getElementById('category').innerHTML="<u style=\"white-space:normal\">" + text + ":</u>" + "<span id=\"coupon\" style=\"display:inline; color:#000000; white-space: normal;\"></span>";
    play_finishsound();
    start_confetti(color);
    $('#coupon').text(" " + coupon);
    wholecoupon = catText[pageindex-1] + "-" + text + ": " + coupon;

}

function categorySpinned(stext, index) {
    $("#spinbtn").hide();
    $("#button").hide();
    $('#tboy').show();
    $('#tboy').text(stext);
    $('#tboy').css('color',col[index]);
    $('#boy').hide();

    document.getElementsByTagName("body")[0].style.backgroundColor = pSBC(0.5,col[index],false,false);
    document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
    //document.getElementById("H3").insertAdjacentHTML('afterend', "<h4 id='testtext' style='white-space:normal'> Depending on the product you buy, here it will say either <br> 'It is a Girl!' or 'It is a Boy! with pink or blue background.</h4>");
    
    document.getElementById("spinbtn").value = "Go to the Category";
    $('#H3').hide();
    if(triggered==true) {
        return;
    }
    play_finishsound();
    triggered=true;
    start_confetti(col[index]);
    setTimeout(function(){
        $("#spinbtn").show();
    }, 1000);          
 };
 function start_confetti(confetti_color) {
    var duration = 1 * 1000;
   var end = Date.now() + duration;

   var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 10};               
   var particleCount = 5 ;
  
   (function frame() {
   // launch a few confetti from the left edge
   confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }}//, colors: [confetti_color]}
   );
   // and launch a few from the right edge
   confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }}//,colors: [confetti_color]}
   );

   // keep going until we are out of time
   if (Date.now() < end) {
       requestAnimationFrame(frame);
       
       return;
   }

    }());
 }
 function resetpage() {
    //$("#resetbutton").hide();
    $("#button").show();
    $('#tboy').hide();
    $('#boy').show();
    $('#or').show();
    $('#H3').show();
    document.getElementById("spinbtn").value = "Spin!";
    document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
    triggered = false;
    return false;
};
function gotohtml(index) {
    //params = new URLSearchParams();
    if (params.get("nosound")==null) {
        params.append("nosound",nosound);
    }
    window.location.href = loc[index] + "?" + params.toString();
    
}

export {resetpage, gotohtml, categorySpinned,getlocAddress, getOS, getOSver,message_popup, getcolor,getCat};


function playticksound() {

        if (!nosound) {
            createjs.Sound.volume = 0.5;
            createjs.Sound.play("sound");
        }

}
export {playticksound};

function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };


    

   
function initsound(){
   /*  soundHandle = document.getElementById('soundHandle');              
    soundHandle.autoplay = true;
    soundHandle.muted=false;
    soundHandle.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    soundHandle.play();
    soundHandle.pause(); */
   
    createjs.Sound.registerSound({src:"audio/celebrate.mp3", id:"celebrate"})
    createjs.Sound.registerSound({src:"audio/tick.mp3", id:"sound"});
    createjs.Sound.defaultInterruptBehavior="late";
   }
    
    function initPage() {

        findOS();
        history.pushState(null, null, document.URL);
        var tx = window.location.pathname;
        for(var x=0;x<loc.length;x++){
            if (tx.search(loc[x])!=-1){
                pageindex=x;
            }
        }
        params = new URLSearchParams(window.location.search.slice(1));
        nosound = params.get("nosound");
        fname = params.get("fname");
        tname = params.get("tname");
        if (fname==null) {
            fname="Someone";
        }
        if (tname==null){
            tname="";
        }
        if (nosound!==null){
            if (nosound == 'true') nosound=true;
            if (nosound == 'false') nosound=false;
            if (pageindex==0) {
                resetpage();
            }           
        } else {
            nosound=true;
            document.getElementById('fname').innerText = fname;
            document.getElementById('tname').innerText = tname + "! ";
            document.getElementById('id01').style.display='block';
        }

        
        window.addEventListener('onbeforeunload', function() {
            history.pushState(null, null, document.URL);
        });
        window.addEventListener('popstate', function(event) {
        window.location.href = loc[0] + "?"+params.toString();
      
      });
        initsound();
        color = col[pageindex];
        if (document.getElementById('myDropdown')!== null){
            $(document).click(function(event) { 
                if (!event.target.matches('.dropbtn')) {
                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    document.getElementById('myDropdown').style.display='none';
                    for (i = 0; i < dropdowns.length; i++) {
                      var openDropdown = dropdowns[i];
                      if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                      }
                    }
                }
                if(event.target.matches('#drp1')){
                    gotohtml(1);
                }
                if(event.target.matches('#drp2')){
                    gotohtml(2);
                }
                if(event.target.matches('#drp3')){
                    gotohtml(3);
                }
                if(event.target.matches('#drp4')){
                    gotohtml(4);
                }
                if(event.target.matches('#drp5')){
                    gotohtml(5);
                }
                if(event.target.matches('#drp6')){
                    gotohtml(6);
                }
              });
            $('.dropbtn').on("click", function(e) {
                document.getElementById('myDropdown').style.display='block';
            });
        }
        $('.nosoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display='none';
            if (pageindex==0) {
                nosound=true;
            }
        });
        
        $('.withsoundbtn').on("click", function (e) {
            if (pageindex==0) {
            document.getElementById('id01').style.display='none';
            nosound=false;
            initsound();
            } else {
            if (navigator.share) {
                navigator.share({
                  title: 'Love Coupon',
                  text : "Look What I've got! I spinned the wheel (for Love Coupons) and received this coupon!\n\n " + wholecoupon
                }).then(() => {

                })
                .catch(console.error);
              } else {
                alert("Unfortunately sharing is not supported by your browser/platform. Please take a screenshot instead");
            }
        }
        });
    };
    /**
     * Handle page load
     */
    window.addEventListener('load', function() {
        //$(document).ready(function() {
        if (supportsCanvas()) {
            initPage();
           

        } else {
            $('#scratcher-box').hide();
            $('#lamebrowser').show();
        }
    });
        