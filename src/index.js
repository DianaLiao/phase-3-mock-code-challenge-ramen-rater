// write your code here

window.addEventListener("DOMContentLoaded", () => {
  retrieveAllRamen()
  displayFirstRamen()
})

const url = "http://localhost:3000/ramens"
const ramenMenu = document.querySelector("div#ramen-menu")
const ramenForm = document.querySelector("form#ramen-rating")
const addRamenForm = document.querySelector("form#new-ramen")
const deleteRamenButton = document.querySelector("button#delete-ramen")
const bestRamenButton = document.querySelector("button#best-ramen")

ramenForm.addEventListener("submit", updateRamen)
addRamenForm.addEventListener("submit", addRamen)
deleteRamenButton.addEventListener("click", deleteRamen)
bestRamenButton.addEventListener("click", showBestRamen)

function retrieveAllRamen(){
  fetch(url).then(resp => resp.json())
    .then(displayAllRamen)
}

function displayAllRamen(data){
  ramenMenu.innerHTML = ""
  data.forEach(addRamenToMenu)
}

function addRamenToMenu(ramen){
  const menuImg = document.createElement("img")
  menuImg.dataset.id = ramen.id
  menuImg.src = ramen.image

  ramenMenu.append(menuImg)

  menuImg.addEventListener("click", _ => {
    displaySelectedRamen(ramen)})
}

function displayFirstRamen(){
  fetch(`${url}/?_limit=1`).then(resp=>resp.json())
  .then(data => displaySelectedRamen(data[0]))
}

function displaySelectedRamen(ramen){
  const ramenDetail = document.querySelector("div#ramen-detail")

  const imgName = ramenDetail.querySelector("h2.name")
  const imgRestaurant = ramenDetail.querySelector("h3.restaurant")

  imgName.textContent = ramen.name
  imgRestaurant.textContent = ramen.restaurant

  ramenDetail.innerHTML = ` <img class="detail-image" src=${ramen.image} alt="${ramen.name}" />
  <h2 class="name">${ramen.name}</h2>
  <h3 class="restaurant">${ramen.restaurant}</h3>`  

  ramenForm.rating.value = ramen.rating
  ramenForm.comment.textContent = ramen.comment 
  ramenForm.dataset.id = ramen.id
  deleteRamenButton.dataset.id = ramen.id
}

function updateRamen(event){
  event.preventDefault()

  const updatedRating = {
    rating: ramenForm.rating.value,
    comment: ramenForm.comment.value
  }

  const fetchObj = {
    method: "PATCH",
    headers: {
      "Content-type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify(updatedRating)
  }

  fetch(`${url}/${ramenForm.dataset.id}`, fetchObj)
    .then(resp => resp.json())
    .then(ramen => {
      retrieveAllRamen()
      displaySelectedRamen(ramen)
    })
}

function addRamen(event){
  event.preventDefault()

  const name = addRamenForm.name.value
  const restaurant = addRamenForm.restaurant.value
  const image = addRamenForm.image.value
  const rating = addRamenForm.rating.value
  const comment = addRamenForm["new-comment"].value
  const fetchObj = {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify({name, restaurant, image, rating, comment})
  }

  fetch(url, fetchObj).then(resp => resp.json())
    .then(ramen => {
      addRamenToMenu(ramen)
      displaySelectedRamen(ramen)
    })

  addRamenForm.reset()
}

function deleteRamen(event){
  const ramenId = event.target.dataset.id
  
  fetch(`${url}/${ramenId}`, {method:"DELETE"}).then(resp => resp.json())
    .then(_ => {
      alert("Ramen has been deleted!")
      retrieveAllRamen()
      displayFirstRamen()
    })
}

function showBestRamen(){
  fetch(url).then(resp=>resp.json())
    .then(list =>{
      let rankedRamen = list.sort((a,b)=>(b.rating - a.rating))
      displaySelectedRamen(rankedRamen[0])
    })
}