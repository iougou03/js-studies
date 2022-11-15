function sleep() {
  return new Promise((res) => {
    setTimeout(() => {
      res('complete');
    }, 1000);
  });
}

async function sleep2() {
  const res = await fetch('www.naver.com');

  return res;
}

sleep2().then((v) => console.log(v));

async function call() {
  console.log(await sleep());
  console.log(await sleep());
  console.log(await sleep());
}

call();
