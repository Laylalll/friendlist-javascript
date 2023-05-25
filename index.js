// variable
const BASE_URL = 'https://user-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const FRIEND_PER_PAGE = 12

const friends = []
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// EXECUTING 
axios
  .get(INDEX_URL)
  .then(function (res) {
    friends.push(...res.data.results)
    renderPaginator(friends.length)
    renderFriendList(getFriendsByPage(1)) //預設顯示首頁
  })
  .catch(function (err) {
    console.log(err)
  })

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.show-friend-modal')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(keyword))

  if (!filteredFriends.length) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的朋友`)
  }
  renderPaginator(filteredFriends.length)
  renderFriendList(getFriendsByPage(1)) //預設顯示搜尋結果首頁
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  renderFriendList(getFriendsByPage(page))
})


// FUNCTION
function getFriendsByPage(page) {
  // page 1 => 0~11 
  // page 2 => 12~23 
  // page 3 => 24~35
  const data = filteredFriends.length ? filteredFriends : friends

  const startIndex = (page - 1) * FRIEND_PER_PAGE
  return data.slice(startIndex, startIndex + FRIEND_PER_PAGE)
}

function renderPaginator(amount) {
  // 200 / 12 = 16...6 => 17頁
  const numberOfPages = Math.ceil(amount / FRIEND_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friends.find(friend => friend.id === id)

  if (list.some(item => item.id === id)) {
    return alert(`此朋友已經加入收藏清單中！`)
  }

  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
}
function showFriendModal(id) {
  const friendModalTitle = document.querySelector('#friend-modal-title')
  const friendModalInfo = document.querySelector('#friend-modal-info')
  const friendModalAvatar = document.querySelector('#friend-modal-avatar')

  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影
  friendModalAvatar.src = ''
  friendModalTitle.textContent = ''
  friendModalInfo.innerHTML = ''

  axios
    .get(INDEX_URL + id)
    .then(function (res) {
      const data = res.data
      friendModalAvatar.src = data.avatar
      friendModalTitle.textContent = data.name
      friendModalInfo.innerHTML = `
        <p>Gender:${data.gender}</p>
        <p>Age:${data.age}</p>
        <p>Region:${data.region}</p>
        <p>Birthday:${data.birthday}</p>
        <p>Email:\n${data.email}</p>
      `
    })
    .catch(function (err) {
      console.log(err)
    })

}
function renderFriendList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <a href="#">
              <img src="${item.avatar}" class="card-img-top show-friend-modal"
              alt="avatar-img" data-bs-toggle="modal" data-bs-target="#show-friend-modal" data-id="${item.id}">
            </a>
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <button class="btn btn-primary btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
