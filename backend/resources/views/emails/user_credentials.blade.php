<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Jeevan Roshini</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: #0B6E6E; padding: 20px; text-align: center; color: white; font-size: 24px; font-weight: bold; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .details { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .details p { margin: 5px 0; }
        .btn { display: inline-block; background: #0B6E6E; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; background: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Jeevan Roshini
        </div>
        <div class="content">
            <p>Dear {{ $user->name }},</p>
            <p>Welcome to the Jeevan Roshini platform! Your account has been successfully created.</p>
            <p>Below are your login credentials and assignment details:</p>
            
            <div class="details">
                <p><strong>Employee ID:</strong> {{ $user->employee_id }}</p>
                <p><strong>Username (Email):</strong> {{ $user->email }}</p>
                <p><strong>Temporary Password:</strong> <span style="color: #e11d48; font-family: monospace; font-size: 16px; font-weight: bold;">{{ $tempPassword }}</span></p>
                <p><strong>Assigned Area:</strong> {{ $assignedAreaText }}</p>
            </div>

            <p style="color: #e11d48; font-weight: bold; font-size: 14px;">
                ⚠️ For security reasons, you will be required to change this temporary password upon your first login.
            </p>

            <div style="text-align: center;">
                <a href="{{ $loginUrl }}" class="btn">Login to Portal</a>
            </div>
            
            <p style="margin-top: 30px;">If you have any questions, please contact your system administrator.</p>
            <p>Best Regards,<br>The Jeevan Roshini Team</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Jeevan Roshini. All rights reserved.
        </div>
    </div>
</body>
</html>
