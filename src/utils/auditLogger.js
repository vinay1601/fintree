// Mock audit logging system

// In a real system, this would save to a database
export const logAuditEvent = (action, entityType, entityId, performedBy, details) => {
  const auditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    entityType, // 'retailer' | 'employee' | 'user'
    entityId,
    performedBy,
    timestamp: new Date().toISOString(),
    details,
    ipAddress: '192.168.1.1', // Mock IP
  };

  // In a real implementation, this would be sent to an API endpoint
  console.log('Audit Log Created:', auditLog);

  // For demo purposes, we could store in localStorage
  const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  existingLogs.unshift(auditLog); // Add to beginning
  localStorage.setItem('auditLogs', JSON.stringify(existingLogs.slice(0, 100))); // Keep only last 100

  return auditLog;
};

// Helper function to get audit logs (for admin viewing)
export const getAuditLogs = () => {
  return JSON.parse(localStorage.getItem('auditLogs') || '[]');
};
