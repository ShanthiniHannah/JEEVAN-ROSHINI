<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jeevan Roshini - Village Health Worker Performance Report</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #1e293b;
            margin: 0;
            padding: 0;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #0057B8;
            padding-bottom: 10px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            color: #1b2b5b;
        }
        .subtitle {
            font-size: 10px;
            color: #64748b;
            margin-top: 5px;
        }
        .metadata {
            float: right;
            text-align: right;
            font-size: 9px;
            color: #64748b;
        }
        .clear {
            clear: both;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #f8fafc;
            color: #1b2b5b;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
            border-bottom: 2px solid #e2e8f0;
            padding: 8px;
            text-align: left;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-success { background-color: #dcfce7; color: #15803d; }
        .badge-danger { background-color: #fee2e2; color: #b91c1c; }
        .badge-info { background-color: #e0f2fe; color: #0369a1; }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="metadata">
            Generated on: {{ $generated_at }}<br>
            Ayathana Trust · HR & Performance
        </div>
        <div class="title">Jeevan Roshini Community Health MIS</div>
        <div class="subtitle">VILLAGE HEALTH WORKER (VHW) PERFORMANCE REPORT</div>
        <div class="clear"></div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>VHW Name</th>
                <th>Mobile Number</th>
                <th>Email Address</th>
                <th>District</th>
                <th>Assigned Villages</th>
                <th>Visits (Current Month)</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    <td style="font-family: monospace; font-weight: bold;">{{ $row['employee_id'] }}</td>
                    <td style="font-weight: bold; color: #0f172a;">{{ $row['name'] }}</td>
                    <td>{{ $row['mobile'] }}</td>
                    <td>{{ $row['email'] }}</td>
                    <td>{{ $row['district'] ?? '—' }}</td>
                    <td>
                        @if(!empty($row['assigned_villages']))
                            @if(is_array($row['assigned_villages']))
                                {{ implode(', ', $row['assigned_villages']) }}
                            @else
                                {{ $row['assigned_villages'] }}
                            @endif
                        @else
                            <span style="color: #ef4444; font-weight: bold;">None Assigned</span>
                        @endif
                    </td>
                    <td style="font-weight: bold; text-align: center;">{{ $row['visits_this_month'] }}</td>
                    <td>
                        <span class="badge {{ strtolower($row['status']) == 'active' ? 'badge-success' : 'badge-danger' }}">
                            {{ $row['status'] }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Jeevan Roshini Community Health Management Information System · Confidential Personnel Report
    </div>
</body>
</html>
