import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
  return _resend;
}
const FROM = process.env.FROM_EMAIL || 'Peace Time Agency <noreply@peacetimeagency.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function send(to: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MOCK EMAIL] → ${to} | Subject: ${subject}`);
    return true;
  }
  try {
    const { error } = await getResend().emails.send({ from: FROM, to, subject, html });
    if (error) { console.error('Resend error:', error); return false; }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#01020A;font-family:'Helvetica Neue',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0F1623;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="height:4px;background:linear-gradient(90deg,#FF1A43,#fd79a8)"></td></tr>
<tr><td style="padding:40px;">
<h1 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">${title}</h1>
<div style="height:2px;width:40px;background:#FF1A43;margin-bottom:24px"></div>
${body}
<p style="color:rgba(255,255,255,0.2);font-size:11px;margin-top:32px;text-transform:uppercase;letter-spacing:1px">Peace Time Agency · Creator Portal</p>
</td></tr></table></td></tr></table></body></html>`;
}

function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#FF1A43;color:#fff;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:2px;padding:14px 28px;border-radius:10px;text-decoration:none;margin:20px 0">${label}</a>`;
}

function infoText(text: string) {
  return `<p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0">${text}</p>`;
}

// ── Public functions ────────────────────────────────────────────────

export async function sendEmailVerification(to: string, token: string) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  return send(to, 'Verify Your Email — Peace Time Agency', baseTemplate(
    'Verify Your Email',
    `${infoText('Click below to verify your email address. This link expires in <strong style="color:#FF1A43">24 hours</strong>.')}
     ${btn(link, 'Verify Email')}
     ${infoText("Didn't sign up? You can safely ignore this email.")}`
  ));
}

export async function sendPasswordReset(to: string, token: string) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  return send(to, 'Password Reset — Peace Time Agency', baseTemplate(
    'Reset Your Password',
    `${infoText('Click below to reset your password. This link expires in <strong style="color:#FF1A43">30 minutes</strong> and can only be used once.')}
     ${btn(link, 'Reset Password')}
     ${infoText("If you didn't request this, your account may be at risk. Contact support immediately.")}`
  ));
}

export async function send2FACode(to: string, code: string) {
  return send(to, `Login Code: ${code} — Peace Time Agency`, baseTemplate(
    'Two-Factor Code',
    `${infoText('Use the code below to complete your login. It expires in <strong style="color:#FF1A43">10 minutes</strong>.')}
     <div style="font-size:48px;font-weight:900;letter-spacing:16px;text-align:center;color:#FF1A43;padding:24px;background:rgba(255,26,67,0.08);border-radius:12px;margin:20px 0">${code}</div>
     ${infoText("If you didn't attempt to log in, contact support immediately.")}`
  ));
}

export async function sendManagerAssignmentRequest(
  managerEmail: string,
  managerName: string,
  creatorHandle: string,
  creatorName: string
) {
  const link = `${APP_URL}/portal/admin/assignments`;
  return send(managerEmail, 'Creator Assignment Request — Peace Time Agency', baseTemplate(
    'New Assignment Request',
    `${infoText(`Hi <strong style="color:#fff">${managerName}</strong>,`)}
     <br>
     ${infoText(`<strong style="color:#fff">${creatorName}</strong> (${creatorHandle}) has requested you as their manager.`)}
     ${btn(link, 'Review Request')}
     ${infoText('Once you accept, they will be granted access to the creator portal.')}`
  ));
}

export async function sendManagerDeniedNotice(creatorEmail: string, creatorName: string) {
  return send(creatorEmail, 'Manager Assignment Update — Peace Time Agency', baseTemplate(
    'Assignment Update',
    `${infoText(`Hi <strong style="color:#fff">${creatorName}</strong>,`)}
     <br>
     ${infoText('Your requested manager was unable to accept your assignment at this time. Your profile has been added to the <strong style="color:#FF1A43">Available Creators</strong> pool and an agency admin has been notified. A manager will reach out to you shortly.')}
     ${infoText('In the meantime, you can use the onboarding message panel to communicate with the team.')}`
  ));
}

export async function sendCreatorPoolAlert(to: string, managerName: string, creatorHandle: string) {
  const link = `${APP_URL}/portal/admin/available-creators`;
  return send(to, 'Creator Available for Assignment — Peace Time Agency', baseTemplate(
    'Creator Needs a Manager',
    `${infoText(`Hi <strong style="color:#fff">${managerName}</strong>,`)}
     <br>
     ${infoText(`<strong style="color:#fff">${creatorHandle}</strong> is in the Available Creators pool and needs a manager.`)}
     ${btn(link, 'View Available Creators')}`
  ));
}

export async function sendAdminAlert(subject: string, body: string) {
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',').map(e => e.trim()).filter(Boolean);
  if (!adminEmails.length) {
    console.log(`[MOCK ADMIN ALERT] ${subject}: ${body}`);
    return true;
  }
  const results = await Promise.all(
    adminEmails.map(to => send(to, `[Admin] ${subject} — Peace Time Agency`,
      baseTemplate(subject, infoText(body))))
  );
  return results.every(Boolean);
}
