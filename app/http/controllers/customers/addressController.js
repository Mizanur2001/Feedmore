const AddressModal = require('../../../models/addressModel');
const UserModel = require('../../../models/user');
const addressController = () => {
    return {
        addAddressPage: (req, res) => {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            res.render('customers/addAddress', {
                title: 'Add Address - FeedMore',
                formData: { addressType: 'home' }
            });
        },
        addAddress: async (req, res) => {
            try {
                // Validate User Session
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                const { userId, name, phone, addressLine1, addressLine2, city, landmark, postalCode, addressType } = req.body;
                if (!userId || !name || !phone || !addressLine1 || !city || !landmark || !postalCode || !addressType) {
                    req.flash('error', 'All fields are required');
                    return res.status(400).render('customers/addAddress', {
                        formData: req.body
                    })
                }

                // Check User Exit or Not
                const findUser = await UserModel.findById(userId);
                if (!findUser) {
                    req.flash('error', 'User not found');
                    return res.status(400).render('customers/addAddress', {
                        formData: req.body
                    })
                }

                //Check Phone Number Format
                const phoneRegex = /^(\+91)?[0-9]{10}$/;
                if (!phoneRegex.test(phone)) {
                    req.flash('error', 'Invalid phone number');
                    return res.status(400).render('customers/addAddress', {
                        formData: req.body
                    })
                }

                //Check Postal Code Format
                const postalCodeRegex = /^[0-9]{6}$/;
                if (!postalCodeRegex.test(postalCode)) {
                    req.flash('error', 'Invalid postal code');
                    return res.status(400).render('customers/addAddress', {
                        formData: req.body
                    })
                }

                //Add Address
                const addressInfoObj = {
                    phone: phone,
                    addressLine1: addressLine1,
                    addressLine2: addressLine2 || '',
                    city: city,
                    landmark: landmark,
                    postalCode: postalCode,
                    addressType: addressType
                };

                const existingAddress = await AddressModal.findOne({ userId: userId });

                if (existingAddress) {
                    // Append to addressInfo array
                    existingAddress.addressInfo.push(addressInfoObj);
                    await existingAddress.save();
                    req.flash('success', 'Address added successfully');
                    return res.status(201).redirect('/cart');
                } else {
                    // Create new address document
                    const address = new AddressModal({
                        userId: userId,
                        name: name,
                        addressInfo: [addressInfoObj]
                    });
                    await address.save();
                    req.flash('success', 'Address added successfully');
                    return res.status(201).redirect('/cart');
                }

            } catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error,
                    code: 500
                });
            }
        },
        editAddressPage: async (req, res) => {
            if (!req.session.user) {
                return res.redirect('/login')
            }

            const { id } = req.params;

            const address = await AddressModal.findOne({ userId: req.session.user.userId });
            if (!address) {
                return res.status(404).redirect('/cart');
            }

            const addressInfo = address.addressInfo.id(id);
            if (!addressInfo) {
                return res.status(404).redirect('/cart');
            }

            res.render('customers/editAddress', {
                addressInfo: addressInfo,
                title: 'Edit Address - FeedMore',
            });


        },
        updateAddress: async (req, res) => {
            try {
                // Validate User Session
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                const { userId, addressId, phone, addressLine1, addressLine2, city, landmark, postalCode, addressType } = req.body;
                if (!userId || !addressId || !phone || !addressLine1 || !city || !landmark || !postalCode || !addressType) {
                    req.flash('error', 'All fields are required');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                // Check User Exit or Not
                const findUser = await UserModel.findById(userId);
                if (!findUser) {
                    req.flash('error', 'User not found');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                //Check Phone Number Format
                const phoneRegex = /^(\+91)?[0-9]{10}$/;
                if (!phoneRegex.test(phone)) {
                    req.flash('error', 'Invalid Phone Number');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                //Check Postal Code Format
                const postalCodeRegex = /^[0-9]{6}$/;
                if (!postalCodeRegex.test(postalCode)) {
                    req.flash('error', 'Invalid Postal Code');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                // Find Address and Update
                const address = await AddressModal.findOne({ userId: userId });
                if (!address) {
                    req.flash('error', 'Address not found');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                const addressInfo = address.addressInfo.id(addressId);
                if (!addressInfo) {
                    req.flash('error', 'Address info not found');
                    return res.redirect(`customers/edit-address/${addressId}`);
                }

                // Update Address Info
                addressInfo.phone = phone;
                addressInfo.addressLine1 = addressLine1;
                addressInfo.addressLine2 = addressLine2 || '';
                addressInfo.city = city;
                addressInfo.landmark = landmark;
                addressInfo.postalCode = postalCode;
                addressInfo.addressType = addressType;

                await address.save();

                return res.redirect('/cart');

            } catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error,
                    code: 500
                });
            }
        }
    }
}

module.exports = addressController;