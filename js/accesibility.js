let date = new Date();
document.getElementById("year").innerText = date.getFullYear();
var Menuprincipal = window.pageYOffset;
const wrapper = document.getElementById("wrapper");
const menu = document.getElementById("menus");
let offset = 0;
window.onscroll = function() {
    let desplazamiento = window.pageYOffset; 
    if(Menuprincipal >= desplazamiento || desplazamiento < 100){
        let toffset = Menuprincipal-desplazamiento;
        if (offset > 500 || desplazamiento < 100){
            wrapper.classList.remove("sticky-on");
            if (window.innerWidth < 1170){
                menu.style.transform = "translateX(0px)";
            }else{
                menu.style.cssText ="";
            }
            offset=0;
        }else{
            offset+=toffset
        }
    }
    else if(! wrapper.classList.contains("sticky-on")){
        wrapper.classList.add("sticky-on");
        if (window.innerWidth < 1170){
            menu.style.cssText = "transform:translateX(-200px);top:150px;";
        }else{
            menu.style.cssText ="";
        }
    }
    Menuprincipal = desplazamiento;
}

var langs = {"es":[],"en":[]};
const cover = document.getElementById("cover");
window.onload = async function onload (){
    document.getElementById("menus").classList.add("darkmen");
    fetch('https://cnfos.confugiradores.es/data/data.json').then(response => response.json()).then(json => JSON.stringify(json)).then(json => JSON.parse(json)).then(async result => {
        console.log(result["lang"])
        langs = result["lang"];
        console.log("HOLA")
        await ready();
      });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function ready(){
    lng = window.localStorage.getItem("lng");
    if (lng == null || lng == undefined){
        lng="es";
    }
    nmode = window.localStorage.getItem("nmode");
    if (nmode == null || nmode == undefined){
        nmode="nightmode";
    }
    await nightmode(nmode);
    await language(lng,true);
    cover.style.opacity="0";
    await sleep(500);
    cover.style.display="none";
}

var lng;
const langsContainer = document.getElementById("langs");
langsContainer.addEventListener("click",e => {
    console.log(e.target.id.split("-")[1]);
    language(e.target.id.split("-")[1]);
})
async function language(value,start=false){
    document.getElementById("lng-active").innerText=value.toUpperCase();
    console.log("Changing lang to " + value)
    if (lng != value){
        lng=value;
    }else{
        if (!start){
            return
        }
    }
    for (var key in langs[lng]){
        let obj = document.getElementById(key);
        if (obj != null){
            if (!start) {
                obj.classList.add("lang-pre");
                await sleep(50);
            }
            obj.innerText = langs[lng][key];
            obj.classList.remove("lang-pre");
        }
    }
    window.localStorage.setItem("lng",lng);
}

var nmode;
const nightContainer = document.getElementById("nmode");
nightContainer.addEventListener("click", e =>{
    let src = nightContainer.src.split("/");
    nightmode(src[src.length - 1].split(".")[0]);
})
function nightmode(mode){
    let cssFile = document.head.getElementsByTagName("link")[0];
    let cssHref = cssFile.href.split("/");
    let imgSrc = nightContainer.src.split("/");
    let logoImg = document.getElementById("logo-img");
    let scroll = document.getElementById("scroll");
    let bgPath = getComputedStyle(document.documentElement).backgroundImage.split("/");
    cssHref.pop();
    imgSrc.pop();
    bgPath.pop();
    bgPath = bgPath.join("/");
    imgSrc = imgSrc.join("/");
    switch (mode){
        case 'night':
            document.getElementById("menus").classList.add("darkmen");
            logoImg.src = imgSrc + "/dark-logo.svg";
            scroll.style.backgroundImage = bgPath + "/dark-header.png\")";
            document.documentElement.style.backgroundImage = bgPath + "/dark-bg.png\")";
            nightContainer.src = imgSrc + "/light.svg";
            cssFile.href = cssHref.join("/") + "/nightmode.css";
            break;
        case 'light':
            document.getElementById("menus").classList.remove("darkmen");
            logoImg.src = imgSrc + "/light-logo.svg";
            scroll.style.backgroundImage = bgPath + "/light-header.png\")";
            document.documentElement.style.backgroundImage = bgPath + "/light-bg.png\")";
            nightContainer.src = imgSrc + "/night.svg";
            cssFile.href = cssHref.join("/") + "/lightmode.css";
            break;
    }
    window.localStorage.setItem("nmode",mode);
}
