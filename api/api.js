import express from 'express';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import cronJob from './jobs';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';

const pretty = new PrettyError();
const app = express();

app.use(bodyParser.json());

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);
  // console.log(req.url);
  const {action, params} = mapUrl(actions, splittedUrlPath);
  // if (params) console.log(`sever: params: ${params}`);
  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          // console.log(result);
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    // start cron job for saving data in REDIS
    cronJob.start();
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
