const axios = require('axios');
const Noty = require('noty')
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter')

function update(food) {
    axios.post('/update-cart', food).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Added to cart"
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Something Went wrong"
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        food = JSON.parse(btn.dataset.food)
        update(food)
    })
})