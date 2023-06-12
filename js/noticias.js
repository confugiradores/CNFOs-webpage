var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    genContent(this);
  }
};

xmlhttp.open("GET", "https://cnfos.confugiradores.es/data/noticias.xml", true); 
xmlhttp.send();

function genContent(xml) {
  var xmlDoc = xml.responseXML;
  var data = xmlDoc.getElementsByTagName("noticia");
  let container = document.getElementsByClassName("container")[0];
  for (let x=0;x<data.length;x++){
    let values =[];
    [1,3].forEach(val=>{
      values.push(data[x].childNodes[val].childNodes[0].nodeValue);
    })
    let article = document.createElement("div");
    article.classList = "box article";
    //console.log(data[x].childNodes[3].nodeValue);
    article.innerHTML="<h2>"+values[0]+"</h2><p class='subtitle'>By "+data[x].getAttribute("author")+ " " + data[x].getAttribute("date")+"</p><div>"+values[1]+"</div>";
    container.appendChild(article);
    console.log(article.clientHeight)
    if (article.clientHeight > 440){
      let readmore = document.createElement("span");
      readmore.innerText = "Read more...";
      readmore.classList = "estudia";
      readmore.onclick = function(self){
        let target = self.target;
        let parent = target.parentNode;
        if (target.innerText == "Read less..."){
          target.innerText = "Read more...";
          parent.childNodes[2].style.maxHeight = "";
        }else{
          target.innerText = "Read less...";
          parent.childNodes[2].style.maxHeight = "2000px";
        }
      };
      article.classList.add("read-more");
      article.appendChild(readmore);
    }
  }
}

