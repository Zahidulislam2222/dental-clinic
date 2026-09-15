import settings from '../config/tooling.json' with { type: 'json' };
export function estimate(users, actionSeconds, requestsPerAction, cacheHitRatio) {
  if (![users, actionSeconds, requestsPerAction].every(x => Number.isFinite(x) && x > 0) || cacheHitRatio < 0 || cacheHitRatio > 1) throw new Error('Invalid capacity assumptions');
  const edgeRps = users * requestsPerAction / actionSeconds;
  return { users, edgeRps, originRps: edgeRps * (1 - cacheHitRatio) };
}
if (process.argv[1]?.endsWith('capacity.mjs')) {
  console.table([10000,100000,1000000].map(n=>estimate(n,settings.secondsBetweenRequests,settings.requestsPerAction,settings.cacheHitRatio)));
  console.log('Planning arithmetic only, not benchmarked capacity. A 30-day 99% time target allows', settings.windowDays*24*60*(1-settings.availabilityTarget),'minutes unavailable.');
}
