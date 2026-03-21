import express from 'express';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { Resend } from 'resend';
import db from '../database.js';
import { sendPasswordResetConfirmation } from '../utils/emailService.js';

const router = express.Router();

// Initialize Resend
const resendApiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY || 're_X3jJKunz_Q9mhaz7QGsfksisiUzxqLUZE';
const resend = new Resend(resendApiKey);

// Request password reset
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo electrónico es requerido' 
      });
    }

    // Check if user exists
    const userResult = await db.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true, 
        message: 'Si el correo existe en nuestro sistema, recibirás un enlace de restablecimiento' 
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save token to database
    await db.query(
      `INSERT INTO password_reset_tokens (email, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [email.toLowerCase(), token, expiresAt]
    );

    // Send reset email
    const resetUrl = `https://genswave.org/reset-password?token=${token}`;
    
    await resend.emails.send({
      from: 'support@genswave.org',
      to: email,
      subject: 'Restablecimiento de Contraseña - Genswave',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Restablecimiento de Contraseña</h1>
              <p>Genswave - Soluciones Tecnológicas</p>
            </div>
            <div class="content">
              <h2>Hola ${user.name},</h2>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Genswave.</p>
              <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
              <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </div>
              <p><strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.</p>
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>© 2024 Genswave - Distrito Nacional, Dominican Republic</p>
              <p>📧 support@genswave.org | 🌐 genswave.org</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`✅ Password reset email sent to ${email}`);

    res.json({ 
      success: true, 
      message: 'Si el correo existe en nuestro sistema, recibirás un enlace de restablecimiento' 
    });

  } catch (error) {
    console.error('❌ Error requesting password reset:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Verify reset token
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const result = await db.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > NOW() AND used = FALSE`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Token válido',
      email: result.rows[0].email 
    });

  } catch (error) {
    console.error('❌ Error verifying token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token y nueva contraseña son requeridos' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verify token
    const tokenResult = await db.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > NOW() AND used = FALSE`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    const resetToken = tokenResult.rows[0];

    // Get user info for confirmation email
    const userResult = await db.query(
      'SELECT name FROM users WHERE email = $1',
      [resetToken.email]
    );

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update user password
    await db.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, resetToken.email]
    );

    // Mark token as used
    await db.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
      [token]
    );

    // Send confirmation email
    try {
      const userName = userResult.rows[0]?.name || 'Usuario';
      const userIP = req.ip || req.connection.remoteAddress || 'No disponible';
      await sendPasswordResetConfirmation(resetToken.email, userName, userIP);
      console.log(`✅ Password reset confirmation email sent to ${resetToken.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset confirmation email:', emailError);
      // Don't fail the reset if email fails
    }

    console.log(`✅ Password reset successful for ${resetToken.email}`);

    res.json({ 
      success: true, 
      message: 'Contraseña restablecida exitosamente' 
    });

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

export default router;