# API Docs

- A cron job is run every 4hrs to get new data from a data store for the various api actions/api requests (see the api/jobs folder)
- The data is stored in redis
- Every time a request is made, we hit redis for any of the cached data
