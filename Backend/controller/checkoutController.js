const TelegramBot = require("node-telegram-bot-api");
const db = require('../database/db')
// Replace with your real bot token
const token = "8043221726:AAHUtbYbW3ZVxW9HAl9eFGOdEv-6twMmH3A";
const bot = new TelegramBot(token, { polling: false });
const chat_id = 1698102973; // your Telegram ID

const orderController = async (req, res) => {
    const { userName, phone, products, total, address } = req.body;

    // Validate input
    if (!userName || !phone || !products || !total || !address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Save to database (without address)
    const sql = `INSERT INTO dborder (userName, phone, products, total) VALUES (?, ?, ?, ?)`;
    const values = [userName, phone, JSON.stringify(products), total];

    db.query(sql, values, async (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        const orderId = result.insertId;

        // Send to Telegram
        try {
            const productText = products
                .map((p, i) => `${i + 1}. ${p.title} x${p.quantity} = $${p.price * p.quantity}`)
                .join("\n");

            // Format address as clickable Google Maps link
            let addressText = "";
            if (address.lat && address.lng) {
                addressText = `<a href="https://www.google.com/maps?q=${address.lat},${address.lng}">View on Map</a>`;
            } else {
                addressText = address; // fallback if string
            }

            const message = `
🛒 <b>New Order</b>

👤 <b>Name:</b> ${userName}
📞 <b>Phone:</b> ${phone}
📍 <b>Address:</b> ${addressText}

📦 <b>Products:</b>
${productText}

💰 <b>Total:</b> $${total}
🆔 <b>Order ID:</b> ${orderId}
`;

            await bot.sendMessage(chat_id, message, { parse_mode: "HTML", disable_web_page_preview: false });

            res.status(200).json({ message: "Order saved to DB and sent to Telegram ✅", orderId });
        } catch (tgErr) {
            console.error("Telegram Error:", tgErr);
            res.status(500).json({ message: "Order saved to DB but failed to send Telegram", error: tgErr.message });
        }
    });
};
const get_all_order = (req, res) => {
    const sql = "SELECT * FROM dborder ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
        
        if (result.length > 0) {
            // បំប្លែង string ទៅជា JSON Object សម្រាប់រាល់ row ទាំងអស់
            const formattedData = result.map(item => {
                return {
                    ...item,
                    products: JSON.parse(item.products) // កន្លែងនេះគឺសំខាន់បំផុត
                };
            });

            res.status(200).json({
                status: true,
                message: "Get data successfully!",
                data: formattedData
            });
        } else {
            res.status(404).json({ status: false, message: "No data found" });
        }
    });
};
module.exports = { 
  orderController ,
  get_all_order
};
