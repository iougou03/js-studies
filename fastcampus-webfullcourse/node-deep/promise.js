// @ts-check

/**
 * If catch function is come earlier than then funtion, the value will return
 */
new Promise((res, rej) => {
  console.log('Inside promise');

  rej('Error occur');
  res('First resolve');
})
  .catch((err) => {
    console.log(err);
  })
  .then((val) => {
    console.log(val);
  });

new Promise((res, rej) => {
  console.log('Check timing');

  setTimeout(() => {
    console.log('resolve called');
    res(true);
  }, 3000);

  // then will not be called since wating for setTimout function
})
  .then(() => console.log('1st then'))
  .then(() => console.log('2st then'))
  .then(() => console.log('3st then'));
