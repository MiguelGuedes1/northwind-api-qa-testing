const baseUrl = 'http://localhost:3000/api'

describe('Customers API', () => {

  before(() => {
    cy.request({ method: 'DELETE', url: `${baseUrl}/customers/TESTE`, failOnStatusCode: false })
  })

  it('GET /customers - should return 200 and array of customers', () => {
    cy.request('GET', `${baseUrl}/customers`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.eq(91)
      expect(response.body[0]).to.have.property('CustomerID')
      expect(response.body[0]).to.have.property('CompanyName')
    })
  })

  it('GET /customers/:id - should return correct customer', () => {
    cy.request('GET', `${baseUrl}/customers/ALFKI`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body.CustomerID).to.eq('ALFKI')
      expect(response.body.CompanyName).to.eq('Alfreds Futterkiste')
    })
  })

  it('GET /customers/:id - should return 404 for invalid ID', () => {
    cy.request({ method: 'GET', url: `${baseUrl}/customers/XXXXX`, failOnStatusCode: false })
    .then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.error).to.eq('Customer not found')
    })
  })

  it('POST /customers - should create a new customer', () => {
    cy.request('POST', `${baseUrl}/customers`, {
      CustomerID: 'TESTE',
      CompanyName: 'Miguel QA Company',
      ContactName: 'Miguel Guedes',
      ContactTitle: 'QA Engineer',
      City: 'Porto',
      Country: 'Portugal'
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Customer created successfully')
    })
  })

  it('PUT /customers/:id - should update customer', () => {
    cy.request('PUT', `${baseUrl}/customers/TESTE`, {
      CompanyName: 'Miguel QA Company Updated',
      ContactName: 'Miguel Guedes',
      ContactTitle: 'Senior QA Engineer',
      City: 'Lisboa',
      Country: 'Portugal'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Customer updated successfully')
    })
  })

  it('DELETE /customers/:id - should delete customer', () => {
    cy.request('DELETE', `${baseUrl}/customers/TESTE`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Customer deleted successfully')
    })
  })

  it('DELETE /customers/:id - should return 404 for invalid ID', () => {
    cy.request({ method: 'DELETE', url: `${baseUrl}/customers/XXXXX`, failOnStatusCode: false })
    .then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.error).to.eq('Customer not found')
    })
  })

})