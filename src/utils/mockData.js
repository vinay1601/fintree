// Mock users
export const mockUsers = [
  {
    id: "admin1",
    email: "admin@crm.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "employee1",
    email: "employee@crm.com",
    name: "Sarah Johnson",
    role: "employee",
  },
  {
    id: "retailer1",
    email: "retailer@crm.com",
    name: "TechStore Inc",
    role: "retailer",
  },
];

// Mock retailers
export const mockRetailers = [
  {
    id: "retailer1",
    companyName: "Tech Solutions Ltd",
    contactPerson: "John Smith",
    email: "john@techsolutions.com",
    phone: "+1 (555) 123-4567",
    businessType: "private_limited",
    gstNumber: "29ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234-5678-9012",
    currentAddress: "123 Business Street, Tech City, TC 12345",
    permanentAddress: "123 Business Street, Tech City, TC 12345",
    kycStatus: "in_review",
    bankDetails: {
      accountNumber: "123456789012",
      accountHolderName: "John Smith",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branchName: "Main Branch",
    },
    companyBankDetails: {
      accountNumber: "987654321098",
      accountHolderName: "Tech Solutions Ltd",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branchName: "Corporate Branch",
    },
    directors: [
      {
        name: "John Smith",
        mobile: "+1 (555) 123-4567",
        email: "john@techsolutions.com",
        panCard: "ABCDE1234F",
      },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    verifiedBy: undefined,
    uploadedBy: "employee1",
  },
  {
    id: "retailer2",
    companyName: "Global Retail Inc",
    contactPerson: "Sarah Wilson",
    email: "sarah@globalretail.com",
    phone: "+1 (555) 987-6543",
    businessType: "private_limited",
    gstNumber: "29FGHIJ5678K1L0",
    panNumber: "FGHIJ5678K",
    aadhaarNumber: "9876-5432-1098",
    currentAddress: "456 Commerce Ave, Business District, BD 67890",
    permanentAddress: "456 Commerce Ave, Business District, BD 67890",
    kycStatus: "approved",
    bankDetails: {
      accountNumber: "234567890123",
      accountHolderName: "Sarah Wilson",
      ifscCode: "ICIC0001234",
      bankName: "ICICI Bank",
      branchName: "Business Branch",
    },
    companyBankDetails: {
      accountNumber: "876543210987",
      accountHolderName: "Global Retail Inc",
      ifscCode: "AXIS0001234",
      bankName: "Axis Bank",
      branchName: "Commercial Branch",
    },
    directors: [
      {
        name: "Sarah Wilson",
        mobile: "+1 (555) 987-6543",
        email: "sarah@globalretail.com",
        panCard: "FGHIJ5678K",
      },
    ],
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    verifiedBy: "employee1",
    uploadedBy: "employee1",
  },
  {
    id: "retailer3",
    companyName: "QuickMart Express",
    contactPerson: "Mike Brown",
    email: "mike@quickmart.com",
    phone: "+1 (555) 456-7890",
    businessType: "proprietorship",
    gstNumber: "29LMNOP9012Q3R4",
    panNumber: "LMNOP9012Q",
    aadhaarNumber: "5678-9012-3456",
    currentAddress: "789 Market Square, Downtown, DT 13579",
    permanentAddress: "789 Market Square, Downtown, DT 13579",
    kycStatus: "pending",
    bankDetails: {
      accountNumber: "345678901234",
      accountHolderName: "Mike Brown",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branchName: "Main Branch",
    },
    createdAt: "2024-01-18T11:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
    verifiedBy: undefined,
    uploadedBy: undefined,
  },
];

// Mock documents
export const mockDocuments = [
  {
    id: "doc1",
    retailerId: "retailer1",
    documentType: "aadhaar",
    fileName: "aadhaar_card.pdf",
    fileUrl: "/api/documents/doc1",
    fileSize: "2.3 MB",
    uploadedAt: "2024-01-15T10:35:00Z",
    verifiedAt: "2024-01-16T14:20:00Z",
    verifiedBy: "employee1",
  },
  {
    id: "doc2",
    retailerId: "retailer1",
    documentType: "pan",
    fileName: "pan_card.pdf",
    fileUrl: "/api/documents/doc2",
    fileSize: "1.8 MB",
    uploadedAt: "2024-01-15T10:40:00Z",
    verifiedAt: "2024-01-16T14:20:00Z",
    verifiedBy: "employee1",
  },
  {
    id: "doc3",
    retailerId: "retailer1",
    documentType: "gst",
    fileName: "gst_certificate.pdf",
    fileUrl: "/api/documents/doc3",
    fileSize: "3.1 MB",
    uploadedAt: "2024-01-15T10:45:00Z",
    verifiedAt: undefined,
    verifiedBy: undefined,
  },
  {
    id: "doc4",
    retailerId: "retailer2",
    documentType: "aadhaar",
    fileName: "aadhaar_verified.pdf",
    fileUrl: "/api/documents/doc4",
    fileSize: "2.1 MB",
    uploadedAt: "2024-01-10T09:20:00Z",
    verifiedAt: "2024-01-12T16:45:00Z",
    verifiedBy: "employee1",
  },
  {
    id: "doc5",
    retailerId: "retailer2",
    documentType: "pan",
    fileName: "pan_verified.pdf",
    fileUrl: "/api/documents/doc5",
    fileSize: "1.9 MB",
    uploadedAt: "2024-01-10T09:25:00Z",
    verifiedAt: "2024-01-12T16:45:00Z",
    verifiedBy: "employee1",
  },
];

// Mock employees
export const mockEmployees = [
  {
    id: "emp1",
    userId: "employee1",
    employeeId: "EMP001",
    department: "KYC Compliance",
    targets: { monthly: 50, quarterly: 150 },
    achievements: { completed: 42, successRate: 95 },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "emp2",
    userId: "employee2",
    employeeId: "EMP002",
    department: "Document Verification",
    targets: { monthly: 60, quarterly: 180 },
    achievements: { completed: 55, successRate: 92 },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "emp3",
    userId: "employee3",
    employeeId: "EMP003",
    department: "Customer Support",
    targets: { monthly: 40, quarterly: 120 },
    achievements: { completed: 38, successRate: 98 },
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Add mock users for employees
export const mockEmployeeUsers = [
  { id: "employee2", email: "employee2@crm.com", name: "David Kumar", role: "employee" },
  { id: "employee3", email: "employee3@crm.com", name: "Lisa Chen", role: "employee" },
];

// Combine with existing users
mockUsers.push(...mockEmployeeUsers);

// Update employees with names from users
mockEmployees.forEach(emp => {
  const user = mockUsers.find(u => u.id === emp.userId);
  if (user) {
    emp.name = user.name;
    emp.email = user.email;
  }
});

// Mock stats
export const mockStats = {
  totalRetailers: 247,
  pendingKyc: 18,
  approvedToday: 5,
  activeEmployees: 12,
  assignedTasks: 8,
  completedToday: 3,
  pendingReviews: 5,
};

// Mock audit logs
export const mockAuditLogs = [
  {
    id: "audit1",
    userId: "employee1",
    userName: "Sarah Johnson",
    userRole: "Employee",
    action: "KYC approved for Tech Solutions Ltd",
    entityType: "Retailer",
    entityId: "retailer1",
    details: "Approved KYC application after document verification",
    timestamp: "2024-01-16T14:20:00Z",
  },
  {
    id: "audit2",
    userId: "employee1",
    userName: "Sarah Johnson",
    userRole: "Employee",
    action: "Documents verified for Global Retail Inc",
    entityType: "Document",
    entityId: "doc4",
    details: "Verified Aadhaar and PAN documents",
    timestamp: "2024-01-12T16:45:00Z",
  },
  {
    id: "audit3",
    userId: "admin1",
    userName: "Admin User",
    userRole: "Admin",
    action: "New employee created: David Kumar",
    entityType: "Employee",
    entityId: "emp2",
    details: "Created new employee account with KYC compliance role",
    timestamp: "2024-01-08T10:30:00Z",
  },
  {
    id: "audit4",
    userId: "employee1",
    userName: "Sarah Johnson",
    userRole: "Employee",
    action: "KYC rejected for ABC Traders",
    entityType: "Retailer",
    entityId: "retailer4",
    details: "Rejected due to invalid GST certificate",
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "audit5",
    userId: "retailer1",
    userName: "John Smith",
    userRole: "Retailer",
    action: "KYC application submitted",
    entityType: "Retailer",
    entityId: "retailer1",
    details: "Submitted complete KYC application with all required documents",
    timestamp: "2024-01-15T10:30:00Z",
  },
];
