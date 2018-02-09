function helloWorldAsync () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Async hello world');
    }, 100);
  });
}

helloWorldAsync().then(function (val) {
  console.log(val);
});
