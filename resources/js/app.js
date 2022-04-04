const axios = require('axios');
const Noty = require('noty')
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter')
const deleteItems = document.querySelectorAll('.deleteItems')
const alert = document.getElementById('success-alert')
const initAdmin =require('./admin')

function update(food) {
    axios.post('/update-cart', food).then(res => {
        if (res.data.message) {
            new Noty({
                type: 'error',
                timeout: 3000,
                text: "You need to Login First"
            }).show();
        }
        else {
            cartCounter.innerText = res.data.totalQty
            new Noty({
                type: 'success',
                timeout: 1000,
                text: "Added to cart"
            }).show();
        }   
        //console.log(res.data.message)
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Something Went wrong"
        }).show();
    })
}

function delItems(items) {
    axios.post('/delete-items', items).then(res => {
        let count = res.data
        if (count == 0) {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: "No Items to be deleted"
            }).show();
        }
        else {
            new Noty({
                type: 'success',
                timeout: 1000,
                text: "Items Deleted"
            }).show();
        }
        location.reload(true);
        //console.log(res.data)
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        food = JSON.parse(btn.dataset.food)
        update(food)
    })
})

deleteItems.forEach((delBtn) => {
    delBtn.addEventListener('click', (e) => {
        let items = (JSON.parse(delBtn.dataset.items))
        delItems(items)
    })
})

// Vanishing Alert After 3 second
if(alert){
    setTimeout(() => {
        alert.remove()
    }, 3000);
}

initAdmin.initAdmin()