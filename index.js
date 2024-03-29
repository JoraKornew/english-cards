// =======================================


// Globals -----------------------

let part = [] // container for sentences, load from static json file.

let loopMap = [ // map for loop, load from local storage
  [3,6,6,0],      // a 3-5, b 6-10, state
  [],            //new
  [],            //zero
  [],            //a1
  [],            //a2
  [],            //a3
  [],            //b1
  [],            //b2
  [],            //b3
  [],            //b4
  [],            //b5
]

const req = new XMLHttpRequest() // request object.

// EndGlobals ----------------------

req.addEventListener("load", start)

// Events --------------------------------

// Start Event
document.getElementById("startBtn").addEventListener("click", ()=> {
  req.open( "GET", document.getElementById("parts").value)
  req.send()
  document.getElementById("startBtn").setAttribute("disabled","")
})

// Select Part Event
document.getElementById("parts").addEventListener("change", ()=> {
  refreshStats()
})

// Input Events
document.getElementById("answer").addEventListener("keyup", (event)=>{
  if(event.keyCode == 13) {
    if(document.getElementById("answer").value == "w\n"){
      win()
    }else if(document.getElementById("answer").value == "l\n"){
      lose()
    }else{
      check()
    }
  }
})

// Reset Event
document.getElementById("resetCurBtn").addEventListener("click", ()=>{
  if(document.getElementById("resetCurBtn").innerText == "reset") {
    document.getElementById("resetCurBtn").innerText = "rly clear curent data?"
  } else {
    document.getElementById("resetCurBtn").innerText = "reset"
    loopMap = [[3,6,6,0],[],[],[],[],[],[],[],[],[],[]]
    localStorage.setItem(`${document.getElementById("parts").value}`,JSON.stringify(loopMap))
    init()
  }
})


// Reset All Event
document.getElementById("resetBtn").addEventListener("click", ()=>{
  if(document.getElementById("resetBtn").innerText == "reset All") {
    document.getElementById("resetBtn").innerText = "rly clear all data?"
  } else {
    document.getElementById("resetBtn").innerText = "reset All"
    localStorage.clear()
    loopMap = [[3,6,6,0],[],[],[],[],[],[],[],[],[],[]]
    init()
  }
})


function load(){
  //console.log(loopMap)
  let counter = loopMap[0][3]
  let i = loopMap[0][2]
  while (loopMap[i].length == 0) {
    if(i>5){loopMap[0][2] = loopMap[0][0]}
    if(i>2 && i<6) {loopMap[0][2] = 2} 
    if(i==2) {loopMap[0][2] = 1}
    if(i==1) {
      if (loopMap[i].length==0)  {
        //console.log("round end")
        loopMap[0][1]==10 ? loopMap[0][1] = 6 : loopMap[0][1]++
        loopMap[0][0]==5 ? loopMap[0][0] = 3 : loopMap[0][0]++
        loopMap[0][2] = loopMap[0][1]
        loopMap[0][3] = 0
        localStorage.setItem(`${document.getElementById("parts").value}`,JSON.stringify(loopMap))
        init()
        return ;
      } 
    }
    i = loopMap[0][2]
  } 
  if(i>5){document.getElementById("info").innerText = `b part: ${loopMap[i].length} | ${document.getElementById("parts").value}`}
  if(i>2 && i<6) {document.getElementById("info").innerText = `a part: ${loopMap[i].length} | ${document.getElementById("parts").value}`} 
  if(i==2) {document.getElementById("info").innerText = `zero part: ${loopMap[i].length} | ${document.getElementById("parts").value}`}
  if(i==1) {document.getElementById("info").innerText = `new part: ${loopMap[i].length} | ${document.getElementById("parts").value}`}

  document.getElementById("question").innerText=part[loopMap[i][counter]][1]
  document.getElementById("ranswer").innerText=""
  document.getElementById("youAnswer").innerText=""
}

function check(){
  let i = loopMap[0][2]
  let counter = loopMap[0][3]
  var refEnd = part[loopMap[i][counter]][0].split(' ')

  document.getElementById("ranswer").innerText=part[loopMap[i][counter]][0]

  document.getElementById("cambDic").setAttribute("href", `https://dictionary.cambridge.org/dictionary/english-russian/${refEnd[0]}`)

  document.getElementById("youAnswer").innerText= document.getElementById("answer").value 
  document.getElementById("answer").value = ""
}

function refreshStats(){
  let aSum = 0
  let bSum = 0
  if(localStorage.hasOwnProperty(`${document.getElementById("parts").value}`)){
    loopMap = JSON.parse(localStorage.getItem(`${document.getElementById("parts").value}`))
  } else {
    loopMap = [[3,6,6,0],[],[],[],[],[],[],[],[],[],[]]
    localStorage.setItem(`${document.getElementById("parts").value}`,JSON.stringify(loopMap))
  }

  aSum = loopMap[3].length + loopMap[4].length + loopMap[5].length
  bSum = loopMap[6].length + loopMap[7].length + loopMap[8].length + loopMap[9].length + loopMap[10].length
  document.getElementById("aStats").innerText=(aSum)
  document.getElementById("bStats").innerText=(bSum)
    if( (aSum + bSum) <= 5){
    document.getElementById("statsBlock").setAttribute("style", "background: greenyellow")
  } else {
    document.getElementById("statsBlock").setAttribute("style", "background: floralwhite")
  }

  if(loopMap[2].length == 0){
    document.getElementById("zStatsLine").setAttribute("style", "background: greenyellow")
  } else {
    document.getElementById("zStatsLine").setAttribute("style", "background: floralwhite")
  }
  document.getElementById("zStats").innerText=(loopMap[2].length)
}

function init(){
  document.getElementById("learn").setAttribute("hidden","")
  document.getElementById("init").removeAttribute("hidden")
  refreshStats()
}

function getRandomInt(max){
  return Math.floor(Math.random()*max)
}

function start(){
  document.getElementById("init").setAttribute("hidden","")
  document.getElementById("learn").removeAttribute("hidden")
  document.getElementById("startBtn").removeAttribute("disabled")
  part = JSON.parse(this.responseText)

  let roundCount = document.getElementById("inCount").value
  const freeList = []
  part.forEach((dummyElement, id)=>{
    freeList.push(id)
  })

  for(let j = 1; j < 11; j++){
    loopMap[j].forEach((element)=>{
      freeList[element] = -1
    })
  }

  for(let k = 0; k < (freeList.length ); k++){
    if(freeList[k]==-1) {
      freeList[k] = freeList[freeList.length - 1]
      freeList.pop()
      k--
    }
  }

  //	console.log(freeList.length)

  if(freeList.length < roundCount)  {
    roundCount = freeList.length
  }

  let index = 0
  for(let i = 0; i < roundCount ; i++){
    index = getRandomInt(freeList.length - 1)
    loopMap[loopMap[0][2]].push(freeList[index])
    freeList[index]= freeList[freeList.length - 1]
    freeList.pop()
  }
  load()
  //	console.log(this.responseText)
}

function win(){
  let i = loopMap[0][2]
  let counter = loopMap[0][3]
  if(i>5 && loopMap[i].length!=0){loopMap[i].length>1 ? loopMap[i][0]=loopMap[i].pop(): loopMap[i].pop()}
  if(i>2 && i<6 && loopMap[i].length!=0) {
    loopMap[loopMap[0][1]].push(loopMap[i][0])
    loopMap[i].length>1 ? loopMap[i][0]=loopMap[i].pop(): loopMap[i].pop()
  } 
  if(i==2 && loopMap[i].length!=0) {
    loopMap[loopMap[0][0]].push(loopMap[i][0])
    loopMap[i].length>1 ? loopMap[i][0]=loopMap[i].pop(): loopMap[i].pop()
  }
  if(i==1){
    loopMap[2].push(loopMap[i][counter])
    counter==(loopMap[1].length - 1) ? loopMap[1].pop(): loopMap[1][counter]=loopMap[1].pop()
    loopMap[0][3]>=(loopMap[1].length - 1) ? loopMap[0][3] = 0 : loopMap[0][3]++

  }
  load()
  document.getElementById("answer").value = ""
}

function lose(){
  let i = loopMap[0][2]
  if(loopMap[i].length!=0) {
    if(i!=1){
      loopMap[1].push(loopMap[i][0])
      loopMap[i].length>1 ? loopMap[i][0]=loopMap[i].pop(): loopMap[i].pop()
    } else {
      loopMap[0][3]>=(loopMap[1].length - 1) ? loopMap[0][3] = 0 : loopMap[0][3]++
    }
  }
  load()
  document.getElementById("answer").value = ""
}

function test1 (a){

  for (i=0;i<a;i++){
    win()
    //check()
    lose()
    //	check()
    win()
  }


  return loopMap



}

init()


// =======================================

