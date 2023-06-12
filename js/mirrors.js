const server_buttons = document.getElementById("serversTable").querySelectorAll("tr")[0];
const server_list = document.getElementById("serversBody");
const noservers = document.getElementById("no-servers");
var timed_mirrors = [];
async function ping(url) {
  let URL = "https://"+url+"";
  try{
    let res = await fetch(URL,{mode: 'no-cors'});
    if (res){
      return true
    }else{
      return false
    }
  }
  catch(e){
    return false
  }
}
function genrow(mirror){
  let tableRow = "<tr class='serverRow"
    if (mirror.port == 0){
      sleepy = true;
      tableRow += " sleepy'>";
    }else{
      sleepy = false;
      tableRow += "''>"
    }
    tableRow += `<td>${mirror.role}</td><td>${mirror.name}</td><td>${mirror.port}</td><td>${mirror.loc}</td><td>${mirror.ms}</td></tr>`;
    server_list.innerHTML += tableRow;
}
async function time_mirrors(mirrors){
  var timed_mirrors = [];
  for (let x=0; x<mirrors.length;x++){
    const start = Date.now();
    let res =await ping(mirrors[x]["name"]);
    if (res){
      let now = Date.now();
      mirrors[x]["ms"] = (now-start);
      timed_mirrors.push(mirrors[x]);
      // console.log(`${server} - ${now - start}ms`);
    }
  }
  timed_mirrors.sort((a,b) => a.ms - b.ms);
  return timed_mirrors;
}
function buildpopup(mirror,sleepy){
  if (sleepy){
    classes = "sleepy " + mirror['role'];
  }else{
    classes = mirror['role'];
  }
  let res = `<ul class='${classes} leaflet-marker'><li><a href='http://${mirror["name"]}'>${mirror["name"]}</a></li><li>Port: ${mirror["port"]}</li><li class='`
  let lag = mirror["ms"];
  if (lag <= 70){
    lclass = "low'>";
  }else if (lag <= 180){
    lclass = "mid'>";
  }else if (lag <= 350){
    lclass = "high'>";
  }else{
    lclass = "shigh'>'";
  }
  res+=`${lclass}Response time: ${lag}ms</li></ul>`
  return res
}

function empty_buttons(target){
  server_buttons.querySelectorAll("th").forEach(node =>{
    if (node.classList.contains("sort")){
      if (node != target){
        node.innerText = node.innerText.split(" ")[0]+" ‐";
      }
    }else{
      node.getElementsByTagName("option")[0].selected = true;
    }
  })
}
function compareValues(a, b) {
  return (a<b) ? -1 : (a>b) ? 1 : 0;
}
function sortBy(item){
  let [option,status] = item.innerText.split(" ");
  let rows = Array.from(server_list.querySelectorAll(`tr`));
  switch(option){
    case "Name":
      colnum = 2;
      break;
    case "Lag":
      colnum = 5;
      break;
    default:
  }
  let qs = `td:nth-child(${colnum})`;
  let invert = false;
  switch (status){
    case "▲":
      item.innerText = option+" ▼";
      break;
    default:
    item.innerText = option + " ▲";
    invert = true;
    
  }
  rows.sort( (r1,r2) => {
    let t1 = r1.querySelector(qs);
    let t2 = r2.querySelector(qs);
    console.log(r1)
    let rval = compareValues(t1.textContent,t2.textContent);
    if (! invert && rval != 0){
      rval = -rval;
    }
    return rval;
  });

  // and then the magic part that makes the sorting appear on-page:
  rows.forEach(row => server_list.appendChild(row));
}
async function main(){
  var mapa = new L.map('map', {
      center: [40.4166359,-3.7038101],
      zoom: 4
  });
  var capa = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  mapa.addLayer(capa);
  var markers = L.markerClusterGroup();
  console.log("STARTING")
  const res = await fetch("../data/mirrors.json")
    .then(res=>res.json())
    .then(data=>{return data});
  console.log(res)
  timed_mirrors = await time_mirrors(res);
  let locOptions = [];
  let locationHeader = server_list.parentNode.querySelectorAll("tr")[0].querySelectorAll("th")[3];
  console.log(locationHeader)
  locationHeader.innerHTML = "Location</br><select id='location'><option selected value='none'>Any</option></select>";
  locationHeader = locationHeader.querySelector("select");
  timed_mirrors.forEach(mirror => {
    if (! locOptions.includes(mirror.loc)){
      locOptions.push(mirror.loc);
      let option = document.createElement("option");
      option.value = mirror.loc;
      option.innerText = mirror.loc;
      locationHeader.appendChild(option)
    }
    genrow(mirror);
    let popup = buildpopup(mirror,sleepy);
    var marcador = new L.marker([mirror["lat"],mirror["lon"]])
    .bindPopup(popup);
    markers.addLayer(marcador);
    console.log(`Mirror ${mirror.name} ${mirror.lat}/${mirror.lon} -> ${mirror.ms}`);
  })
  mapa.addLayer(markers);
}

server_buttons.addEventListener("click",e=>{
  let target = e.target;
  server_list.parentNode.classList.add("change");
  if (target.classList.contains("sort")){
    empty_buttons(target);
    sortBy(target);
  }
  server_list.parentNode.classList.remove("change");
})
server_buttons.addEventListener("change", e => {
  let select = e.target;
  server_list.parentNode.classList.add("change");
  server_list.innerHTML="";
  timed_mirrors.forEach(mirror =>{
    genrow(mirror);
  })
  console.log(select.id + " with value " + select.value);
  let rows = Array.from(server_list.querySelectorAll(`tr`));
  switch (select.id) {
    case "role":
      colnum=1;
    break;
    case "port":
      colnum=3;
    break;
    case "location":
      colnum=4;
    break;
  }
  let qs = `td:nth-child(${colnum})`;
  let frows = [];
  console.log(frows.length)
  rows.forEach(row =>{
    server_list.removeChild(row);
    let rowvalue = row.querySelector(qs).innerText;
    if (rowvalue == select.value || select.value == "none" || (select.value == "other" && (rowvalue != 1407  && rowvalue[0] != 0)) || (colnum == 3 && rowvalue[0] == 0 && select.value == 0)){
      console.log("Pushing with value " + select.value)
      console.log(row)
      frows.push(row);
    }
  })
  console.log(frows.length)
  if (frows.length != 0) {
    server_list.style.opacity = "";
    noservers.style.display = "none";
    frows.forEach(row => server_list.appendChild(row));
  }else{
    server_list.style.opacity = "0";
    noservers.style.display = "inline";
  }
  server_list.parentNode.classList.remove("change");
});
main() 
