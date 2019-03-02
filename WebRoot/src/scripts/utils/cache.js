import cache from 'store';
import ExpirePlugin from 'store/plugins/expire';
cache.addPlugin(ExpirePlugin);

export default cache
