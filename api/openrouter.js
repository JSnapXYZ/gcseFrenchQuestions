console.log('OPENROUTER_API_KEY is set:', Boolean(process.env.OPENROUTER_API_KEY));


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }
  
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ error: errorText });
        return;
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Unknown error' });
    }
  }
  