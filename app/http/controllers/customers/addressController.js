const AddressModal = require('../../../models/addressModel');
const UserModel = require('../../../models/user');
const addressController = () => {
    return {
        getAddress: async (req, res) => {
            try {
                // Validate User ID
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                const { userId } = req.params;
                if (!userId) {
                    return res.status(400).json({
                        message: "User ID is required",
                        code: 400
                    });
                }

                // Check User Exit or Not
                const findUser = await UserModel.findById(userId);
                if (!findUser) {
                    return res.status(400).json({
                        message: "User not found",
                        code: 400
                    });
                }

                // Get Address
                const address = await AddressModal.findOne({ userId: userId });
                if (!address) {
                    return res.status(404).json({
                        message: "Address not found",
                        code: 404
                    });
                }

                return res.status(200).json({
                    message: "Address retrieved successfully",
                    data: address,
                    code: 200
                });

            } catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error,
                    code: 500
                });
            }
        },
        addAddress: async (req, res) => {
            //==================================
            // toDo : validate user session
            //==================================
            try {
                const { userId, name, phone, addressLine1, addressLine2, city, landmark, postalCode, addressType } = req.body;
                if (!userId || !name || !phone || !addressLine1 || !city || !landmark || !postalCode || !addressType) {
                    return res.status(400).json({
                        message: "All fields are required",
                        code: 400
                    });
                }

                // Check User Exit or Not
                const findUser = await UserModel.findById(userId);
                if (!findUser) {
                    return res.status(400).json({
                        message: "User not found",
                        code: 400
                    });
                }

                //Check Phone Number Format
                const phoneRegex = /^(\+91)?[0-9]{10}$/;
                if (!phoneRegex.test(phone)) {
                    return res.status(400).json({
                        message: "Invalid phone number format",
                        code: 400
                    });
                }

                //Check Postal Code Format
                const postalCodeRegex = /^[0-9]{6}$/;
                if (!postalCodeRegex.test(postalCode)) {
                    return res.status(400).json({
                        message: "Invalid postal code format",
                        code: 400
                    });
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
                    return res.status(201).json({
                        message: "Address added successfully",
                        code: 201
                    });
                } else {
                    // Create new address document
                    const address = new AddressModal({
                        userId: userId,
                        name: name,
                        addressInfo: [addressInfoObj]
                    });
                    await address.save();
                    return res.status(201).json({
                        message: "Address added successfully",
                        code: 201
                    });
                }

            } catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error,
                    code: 500
                });
            }
        },
        updateAddress: async (req, res) => {
            try {
                //==================================
                // toDo : validate user session
                //==================================
                const { userId, addressId, phone, addressLine1, addressLine2, city, landmark, postalCode, addressType } = req.body;
                if (!userId || !addressId || !phone || !addressLine1 || !city || !landmark || !postalCode || !addressType) {
                    return res.status(400).json({
                        message: "All fields are required",
                        code: 400
                    });
                }

                // Check User Exit or Not
                const findUser = await UserModel.findById(userId);
                if (!findUser) {
                    return res.status(400).json({
                        message: "User not found",
                        code: 400
                    });
                }

                //Check Phone Number Format
                const phoneRegex = /^(\+91)?[0-9]{10}$/;
                if (!phoneRegex.test(phone)) {
                    return res.status(400).json({
                        message: "Invalid phone number format",
                        code: 400
                    });
                }

                //Check Postal Code Format
                const postalCodeRegex = /^[0-9]{6}$/;
                if (!postalCodeRegex.test(postalCode)) {
                    return res.status(400).json({
                        message: "Invalid postal code format",
                        code: 400
                    });
                }

                // Find Address and Update
                const address = await AddressModal.findOne({ userId: userId });
                if (!address) {
                    return res.status(404).json({
                        message: "Address not found",
                        code: 404
                    });
                }

                const addressInfo = address.addressInfo.id(addressId);
                if (!addressInfo) {
                    return res.status(404).json({
                        message: "Address info not found",
                        code: 404
                    });
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

                return res.status(200).json({
                    message: "Address updated successfully",
                    code: 200
                });

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