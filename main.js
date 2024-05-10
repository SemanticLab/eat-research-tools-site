import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'


import { gsap } from "gsap";
    
import { Draggable } from "gsap/Draggable";

/* The following plugin is a Club GSAP perk */
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { SplitText } from "gsap/SplitText";



gsap.registerPlugin(Draggable,InertiaPlugin,SplitText);




// document.querySelector('#app').innerHTML = `

// `





// repeat:-1,

let cardData = {}
let draggable = null
let cardTextData = {}
let canResetCardsPos = true
let activeMode = 'freestyle'
let entities = {}




let winWidth = Math.max(
  document.body.scrollWidth,
  document.documentElement.scrollWidth,
  document.body.offsetWidth,
  document.documentElement.offsetWidth,
  document.documentElement.clientWidth
);    
let winHeight= Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.documentElement.clientHeight
); 

let frestyle3Piles = false
if (winHeight >= 1100){
  frestyle3Piles = false
}
let minXNeg = -800
let minXPos = winWidth + 100
let minYNeg = -500
let minYPos = winHeight + 100

let firstFreeStyle = true
let welcomeHid = false

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;


let frestyleMode = async function(){

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // store current location
  let avgHeight = []
  for (let el of document.querySelectorAll('.card')){
    el.dataset.x = el.getBoundingClientRect().x
    el.dataset.y = el.getBoundingClientRect().y
    avgHeight.push(el.getBoundingClientRect().height)
  }
  activeMode = 'freestyle'

  avgHeight = average(avgHeight)
 

  
  gsap.to('.card-pile1',{stagger:0.1, y:avgHeight/2, x:20,duration:1, onComplete(){
    // gsap.to('.card-pile1',{y:avgHeight/2, x:20,duration:0.1, onComplete(){

  }})

  gsap.to('.card-pile2',{stagger:0.1, y:avgHeight+avgHeight/2+20, x:20,duration:1, onComplete(){
    // gsap.to('.card-pile2',{y:avgHeight+avgHeight/2+20, x:20,duration:0.1, onComplete(){

    if (firstFreeStyle){

      document.querySelector('#welcome').style.display='block'
      gsap.to('#welcome',{ opacity:1, duration: 0.5, onComplete(){
        
      }})
      

      firstFreeStyle = false
    }

  }})
  

    //



  document.body.style.overflowY = 'hidden'
  document.body.style.height = "100vh"
  


}

let hideWelcome = function(){

  if (!welcomeHid){
    gsap.to('#welcome',{ opacity:0, duration: 0.5, onComplete(){
      document.querySelector('#welcome').style.display='none'
      welcomeHid = true
    }})
  }


}


let showEntityBox = async function(){
  
  hideWelcome()

  for (let k in cardData){
    
    for (let ass of cardData[k].assoictedBack.concat(cardData[k].assoictedFront)){
      if (!entities[ass.label]){
        entities[ass.label] = {label: ass.label, qid: ass.qid, cards:[]}
      }
      if (entities[ass.label].cards.indexOf(k) == -1 ){
        entities[ass.label].cards.push(k)
      }
      

    }

  }
  let keysSorted = Object.keys(entities).sort()

  let html = ''
  for (let k in keysSorted){
    let e = entities[keysSorted[k]]

    let count = (e.cards.length > 1) ? ` (${e.cards.length})` : '';

    html = html + `<li><a class="entity-name" data-qid="${e.qid}" href="#">${keysSorted[k]}${count}</a></li>`

  }
  console.log(html)
  document.querySelector('#entities').innerHTML = html
  console.log("entitiesentitiesentitiesentities",entities)



  let elementsArray = document.querySelectorAll(".entity-name");

  elementsArray.forEach(function(elem) {
      elem.addEventListener("click", function(event) {
        
        if (!canResetCardsPos){ return false}
          
        gsap.to('#entity-box',{ opacity:0, duration: 0.5, onComplete(){
          document.querySelector('#entity-box').style.display='none'
        }})
        let nameClicked = ''
        for (let k in entities){
          if (entities[k].qid == event.target.dataset.qid){

            nameClicked = k
            for (let el of document.querySelectorAll('.card')){
              if (entities[k].cards.indexOf(el.dataset.qid)>-1 ){
                activeMode = 'entity'

                gsap.to(el,{ x: gsap.utils.random(0, winWidth-800, 1),  y: gsap.utils.random(50, winHeight-400, 1), duration: 1, onComplete(){

                }})


              }
            }

          }
        }

        document.querySelector('#entity-box-close').innerHTML = `Filtering: ${nameClicked} - Reset`
        document.querySelector('#entity-box-close').style.display='block'
        gsap.to('#entity-box-close',{ opacity:1, duration: 0.5, onComplete(){

        }})


        event.preventDefault()
        return false
      });
  });
  


  // store current location
  for (let el of document.querySelectorAll('.card')){
    el.dataset.x = el.getBoundingClientRect().x
    el.dataset.y = el.getBoundingClientRect().y
  }


  document.body.style.overflow = 'hidden'
  canResetCardsPos = false
  for (let el of document.querySelectorAll('.card')){

    let x = gsap.utils.random(minXNeg, minXNeg - 1000, 1)
    let y = gsap.utils.random(minYNeg, minYNeg - 1000, 1)
    if (gsap.utils.random(0, 1, 1) > 0){                  
      x = gsap.utils.random(minXPos,minXPos + 1000, 1)                  
    }
    if (gsap.utils.random(0, 1, 1) > 0){                  
      y = gsap.utils.random(minYPos, minYPos + 1000, 1)
    }
        
    gsap.to(el,{ x: x,  y: y, duration: 2, onComplete(){
      canResetCardsPos = true
    }})

  }



  document.querySelector('#entity-box').style.display = 'block'
  gsap.to('#entity-box',{ opacity:1, duration: 0.5, onComplete(){

  }})


  
  



}


let gridMode = async function(){
      hideWelcome()
      // store current location
      let avgHeight = []
      for (let el of document.querySelectorAll('.card')){
        el.dataset.x = el.getBoundingClientRect().x
        el.dataset.y = el.getBoundingClientRect().y
        avgHeight.push(el.getBoundingClientRect().height)
      }

      avgHeight = average(avgHeight)
      let currentY = -200
      document.body.style.overflowY = 'scroll'
      document.body.style.height = avgHeight * (document.querySelectorAll('.card').length /2 )  + 6000 + 'px'
      
      activeMode = 'grid'
      
      // for (let d of draggable){
      //   d.disable()
      // }
      // document.body.style.height = "5000vh"

      let counter = 0
      for (let el of document.querySelectorAll('.card')){       
        if (counter++ % 2 == 0){
          currentY = currentY + el.getBoundingClientRect().height + 5
          gsap.to(el,{ x: 10,  y: currentY, duration: gsap.utils.random(1, 2), onComplete(value){

          }})

        }else{

          gsap.to(el,{ x: winWidth / 2,  y: currentY, duration: gsap.utils.random(1, 2), onComplete(){

          }})

        }
      }

      // await new Promise(r => setTimeout(r, 2000));
      // for (let d of draggable){
      //   d.enable()
      // }

}

const init = async function(){

  var split = new SplitText("#loading-dots", {type: "chars"});

  gsap
    .fromTo(split.chars,{
      y: 0,  
      duration:1,
      stagger: 0.1,
      
    },
    {
      y: -25,  
      duration:1,
      yoyo:true,
      repeat:-1,
      stagger: 0.1,    
    })

    document.getElementById('menu').addEventListener('click',()=>{
      if (document.querySelector('nav').getBoundingClientRect().width > 60){
        gsap.to('nav',{width:'1.25em', duration:1})
      }else{
        gsap.to('nav',{width:'10.5em', duration:1})
      }
    })

    document.getElementById('mode-grid').addEventListener('click',async ()=>{

      gridMode()
      
    })
    document.getElementById('mode-freestyle').addEventListener('click',async ()=>{

      frestyleMode()
      
    })
    document.getElementById('mode-entity').addEventListener('click',async ()=>{

      showEntityBox()
      
    })



    document.getElementById('entity-box-close').addEventListener('click',async ()=>{
      activeMode = "freestyle"
      returnCardsToOrgPos()
      gsap.to('#entity-box-close',{ opacity:0, duration: 0.5, onComplete(){
        document.querySelector('#entity-box-close').style.display='none'
      }})



    })


    
    
    for (let el of document.querySelectorAll('.nav-button')){
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.15,
          duration: 0.25,
          rotate:3,
          yoyo:true,
          repeat:1
        });     
      });    
      el.addEventListener("mouseleave", () => {
        gsap.from(el, {
          scale: 1,
          duration: 0.25,
          rotate:0,
          yoyo:true,
          repeat:1
        });     
      }); 
      
      
    }


    var tl = gsap.timeline ()
    .to('#instruct-mock-card',{
      x: "random(10, 100, 1)", //chooses a random number between -20 and 20 for each target, rounding to the closest 5!
      y: "random(10, 100, 1)",
      duration:1,

      repeat:-1,
      repeatRefresh:true // gets a new random x and y value on each repeat
    })
    var tl2 = gsap.timeline ()
    .to('#instruct-mock-card-rotate',{
      
      rotationY:180,
      duration:2,
      yoyo:true,

      repeat:-1,

    })
    var tl3 = gsap.timeline ()
    .to('#instruct-mock-card-right',{
      
      scale:1.1,
      duration:0.5,

      repeatDelay: 2,

      repeat:-1,

    })



    






  let sparqlEndpoint = 'https://query.semlab.io/proxy/wdqs/bigdata/namespace/wdq/sparql'
	let queriesAllData = `

      select ?card ?block ?localId (group_concat(?assoicted;separator="<SEP>") as ?assoicteds) (group_concat(?assoictedLabel;separator="<SEP>") as ?assoictedLabels) where {
      
        ?card wdt:P1 wd:Q19069.
        ?card wdt:P96 wd:Q24347.
        ?block wdt:P24 ?card.
        ?block wdt:P21 ?assoicted.
        ?block wdt:P17 ?localId.
        ?assoicted rdfs:label ?assoictedLabel.
        ?assoicted wdt:P1 ?assoictedType.

        
      }  

    group by ?card ?block ?localId
		`
	  let sparqlOptions = {
        headers: new Headers({'Accept' : 'application/json'}),
        mode: 'cors'
    }

		const response = await fetch(`${sparqlEndpoint}?` + new URLSearchParams({query: queriesAllData}), sparqlOptions)
		const data = await response.json();

    for (let r of data.results.bindings){

      let qid = r.card.value.split('/')[4]

      if (!cardData[qid]){
        cardData[qid] = {
          qid: qid,
          uri: r.card.value,
          assoictedBack: [],
          assoictedFront: [],
          imgFront: `https://semlab.s3.amazonaws.com/images/eat-cards/smaller/${r.card.value.split('/')[4]}_f.png`,
          imgBack: `https://semlab.s3.amazonaws.com/images/eat-cards/smaller/${r.card.value.split('/')[4]}_b.png`

        }
      }

      if (r.assoicteds){
        
        let assoicted = r.assoicteds.value.split("<SEP>").map((v)=>{ return v.split('/')[4]})
        let assoictedLabels = r.assoictedLabels.value.split("<SEP>")
        let associatedObjs = []
        for (const [index, value] of assoicted.entries()) {
          if (['Technical Services Program','engineer','artist'].indexOf(assoictedLabels[index]) > -1){ continue }
          associatedObjs.push({qid:value,label:assoictedLabels[index]})
        }

        if (r.localId.value === '0'){
          cardData[qid].assoictedFront = associatedObjs
        }else{
          cardData[qid].assoictedBack = associatedObjs
        }
      }


    }


    

    let card, cardImg
    let cardWidth = winWidth * 0.45 
    if (cardWidth > 800){ cardWidth = 800}
    cardWidth=cardWidth+'px'
    
    let numberOfCards = Object.keys(cardData).length
    let allCardQids 

    let counter = 0
    for (let c in cardData){
      counter++
      cardData[c].initalSide = (cardData[c].assoictedFront.length>=cardData[c].assoictedBack.length) ? 'front' : 'back'

      card = document.createElement('div')
      card.style.opacity = 0

      card.classList.add('card')
      card.dataset.qid = cardData[c].qid


      if (!frestyle3Piles){
        if (counter >= numberOfCards/2){
          card.classList.add('card-pile2')

        }else{
          card.classList.add('card-pile1')

        }
      }else{


        


      }

      cardImg = document.createElement('img')

      if (cardData[c].initalSide == 'front'){
        cardImg.setAttribute('src',cardData[c].imgFront)    
        cardImg.dataset.side = 'front'
        card.dataset.activeSide = 'front'
      }else{
        cardImg.setAttribute('src',cardData[c].imgBack)
        cardImg.dataset.side = 'back'
        card.dataset.activeSide = 'back'
      }
      cardImg.style.height='auto'
      cardImg.style.width=cardWidth

      card.appendChild(cardImg)

      let cardImgOther = document.createElement('img')

      if (cardData[c].initalSide == 'front'){

        cardImgOther.setAttribute('src',cardData[c].imgBack)    
        cardImgOther.dataset.side = 'back'



      }else{

        cardImgOther.setAttribute('src',cardData[c].imgFront)    
        cardImgOther.dataset.side = 'front'


      }
      cardImgOther.style.height='auto'
      cardImgOther.style.width=cardWidth
      cardImgOther.style.position='absolute'
      cardImgOther.style.left=0
      cardImgOther.style.opacity=0


      // cardImgOther

      card.appendChild(cardImgOther)


      document.body.appendChild(card)




    }
    

    let loadCardsAni = async function(){
      
      await new Promise(r => setTimeout(r, 750));


      gsap.to('#loading',{ 

        opacity: 0,
        duration: 2,
        onComplete(){
          
          // document.getElementById("loading").style.display = 'none'
        }
      })
      gsap.set('.card',{x:-1000, opacity:1})
      gsap.to('.card',{ y:winHeight/2-card.getBoundingClientRect().height/2, x:winWidth-cardImg.getBoundingClientRect().width-25,duration:0.75, stagger:0.1, onComplete(){
        // gsap.to('.card',{ y:winHeight/2-card.getBoundingClientRect().height/2, x:winWidth-cardImg.getBoundingClientRect().width-25,duration:0.1, onComplete(){
        
        frestyleMode()
              
        draggable = Draggable.create(".card",
        {
          bounds: document.body,
          inertia: true,
          onDragStart: function(){
            hideWelcome()
          },
          onClick:  async function (event) {

            hideWelcome()
            let cardHolder = event.target
            if (event.target.tagName =='IMG'){
              cardHolder = event.target.parentNode
            }    
            let f = cardHolder.querySelector('[data-side="front"]')
            let b = cardHolder.querySelector('[data-side="back"]')

            if (event.button == 0){


              if (cardHolder.dataset.activeSide === 'front'){
                f.style.transitionDuration = "1000ms"
                f.style.transitionProperty = "transform"
                f.style.transform = "rotatey(" + 180 + "deg)"
                await new Promise(r => setTimeout(r, 325));
                f.style.opacity = 0
                b.style.opacity = 1
                f.style.transform = 'none'
                cardHolder.dataset.activeSide = 'back'
  
              }else{
                b.style.transitionDuration = "1000ms"
                b.style.transitionProperty = "transform"
                b.style.transform = "rotatey(" + 180 + "deg)"
                await new Promise(r => setTimeout(r, 325));
                b.style.opacity = 0
                f.style.opacity = 1
                b.style.transform = 'none'
                cardHolder.dataset.activeSide = 'front'
  
              }
  


            }else{


              
              if (window.getComputedStyle(document.querySelector('#info-box'), null).display !='none'){
                return false
              }

              window.scrollTo({ top: 0, behavior: 'smooth' });

                
              let position = null
              const checkIfScrollIsStatic = setInterval(() => {
                if (position === window.scrollY) {
                  clearInterval(checkIfScrollIsStatic)
                  document.body.style.overflow='hidden'
                }
                position = window.scrollY
              }, 50)




              // store current location
              if (activeMode != 'entity'){
                for (let el of document.querySelectorAll('.card')){
                  el.dataset.x = el.getBoundingClientRect().x
                  el.dataset.y = el.getBoundingClientRect().y
                }
              }
              

              
              canResetCardsPos = false
              for (let el of document.querySelectorAll('.card')){
                
                if (el.dataset.qid!=cardHolder.dataset.qid){  
                  
                  if (activeMode != 'entity'){

                    let x = gsap.utils.random(minXNeg, minXNeg - 1000, 1)
                    let y = gsap.utils.random(minYNeg, minYNeg - 1000, 1)
                    if (gsap.utils.random(0, 1, 1) > 0){                  
                      x = gsap.utils.random(minXPos,minXPos + 1000, 1)                  
                    }
                    if (gsap.utils.random(0, 1, 1) > 0){                  
                      y = gsap.utils.random(minYPos, minYPos + 1000, 1)
                    }
                    
                    
                    gsap.to(el,{ x: x,  y: y, duration: 2, onComplete(){
                      canResetCardsPos = true
                    }})
                  }else{
                    canResetCardsPos = true
                  }



                }else{  
                  
  
                  gsap.to(el,{ x: winWidth / 2 - (el.getBoundingClientRect().width / 2),  y: 50, duration: 1 })

                  let offsetFromTop = el.getBoundingClientRect().height + 50;
                  
                  document.querySelector('#info-box').style.top = offsetFromTop +'px'

                  let frontText = "no text"
                  let backText = 'no text'

                  if (cardTextData[cardHolder.dataset.qid].frontText){
                    const frontTextRequest = await fetch(cardTextData[cardHolder.dataset.qid].frontText)
                    const frontTextRequestText = await frontTextRequest.text();                    
                    frontText = frontTextRequestText
                  }
                  if (cardTextData[cardHolder.dataset.qid].backText){
                    const backTextRequest = await fetch(cardTextData[cardHolder.dataset.qid].backText)
                    const backTextRequestText = await backTextRequest.text();                    
                    backText = backTextRequestText
                  }

                  for (let side of ['front','back']){
                    let useText, updateHtmlId, assoicted, useBlock

                    if (side == 'front'){
                      useText = frontText
                      updateHtmlId = '#info-box-left-content'
                      assoicted = cardData[cardHolder.dataset.qid].assoictedFront
                      useBlock = cardTextData[cardHolder.dataset.qid].frontBlock
                    }else{
                      useText = backText
                      updateHtmlId = '#info-box-right-content'
                      assoicted = cardData[cardHolder.dataset.qid].assoictedBack
                      useBlock = cardTextData[cardHolder.dataset.qid].backBlock


                    }


                    

                    let textHTML = `
                      <div class="block-text">${useText}</div>
                    `

                    let assoictedHtml = `<div class="assoicted-links">`
                    for (let a of assoicted){
                      assoictedHtml = assoictedHtml + `<a href="http://base.semlab.io/entity/${a.qid}" target="_blank">${a.label}</a>`
                    }
                    assoictedHtml = assoictedHtml + `</div>`

                    let linksHtml = `<div class="info-links">Card Link: <a target="_blank" href="${cardData[cardHolder.dataset.qid].uri}">${cardHolder.dataset.qid}</a>`
                    if (useBlock){
                      linksHtml= linksHtml + ` | Block Link: <a target="_blank" href="${useBlock}">${useBlock.split('/')[4]}</a>`
                      
                    }
                    linksHtml= linksHtml + '</div>'


                    document.querySelector(updateHtmlId).innerHTML = linksHtml + textHTML + assoictedHtml


                  }
                  document.querySelector('#info-box').style.opacity = 0

                  document.querySelector('#info-box').style.display = 'flex'

                  gsap.to('#info-box',{ opacity:1, duration: 2 })

                }
  
              }

  



            }




          },      
        });        

      }})






    }
    

    if (cardImg.complete) {
      loadCardsAni()
    } else {
      cardImg.addEventListener('load',()=>{
        loadCardsAni()
      })
      
    }    


    // console.log(data)
    // console.log(cardData)

    
    // load some more data we use but not immedialty 
    queriesAllData = `
    select ?card ?block ?blockTextURL where {
  
      ?card wdt:P1 wd:Q19069.
      ?card wdt:P96 wd:Q24347.
      ?block wdt:P24 ?card.
      ?block wdt:P20 ?blockTextURL.

      
    }  
  `

  const response2 = await fetch(`${sparqlEndpoint}?` + new URLSearchParams({query: queriesAllData}), sparqlOptions)
  const data2 = await response2.json();    
  
  for (let r of data2.results.bindings){
    
    let qid = r.card.value.split('/')[4]

    if (!cardTextData[qid]){
      cardTextData[qid] = {
        qid: qid,
        uri: r.card.value,
        frontText:null,
        backText: null,
        frontBlock: null,
        backBlock: null,
      }
    }

    if (r.blockTextURL.value.indexOf('/0.txt')>-1){
      cardTextData[qid].frontText = r.blockTextURL.value
      cardTextData[qid].frontBlock = r.block.value

    }else{
      cardTextData[qid].backText = r.blockTextURL.value
      cardTextData[qid].backBlock = r.block.value

    }


  }


  let returnCardsToOrgPos = async function(){
    console.log(canResetCardsPos)
    if (!canResetCardsPos) return false

    document.querySelector('#info-box').style.display = 'none'


    if (activeMode == 'grid'){
      gridMode()
    }else if (activeMode == 'entity'){

    }else{

      for (let el of document.querySelectorAll('.card')){    
         console.log(el, el.dataset.x, el.dataset.y)
        gsap.to(el,{ x: el.dataset.x ,  y: el.dataset.y , duration: 2 })
      }


    }
    await new Promise(r => setTimeout(r, 2000));
    // document.body.style.overflow='auto'



  }


  document.getElementById('info-box-close').addEventListener('click', () =>{
    returnCardsToOrgPos()
  })



}

init()