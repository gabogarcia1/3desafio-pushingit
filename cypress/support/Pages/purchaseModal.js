export class PurchaseModal{
    constructor(){
        this.name = '#name'
        this.creditCard = '#creditCard'
        this.totalPrice = '#totalPrice'
    }
    verificarNombre(nombre,apellido)
    {
        cy.get(this.name).should('have.text',`${nombre} ${apellido} has succesfully purchased the following items:`)
    }
    verificaProducto(producto)
    {
        cy.get(`#${producto}`).should('have.length',1)
    }
    verificarCreditCard(creditCard){
        cy.get(this.creditCard).should('have.text',`${creditCard}`)
    }
    verificarPrecioTotal(precioTotal){
        cy.get(this.totalPrice).should('have.text',`You have spent $${precioTotal}`)
    }

}