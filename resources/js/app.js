const axios = require('axios');
const Noty = require('noty')
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter')
const deleteItems = document.querySelectorAll('.deleteItems')
const alert = document.getElementById('success-alert')
const initAdmin = require('./admin')

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
if (alert) {
    setTimeout(() => {
        alert.remove()
    }, 3000);
}



//Order Status change functionality
const status_line = document.querySelectorAll('.status_line');
const StatusChangeHInput = document.getElementById('StatusChangeHInput');
let orders = StatusChangeHInput ? StatusChangeHInput.value : null
orders = JSON.parse(orders)

const updateStatus = (orders) => {
    status_line.forEach(status => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepComplete = true
    status_line.forEach(status => {
        if (stepComplete) {
            status.classList.add('step-completed')
        }
        if (status.dataset.status == orders.status) {
            stepComplete = false
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}


updateStatus(orders)

//Socket
let socket = io()
initAdmin.initAdmin(socket)
if (orders) {
    socket.emit('join', `oredr_${orders._id}`)
}

socket.on(`updateStatus`,(data)=>{
    const updatedStatus = {...orders}
    updatedStatus.status = data.status
    updateStatus(updatedStatus)
    new Noty({
        type: 'success',
        timeout: 2000,
        text: `${data.status}`
    }).show();
    const clintTones = new Audio('/tones/clint.mp3')
    clintTones.play()
})


//Admin Socket 
let adminPath = window.location.pathname
if(adminPath.includes('admin')){
    socket.emit('join','adminRoom')
}