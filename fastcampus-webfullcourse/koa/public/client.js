// @ts-check

(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);

  const formEl = document.getElementById('form');
  const inputEl = document.getElementById('input');

  if (!formEl) {
    throw new Error('Init failed!');
  }

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        // @ts-ignore
        message: inputEl.value,
        nickname: '해솔',
      })
    );
    // @ts-ignore
    inputEl.value = '';
  });

  socket.addEventListener('open', () => {
    socket.send('Hello, WebSocket');
  });

  socket.addEventListener('message', (event) => {
    console.log(event.data);
  });
})();
