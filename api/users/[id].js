import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// Middleware to verify admin status
async function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.admin !== 1) {
      res.status(403).json({ error: 'Admin access required' });
      return null;
    }
    return decoded;
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

export default async function handler(req, res) {
  const adminUser = await verifyAdmin(req, res);
  if (!adminUser) return;

  const id = req.query.id; // Extract ID from URL path (e.g., /api/users/123 -> req.query.id)
  
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'PUT') {
    const { first_name, last_name, email, admin, password, approval_status } = req.body;
    
    try {
      // Fetch current to check if status is changing
      const currentUserResult = await query('SELECT approval_status, first_name, email FROM user_profiles WHERE id = $1', [id]);
      if (currentUserResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const currentUser = currentUserResult.rows[0];
      const newStatus = approval_status || currentUser.approval_status;

      let result;
      
      if (password) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
         result = await query(
          'UPDATE user_profiles SET first_name = $1, last_name = $2, email = $3, admin = $4, password_hash = $5, approval_status = $6 WHERE id = $7 RETURNING id, first_name, last_name, email, admin, approval_status',
          [first_name, last_name, email, admin, passwordHash, newStatus, id]
        );
      } else {
        result = await query(
          'UPDATE user_profiles SET first_name = $1, last_name = $2, email = $3, admin = $4, approval_status = $5 WHERE id = $6 RETURNING id, first_name, last_name, email, admin, approval_status',
          [first_name, last_name, email, admin, newStatus, id]
        );
      }

      // Check if status changed and trigger email
      if (approval_status && currentUser.approval_status !== approval_status) {
         const BREVO_API_KEY = process.env.BREVO_API_KEY;
         const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@codeviolation.com';
         
         if (BREVO_API_KEY) {
           const protocol = req.headers['x-forwarded-proto'] || 'http';
           const host = req.headers.host;
           let subject = '';
           let htmlContent = '';
           
           if (approval_status === 'approved') {
              subject = 'Welcome to requestkits.com – Account Approved';
              htmlContent = `<p>Hi there,</p><p>Your registration for requestkits.com is approved. You can now log in to your account and access our platform.</p><p><a href="https://www.requestkits.com/">https://www.requestkits.com/</a></p>`;
           } else if (approval_status === 'declined') {
              subject = 'Update regarding your requestkits.com account';
              htmlContent = `<p>Hi there,</p><p>Your registration for requestkits.com has been declined. To gain access, you must first enroll in Gov List Millionaire at Wholesailors Academy on Skool.</p><p>Once you have enrolled, please let us know so we can update your status.</p>`;
           }

           if (subject) {
             const emailBody = {
               sender: { name: 'Code Violation Forms Directory', email: SENDER_EMAIL },
               to: [{ email: email, name: first_name || 'User' }],
               subject: subject,
               htmlContent: htmlContent
             };

             try {
               // IMPORTANT: Await fetch so serverless function doesn't terminate early
               const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
                 method: 'POST',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'api-key': BREVO_API_KEY
                 },
                 body: JSON.stringify(emailBody)
               });

               if (!brevoRes.ok) {
                 const errorData = await brevoRes.json();
                 console.error('Brevo API Error Detail:', JSON.stringify(errorData, null, 2));
                 console.error('Brevo Sender Used:', SENDER_EMAIL);
               }
             } catch (err) {
               console.error('Brevo fetch failure:', err);
             }
           }
         }
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
       console.error('Error updating user:', error);
       if (error.code === '23505') { 
         return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Prevent deleting yourself to avoid lockouts
      if (id === adminUser.userId) {
         return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const result = await query('DELETE FROM user_profiles WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
