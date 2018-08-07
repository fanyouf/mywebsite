const exec = require('child_process').exec;

const options = {
  encoding: 'utf8',
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM',
  setsid: false,
  cwd: './fanyoufu.github.io',
  env: null,
};
  // 成功的例子
exec('ls -al', options, function (error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error}`);

    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${typeof stderr}`);
});
exec('git status', options, function (error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error}`);

    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${typeof stderr}`);
});
exec('git add .', options, function (error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error}`);

    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${typeof stderr}`);

  exec('git commit -a -m \'new\'', options, function (error, stdout, stderr) {
    if (error) {
      console.error(`error: ${error}`);

      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${typeof stderr}`);

    exec('git push', options, function (error, stdout, stderr) {
      if (error) {
        console.error(`error: ${error}`);

        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${typeof stderr}`);
    });
  });
});


