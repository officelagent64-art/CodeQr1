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
    // 1. Cherche le certificat
    const { data: cert, error: certError } = await supabase
      .from('demandes_certificats')
      .select('*')
      .eq('cert_id', certId)
      .maybeSingle();

    if (certError || !cert) return res.json({ found: false });

    // 2. Cherche l'étudiant avec student_id
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('nom, prenom, filiere, niveau')
      .eq('id', cert.student_id)
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
