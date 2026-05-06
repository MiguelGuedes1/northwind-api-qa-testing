const baseUrl = 'http://localhost:3000/api'

describe('Employees API', () => {

  it('GET /employees - should return 200 and array of employees', () => {
    cy.request('GET', `${baseUrl}/employees`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)
      expect(response.body[0]).to.have.property('EmployeeID')
      expect(response.body[0]).to.have.property('FirstName')
      expect(response.body[0]).to.have.property('LastName')
    })
  })

  it('GET /employees/:id - should return correct employee', () => {
    cy.request('GET', `${baseUrl}/employees/1`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body.EmployeeID).to.eq(1)
      expect(response.body).to.have.property('FirstName')
      expect(response.body).to.have.property('LastName')
    })
  })

  it('GET /employees/:id - should return 404 for invalid ID', () => {
    cy.request({ method: 'GET', url: `${baseUrl}/employees/9999`, failOnStatusCode: false })
    .then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.error).to.eq('Employee not found')
    })
  })

})