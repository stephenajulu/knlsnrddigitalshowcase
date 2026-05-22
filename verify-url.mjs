import https from 'https';
https.get('https://knls.ac.ke/wp-content/uploads/2021/04/KNLS-logo.png', res => {
  console.log('STATUS ' + res.statusCode);
}).on('error', e => console.log('ERROR ' + e.message));
