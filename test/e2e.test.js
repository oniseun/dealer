const supertest = require('supertest');
const chai = require('chai');
const app = require('../src/app');

const expect = chai.expect;
const request = supertest(app);

describe('End-to-End Tests', () => {
  it('GET /contracts/:id - should return a contract for the authenticated profile', async () => {
    // Assuming you have valid authentication headers
    const response = await request.get('/contracts/1').set('profile_id', 1);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('terms');
  });

  it('GET /contracts - should return a list of contracts for the authenticated profile', async () => {
    // Assuming you have valid authentication headers
    const response = await request.get('/contracts').set('profile_id', 1);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('GET /jobs/unpaid - should return a list of unpaid jobs for the authenticated profile', async () => {
    // Assuming you have valid authentication headers
    const response = await request.get('/jobs/unpaid').set('profile_id', 1);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  // Add tests for other routes...

  it('GET /admin/best-profession - should return the best profession', async () => {
    // Assuming you have valid authentication headers and query parameters
    const response = await request.get('/admin/best-profession?start=2023-01-01&end=2023-12-31').set('profile_id', 1);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('profession');
    expect(response.body).to.have.property('totalEarnings');
  });

  it('GET /admin/best-clients - should return the best clients', async () => {
    // Assuming you have valid authentication headers and query parameters
    const response = await request.get('/admin/best-clients?start=2023-01-01&end=2023-12-31&limit=2').set('profile_id', 1);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });
});
