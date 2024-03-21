import { ProductsPage } from "../support/Pages/productsPage";
import { HomePage } from "../support/Pages/homePage";
import { ShoppingCart } from "../support/Pages/shoppingCart";
import { CheckoutPage } from "../support/Pages/checkOutPage";
import { PurchaseModal } from "../support/Pages/purchaseModal";

describe("template spec", () => {
  let productos, datosUsuario, purchaseCompleted;
  const productPage = new ProductsPage();
  const homePage = new HomePage();
  const shoppingCart = new ShoppingCart();
  const checkoutPage = new CheckoutPage();
  const purchaseModal = new PurchaseModal();

  before(() => {
    cy.login(Cypress.env().usuario, Cypress.env().password);
    cy.visit("");
    cy.fixture("../fixtures/products").then((data) => {
      productos = data;
    });
    cy.fixture("../fixtures/userData").then((data) => {
      datosUsuario = data;
    });
  });
  after(() => {
    cy.eliminarProducto(productos.product.id);
  });

  it("Editar producto y verificar los datos", () => {
    cy.eliminarProducto(productos.product.id);
    cy.eliminarProducto(productos.product2.id);

    cy.crearProducto(productos.product);
    cy.crearProducto(productos.product2);

    const query = (id) => `SELECT s.id, 
                            s."firstName", 
                            s."lastName", 
                            s."cardNumber", 
                            pp."id",
                            pp."product",
                            pp."quantity",
                            pp."total_price",
                            pp."sell_id" 
                        FROM 
                            public."sells" s 
                        JOIN 
                            public."purchaseProducts" pp ON s.id = pp.sell_id
                        WHERE 
                            s.id = ${id};`;
    homePage.clickOnlineShop();
    productPage.selectFilterById();
    productPage.filterProductById(productos.product.id);
    productPage.addToCartById(productos.product.id);
    cy.get("p")
      .contains(`${productos.product.name} has been added to the shopping cart`)
      .should("exist");
    productPage.deleteSearchBar();
    productPage.filterProductById(productos.product2.id);
    productPage.addToCartById(productos.product2.id);
    cy.get("p")
      .contains(
        `${productos.product2.name} has been added to the shopping cart`
      )
      .should("exist");

    productPage.goToShoppingCart();
    shoppingCart.goToCheckOutPage();
    checkoutPage.completeFirstName(datosUsuario.nombre);
    checkoutPage.completeLastName(datosUsuario.apellido);
    checkoutPage.completeCreditCardNumber(datosUsuario.creditCardNumber);
    checkoutPage.clickOnPurchase();
    cy.intercept("POST", "https://pushing-it.onrender.com/api/purchase").as(
      "purchase"
    );
    cy.wait(5000);
    cy.wait("@purchase", { timeout: 10000 }).then((res) => {
      purchaseCompleted = res.response.body.product;
      cy.task("connectDB", query(purchaseCompleted.sellid)).then((products) => {
        for (let i = 0; i < products.length; i++) {
          expect(products[i].cardNumber).to.be.equal(
            purchaseCompleted.cardNumber
          );
          expect(products[i].firstName).to.be.equal(
            purchaseCompleted.firstName
          );
          expect(products[i].lastName).to.be.equal(purchaseCompleted.lastName);
          expect(products[i].product).to.be.equal(
            purchaseCompleted.products[i].product
          );
          expect(parseFloat(products[i].total_price)).to.deep.equal(
            parseFloat(purchaseCompleted.products[i].total_price)
          );
          expect(products[i].quantity).to.be.equal(
            purchaseCompleted.products[i].quantity
          );
        }
      });
    });

    purchaseModal.verificarNombre(datosUsuario.nombre, datosUsuario.apellido);
    purchaseModal.verificaProducto(productos.product.name);
    purchaseModal.verificaProducto(productos.product2.name);
    purchaseModal.verificarCreditCard(datosUsuario.creditCardNumber);
  });
});
