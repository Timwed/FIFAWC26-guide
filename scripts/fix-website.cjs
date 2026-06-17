const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: process.env.OSS_KEY_ID,
  accessKeySecret: process.env.OSS_KEY_SECRET,
  bucket: 'fifawc26-guide',
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<WebsiteConfiguration>
  <IndexDocument>
    <Suffix>index.html</Suffix>
    <SupportSubDir>true</SupportSubDir>
    <Type>0</Type>
  </IndexDocument>
  <ErrorDocument>
    <Key>index.html</Key>
  </ErrorDocument>
</WebsiteConfiguration>`;

(async () => {
  await client.request({
    method: 'PUT',
    resourcePath: '/?website',
    data: xml,
    headers: { 'Content-Type': 'application/xml' },
  });
  console.log('Website config updated');
  const r = await client.getBucketWebsite('fifawc26-guide');
  console.log('Config:', JSON.stringify(r, null, 2));
})();
