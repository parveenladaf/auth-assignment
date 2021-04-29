module.exports = {
    id: "/userSchema",
    type: "Object",
    properties: {
        first_name: {
            type: "string",
            description: "firstName",
        },
        last_name: {
            type: "string",
            description: "lastName",
        },
        address: {
            type: "string",
            description: "address",
        },
        mobile_no: {
            type: "string",
            description: "mobileNo",
        },
        password: {
            type: "string",
            description: "password",
        },
        email_id: {
            type: "string",
            format: "email",
            description: "email",
        },
    },
    required: ["first_name", "last_name", "address", "mobile_no", "password", "email_id"],
};