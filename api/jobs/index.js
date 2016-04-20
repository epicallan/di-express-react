import cron from 'cron';
import unbundlingJob from './unbundlingJob';
import spotlightJob from './spotlightJob';

const CronJob = cron.CronJob;

// cron job
const job = new CronJob({
  cronTime: '00 45 * * * *',
  onTick: () => {
    unbundlingJob();
    spotlightJob();
  },
  start: true,
  runOnInit: true
});

export default job;
