const https = require('https');
const apiKey = 'AIzaSyCMqGxW0WVA6WzeN3ea_Rkj2rauOh_7p54';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        const models = json.models
          .filter(m => m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name);
        console.log("AVAILABLE MODELS:");
        models.forEach(m => console.log(m));
      } else {
        console.log("ERROR:", JSON.stringify(json));
      }
    } catch (e) {
      console.error("PARSE ERROR:", e.message);
      console.log("RAW:", data);
    }
  });
}).on('error', (e) => {
  console.error("REQ ERROR:", e.message);
});
