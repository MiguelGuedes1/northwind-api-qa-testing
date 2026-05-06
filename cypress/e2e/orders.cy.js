const baseUrl = 'http://localhost:3000/api'

describe('Orders API', () => {

  it('GET /orders - should return 200 and array of orders', () => {
    cy.request('GET', `${baseUrl}/orders`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)
      expect(response.body[0]).to.have.property('OrderID')
      expect(response.body[0]).to.have.property('CustomerID')
      expect(response.body[0]).to.have.property('OrderDate')
    })
  })

  it('GET /orders/:id - should return correct order', () => {
    cy.request('GET', `${baseUrl}/orders/10248`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body.OrderID).to.eq(10248)
    })
  })

  it('GET /orders/:id - should return 404 for invalid ID', () => {
    cy.request({ method: 'GET', url: `${baseUrl}/orders/99999`, failOnStatusCode: false })
    .then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.error).to.eq('Order not found')
    })
  })

})