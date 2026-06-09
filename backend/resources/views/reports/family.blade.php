<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jeevan Roshini - Family Health Registry Report</title>
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
        .badge-warning { background-color: #fef3c7; color: #b45309; }
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
            Ayathana Trust · Health Registry
        </div>
        <div class="title">Jeevan Roshini Community Health MIS</div>
        <div class="subtitle">FAMILY HEALTH REGISTRY REPORT</div>
        <div class="clear"></div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Family Code</th>
                <th>House No.</th>
                <th>Village</th>
                <th>District</th>
                <th>Members Count</th>
                <th>Economic Status</th>
                <th>Toilet Facility</th>
                <th>Drinking Water Source</th>
                <th>Electricity</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    <td style="font-family: monospace; font-weight: bold; color: #0057B8;">{{ $row['family_code'] }}</td>
                    <td>{{ $row['house_no'] }}</td>
                    <td>{{ $row['village'] ?? '—' }}</td>
                    <td>{{ $row['district'] ?? '—' }}</td>
                    <td style="font-weight: bold;">{{ $row['members'] }}</td>
                    <td>
                        <span class="badge {{ strtolower($row['economic_status']) == 'bpl' ? 'badge-danger' : 'badge-info' }}">
                            {{ $row['economic_status'] ?? 'APL' }}
                        </span>
                    </td>
                    <td>{{ $row['toilet'] ?? 'None' }}</td>
                    <td>{{ $row['water'] ?? '—' }}</td>
                    <td>
                        <span class="badge {{ strtolower($row['electricity']) == 'yes' ? 'badge-success' : 'badge-danger' }}">
                            {{ $row['electricity'] }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Jeevan Roshini Community Health Management Information System · Confidential Family Registry Report
    </div>
</body>
</html>
