<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jeevan Roshini - Training Report</title>
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
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1b2b5b;
            margin-top: 20px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
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
        
        /* Detailed layout */
        .info-grid {
            margin-top: 15px;
            margin-bottom: 15px;
        }
        .info-col {
            float: left;
            width: 50%;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #64748b;
        }
        .info-val {
            color: #1e293b;
        }
        .outcome-box {
            background-color: #f0fdf4;
            border-left: 3px solid #22c55e;
            padding: 10px;
            margin-top: 10px;
            font-style: italic;
        }
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
    @isset($data)
        <!-- ========================================== -->
        <!-- SUPER ADMIN TRAINING SUMMARY EXPORT -->
        <!-- ========================================== -->
        <div class="header">
            <div class="metadata">
                Generated on: {{ $generated_at }}<br>
                Ayathana Trust · Capacity Building
            </div>
            <div class="title">Jeevan Roshini Community Health MIS</div>
            <div class="subtitle">CAPACITY BUILDING & VHW TRAINING REGISTER</div>
            <div class="clear"></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Training Program</th>
                    <th>Category</th>
                    <th>Scheduled Date</th>
                    <th>Venue</th>
                    <th>Conducted By</th>
                    <th>Participants Count</th>
                    <th>Outcome / Impact Summary</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $row)
                    <tr>
                        <td style="font-weight: bold; color: #0f172a;">{{ $row['title'] }}</td>
                        <td>
                            <span class="badge badge-info">{{ $row['category'] }}</span>
                        </td>
                        <td>{{ $row['date'] }}</td>
                        <td>{{ $row['venue'] ?? '—' }}</td>
                        <td>{{ $row['conductor'] ?? '—' }}</td>
                        <td style="font-weight: bold; text-align: center;">{{ $row['participants'] }}</td>
                        <td>{{ $row['outcome'] ?? '—' }}</td>
                        <td>
                            <span class="badge {{ strtolower($row['status']) == 'completed' ? 'badge-success' : (strtolower($row['status']) == 'scheduled' ? 'badge-info' : 'badge-danger') }}">
                                {{ $row['status'] }}
                            </span>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <!-- ========================================== -->
        <!-- INDIVIDUAL TRAINING SESSION DETAILED REPORT -->
        <!-- ========================================== -->
        <div class="header">
            <div class="metadata">
                Generated on: {{ $generated_at }}<br>
                Conducted by: {{ $training->conductedBy?->name ?? 'Project Director' }}
            </div>
            <div class="title">Jeevan Roshini Capacity Building Program</div>
            <div class="subtitle">DETAILED SESSION WORKSHOP REPORT</div>
            <div class="clear"></div>
        </div>

        <div class="section-title">Session Overview</div>
        <div class="info-grid">
            <div class="info-col">
                <div class="info-item">
                    <span class="info-label">Workshop Title:</span>
                    <span class="info-val" style="font-weight: bold;">{{ $training->title }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Category:</span>
                    <span class="info-val">{{ $training->category }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date &amp; Time:</span>
                    <span class="info-val">{{ $training->scheduled_date }} ({{ $training->start_time ?? '—' }} to {{ $training->end_time ?? '—' }})</span>
                </div>
            </div>
            <div class="info-col">
                <div class="info-item">
                    <span class="info-label">Training Venue:</span>
                    <span class="info-val">{{ $training->venue?->name ?? $training->venue }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Target Audience size:</span>
                    <span class="info-val">{{ $training->expected_participants ?? '—' }} expected</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Overall Status:</span>
                    <span class="badge {{ strtolower($training->status) == 'completed' ? 'badge-success' : 'badge-warning' }}">{{ $training->status }}</span>
                </div>
            </div>
            <div class="clear"></div>
        </div>

        @if($training->description)
            <div class="section-title">Workshop Description</div>
            <p style="line-height: 1.5; color: #334155;">{{ $training->description }}</p>
        @endif

        @if($training->trainingReport)
            <div class="section-title">Execution Report &amp; Outcomes</div>
            <div class="info-grid">
                <div class="info-col">
                    <div class="info-item">
                        <span class="info-label">Topics Covered:</span>
                        <span class="info-val">{{ $training->trainingReport->topics_covered }}</span>
                    </div>
                </div>
                <div class="info-col">
                    <div class="info-item">
                        <span class="info-label">Attendance Metrics:</span>
                        <span class="info-val" style="font-weight: bold; color: #15803d;">{{ $attendance_pct }}% Present ({{ $training->trainingReport->participants_count }} VHWs)</span>
                    </div>
                </div>
                <div class="clear"></div>
            </div>

            <div class="info-label" style="margin-top: 10px;">Workshop Impact / Key Outcomes:</div>
            <div class="outcome-box">
                {{ $training->trainingReport->outcome }}
            </div>
            
            @if($training->trainingReport->remarks)
                <div class="info-label" style="margin-top: 10px;">Remarks:</div>
                <p style="color: #475569; font-size: 10px;">{{ $training->trainingReport->remarks }}</p>
            @endif
        @endif

        <div class="section-title">Participant Attendance Log ({{ $sessions->count() }} enrolled)</div>
        <table>
            <thead>
                <tr>
                    <th>Staff Name</th>
                    <th>Employee ID</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Attendance Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sessions as $session)
                    <tr>
                        <td style="font-weight: bold;">{{ $session->user?->name }}</td>
                        <td style="font-family: monospace;">{{ $session->user?->employee_id }}</td>
                        <td>{{ $session->user?->email }}</td>
                        <td>Village Health Worker</td>
                        <td>
                            <span class="badge {{ strtolower($session->attendance_status) == 'present' ? 'badge-success' : (strtolower($session->attendance_status) == 'late' ? 'badge-warning' : 'badge-danger') }}">
                                {{ $session->attendance_status }}
                            </span>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endisset

    <div class="footer">
        Jeevan Roshini Capacity Building & Training Management Information System
    </div>
</body>
</html>
