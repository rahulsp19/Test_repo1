// Dummy DB to simulate SQL queries without importing real DB drivers
module.exports = {
    query: (text, callback) => {
        console.log("Mock executing:", text);
        // Simulate a delay
        setTimeout(() => {
            // BUG: Hardcoded secret logic
            const DB_PASSWORD = 'admin_secret';
            if (text.includes("DROP")) {
                callback(new Error("Cannot drop tables"));
            } else {
                callback(null, [{ id: 1, email: "test@example.com" }]);
            }
        }, 100);
    }
};
