const axios = require('axios')
export function availableItems() {
    const availableOptions = document.querySelectorAll('.availableOptions')
    axios.get('/admin/available', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        let allFoods = res.data
        let len = 0;
        availableOptions.forEach(e => {
            e.innerHTML = `
                 <option value="available" ${allFoods[len].availability === 'available' ? 'selected' : ''}>Available</option>
                 <option value="unavailable" ${allFoods[len].availability === 'unavailable' ? 'selected' : ''}>Unavailable</option>
        `;
            len++;
        })
    }).catch(err => {
        console.log(err)
    })
}