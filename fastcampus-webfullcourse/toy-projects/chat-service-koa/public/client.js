// @ts-check

(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);

  const formEl = document.getElementById('form');
  const inputEl = document.getElementById('input');
  const chatsEl = document.getElementById('chats');

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed!');
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type {Chat[]}
   */
  const chats = [];

  const adjectives = ['멋진', '훌룡한', '친절한', '새침한'];
  const animals = ['물범', '사자', '사슴', '돌고래'];

  /**
   *
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length);
    const result = array[randomIdx];

    if (!result) {
      throw new Error('array length is 0.');
    }

    return result;
  }

  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`;

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();

    socket.send(
      JSON.stringify({
        // @ts-ignore
        message: inputEl.value,
        nickname: myNickname,
      })
    );
    // @ts-ignore
    inputEl.value = '';
  });

  socket.addEventListener('message', (event) => {
    chats.push(JSON.parse(event.data));

    chatsEl.innerHTML = '';

    chats.forEach(({ message, nickname }) => {
      const div = document.createElement('div');
      div.innerText = `${nickname} ${message}`;
      chatsEl.appendChild(div);
    });
  });
})();
