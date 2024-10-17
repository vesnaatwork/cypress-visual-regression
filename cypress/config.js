
module.exports = {
    scenarios: [
      { cookiesAccepted: false, description: 'with-cookies' },
      { cookiesAccepted: true, description: 'without-cookies' }
    ],
  
    breakpoints: [
      { name: 'S', width: 375 },
      { name: 'M', width: 768 },
      { name: 'L', width: 1024 },
      { name: 'XL', width: 1440 },
      { name: 'XXL', width: 2560 }
    ],
    pages : [
        '/',
        '/clients',
        '/grid',
        '/company',
        '/outcomes',
        '/process',
        '/leadership'
      ]
  };
  