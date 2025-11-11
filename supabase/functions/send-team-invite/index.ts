Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { email, name, role, department, inviterName } = await req.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Email and name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // In a real implementation, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // For now, we'll log the email details
    
    const emailContent = {
      to: email,
      subject: `You've been invited to join the team!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Team Invitation</h2>
          <p>Hi ${name},</p>
          <p>${inviterName || 'Your team'} has invited you to join as a <strong>${role || 'team member'}</strong> in the <strong>${department || 'team'}</strong> department.</p>
          <p>Click the button below to accept your invitation:</p>
          <a href="${req.headers.get('origin') || 'https://your-app.com'}/accept-invite" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Accept Invitation
          </a>
          <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      `,
      text: `Hi ${name}, ${inviterName || 'Your team'} has invited you to join as a ${role || 'team member'} in the ${department || 'team'} department.`
    };

    console.log('Email invite would be sent:', emailContent);

    // TODO: Integrate with your email service provider
    // Example with Resend:
    // const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${RESEND_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     from: 'team@yourcompany.com',
    //     to: email,
    //     subject: emailContent.subject,
    //     html: emailContent.html
    //   })
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email sent successfully',
        emailPreview: emailContent 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error sending invite:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
