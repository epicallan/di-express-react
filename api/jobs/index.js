import cron from 'cron';
import unbundlingJob from './unbundlingJob';

const CronJob = cron.CronJob;

// cron job
const job = new CronJob({
  cronTime: '00 45 * * * *',
  onTick: () => {
    unbundlingJob();
  },
  start: true,
  runOnInit: true
});

export default job;
