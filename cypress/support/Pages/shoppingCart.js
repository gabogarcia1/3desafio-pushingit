export class ShoppingCart{
    constructor(){
        this.goToCheckOut="#goCheckout"

    }

    goToCheckOutPage(){
        cy.get(this.goToCheckOut).click()
    }


}