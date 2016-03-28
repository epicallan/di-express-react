require('babel-polyfill');
const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Data Hub',
    description: 'Datahub development Initiatives',
    head: {
      titleTemplate: 'Data hub: %s',
      link: [
         {'rel': 'stylesheet', 'href': 'https://fonts.googleapis.com/css?family=Fira+Sans'}
      ],
      meta: [
        {name: 'description', content: 'Development Data Hub'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'data hub'},
        {property: 'og:image', content: 'https://localhost:3000/og-image.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Development Data Hub'},
        {property: 'og:description', content: 'Development Data Hub'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
