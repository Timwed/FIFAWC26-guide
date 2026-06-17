const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: process.env.OSS_KEY_ID,
  accessKeySecret: process.env.OSS_KEY_SECRET,
  bucket: 'fifawc26-guide',
});

(async () => {
  // Try copyObject to update metadata for all HTML/CSS/JS files
  const files = ['index.html'];
  for (const key of files) {
    try {
      const result = await client.copy(key, key, {
        headers: {
          'Content-Disposition': 'inline',
          'Cache-Control': 'no-cache',
        },
        meta: {
          'force-download': 'false',
        },
      });
      console.log(`${key}: copied OK, status=${result.res.status}`);
    } catch (e) {
      console.log(`${key}: error - ${e.code} ${e.message}`);
    }
  }
  console.log('Done');
})();
