/**
 * Email notification utilities for FastMVP
 * Uses Resend/SendGrid for email delivery
 */

// Uncomment when ready to integrate:
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email notification when a project is ready
 * @param userEmail - The recipient's email address
 * @param projectName - The name of the created project
 * @param repoUrl - The GitHub repository URL
 */
export async function sendProjectReadyEmail(
  userEmail: string,
  projectName: string,
  repoUrl: string
): Promise<void> {
  // Mock implementation - replace with actual email service
  console.log('📧 Sending project ready email:', {
    to: userEmail,
    project: projectName,
    repository: repoUrl,
  });

  // TODO: Uncomment when email service is configured
  /*
  try {
    await resend.emails.send({
      from: 'FastMVP <noreply@fastmvp.com>',
      to: userEmail,
      subject: `Your project ${projectName} is ready! 🚀`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Your Project is Ready! 🎉</h1>
          <p>Hi there!</p>
          <p>Great news! Your project <strong>${projectName}</strong> has been successfully created and is ready to use.</p>
          <p>You can access your repository here:</p>
          <a href="${repoUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">
            View Repository
          </a>
          <p>Happy coding!</p>
          <p>- The FastMVP Team</p>
        </div>
      `,
    });
    console.log('✅ Email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
  */

  // Alternative: SendGrid integration
  /*
  import sgMail from '@sendgrid/mail';
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  
  const msg = {
    to: userEmail,
    from: 'noreply@fastmvp.com',
    subject: `Your project ${projectName} is ready! 🚀`,
    html: `...`,
  };
  
  await sgMail.send(msg);
  */
}
