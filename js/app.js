(function () {
  'use strict';

  const STATUSES = ['Fresh Lead','Webinar Sale','Sales by Team','Not Interested','Follow Up','Call Not Pickup','Interested for Future','Call Back','Invalid Number','Want L2 Course','Session Not Joined'];
  const STATUS_CLASS = {'Fresh Lead':'blue','Webinar Sale':'teal','Sales by Team':'green','Not Interested':'red','Follow Up':'purple','Call Not Pickup':'amber','Interested for Future':'amber','Call Back':'blue','Invalid Number':'gray','Want L2 Course':'red','Session Not Joined':'gray'};
  const adminNav = [
    ['admin.html','Admin dashboard','▦','admin-dashboard'],['pages/all-leads.html','All leads','◫','all-leads'],['pages/upload-leads.html','Upload leads','⇧','upload-leads'],['pages/lead-distribution.html','Lead distribution','⇄','lead-distribution'],['pages/caller-management.html','Caller management','♙','caller-management'],['pages/reports.html','Reports','▤','reports'],['pages/activity-logs.html','Activity logs','◷','activity-logs']
  ];
  const callerNav = [['caller.html','My dashboard','▦','caller-dashboard'],['pages/my-leads.html','My leads','◫','my-leads'],['pages/my-follow-ups.html','My follow-ups','◷','my-follow-ups'],['pages/my-performance.html','My performance','▤','my-performance']];
  const callers = [{id:'CALL-001',name:'Aarav Mehta',email:'aarav@example.test',active:true,initials:'AM'},{id:'CALL-002',name:'Diya Shah',email:'diya@example.test',active:true,initials:'DS'},{id:'CALL-003',name:'Kabir Rao',email:'kabir@example.test',active:false,initials:'KR'}];
  const uploadHistory = [
    {id:'UP-003',file:'webinar-oct-18.csv',rows:3,uploadedAt:'2026-10-18T08:30:00.000Z',uploadedBy:'SMM Admin'},
    {id:'UP-002',file:'webinar-oct-11.csv',rows:3,uploadedAt:'2026-10-11T08:26:00.000Z',uploadedBy:'SMM Admin'},
    {id:'UP-001',file:'webinar-oct-04.csv',rows:2,uploadedAt:'2026-10-04T08:15:00.000Z',uploadedBy:'SMM Admin'}
  ];
  let leads = [
    {id:'D-1001',name:'Sample Lead 01',phone:'0000000000',webinarDate:'2026-10-18',uploadDate:'2026-10-18T08:30:00.000Z',status:'Fresh Lead',followUp:'2026-10-22',revenue:0,notes:'Asked for course details',nextAction:'Share course outline',caller:'Aarav Mehta'},
    {id:'D-1002',name:'Sample Lead 02',phone:'0000000000',webinarDate:'2026-10-18',uploadDate:'2026-10-18T08:30:00.000Z',status:'Webinar Sale',followUp:'',revenue:4999,notes:'Payment received',nextAction:'Welcome call',caller:'Diya Shah'},
    {id:'D-1003',name:'Sample Lead 03',phone:'0000000000',webinarDate:'2026-10-18',uploadDate:'2026-10-18T08:30:00.000Z',status:'Follow Up',followUp:'2026-10-21',revenue:0,notes:'Call after 7 PM',nextAction:'Call after 7 PM',caller:'Aarav Mehta'},
    {id:'D-1004',name:'Sample Lead 04',phone:'0000000000',webinarDate:'2026-10-11',uploadDate:'2026-10-11T08:26:00.000Z',status:'Call Not Pickup',followUp:'2026-10-21',revenue:0,notes:'First attempt missed',nextAction:'Retry in evening',caller:'Diya Shah'},
    {id:'D-1005',name:'Sample Lead 05',phone:'0000000000',webinarDate:'2026-10-11',uploadDate:'2026-10-11T08:26:00.000Z',status:'Interested for Future',followUp:'2026-10-25',revenue:0,notes:'Interested in next webinar',nextAction:'Invite to next webinar',caller:'Aarav Mehta'},
    {id:'D-1006',name:'Sample Lead 06',phone:'0000000000',webinarDate:'2026-10-11',uploadDate:'2026-10-11T08:26:00.000Z',status:'Sales by Team',followUp:'',revenue:7999,notes:'Closed by team',nextAction:'',caller:'Diya Shah'},
    {id:'D-1007',name:'Sample Lead 07',phone:'0000000000',webinarDate:'2026-10-04',uploadDate:'2026-10-04T08:15:00.000Z',status:'Not Interested',followUp:'',revenue:0,notes:'Price is high',nextAction:'',caller:''},
    {id:'D-1008',name:'Sample Lead 08',phone:'0000000000',webinarDate:'2026-10-04',uploadDate:'2026-10-04T08:15:00.000Z',status:'Want L2 Course',followUp:'2026-10-23',revenue:0,notes:'Asked about L2 course',nextAction:'Send L2 syllabus',caller:''}
  ];
  const activities = [
    ['Today, 10:42 AM','Aarav Mehta','Updated status','Sample Lead 03 → Follow Up'],['Today, 10:18 AM','Admin','Assigned leads','12 leads → Aarav Mehta'],['Yesterday, 4:32 PM','Diya Shah','Added remark','Sample Lead 02: Payment received'],['Yesterday, 2:07 PM','Admin','Imported leads','24 rows from webinar-oct.csv']
  ];
  const page = document.body.dataset.page || 'admin-dashboard';
  const role = page.indexOf('my-') === 0 || page === 'caller-dashboard' ? 'caller' : 'admin';
  const basePath = window.location.pathname.indexOf('/pages/') >= 0 ? '../' : '';
  const titleMap = {'admin-dashboard':'Admin dashboard','caller-dashboard':'Caller dashboard','all-leads':'All leads','upload-leads':'Upload leads','lead-distribution':'Lead distribution','caller-management':'Caller management','reports':'Reports','activity-logs':'Activity logs','my-leads':'My leads','my-follow-ups':'My follow-ups','my-performance':'My performance'};
  const titles = titleMap[page] || 'Dashboard';
  const esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  const money = function (n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); };
  const uploadDay = function (lead) { return lead.uploadDate ? String(lead.uploadDate).slice(0,10) : ''; };
  const formatUploadDate = function (stamp) { return stamp ? new Date(stamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) : '—'; };
  const badge = function (s) { return '<span class="badge ' + (STATUS_CLASS[s] || 'gray') + '">' + esc(s) + '</span>'; };
  const safePhone = function (phone) { const digits = String(phone || '').replace(/\D/g,''); return digits.length >= 10 && !/^0+$/.test(digits) ? digits : ''; };
  const callerLeads = function () { return leads.filter(function (lead) { return lead.caller === 'Aarav Mehta'; }); };
  const demoNotice = '<div class="notice"><strong>Preview data only</strong>Sample records and changes live in this page session. Supabase Auth, RLS, and database writes are not connected.</div>';

  function shell() {
    const nav = role === 'admin' ? adminNav : callerNav;
    const initials = role === 'admin' ? 'AD' : 'AM';
    const who = role === 'admin' ? 'SMM Admin' : 'Aarav Mehta';
    const links = nav.map(function (item) { return '<a class="nav-link ' + (item[3] === page ? 'active' : '') + '" href="' + basePath + item[0] + '"><span class="nav-icon">' + item[2] + '</span><span>' + item[1] + '</span></a>'; }).join('');
    document.getElementById('app').innerHTML = '<div class="app-shell"><aside class="sidebar"><a class="brand" href="' + basePath + (role === 'admin' ? 'admin.html' : 'caller.html') + '"><span class="brand-mark">S</span><span><b>Scale My Marketing</b><small>Lead Management CRM</small></span></a><div class="nav-section">Workspace</div><nav class="nav-links" aria-label="Main navigation">' + links + '</nav><div class="sidebar-foot"><div class="side-user"><span class="avatar">' + initials + '</span><span>' + who + '<small>' + (role === 'admin' ? 'Administrator' : 'Caller') + ' · preview</small></span></div>Sample data workspace</div></aside><section class="main-area"><header class="topbar"><div class="mobile-brand"><span class="brand-mark">S</span> SMM Lead CRM</div><div class="crumb">Workspace <span aria-hidden="true">/</span> <strong>' + titles + '</strong></div><div class="top-actions"><span class="demo-chip"><i></i>Preview mode</span><a class="logout" href="' + basePath + 'index.html">Exit preview</a></div></header><main class="page-wrap" id="page-content"></main></section></div>';
    renderPage();
  }
  function pageHead(eyebrow, title, description, actions) {
    return '<div class="page-head"><div><div class="eyebrow">' + eyebrow + '</div><h1>' + title + '</h1><p>' + description + '</p></div>' + (actions ? '<div class="page-actions">' + actions + '</div>' : '') + '</div>';
  }
  function metric(label, value, icon, meta, tone) {
    return '<div class="metric-card"><div class="metric-top"><span>' + label + '</span><span class="metric-icon">' + icon + '</span></div><div class="metric-value">' + value + '</div><div class="metric-meta ' + (tone || '') + '">' + meta + '</div></div>';
  }
  function sectionPanel(title, subtitle, inner, right) {
    return '<section class="panel"><div class="panel-head"><div><h2>' + title + '</h2><p>' + subtitle + '</p></div>' + (right || '') + '</div>' + inner + '</section>';
  }
  function statusSelect(lead) {
    return '<select class="table-status" data-edit="status" data-id="' + esc(lead.id) + '" aria-label="Status for ' + esc(lead.name) + '">' + STATUSES.map(function (s) { return '<option ' + (s === lead.status ? 'selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select>';
  }
  function leadTable(rows, options) {
    options = options || {};
    if (!rows.length) return '<div class="empty-state"><div class="empty-icon">⌕</div>No leads match these filters.</div>';
    const callerMode = !!options.callerMode;
    const adminMode = !!options.adminMode;
    const columns = '<th>Lead</th><th>Mobile</th><th>Webinar date</th><th>Uploaded</th><th>Status</th><th>Follow-up</th><th>Revenue</th><th>Remarks / next action</th>' + (adminMode ? '<th>Assigned to</th>' : '') + (callerMode ? '<th>Contact</th>' : adminMode ? '<th>Actions</th>' : '');
    const body = rows.map(function (lead) {
      const phone = safePhone(lead.phone);
      const contact = phone ? '<a class="call-link" href="tel:' + phone + '">Call</a> <a class="call-link" target="_blank" rel="noopener" href="https://wa.me/' + phone + '">WhatsApp</a>' : '<span class="muted">—</span>';
      let extra = adminMode ? '<td>' + esc(lead.caller || 'Unassigned') + '</td><td><div class="button-row"><button class="btn btn-secondary btn-sm" data-action="edit-lead" data-id="' + esc(lead.id) + '">View</button><button class="btn btn-danger btn-sm" data-action="delete-lead" data-id="' + esc(lead.id) + '">Delete</button></div></td>' : callerMode ? '<td><div class="call-actions">' + contact + '</div><button class="btn btn-secondary btn-sm" data-action="next-cycle" data-id="' + esc(lead.id) + '">Next webinar</button></td>' : '';
      const statusCell = callerMode ? statusSelect(lead) : badge(lead.status);
      const follow = callerMode ? '<input class="table-note" type="date" data-edit="followUp" data-id="' + esc(lead.id) + '" value="' + esc(lead.followUp) + '" aria-label="Follow-up date">' : esc(lead.followUp || '—');
      const notes = callerMode ? '<input class="table-note" data-edit="notes" data-id="' + esc(lead.id) + '" value="' + esc(lead.notes || '') + '" placeholder="Add remark" aria-label="Remarks"><input class="table-note" data-edit="nextAction" data-id="' + esc(lead.id) + '" value="' + esc(lead.nextAction || '') + '" placeholder="Next action" aria-label="Next action">' : esc(lead.notes || '—');
      return '<tr><td><span class="lead-name">' + esc(lead.name) + '</span><br><span class="muted">' + esc(lead.id) + '</span></td><td>' + esc(lead.phone) + '</td><td>' + esc(lead.webinarDate) + '</td><td title="' + esc(lead.uploadDate || '') + '">' + esc(formatUploadDate(lead.uploadDate)) + '</td><td>' + statusCell + '</td><td>' + follow + '</td><td>' + money(lead.revenue) + '</td><td>' + notes + '</td>' + extra + '</tr>';
    }).join('');
    return '<div class="table-panel"><div class="table-scroll"><table class="data-table"><thead><tr>' + columns + '</tr></thead><tbody>' + body + '</tbody></table></div><div class="pagination"><span>Showing 1–' + rows.length + ' of ' + rows.length + ' sample leads</span><div class="pager-buttons"><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></div></div>';
  }
  function statusBars(rows) {
    const counts = STATUSES.map(function (s) { return [s, rows.filter(function (l) { return l.status === s; }).length]; }).filter(function (pair) { return pair[1] > 0; });
    return '<div class="status-list">' + counts.map(function (pair) { return '<div class="status-row"><span class="status-name">' + esc(pair[0]) + '</span><div class="progress-track"><div class="progress-fill" style="width:' + Math.round(pair[1] / Math.max(rows.length,1) * 100) + '%"></div></div><span class="status-count">' + pair[1] + '</span></div>'; }).join('') + '</div>';
  }
  function dashboard(admin) {
    const data = admin ? leads : callerLeads();
    const sales = data.filter(function (l) { return l.status === 'Webinar Sale' || l.status === 'Sales by Team'; });
    const due = data.filter(function (l) { return l.followUp === '2026-10-21'; });
    const header = pageHead(admin ? 'OVERVIEW' : 'CALLER WORKSPACE', admin ? 'Admin dashboard' : 'Good morning, Aarav', admin ? 'A clear view of lead volume, outcomes, team activity and follow-ups.' : 'Your assigned leads, follow-ups and outcomes at a glance.', '<a class="btn btn-primary" href="' + (admin ? 'pages/upload-leads.html' : 'pages/my-leads.html') + '">' + (admin ? '+ Upload leads' : 'Open my leads') + '</a>');
    const cards = '<div class="cards">' + metric(admin ? 'Total leads' : 'Assigned leads', data.length, '◫', 'Across webinar cycles','') + metric('Follow-ups due today', due.length, '◷', 'Sample date: 21 Oct 2026','') + metric('Sales', sales.length, '✓', 'Webinar and team sales','good') + metric('Revenue', money(data.reduce(function (a,l) { return a + Number(l.revenue || 0); },0)), '₹', 'Sample data only','') + '</div>';
    const recent = data.slice(0,5);
    const table = '<div class="table-scroll"><table class="data-table"><thead><tr><th>Lead</th><th>Webinar</th><th>Status</th><th>Follow-up</th></tr></thead><tbody>' + recent.map(function (l) { return '<tr><td><span class="lead-name">' + esc(l.name) + '</span></td><td>' + esc(l.webinarDate) + '</td><td>' + badge(l.status) + '</td><td>' + esc(l.followUp || '—') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    const left = sectionPanel('Recent leads','Latest sample records',table,'<a class="text-link" href="' + (admin ? 'pages/all-leads.html' : 'pages/my-leads.html') + '">View all →</a>');
    const right = sectionPanel('Status overview','Lead count by current status',statusBars(data),'');
    return header + demoNotice + cards + '<div class="content-grid">' + left + right + '</div>';
  }
  function leadsPage(isCaller) {
    const source = isCaller ? callerLeads() : leads.slice();
    const actions = !isCaller ? '<a class="btn btn-secondary" href="upload-leads.html">Import CSV</a><button class="btn btn-primary" data-action="export-csv">Export CSV</button>' : '<button class="btn btn-primary" data-action="export-csv">Export my leads</button>';
    const header = pageHead(isCaller ? 'CALLER WORKSPACE' : 'LEAD MANAGEMENT', isCaller ? 'My leads' : 'All leads', isCaller ? 'Update status, remarks, next action and follow-up dates for your assigned leads.' : 'Search and review leads across webinar dates, owners and outcomes.', actions);
    const filters = '<div class="filters"><input class="control search" id="lead-search" placeholder="Search name, phone or remarks" aria-label="Search leads"><select class="control" id="lead-status"><option value="">All statuses</option>' + STATUSES.map(function(s){return '<option>'+esc(s)+'</option>';}).join('') + '</select><select class="control" id="lead-date"><option value="">All webinar dates</option>' + Array.from(new Set(source.map(function(l){return l.webinarDate;}))).sort().reverse().map(function(d){return '<option>'+esc(d)+'</option>';}).join('') + '</select>' + (!isCaller ? '<select class="control" id="lead-caller"><option value="">All callers</option>' + callers.map(function(c){return '<option value="'+esc(c.name)+'">'+esc(c.name)+' · '+esc(c.id)+'</option>';}).join('') + '</select><select class="control" id="lead-upload-date"><option value="">All upload dates</option>' + Array.from(new Set(source.map(uploadDay).filter(Boolean))).sort().reverse().map(function(d){return '<option>'+esc(d)+'</option>';}).join('') + '</select><select class="control" id="lead-assignment-status"><option value="">All assignment states</option><option value="assigned">Assigned</option><option value="unassigned">Unassigned</option></select>' : '') + '</div>';
    return header + demoNotice + sectionPanel(isCaller ? 'Assigned lead list' : 'Lead register', source.length + ' sample records', filters + '<div id="lead-table">' + leadTable(source,{callerMode:isCaller,adminMode:!isCaller}) + '</div>','');
  }
  function uploadPage() {
    const historyRows = uploadHistory.map(function (upload) { return '<tr><td><span class="lead-name">' + esc(upload.file) + '</span><br><span class="muted">' + esc(upload.id) + '</span></td><td>' + upload.rows + '</td><td>' + esc(formatUploadDate(upload.uploadedAt)) + '</td><td>' + esc(upload.uploadedBy) + '</td></tr>'; }).join('');
    return pageHead('DATA INTAKE','Upload leads','Preview webinar or campaign files and review earlier upload batches.','') + demoNotice + '<div class="notice"><strong>Upload date is system generated</strong>In the live database, PostgreSQL must set the timestamp when rows are inserted; this form has no date field. Reassignment must leave the timestamp unchanged.</div><div class="content-grid"><section class="panel"><div class="panel-head"><div><h2>Choose a CSV or Excel file</h2><p>Preview supports UTF-8 CSV and .xlsx spreadsheets.</p></div><span class="mock-tag">Preview only</span></div><div class="field"><label for="csv-file">CSV or Excel file<input id="csv-file" type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></label><span class="field-help">Expected columns: Name, Mobile Number, Webinar Date, Status, Follow-up Date, Revenue, Notes.</span></div><div class="divider"></div><div class="button-row"><button class="btn btn-primary" id="preview-csv" type="button">Preview file</button><button class="btn btn-secondary" data-action="download-template" type="button">Download CSV template</button></div><div id="csv-result" style="margin-top:16px"></div></section><section class="panel"><h2 class="section-title">Before importing</h2><div class="list-stack"><div class="list-item"><div><strong>Use one row per webinar cycle</strong><small>Keep returning leads on a separate row for each event date.</small></div></div><div class="list-item"><div><strong>Check phone numbers</strong><small>Keep mobile numbers as text so leading digits are preserved.</small></div></div><div class="list-item"><div><strong>Review statuses</strong><small>Unrecognized or blank statuses should be resolved before a live import.</small></div></div><div class="list-item"><div><strong>Upload timestamps</strong><small>Production timestamps are assigned by PostgreSQL at insert time.</small></div></div></div></section></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Upload history</h2><p>Sample records · live history requires the audited database table</p></div><span class="mock-tag">Sample</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>File</th><th>Rows</th><th>Uploaded at</th><th>Uploaded by</th></tr></thead><tbody>' + historyRows + '</tbody></table></div></section>';
  }
  function distributionPage() {
    const active = callers.filter(function (c) { return c.active; });
    const countInputs = active.map(function (c) { return '<label class="allocation-card"><span class="allocation-person"><b>' + esc(c.name) + '</b><small>Caller ID: ' + esc(c.id) + ' · currently assigned: ' + leads.filter(function (l) { return l.caller === c.name; }).length + '</small></span><span class="allocation-count"><input class="count-input" type="number" min="0" step="1" value="0" data-distribute-count="' + esc(c.id) + '" aria-label="Lead count for ' + esc(c.name) + '"><small>leads</small></span></label>'; }).join('');
    const statuses = STATUSES.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    const uploadDates = Array.from(new Set(leads.map(uploadDay).filter(Boolean))).sort().reverse().map(function (d) { return '<option>' + esc(d) + '</option>'; }).join('');
    const callersFilter = callers.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + ' · ' + esc(c.id) + '</option>'; }).join('');
    const bulkTargets = active.map(function (c) { return '<option value="' + esc(c.name) + '">' + esc(c.name) + ' · ' + esc(c.id) + '</option>'; }).join('');
    return pageHead('TEAM OPERATIONS','Lead distribution','Caller ka naam ya ID filter karein, phir count ya selected leads ke through assign karein.','') + demoNotice + '<div class="notice"><strong>Preview mode</strong>Assignments abhi sirf sample records mein temporary hain. Live assignment database/RLS se connect nahi hai.</div><div id="distribution-metrics"></div><section class="panel allocation-panel"><div class="panel-head"><div><h2>Distribute by caller count</h2><p>Selected leads honge to unmein se unassigned records use honge; selection na ho to filters ke matching unassigned records use honge.</p></div><button class="btn btn-primary" data-action="assign-by-count">Distribute leads</button></div><div class="allocation-grid">' + countInputs + '</div><div id="distribution-result" aria-live="polite"></div></section><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Caller assignment totals</h2><p>Caller-wise assigned total aur remaining unassigned pool.</p></div></div><div id="distribution-summary"></div></section><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Filter and choose specific leads</h2><p>New distribution sirf unassigned leads par chalega. Reassignment alag confirmation ke saath hoti hai.</p></div></div><div class="filters distribution-filters"><input class="control search" id="distribution-search" placeholder="Search lead name, phone, or ID"><select class="control" id="distribution-caller-filter"><option value="">All callers</option><option value="unassigned">Unassigned</option>' + callersFilter + '</select><select class="control" id="distribution-status"><option value="">All statuses</option>' + statuses + '</select><select class="control" id="distribution-upload-date"><option value="">All upload dates</option>' + uploadDates + '</select><select class="control" id="distribution-assignment-status"><option value="unassigned" selected>Unassigned only</option><option value="assigned">Assigned only</option><option value="">All assignment states</option></select></div><div class="bulk-reassign"><label for="bulk-target-caller">Reassign selected to</label><select class="control" id="bulk-target-caller"><option value="">Choose caller</option>' + bulkTargets + '</select><button class="btn btn-secondary" data-action="reassign-selected">Reassign selected</button><span id="selection-count" class="muted">0 selected</span></div><div id="distribution-table"></div></section>';
  }
  function filteredDistributionLeads() {
    const q = (document.getElementById('distribution-search') || {}).value || '';
    const callerId = (document.getElementById('distribution-caller-filter') || {}).value || '';
    const status = (document.getElementById('distribution-status') || {}).value || '';
    const uploaded = (document.getElementById('distribution-upload-date') || {}).value || '';
    const assignment = (document.getElementById('distribution-assignment-status') || {}).value || '';
    const needle = q.toLowerCase();
    return leads.filter(function (lead) {
      const owner = callers.find(function (c) { return c.name === lead.caller; });
      const ownerMatches = !callerId || (callerId === 'unassigned' ? !lead.caller : !!owner && owner.id === callerId);
      const assignmentMatches = !assignment || (assignment === 'assigned' ? !!lead.caller : !lead.caller);
      return (!needle || (lead.name + ' ' + lead.phone + ' ' + lead.id).toLowerCase().indexOf(needle) >= 0) && ownerMatches && assignmentMatches && (!status || lead.status === status) && (!uploaded || uploadDay(lead) === uploaded);
    });
  }
  function distributionTable(rows) {
    if (!rows.length) return '<div class="empty-state"><div class="empty-icon">⌕</div>No leads match these distribution filters.</div>';
    const active = callers.filter(function (c) { return c.active; });
    return '<div class="table-panel"><div class="table-scroll"><table class="data-table"><thead><tr><th><input type="checkbox" id="select-all-distribution" aria-label="Select visible leads"></th><th>Lead</th><th>Mobile</th><th>Status</th><th>Uploaded at</th><th>Assignment status</th><th>Current caller</th></tr></thead><tbody>' + rows.map(function (lead) {
      const caller = callers.find(function (c) { return c.name === lead.caller; });
      return '<tr><td><input type="checkbox" class="distribution-check" value="' + esc(lead.id) + '" aria-label="Select ' + esc(lead.name) + '"></td><td><span class="lead-name">' + esc(lead.name) + '</span><br><span class="muted">' + esc(lead.id) + '</span></td><td>' + esc(lead.phone) + '</td><td>' + badge(lead.status) + '</td><td title="' + esc(lead.uploadDate || '') + '">' + esc(formatUploadDate(lead.uploadDate)) + '</td><td><span class="badge ' + (lead.caller ? 'green' : 'amber') + '">' + (lead.caller ? 'Assigned' : 'Unassigned') + '</span></td><td>' + (caller ? esc(caller.name) + '<br><span class="muted">' + esc(caller.id) + '</span>' : '<span class="muted">—</span>') + '</td></tr>';
    }).join('') + '</tbody></table></div><div class="pagination"><span>Showing ' + rows.length + ' matching sample lead(s)</span></div></div>';
  }
  function distributionSummary() {
    const unassigned = leads.filter(function (lead) { return !lead.caller; }).length;
    const metrics = '<div class="cards">' + metric('Total available', leads.length, '◫', 'All sample leads', '') + metric('Assigned', leads.length - unassigned, '✓', 'Currently owned by callers', 'good') + metric('Unassigned', unassigned, '○', 'Remaining pool for distribution', '') + metric('Active callers', callers.filter(function (c) { return c.active; }).length, '♙', 'Can receive leads', '') + '</div>';
    const rows = callers.map(function (caller) { const count = leads.filter(function (lead) { return lead.caller === caller.name; }).length; return '<tr><td>' + esc(caller.id) + '</td><td><span class="lead-name">' + esc(caller.name) + '</span></td><td>' + count + '</td><td><span class="badge ' + (caller.active ? 'green' : 'gray') + '">' + (caller.active ? 'Active' : 'Inactive') + '</span></td></tr>'; }).join('');
    return {metrics:metrics,summary:'<div class="table-scroll"><table class="data-table"><thead><tr><th>Caller ID</th><th>Caller</th><th>Total assigned</th><th>Account</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="muted summary-note">Remaining unassigned for the whole pool: <b>' + unassigned + '</b>. Assignment totals update after each preview distribution.</p>'};
  }
  function renderDistribution() {
    const stats = distributionSummary();
    document.getElementById('distribution-metrics').innerHTML = stats.metrics;
    document.getElementById('distribution-summary').innerHTML = stats.summary;
    document.getElementById('distribution-table').innerHTML = distributionTable(filteredDistributionLeads());
    const count = document.querySelectorAll('.distribution-check:checked').length;
    const countLabel = document.getElementById('selection-count');
    if (countLabel) countLabel.textContent = count + ' selected';
  }
  function distributionCandidates() {
    const checked = Array.from(document.querySelectorAll('.distribution-check:checked')).map(function (input) { return input.value; });
    const source = checked.length ? leads.filter(function (lead) { return checked.indexOf(lead.id) >= 0; }) : filteredDistributionLeads();
    return source.filter(function (lead) { return !lead.caller; });
  }
  function assignByCounts() {
    const pool = distributionCandidates();
    const inputs = Array.from(document.querySelectorAll('[data-distribute-count]'));
    const rawRequests = inputs.map(function (input) { return {caller:callers.find(function (c) { return c.id === input.dataset.distributeCount && c.active; }),count:Number(input.value),raw:input.value}; });
    const requests = rawRequests.filter(function (row) { return row.count > 0; });
    const requested = requests.reduce(function (total, row) { return total + row.count; }, 0);
    const result = document.getElementById('distribution-result');
    if (!requests.length || rawRequests.some(function (row) { return !row.caller || !Number.isInteger(row.count) || row.count < 0; })) { result.innerHTML = '<div class="notice error-notice">Har caller ke liye valid non-negative whole-number count enter karein. Zero count ignore hoga.</div>'; return; }
    if (requested > pool.length) { result.innerHTML = '<div class="notice error-notice">Requested ' + requested + ' leads, lekin selected/filtered unassigned pool mein sirf ' + pool.length + ' available hain.</div>'; return; }
    if (!confirm(requested + ' unassigned lead(s) ko ' + requests.length + ' caller(s) mein distribute karein?')) return;
    let cursor = 0;
    requests.forEach(function (request) { for (let i = 0; i < request.count; i++) { pool[cursor].caller = request.caller.name; cursor++; } });
    renderDistribution();
    result.innerHTML = '<div class="success-notice" role="status">Done — ' + requested + ' sample lead(s) distribute kiye gaye. Har lead ka ek hi current caller hai; upload timestamp preserve hua.</div>';
  }
  function reassignSelected() {
    const selected = Array.from(document.querySelectorAll('.distribution-check:checked')).map(function (input) { return input.value; });
    const target = (document.getElementById('bulk-target-caller') || {}).value || '';
    const result = document.getElementById('distribution-result');
    if (!selected.length || !target) { result.innerHTML = '<div class="notice error-notice">Reassign karne ke liye leads select karein aur destination caller choose karein.</div>'; return; }
    const affected = leads.filter(function (lead) { return selected.indexOf(lead.id) >= 0 && lead.caller !== target; });
    if (!affected.length) { result.innerHTML = '<div class="notice">Selected leads pehle se isi caller ko assigned hain.</div>'; return; }
    if (!confirm(affected.length + ' lead(s) ko ' + target + ' ko reassign karein?')) return;
    affected.forEach(function (lead) { lead.caller = target; });
    renderDistribution();
    result.innerHTML = '<div class="success-notice" role="status">Done — ' + affected.length + ' sample lead(s) reassign hue. Original upload timestamps unchanged hain.</div>';
  }
  function callerManagementPage() {
    const users = callers.map(function(c){return '<tr><td><span class="lead-name">'+esc(c.id)+'</span></td><td><span class="lead-name">'+esc(c.name)+'</span><br><span class="muted">Caller</span></td><td>'+esc(c.email)+'</td><td>'+leads.filter(function(l){return l.caller===c.name;}).length+'</td><td><span class="badge '+(c.active?'green':'gray')+'">'+(c.active?'Active':'Inactive')+'</span></td><td><div class="button-row"><button class="btn btn-secondary btn-sm" data-action="toggle-caller" data-id="'+c.id+'">'+(c.active?'Deactivate':'Reactivate')+'</button><button class="btn btn-secondary btn-sm" data-action="reset-password" data-id="'+c.id+'">Send reset link</button></div></td></tr>';}).join('');
    return pageHead('TEAM OPERATIONS','User and caller management','Unique user IDs, roles and account lifecycle controls.','') + demoNotice + '<div class="notice"><strong>Secure setup sequence</strong>Pehle initial Admin ko Supabase Auth + server-side role bootstrap se provision karein. Uske baad authorized Admin Edge Function se user invite kare. Browser mein password save nahi hota; user apna password Auth ke through set karega.</div><div class="content-grid"><section class="panel"><div class="panel-head"><div><h2>Initial Admin setup</h2><p>Public admin signup enable na karein.</p></div><span class="mock-tag">Backend pending</span></div><ol class="setup-list"><li>Schema/RLS audit complete karein aur profile mapping tay karein.</li><li>Ek verified admin email ko Supabase Auth mein invite karein.</li><li>One-time server-side bootstrap se us Auth user ko Admin role dein.</li><li>Bootstrap token/endpoint ko disable karke role access test karein.</li></ol><p class="field-help">Yeh preview setup ko describe karta hai; abhi koi account create nahi hota.</p></section><section class="panel"><div class="panel-head"><div><h2>Invite a user</h2><p>Caller ya Admin role select karein; password email invite se set hoga.</p></div><span class="mock-tag">Preview only</span></div><form id="preview-user-form" class="form-grid"><div class="field"><label for="new-user-id">Unique User ID<input id="new-user-id" name="userId" required placeholder="e.g. CALL-004"></label></div><div class="field"><label for="new-user-name">Display name<input id="new-user-name" name="name" required placeholder="Full name"></label></div><div class="field"><label for="new-user-email">Login email<input id="new-user-email" name="email" type="email" required placeholder="name@example.com"></label></div><div class="field"><label for="new-user-role">Role<select id="new-user-role" name="role"><option value="caller">Caller</option><option value="admin">Admin</option></select></label></div><div class="field full"><button class="btn btn-primary" type="submit">Preview invite request</button><div id="user-form-result" aria-live="polite"></div></div></form></section></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Caller directory</h2><p>' + callers.length + ' sample caller accounts</p></div><input class="control search" id="caller-search" placeholder="Search caller name or ID"></div><div class="table-scroll"><table class="data-table"><thead><tr><th>User ID</th><th>User / role</th><th>Email</th><th>Assigned leads</th><th>Status</th><th>Preview actions</th></tr></thead><tbody>' + users + '</tbody></table></div></section>';
  }
  function reportsPage() {
    const revenue = leads.reduce(function(a,l){return a+Number(l.revenue||0);},0);
    const sales = leads.filter(function(l){return l.status==='Webinar Sale'||l.status==='Sales by Team';}).length;
    const bars = callers.filter(function(c){return c.active;}).map(function(c){const assigned=leads.filter(function(l){return l.caller===c.name;});const sold=assigned.filter(function(l){return l.status==='Webinar Sale'||l.status==='Sales by Team';}).length;return '<div class="list-item"><div><strong>'+esc(c.name)+'</strong><small>'+assigned.length+' assigned · '+sold+' sales</small></div><b>'+money(assigned.reduce(function(a,l){return a+Number(l.revenue||0);},0))+'</b></div>';}).join('');
    return pageHead('INSIGHTS','Reports','Caller-wise, webinar-wise, sales and revenue summaries for the sample data.','<button class="btn btn-secondary" data-action="export-csv">Export CSV</button>') + demoNotice + '<div class="cards">'+metric('Sales',sales,'✓','Statuses: Webinar Sale + Sales by Team','good')+metric('Revenue',money(revenue),'₹','Sum of sample revenue fields','')+metric('Webinar cycles',new Set(leads.map(function(l){return l.webinarDate;})).size,'◷','Unique webinar dates','')+metric('Conversion',Math.round(sales/Math.max(leads.length,1)*100)+'%','↗','Sales divided by sample leads','')+'</div><div class="content-grid">'+sectionPanel('Caller performance','Assigned volume and recorded revenue','<div class="list-stack">'+bars+'</div>','')+sectionPanel('Webinar summary','Leads and sales by event date','<div class="list-stack">'+Array.from(new Set(leads.map(function(l){return l.webinarDate;}))).sort().reverse().map(function(d){const group=leads.filter(function(l){return l.webinarDate===d;});const sold=group.filter(function(l){return l.status==='Webinar Sale'||l.status==='Sales by Team';}).length;return '<div class="list-item"><div><strong>'+esc(d)+'</strong><small>'+group.length+' leads · '+sold+' sales</small></div><b>'+money(group.reduce(function(a,l){return a+Number(l.revenue||0);},0))+'</b></div>';}).join('')+'</div>','')+'</div>';
  }
  function activityPage() {
    return pageHead('AUDIT TRAIL','Activity logs','A preview of important changes that should be retained in a server-written audit log.','') + demoNotice + '<div class="notice"><strong>Sample activity only</strong>These rows are static examples. Live audit events must be generated server-side so callers cannot forge admin activity.</div><section class="panel"><div class="panel-head"><div><h2>Recent activity</h2><p>Latest sample events</p></div><select class="control"><option>All activity</option><option>Lead updates</option><option>Assignments</option><option>Imports</option></select></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Time</th><th>Actor</th><th>Event</th><th>Details</th></tr></thead><tbody>'+activities.map(function(a){return '<tr><td>'+a[0]+'</td><td>'+a[1]+'</td><td>'+a[2]+'</td><td>'+a[3]+'</td></tr>';}).join('')+'</tbody></table></div></section>';
  }
  function followupsPage() {
    const rows = callerLeads().filter(function(l){return l.followUp;}).sort(function(a,b){return a.followUp.localeCompare(b.followUp);});
    const overdue = rows.filter(function(l){return l.followUp<'2026-10-21';}).length;
    const due = rows.filter(function(l){return l.followUp==='2026-10-21';}).length;
    return pageHead('CALLER WORKSPACE','My follow-ups','Prioritize today’s and overdue follow-ups across your assigned sample leads.','<a class="btn btn-primary" href="my-leads.html">Open my leads</a>') + demoNotice + '<div class="cards">'+metric('Overdue',overdue,'!','Follow-up date before 21 Oct','')+metric('Due today',due,'◷','Follow-up date is 21 Oct','')+metric('Upcoming',rows.length-overdue-due,'→','Future follow-up dates','')+metric('Total scheduled',rows.length,'▤','Assigned sample leads','')+'</div><section class="panel"><div class="panel-head"><div><h2>Follow-up queue</h2><p>Update lead details from My leads.</p></div><select class="control"><option>All follow-ups</option><option>Overdue</option><option>Due today</option></select></div>'+leadTable(rows,{callerMode:true})+'</section>';
  }
  function performancePage() {
    const mine=callerLeads();const sales=mine.filter(function(l){return l.status==='Webinar Sale'||l.status==='Sales by Team';});const rate=Math.round(sales.length/Math.max(mine.length,1)*100);
    return pageHead('CALLER WORKSPACE','My performance','A personal view of assigned leads, follow-up coverage, sales and revenue.','')+demoNotice+'<div class="cards">'+metric('Assigned leads',mine.length,'◫','Current sample workload','')+metric('Sales',sales.length,'✓','Webinar and team sales','good')+metric('Conversion',rate+'%','↗','Sales / assigned leads','')+metric('Revenue',money(mine.reduce(function(a,l){return a+Number(l.revenue||0);},0)),'₹','Recorded sample revenue','')+'</div><div class="content-grid">'+sectionPanel('Lead outcomes','Your current status distribution',statusBars(mine),'')+sectionPanel('Follow-up coverage','Assigned leads with a follow-up date','<div class="summary-grid"><div class="summary-item"><strong>'+mine.filter(function(l){return l.followUp;}).length+'</strong><span>Scheduled</span></div><div class="summary-item"><strong>'+mine.filter(function(l){return l.followUp==='2026-10-21';}).length+'</strong><span>Due today</span></div><div class="summary-item"><strong>'+mine.filter(function(l){return l.status==='Call Not Pickup';}).length+'</strong><span>Call not picked up</span></div></div>','')+'</div>';
  }
  function renderPage() {
    let html = '';
    if (page === 'admin-dashboard') html = dashboard(true);
    else if (page === 'caller-dashboard') html = dashboard(false);
    else if (page === 'all-leads') html = leadsPage(false);
    else if (page === 'my-leads') html = leadsPage(true);
    else if (page === 'upload-leads') html = uploadPage();
    else if (page === 'lead-distribution') html = distributionPage();
    else if (page === 'caller-management') html = callerManagementPage();
    else if (page === 'reports') html = reportsPage();
    else if (page === 'activity-logs') html = activityPage();
    else if (page === 'my-follow-ups') html = followupsPage();
    else if (page === 'my-performance') html = performancePage();
    document.getElementById('page-content').innerHTML = html;
    bindPageEvents();
  }
  function filteredLeads() {
    const base = role === 'caller' ? callerLeads() : leads;
    const q = (document.getElementById('lead-search') || {}).value || '';
    const st = (document.getElementById('lead-status') || {}).value || '';
    const dt = (document.getElementById('lead-date') || {}).value || '';
    const caller = (document.getElementById('lead-caller') || {}).value || '';
    const uploaded = (document.getElementById('lead-upload-date') || {}).value || '';
    const assignment = (document.getElementById('lead-assignment-status') || {}).value || '';
    const query = q.toLowerCase();
    return base.filter(function(l){return (!query || (l.name+' '+l.phone+' '+l.notes+' '+l.nextAction+' '+l.id).toLowerCase().indexOf(query)>=0) && (!st || l.status===st) && (!dt || l.webinarDate===dt) && (!caller || l.caller===caller) && (!uploaded || uploadDay(l)===uploaded) && (!assignment || (assignment==='assigned' ? !!l.caller : !l.caller));});
  }
  function bindPageEvents() {
    const search = document.getElementById('lead-search');
    if (search) search.addEventListener('input',function(){document.getElementById('lead-table').innerHTML=leadTable(filteredLeads(),{callerMode:role==='caller',adminMode:role==='admin'});});
    ['lead-status','lead-date','lead-caller','lead-upload-date','lead-assignment-status'].forEach(function(id){const el=document.getElementById(id);if(el)el.addEventListener('change',function(){document.getElementById('lead-table').innerHTML=leadTable(filteredLeads(),{callerMode:role==='caller',adminMode:role==='admin'});});});
    const csvButton=document.getElementById('preview-csv');if(csvButton)csvButton.addEventListener('click',previewCsv);
    const userForm = document.getElementById('preview-user-form');
    if (userForm) userForm.addEventListener('submit',function(event){
      event.preventDefault();
      const id = document.getElementById('new-user-id').value.trim();
      const email = document.getElementById('new-user-email').value.trim().toLowerCase();
      const result = document.getElementById('user-form-result');
      const duplicate = callers.some(function(c){return c.id.toLowerCase()===id.toLowerCase()||c.email.toLowerCase()===email;});
      result.innerHTML = duplicate ? '<div class="notice error-notice">Sample directory mein yeh User ID ya email pehle se hai.</div>' : '<div class="notice">Preview validation pass hua. Account invite nahi bheja gaya; Auth Edge Function abhi connected nahi hai.</div>';
    });
    if (page === 'lead-distribution') {
      renderDistribution();
      ['distribution-search','distribution-caller-filter','distribution-status','distribution-upload-date','distribution-assignment-status'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', renderDistribution);
      });
      const table = document.getElementById('distribution-table');
      if (table) table.addEventListener('change',function(event){
        if (event.target.id === 'select-all-distribution') document.querySelectorAll('.distribution-check').forEach(function (input) { input.checked = event.target.checked; });
        if (event.target.matches('.distribution-check') || event.target.id === 'select-all-distribution') {
          const selected = document.querySelectorAll('.distribution-check:checked').length;
          document.getElementById('selection-count').textContent = selected + ' selected';
        }
      });
    }
  }
  function previewCsv() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput && fileInput.files[0];
    const target = document.getElementById('csv-result');
    if (!file) { target.innerHTML = '<div class="notice">CSV ya Excel file choose karein.</div>'; return; }
    const renderRows = function (matrix) {
      if (!matrix || matrix.length < 2) { target.innerHTML = '<div class="notice">File mein header aur kam se kam ek data row honi chahiye.</div>'; return; }
      const headers = matrix[0].map(function (h) { return String(h == null ? '' : h).trim(); });
      const normalized = headers.map(function (h) { return h.toLowerCase(); });
      const nameIndex = normalized.findIndex(function (h) { return h.indexOf('name') >= 0; });
      const phoneIndex = normalized.findIndex(function (h) { return h.indexOf('mobile') >= 0 || h.indexOf('phone') >= 0; });
      const statusIndex = normalized.findIndex(function (h) { return h.indexOf('status') >= 0; });
      const rows = matrix.slice(1).filter(function (row) { return row.some(function (cell) { return String(cell == null ? '' : cell).trim() !== ''; }); });
      const missingIdentity = rows.filter(function (row) { return nameIndex < 0 && phoneIndex < 0 || nameIndex >= 0 && !String(row[nameIndex] || '').trim() && (phoneIndex < 0 || !String(row[phoneIndex] || '').trim()); }).length;
      const badStatus = statusIndex < 0 ? 0 : rows.filter(function (row) { const status = String(row[statusIndex] || '').trim(); return status && STATUSES.indexOf(status) < 0; }).length;
      const summary = (nameIndex >= 0 ? 'Name column found. ' : 'Missing Name column. ') + (phoneIndex >= 0 ? 'Mobile/Phone column found. ' : 'Missing Mobile/Phone column. ') + 'Rows missing both name and phone: ' + missingIdentity + '. Unknown statuses: ' + badStatus + '. No rows were uploaded or saved.';
      const preview = rows.slice(0, 8);
      target.innerHTML = '<div class="notice"><strong>Preview ready · ' + rows.length + ' data rows · ' + esc(file.name) + '</strong>' + esc(summary) + '</div><div class="table-scroll"><table class="data-table"><thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + preview.map(function (row) { return '<tr>' + headers.map(function (_, i) { return '<td>' + esc(row[i] || '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    const reader = new FileReader();
    if (/\.xlsx$/i.test(file.name)) {
      if (!window.XLSX) { target.innerHTML = '<div class="notice error-notice">Excel parser load nahi hua. Page ko internet-enabled local server se kholkar dobara try karein.</div>'; return; }
      reader.onload = function (event) {
        try {
          const workbook = window.XLSX.read(event.target.result, {type:'array',cellDates:false});
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          renderRows(window.XLSX.utils.sheet_to_json(firstSheet,{header:1,raw:false,defval:''}));
        } catch (error) { target.innerHTML = '<div class="notice error-notice">Excel file read nahi ho saki. File format verify karke dobara try karein.</div>'; }
      };
      reader.readAsArrayBuffer(file);
      return;
    }
    reader.onload = function () { const lines = String(reader.result).split(/\r?\n/).filter(function (line) { return line.trim(); }); renderRows(lines.map(parseCsvLine)); };
    reader.readAsText(file);
  }
  function parseCsvLine(line) { const cells=[];let cell='',quoted=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&line[i+1]==='"'&&quoted){cell+='"';i++;}else if(ch==='"'){quoted=!quoted;}else if(ch===','&&!quoted){cells.push(cell);cell='';}else{cell+=ch;}}cells.push(cell);return cells; }
  function exportCsv() { const rows=role==='caller'?callerLeads():leads;const all=[['Name','Mobile Number','Webinar Date','Status','Follow-up Date','Revenue','Notes','Next Action','Assigned Caller']].concat(rows.map(function(l){return [l.name,l.phone,l.webinarDate,l.status,l.followUp,l.revenue,l.notes,l.nextAction,l.caller];}));const csv='\ufeff'+all.map(function(row){return row.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}).join(',');}).join('\r\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download='smm-leads-preview.csv';link.click();URL.revokeObjectURL(link.href); }
  function downloadTemplate() { const data='Name,Mobile Number,Webinar Date,Status,Follow-up Date,Revenue,Notes\r\nSample Lead,0000000000,2026-10-21,Fresh Lead,2026-10-22,0,Sample remark';const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([data],{type:'text/csv'}));link.download='smm-lead-template.csv';link.click();URL.revokeObjectURL(link.href); }
  document.addEventListener('change',function(event){const target=event.target;if(target.matches('[data-edit]')){const lead=leads.find(function(l){return l.id===target.dataset.id;});if(lead){lead[target.dataset.edit]=target.value;if(target.dataset.edit==='status')renderPage();}}});
  document.addEventListener('click',function(event){const button=event.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;
    if(action==='export-csv')exportCsv();
    if(action==='download-template')downloadTemplate();
    if(action==='assign-sample'){const owner=document.getElementById('bulk-caller').value;const selected=Array.from(document.querySelectorAll('.row-check:checked')).map(function(c){return c.value;});if(!owner||!selected.length){alert('Choose a caller and select at least one sample lead.');return;}leads.forEach(function(l){if(selected.indexOf(l.id)>=0)l.caller=owner;});renderPage();}
    if(action==='assign-by-count')assignByCounts();
    if(action==='reassign-selected')reassignSelected();
    if(action==='toggle-caller'){const c=callers.find(function(x){return x.id===button.dataset.id;});if(c){c.active=!c.active;renderPage();}}
    if(action==='reset-password'){alert('Preview only. Password reset is not connected.');}
    if(action==='add-caller'){alert('Preview only. Caller creation requires the audited schema and a protected server-side function.');}
    if(action==='edit-lead'){alert('This is a sample record. Live editing will be connected after schema and RLS review.');}
    if(action==='delete-lead'){const lead=leads.find(function(l){return l.id===button.dataset.id;});if(lead&&confirm('Remove '+lead.name+' from this sample preview?')){leads=leads.filter(function(l){return l.id!==button.dataset.id;});renderPage();}}
    if(action==='next-cycle'){const old=leads.find(function(l){return l.id===button.dataset.id;});if(old){const date=prompt('Next webinar date (YYYY-MM-DD):','');if(date&&/^\d{4}-\d{2}-\d{2}$/.test(date)){leads.unshift(Object.assign({},old,{id:'D-'+Date.now(),webinarDate:date,status:'Fresh Lead',followUp:'',revenue:0,notes:'Previous cycle: '+old.status,nextAction:'',caller:old.caller}));renderPage();}}}
  });
  shell();
})();
