const KNOWN_SERVICES = {
    invoices: ['invoice', 'billing', 'bill'],
    employees: ['employee', 'emp', 'user', 'staff'],
    customers: ['customer', 'client', 'cust'],
    products: ['product', 'item', 'catalog'],
    vendors: ['vendor', 'supplier']
  };
  
function detectERPServices(endpoints = {}) {
    //here ai model to detect service out of 5
    //logic to implement what to do if not found
    const detected = {};
  
    Object.entries(endpoints).forEach(([key, path]) => {
      const combined = `${key} ${path}`.toLowerCase();
      
      for (const [universalService, keywords] of Object.entries(KNOWN_SERVICES)) {
        for (const keyword of keywords) {
          if (combined.includes(keyword)) {
            detected[key] = universalService;
            break;
          }
        }
      }
  
      if (!detected[key]) {
        detected[key] = 'unknown';
      }

    });
  
    return detected;
  }
  
  module.exports = { detectERPServices };
  