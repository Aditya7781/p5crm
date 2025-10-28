// Utility functions for downloading data as CSV files

export const downloadCSV = (data: any[], filename: string, headers: string[]) => {
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '');
        let value = '';
        
        // Handle different data structures
        switch (key) {
          case 'clientinfo':
            value = `"${row.clientName} (${row.clientId})"`;
            break;
          case 'contact':
            value = `"${row.clientPhone} | ${row.clientEmail}"`;
            break;
          case 'projectdetails':
            value = `"₹${row.estValue?.toLocaleString()} | ${row.date} | Lead: ${row.projectLead}"`;
            break;
          case 'billing':
            value = `"${row.billingStatus} | A/c: ${row.sentToAccounting ? 'Sent' : 'Pending'}"`;
            break;
          case 'status':
            value = `"GST: ${row.gstFilingStatus} | Confirmed: ${row.confirmationBy}"`;
            break;
          case 'project':
            value = `"${row.project} (${row.projectId})"`;
            break;
          case 'team':
            value = `"Design: ${row.designers} | Frontend: ${row.frontend} | Backend: ${row.backend}"`;
            break;
          case 'timeline':
            value = `"Created: ${row.createdOn} | Deadline: ${row.deadline}${row.overdue ? ' | OVERDUE' : ''}"`;
            break;
          case 'technical':
            value = `"AWS: ${row.awsDetails} | Figma: Available"`;
            break;
          case 'jobstatus':
            value = `"${row.status}${row.holdReassign ? ' | Hold/Reassign' : ''}"`;
            break;
          default:
            // Handle direct field mapping
            const fieldMap: { [key: string]: string } = {
              'clientid': 'clientId',
              'clientname': 'clientName',
              'clientphone': 'clientPhone',
              'clientemail': 'clientEmail',
              'estvalue': 'estValue',
              'confirmationby': 'confirmationBy',
              'projectlead': 'projectLead',
              'senttoaccounting': 'sentToAccounting',
              'billingstatus': 'billingStatus',
              'gstfilingstatus': 'gstFilingStatus',
              'projectid': 'projectId',
              'projectvalue': 'projectValue',
              'createdon': 'createdOn',
              'awsdetails': 'awsDetails',
              'figmafile': 'figmaFile',
              'holdreassign': 'holdReassign',
              'employeeid': 'employeeId'
            };
            
            const actualKey = fieldMap[key] || key;
            value = row[actualKey];
            
            // Format specific types
            if (typeof value === 'boolean') {
              value = value ? 'Yes' : 'No';
            } else if (typeof value === 'number') {
              value = value.toString();
            } else if (value === undefined || value === null) {
              value = '';
            } else {
              value = `"${value}"`;
            }
            break;
        }
        
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const downloadProjectsCSV = (projects: any[]) => {
  const headers = [
    'Client ID',
    'Client Name', 
    'Client Phone',
    'Client Email',
    'Date',
    'Est Value',
    'Confirmation By',
    'Project Lead',
    'Sent to Accounting',
    'Billing Status',
    'GST Filing Status'
  ];
  
  downloadCSV(projects, 'projects_export', headers);
};

export const downloadJobsCSV = (jobs: any[]) => {
  const headers = [
    'Project',
    'Project ID',
    'Description',
    'Project Value',
    'Designers',
    'Frontend',
    'Backend',
    'Created On',
    'Deadline',
    'Overdue',
    'Status',
    'AWS Details',
    'Figma File',
    'Hold Reassign'
  ];
  
  downloadCSV(jobs, 'jobs_export', headers);
};