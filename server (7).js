const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Verification endpoint
app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

// API endpoint to check certificate
app.get('/api/verify/:certId', async (req, res) => {
  const { certId } = req.params;

  try {
    const { data, error } = await supabase
      .from('demandes_certificats')
      .select('*')
      .eq('cert_id', certId)
      .single();

    if (error || !data) {
      return res.json({ found: false });
    }

    res.json({ found: true, data });
  } catch (err) {
    res.json({ found: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
