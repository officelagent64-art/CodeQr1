const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});

app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});

app.get('/api/verify/:certId', async (req, res) => {
  const { certId } = req.params;
  try {
    const { data: cert, error: certError } = await supabase
      .from('demandes_certificats')
      .select('*')
      .eq('cert_id', certId)
      .maybeSingle();

    if (certError || !cert) return res.json({ found: false });

    const { data: student } = await supabase
      .from('student')
      .select('last_name, first_name, field, levele, specialty, year')
      .eq('student_id', cert.student_id)
      .maybeSingle();

    res.json({
      found: true,
      data: {
        ...cert,
        student: student || {}
      }
    });
  } catch (err) {
    res.json({ found: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
