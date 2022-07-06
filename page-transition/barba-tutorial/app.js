function delay(n) {
  const DEFAULT = 2000;
  
  n = n || DEFAULT;

  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

barba.init({
  transitions:[{
    name: 'understanding-trasnition',

    async enter(data) {
      data.next.container.style.transform = 'translateY(10px)';
      data.next.container.style.opacity = 0;
      
      if (data.next.url.path.includes('page3'))
        data.next.container.style.backgroundColor = 'skyblue';

      await delay(300);
      
      data.next.container.style.transform = 'translateY(0)';
      data.next.container.style.opacity = 1;
    },
    
    leave(data) {
      data.current.container.style.opacity = 0;
    }
  }]
});