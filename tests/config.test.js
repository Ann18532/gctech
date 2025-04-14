const mongoose = require('mongoose');
const ERPConfig = require('../src/core/config/configModel');

describe('ERP Config Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_universal_erp');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and retrieve ERP config', async () => {
    const config = new ERPConfig({
      email: 'test@example.com',
      provider: 'bamboohr',
      baseURL: 'https://api.bamboohr.com',
      auth: {
        type: 'Bearer',
        token: 'mock-token'
      },
      endpoints: {
        employees: '/employees-directory'
      }
    });

    await config.save();

    const found = await ERPConfig.findOne({ email: 'test@example.com' });
    expect(found.provider).toBe('bamboohr');
    expect(found.auth.token).toBe('mock-token');
  });
});
