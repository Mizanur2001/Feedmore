const axios = require('axios')
const Noty = require('noty')
export function initAdmin(socket) {
    let orders = []
    let markup

    const orderTableBody = document.getElementById('orderTableBody')
    const totalPriceMarkup = document.getElementById('totalPrice');
    const refresh = document.getElementById('refresh')
    const orderTitle = document.getElementById('orders-title')
    let orderCount = 0

    if (refresh != null) {
        refresh.addEventListener('click', () => {
            location.reload();
        })
    }

    axios.get('/admin/orders/pricecalculation', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        const { dailyTotal } = res.data;

        // Update the totalPriceMarkup element with the totals
        if (totalPriceMarkup) {
            totalPriceMarkup.innerHTML = `
            <h1 class="font-bold text-2xl mb-2 amount">Daily Total: ₹ ${dailyTotal}</h1>
        `;
        }
    }).catch(err => {
        console.log(err)
    })

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        orderCount = orders.length
        markup = generateMarkup(orders)
        if (orderTableBody != null) {
            orderTableBody.innerHTML = markup
            orderTitle.innerText = `All Orders (${orderCount})`;
        }
    }).catch(err => {
        console.log(err)
    })

    const renderItems = (items) => {
        return Object.values(items).map(item => {
            return `<p class="my-2 amount font-bold w-40">${item.items.name} -> ${item.qty}(${item.items.size})</p>`
        }).join('')
    }

    const renderPrice = (items) => {
        let sum = 0;
        Object.values(items).map(item => {
            sum += item.items.price * item.qty
        })
        return `<p class="my-2"> ₹ ${sum}</p>`
    }

    const buildMapsUrl = (address) => {
        if (!address) return '#';
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }

    const buildPhoneUrl = (phone) => {
        if (!phone) return '#';
        const digits = phone.toString().replace(/\D+/g, '');
        return digits ? `tel:${digits}` : '#';
    }

    function generateMarkup(orders) {
        if (orders.length == 0) {
            return `<tr><td class="px-4 py-2"><b>No Oreders :(</b></td></tr>`
        }
        if (orders.includes('<!DOCTYPE html>')) {
            return ``
        }
        return orders.map(order => {
            return `
            <tr>
                <td class="border px-4 py-2">
                    <p class="flex">
                        <span class="material-symbols-outlined">
                            badge
                        </span>
                        ${order._id}
                    </p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>completed</option>
                        </select>
                        </form>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    <div class="flex items-center space-x-2">
                        <span>${order.address}</span>
                        <a class="inline-flex items-center justify-center" href="${buildMapsUrl(order.address)}" target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                            <path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path>
                            </svg>
                        </a>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    <div class="flex items-center space-x-2">
                        <span>${order.phone}</span>
                        <a class="inline-flex items-center justify-center" href="${buildPhoneUrl(order.phone)}" aria-label="Call customer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4h4l2 5-2.5 1.5a13 13 0 006 6L15 14l5 2v4c0 .55-.45 1-1 1A14 14 0 013 5c0-.55.45-1 1-1z" fill="#34A853"/>
                            </svg>
                        </a>
                    </div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">
                    ${order.orderTime && /^[A-Za-z]+, \d{2}-\d{2}-\d{4}, \d{1,2}:\d{2}:\d{2} (am|pm)$/i.test(order.orderTime) ? order.orderTime : new Date(order.createdAt).toGMTString()}
                </td>
                <td class="border px-4 py-2 align-middle">
                    <div class="flex flex-col items-start space-y-1">
                        <span class="text-lg font-semibold py-1 amount">
                            ${renderPrice(order.items)}
                        </span>
                        <span class="inline-block text-xs font-medium px-2 py-0.5 rounded ${order.paymentType == 'COD' ? 'text-black bg-yellow-500' : 'text-white bg-green-400'}">
                            ${order.paymentType}
                        </span>
                    </div>
                </td> 
            </tr>`}).join('')
    }

    //let socket = io()
    socket.on('oderPlaced', (order) => {
        const clintTones = new Audio('/tones/adminNotification.mp3')
        clintTones.play()
        new Noty({
            type: 'success',
            timeout: 2000,
            text: `New Order!`
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ``
        orderTableBody.innerHTML = generateMarkup(orders)
    })


    socket.on('totalOrdersAmount', (Amount) => {
        if (totalPriceMarkup) {
            totalPriceMarkup.innerHTML = `
            <h1 class="font-bold text-2xl mb-2 amount">Daily Total: ₹ ${Amount}</h1>`
        }
    })
}