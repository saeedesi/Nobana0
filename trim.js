const sharp = require('sharp');
sharp('public/images/logo.png')
  .trim()
  .webp()
  .toFile('public/images/logo-trimmed.webp')
  .then(info => console.log('Successfully trimmed image:', info))
  .catch(err => console.error('Error trimming image:', err));
