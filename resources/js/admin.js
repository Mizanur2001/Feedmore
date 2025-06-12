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
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">${order.phone}</td>
                <td class="border px-4 py-2">${new Date(order.createdAt).toGMTString()}</td>
                <td class="border px-4 py-2 align-middle">
                    <div class="flex flex-col items-start space-y-1">
                        <span class="text-lg font-semibold py-1 amount">
                            ${renderPrice(order.items)}
                        </span>
                        <span class="inline-block text-xs font-medium text-black bg-yellow-500 px-2 py-0.5 rounded">
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