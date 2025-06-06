const axios = require('axios');
const Noty = require('noty')
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter')
const deleteItems = document.querySelectorAll('.deleteItems')
const alert = document.getElementById('success-alert')
const initAdmin = require('./admin')
const availableItems = require('./availavle')

function update(food) {
    axios.post('/update-cart', food).then(res => {
        if (res.data.message) {
            new Noty({
                type: 'error',
                timeout: 3000,
                text: "You need to Login First"
            }).show();
        }
        else if (res.data.availableFoodMsg) {
            new Noty({
                type: 'error',
                timeout: 3000,
                text: "This food is not available"
            }).show();
        }
        else {
            cartCounter.innerText = res.data.totalQty
            new Noty({
                type: 'success',
                timeout: 1000,
                text: "Added to cart"
            }).show();
            refreshCartButton();
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

//Update the floating cart button
function refreshCartButton() {
    axios.get('/cart-info').then(res => {
        const data = res.data;
        const cartSection = document.getElementById('cart-btn-section');
        if (!cartSection) return;
        if (data.count && data.count > 0) {
            let imagesHtml = '';
            (data.images.length ? data.images.slice(0, 3) : [{ image: 'placeholder.png' }]).forEach(function (item) {
                imagesHtml += `<img src="/img/${item.image}" alt="item" class="w-10 h-10 rounded-full border-2 border-white bg-white object-cover">`;
            });
            cartSection.innerHTML = `
                <a href="/cart">
                    <button class="flex items-center btn-orange transition px-4 py-3 rounded-full text-white font-bold shadow-lg min-w-[260px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        <div class="flex -space-x-2 mr-4">${imagesHtml}</div>
                        <div class="flex flex-col items-start flex-1">
                            <span class="text-lg font-semibold">View cart</span>
                            <span class="text-xs font-normal">${data.count || 0} Items</span>
                        </div>
                        <svg class="w-6 h-6 ml-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </a>
            `;
            cartSection.style.display = 'flex';
        } else {
            cartSection.innerHTML = '';
            cartSection.style.display = 'none';
        }
    });
}

// If the DOM is refreshe the floating cart will not disappear
document.addEventListener('DOMContentLoaded', function () {
    refreshCartButton();
});

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

// Cart - Address Set to Hidden Input (Address input and Phone input)
const form = document.querySelector('form[action="/orders"]');
if (form) {
    form.addEventListener('submit', function (e) {
        // e.preventDefault(); // Prevent form from submitting right away

        const selectedAddressInput = document.querySelector('input[name="selectedAddress"]:checked');
        if (selectedAddressInput) {
            const selectedAddress = JSON.parse(selectedAddressInput.value);
            const {
                addressLine1,
                addressLine2,
                landmark,
                city,
                postalCode,
                phone,
            } = selectedAddress;

            const Address = addressLine1 + "," + addressLine2 + "," + landmark + "," + city + "-" + postalCode;

            // Set the Value of the Address input field
            const addressInputElement = document.getElementById('address_input');
            addressInputElement.value = Address;

            //Set the phone number input field
            const phoneInputElement = document.getElementById('phone_input');
            phoneInputElement.value = phone;
        } else {
            e.preventDefault();
            new Noty({
                type: 'error',
                timeout: 1000,
                text: "No Address Selected"
            }).show();
            // console.log("No address selected");
        }
    });
}


// Add Address - Highlighting the selected address type
document.addEventListener('DOMContentLoaded', function () {
    const labels = [
        document.getElementById('label-home'),
        document.getElementById('label-work'),
        document.getElementById('label-other')
    ].filter(Boolean);

    if (labels.length === 0) return;

    const spans = labels.map(l => l.querySelector('span'));
    const svgs = labels.map(l => l.querySelector('svg'));
    const radios = document.querySelectorAll('input[name="addressType"]');

    // --- ADD THIS BLOCK: set highlight on page load ---
    radios.forEach((radio, idx) => {
        if (radio.checked) {
            labels[idx].classList.add('bg-orange-50');
            labels[idx].classList.remove('bg-white');
            spans[idx].classList.add('text-orange-500');
            spans[idx].classList.remove('text-gray-700');
            svgs[idx].classList.add('text-orange-500');
            svgs[idx].classList.remove('text-gray-400');
        } else {
            labels[idx].classList.remove('bg-orange-50');
            labels[idx].classList.add('bg-white');
            spans[idx].classList.remove('text-orange-500');
            spans[idx].classList.add('text-gray-700');
            svgs[idx].classList.remove('text-orange-500');
            svgs[idx].classList.add('text-gray-400');
        }
    });
    // --- END BLOCK ---

    labels.forEach((label, idx) => {
        label.addEventListener('click', function () {
            labels.forEach((l, i) => {
                l.classList.remove('bg-orange-50');
                l.classList.add('bg-white');
                spans[i].classList.remove('text-orange-500');
                spans[i].classList.add('text-gray-700');
                svgs[i].classList.remove('text-orange-500');
                svgs[i].classList.add('text-gray-400');
            });
            this.classList.add('bg-orange-50');
            this.classList.remove('bg-white');
            spans[idx].classList.add('text-orange-500');
            spans[idx].classList.remove('text-gray-700');
            svgs[idx].classList.add('text-orange-500');
            svgs[idx].classList.remove('text-gray-400');
            radios[idx].checked = true;
        });
    });
});



//Socket
let socket = io()
if (orders) {
    socket.emit('join', `oredr_${orders._id}`)
}

socket.on(`updateStatus`, (data) => {
    const updatedStatus = { ...orders }
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
if (adminPath.includes('admin')) {
    initAdmin.initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

//Admin Availavle controllers
availableItems.availableItems()