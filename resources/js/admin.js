const axios = require('axios')
export function initAdmin() {
    let orders = []
    let markup

    const orderTableBody = document.getElementById('orderTableBody')

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup

    }).catch(err => {
        console.log(err)
    })

    const renderItems = (items) => {
        return Object.values(items).map(item => {
            return `<p class="my-2">${item.items.name} -> ${item.qty}</p>`
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
            <tr>
                <td class="border px-4 py-2">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">${order.phone}</td>
                <td class="border px-4 py-2">
                    <div>
                        <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>completed</option>
                        </select>
                        </form>
                    </div>
                </td>
                <td class="border px-4 py-2">${new Date(order.createdAt).toGMTString()}</td>
            </tr>`}).join('')
    }
}