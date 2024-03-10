fetch('https://mesaverde.ir/cartshop',{
      method:'POST'
    }).then(res=>res.json())
    .then(res=>{
      if(res[0]) document.getElementById('ekhtar').remove()
      function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
        return parts.join(",");
        }
       var sum = 0;
      for(let i of res){
        for(let x of document.getElementById('colesh').children){
       if(x.classList.contains('cart-item')){
        x.children[1].children[0].textContent=i.fullname;
        x.children[1].children[1].textContent+=i.price;
        x.setAttribute("data-id",i.id)
        x.children[0].src=`image/${i.id}.jpg`
        x.classList.remove('cart-item')
        x.classList.add('cartt-item')
        
        break
       }}
       let price = (i.price).replaceAll(".","")
       sum+= +(price)
      
      }
      document.getElementById('totalprice').textContent+=numberWithCommas(sum)
      
      })


  for(let g of document.getElementsByClassName('remove-button')){
    g.onclick=function(event){
      let divv= event.currentTarget.parentElement
      divv.classList.remove('cartt-item')
      divv.classList.add('cart-item')
      g.setAttribute('href' , `/shopcart`)
      var req = new XMLHttpRequest();
      req.open('post', `/cart/remove/?id=${divv.dataset.id}`, true);
      req.send(null);

    }
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
  let username = getCookie("name");
  if (username != "") {
    document.getElementById('title1').textContent+=` : ${username}`
  }
}
checkCookie()
      

document.getElementById('demo').onclick=function(){
  alert('این یک سایت آزمایشی است')
}
