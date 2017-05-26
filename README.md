# Spendesk Test - VAT extraction

# Dependencies
- Create react app
- Express
- Morgan (logger / pinto is faster)
- React
- Nodemon (in production the use of PM2 is much better)
- bluebird for promise
- extract pdf -> Installation : https://github.com/nisaacson/pdf-extract
- eyes
- body-parser

**Node version: v6.7.0**

# Installation

To start the project run the following commands

```js
$ npm install -g create-react-app
$ npm install -g nodemon
$ npm install
$ npm run server (port 3001) // api
$ npm start (port 3000) // react application
```

Improvment
==========

- Test endpoint and well known errors to test statuses.
- Test front-end to validate that the user can select and upload the file
- Unit test the service that is used to process the files
- Use redux to handle state of the upload (loading/error/success)
