// variable
const BASE_URL = 'https://user-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/users/'

const friends = JSON.parse(localStorage.getItem('favoriteFriends')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// EXECUTING 
renderFriendList(friends)

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.show-friend-modal')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// FUNCTION
function removeFromFavorite(id) {
  if (!friends || !friends.length) return

  const friendIndex = friends.findIndex(friend => friend.id === id)
  if (friendIndex === -1) return

  friends.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(friends))

  renderFriendList(friends)
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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
