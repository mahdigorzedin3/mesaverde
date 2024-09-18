

function resp() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  function home(){
    let products =document.getElementById('dan').children;
    
    for(let x of products){
      x.style.display='flex';
    }
    let anchor = document.getElementById('myTopnav').children;
    for(let x of anchor){
      if(x.classList.contains('active')) x.classList.remove('active');
    }
    anchor[0].classList.add('active');
    footerstay()
  }
  function no(){
    let products =document.getElementById('dan').children;
    
    for(let x of products){
      x.style.display='flex';
      if(!(x.dataset.type ==="new")) x.style.display='none';
    }
    let anchor = document.getElementById('myTopnav').children;
    for(let x of anchor){
      if(x.classList.contains('active')) x.classList.remove('active');
    }
    anchor[1].classList.add('active');
    footerstay()
  }

  function hand(){
    let products =document.getElementById('dan').children;
    
    for(let x of products){
      x.style.display='flex';
      if(!(x.dataset.type ==="hand")) x.style.display='none';
    }
    let anchor = document.getElementById('myTopnav').children;
    for(let x of anchor){
      if(x.classList.contains('active')) x.classList.remove('active');
    }
    anchor[2].classList.add('active');
    footerstay()
  }

  function stock(){
    let products =document.getElementById('dan').children;
    
    for(let x of products){
      x.style.display='flex';
      if(!(x.dataset.type ==="stock")) x.style.display='none';
    }
    let anchor = document.getElementById('myTopnav').children;
    for(let x of anchor){
      if(x.classList.contains('active')) x.classList.remove('active');
    }
    anchor[3].classList.add('active');
    footerstay()
  }

 

  function search(){
    let product =document.getElementById('dan').children;
    
    for(let x of product){
      x.style.display='flex';
    }
    let input=document.getElementById('search').value.toLowerCase();
    var arr= input.split(' ');
    console.log(arr.length);
    var products =document.getElementsByClassName('title');
    for(let x of products){
      let ban = x.textContent.toLowerCase().split(' ');
      if(!(todo(arr,ban)))x.parentNode.parentNode.style.display='none'  ;
    }
    footerstay()
  }
  function search2(){let product =document.getElementById('dan').children;
    
  for(let x of product){
    x.style.display='flex';
  }
  let input=document.getElementById('search2').value.toLowerCase();
  var arr= input.split(' ');
  console.log(arr.length);
  var products =document.getElementsByClassName('title');
  for(let x of products){
    let ban = x.textContent.toLowerCase().split(' ');
    if(!(todo(arr,ban)))x.parentNode.parentNode.style.display='none'  ;
  }
  footerstay()}

  function todo (search,pro){
    let counter = 0;
    for(let word of search){
      let item = word.toString();
      if(pro.includes(item)){
        counter++;
      } 
    }
    if(counter===search.length) return true;
  }

  function footerstay(){
   
  if(document.body.clientHeight<window.innerHeight) foot.classList.add('footerdown');
    else(foot.classList.remove('footerdown'))
  
  }


for(let i=1;i<=document.getElementById('dan').children.length;i++){
  let anchor =  document.getElementById('dan').children[i-1].firstElementChild;
  anchor.setAttribute('href' , `/products/?id=${i}`)
  anchor.onclick=function(event){
    var req = new XMLHttpRequest();
  req.open('GET', `/gson`, true);
  req.send(null);
  
  }

}
let cartanch= document.getElementById('cartshop');
cartanch.onclick=function(event){
  var req = new XMLHttpRequest();
 req.open('post', `/cartshop`, true);
 req.send(null);
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let username = getCookie("jwt");
  if (username != "") {
    document.getElementById('log').textContent='حساب کاربری👤'
    document.getElementById('log').href='/user-info'
    document.getElementById('log').classList.add('logged')
    document.getElementById('log').classList.remove('unlog')
  }
}
checkCookie()
  
if(window.location.search==="?stock") stock();
if(window.location.search==="?no") no();
if(window.location.search==="?hand") hand();
