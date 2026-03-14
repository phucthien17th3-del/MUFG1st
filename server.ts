import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    avatar TEXT,
    balance REAL,
    vip TEXT,
    isVirtual INTEGER,
    isBetBlocked INTEGER,
    withdrawBlockStatus TEXT,
    inviteCode TEXT,
    referredBy TEXT,
    bankName TEXT,
    bankAccount TEXT,
    bankOwner TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    userId TEXT,
    nickname TEXT,
    avatar TEXT,
    content TEXT,
    addtime TEXT,
    timestamp INTEGER,
    isService INTEGER,
    isRead INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    room TEXT,
    expect TEXT,
    betCode TEXT,
    amount REAL,
    status TEXT,
    result TEXT,
    time TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    username TEXT,
    type TEXT, -- 'deposit' or 'withdraw'
    amount REAL,
    status TEXT, -- 'pending', 'approved', 'rejected'
    time TEXT,
    bankName TEXT,
    bankAccount TEXT,
    bankOwner TEXT,
    isRead INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

// Initialize settings if not exists
const existingSettings = db.prepare("SELECT * FROM settings WHERE id = 'platform'").get();
if (!existingSettings) {
  const defaultSettings = {
    announcement: {
      depositTime: "11:00 - 00:00",
      withdrawTime: "12:00 - 00:00",
      serviceTime: "10:00 - 00:00",
      message: "TRƯỚC KHI NỘP TIỀN VUI LÒNG VÀO DỊCH VỤ CHĂM SÓC KHÁCH HÀNG XIN SỐ TÀI KHOẢN NGÂN HÀNG"
    },
    vip1: {
      min: 100000,
      max: 500000000,
      botMin: 1000000,
      botMax: 200000000
    },
    vip2: {
      min: 150000000,
      max: 500000000,
      botMin: 150000000,
      botMax: 500000000
    }
  };
  db.prepare("INSERT INTO settings (id, data) VALUES (?, ?)").run('platform', JSON.stringify(defaultSettings));
}

// Initialize admin user if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  db.prepare(`
    INSERT INTO users (id, username, password, avatar, balance, vip, isVirtual, isBetBlocked, withdrawBlockStatus, inviteCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('admin', 'admin', 'admin123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 0, 'Platinum', 0, 0, 'none', 'admin');
}

// Migrations for existing databases
try { db.exec("ALTER TABLE users ADD COLUMN bankName TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN bankAccount TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN bankOwner TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE messages ADD COLUMN isRead INTEGER DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE messages ADD COLUMN timestamp INTEGER"); } catch (e) {}
try { db.exec("ALTER TABLE transactions ADD COLUMN bankName TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE transactions ADD COLUMN bankAccount TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE transactions ADD COLUMN bankOwner TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE transactions ADD COLUMN isRead INTEGER DEFAULT 0"); } catch (e) {}
try { db.exec("UPDATE messages SET timestamp = strftime('%s', 'now') * 1000 WHERE timestamp IS NULL"); } catch (e) {}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = process.env.PORT || 3000;

// robots.txt cho bot Google
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://mufg-server.onrender.com/sitemap.xml`);
});

  // Auto-delete messages from previous days every hour
  setInterval(() => {
    try {
      const now = new Date();
      // Get timestamp for the start of today (midnight)
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const result = db.prepare("DELETE FROM messages WHERE timestamp < ?").run(todayMidnight);
      if (result.changes > 0) {
        console.log(`Auto-deleted ${result.changes} old messages from previous days.`);
        io.emit("messages_cleaned");
      }
    } catch (e) {
      console.error("Auto-delete messages error:", e);
    }
  }, 3600000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
app.use(express.static(path.join(process.cwd(), "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/index.html"));
});
  }

  // Socket.io logic
  io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

    // Initial data sync
    socket.on("get_initial_data", (userId) => {

  socket.userId = userId;   // thêm dòng này

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100").all();

  const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY time DESC").all(userId);

  const transactions = db.prepare("SELECT * FROM transactions WHERE userId = ? ORDER BY time DESC").all(userId);

  const settingsRow = db.prepare("SELECT * FROM settings WHERE id = 'platform'").get();

  const settings = settingsRow ? JSON.parse(settingsRow.data) : null;

  socket.emit("initial_data", { 
    user,
    messages,
    orders,
    transactions,
    settings,
    lottery: {
      vip1: vip1State,
      vip2: vip2State
    }
  });

});

socket.on("admin_get_all_orders", (adminId) => {

  const admin = db.prepare("SELECT * FROM users WHERE id = ?").get(adminId);

  if (admin && admin.username === "admin") {

    const orders = db.prepare("SELECT * FROM orders ORDER BY time DESC").all();

    socket.emit("admin_all_orders", orders);

  }

});

socket.on("admin_get_user_orders", (data) => {

  const admin = db.prepare("SELECT * FROM users WHERE id = ?").get(data.adminId);

  if (admin && admin.username === "admin") {

    const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY time DESC").all(data.userId);

    socket.emit("admin_user_orders", orders);

  }

});

    socket.on("update_platform_settings", (settings) => {
      try {
        db.prepare("UPDATE settings SET data = ? WHERE id = 'platform'").run(JSON.stringify(settings));
        io.emit("platform_settings_updated", settings);
      } catch (e) {
        console.error("Update platform settings error:", e);
      }
    });

   socket.on("place_order", (order) => {

  io.to(order.room).emit("global_trade_notice", order);

  try {
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(order.userId);
        if (!user || user.balance < order.amount) return;

        const newBalance = user.balance - order.amount;
        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, order.userId);

        const stmt = db.prepare(`
          INSERT INTO orders (id, userId, room, expect, betCode, amount, status, time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          order.id,
          order.userId,
          order.room,
          order.expect,
          order.betCode,
          order.amount,
          order.status,
          order.time
        );
        io.to(order.room).emit("new_order", order);
        io.emit("user_updated", { ...user, balance: newBalance });
      } catch (e) {
        console.error("Place order error:", e);
      }
    });
    
    socket.on("update_future_results", (data) => {
      try {
        if (data.roomId === 'VIP1') {
          vip1State.futureResults = data.results;
        } else if (data.roomId === 'VIP2') {
          vip2State.futureResults = data.results;
        }
      } catch (e) {
        console.error("Update future results error:", e);
      }
    });

    socket.on("register", (userData) => {

  socket.userId = userData.id;   // thêm dòng này

  try {
        const stmt = db.prepare(`
          INSERT INTO users (id, username, password, avatar, balance, vip, isVirtual, isBetBlocked, withdrawBlockStatus, inviteCode, referredBy)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          userData.id,
          userData.username,
          userData.password,
          userData.avatar,
          userData.balance,
          userData.vip,
          userData.isVirtual ? 1 : 0,
          userData.isBetBlocked ? 1 : 0,
          userData.withdrawBlockStatus,
          userData.inviteCode,
          userData.referredBy
        );
        io.emit("user_registered", userData);
      } catch (e) {
        console.error("Registration error:", e);
      }
    });

    socket.on("send_message", (msg) => {
      try {
        const stmt = db.prepare(`
          INSERT INTO messages (id, roomId, userId, nickname, avatar, content, addtime, timestamp, isService, isRead)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const timestamp = Date.now();
        stmt.run(
          msg.id,
          msg.roomId || 'global',
          msg.userId,
          msg.nickname,
          msg.avatar,
          msg.content,
          msg.addtime,
          timestamp,
          msg.isService ? 1 : 0,
          msg.isRead ? 1 : 0
        );
        io.emit("new_message", { ...msg, timestamp });
      } catch (e) {
        console.error("Message error:", e);
      }
    });

    socket.on("mark_messages_read", (data) => {
      try {
        db.prepare("UPDATE messages SET isRead = 1 WHERE userId = ? AND isService = 0").run(data.userId);
        io.emit("messages_marked_read", { userId: data.userId });
      } catch (e) {
        console.error("Mark messages read error:", e);
      }
    });

    socket.on("update_user", (userData) => {
      try {
        const stmt = db.prepare(`
          UPDATE users SET 
            balance = ?, 
            isBetBlocked = ?, 
            withdrawBlockStatus = ?,
            isVirtual = ?
          WHERE id = ?
        `);
        stmt.run(
          userData.balance,
          userData.isBetBlocked ? 1 : 0,
          userData.withdrawBlockStatus,
          userData.isVirtual ? 1 : 0,
          userData.id
        );
        io.emit("user_updated", userData);
      } catch (e) {
        console.error("Update user error:", e);
      }
    });

    socket.on("request_transaction", (txData) => {
      try {
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(txData.userId);
        if (!user) return;

        const isVirtual = user.isVirtual === 1;
        const status = isVirtual ? 'approved' : 'pending';

        const stmt = db.prepare(`
          INSERT INTO transactions (id, userId, username, type, amount, status, time, bankName, bankAccount, bankOwner, isRead)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `);
        stmt.run(
          txData.id,
          txData.userId,
          txData.username,
          txData.type,
          txData.amount,
          status,
          txData.time,
          txData.bankName || '',
          txData.bankAccount || '',
          txData.bankOwner || ''
        );

        if (txData.type === 'withdraw') {
          const newBalance = user.balance - txData.amount;
          db.prepare(`
            UPDATE users SET 
              balance = ?, 
              bankName = ?, 
              bankAccount = ?, 
              bankOwner = ? 
            WHERE id = ?
          `).run(
            newBalance, 
            txData.bankName, 
            txData.bankAccount, 
            txData.bankOwner, 
            txData.userId
          );
          io.emit("user_updated", { 
            ...user, 
            balance: newBalance,
            bankName: txData.bankName,
            bankAccount: txData.bankAccount,
            bankOwner: txData.bankOwner
          });
        } else if (txData.type === 'deposit' && isVirtual) {
          const newBalance = user.balance + txData.amount;
          db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, txData.userId);
          io.emit("user_updated", { ...user, balance: newBalance });
        }

        io.emit("new_transaction", { ...txData, status, isRead: 0 });
      } catch (e) {
        console.error("Transaction request error:", e);
      }
    });

    socket.on("mark_transactions_read", () => {
      try {
        db.prepare("UPDATE transactions SET isRead = 1").run();
        io.emit("transactions_marked_read");
      } catch (e) {
        console.error("Mark read error:", e);
      }
    });

    socket.on("mark_user_transactions_read", (data) => {
      try {
        db.prepare("UPDATE transactions SET isRead = 1 WHERE userId = ?").run(data.userId);
        io.emit("user_transactions_marked_read", { userId: data.userId });
      } catch (e) {
        console.error("Mark user read error:", e);
      }
    });

    socket.on("approve_transaction", (data) => {
      try {
        const tx = db.prepare("SELECT * FROM transactions WHERE id = ?").get(data.id);
        if (tx && tx.status === 'pending') {
          db.prepare("UPDATE transactions SET status = 'approved' WHERE id = ?").run(data.id);
          
          const user = db.prepare("SELECT * FROM users WHERE id = ?").get(tx.userId);
          if (user) {
            if (tx.type === 'deposit') {
              const newBalance = user.balance + tx.amount;
              db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, tx.userId);
              io.emit("user_updated", { ...user, balance: newBalance });
            }
            // For withdrawal, balance was already deducted at request time
          }
          
          io.emit("transaction_updated", { id: data.id, status: 'approved' });
        }
      } catch (e) {
        console.error("Approve transaction error:", e);
      }
    });

    socket.on("reject_transaction", (data) => {
      try {
        const tx = db.prepare("SELECT * FROM transactions WHERE id = ?").get(data.id);
        if (tx && tx.status === 'pending') {
          db.prepare("UPDATE transactions SET status = 'rejected' WHERE id = ?").run(data.id);
          
          // Refund if it was a withdrawal
          if (tx.type === 'withdraw') {
            const user = db.prepare("SELECT * FROM users WHERE id = ?").get(tx.userId);
            if (user) {
              const newBalance = user.balance + tx.amount;
              db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, tx.userId);
              io.emit("user_updated", { ...user, balance: newBalance });
            }
          }
          
          io.emit("transaction_updated", { id: data.id, status: 'rejected' });
        }
      } catch (e) {
        console.error("Reject transaction error:", e);
      }
    });

    socket.on("delete_transaction", (data) => {
      console.log("Deleting transaction:", data.id);
      try {
        const result = db.prepare("DELETE FROM transactions WHERE id = ?").run(data.id);
        console.log("Delete transaction result:", result);
        io.emit("transaction_deleted", { id: data.id });
      } catch (e) {
        console.error("Delete transaction error:", e);
      }
    });

    socket.on("delete_user_transactions", (data) => {
      console.log("Deleting transactions for user:", data.userId);
      try {
        const result = db.prepare("DELETE FROM transactions WHERE userId = ?").run(data.userId);
        console.log("Delete user transactions result:", result);
        io.emit("user_transactions_deleted", { userId: data.userId });
      } catch (e) {
        console.error("Delete user transactions error:", e);
      }
    });

    socket.on("delete_all_transactions", () => {
      console.log("Deleting all transactions");
      try {
        const result = db.prepare("DELETE FROM transactions").run();
        console.log("Delete all transactions result:", result);
        io.emit("all_transactions_deleted");
      } catch (e) {
        console.error("Delete all transactions error:", e);
      }
    });

    socket.on("delete_user", (data) => {
      console.log("Deleting user:", data.userId);
      try {
        const r1 = db.prepare("DELETE FROM users WHERE id = ?").run(data.userId);
        const r2 = db.prepare("DELETE FROM transactions WHERE userId = ?").run(data.userId);
        const r3 = db.prepare("DELETE FROM messages WHERE userId = ?").run(data.userId);
        const r4 = db.prepare("DELETE FROM orders WHERE userId = ?").run(data.userId);
        console.log("Delete user results:", { r1, r2, r3, r4 });
        io.emit("user_deleted", { userId: data.userId });
      } catch (e) {
        console.error("Delete user error:", e);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Lottery Loop
  const INITIAL_TIMER = 300;
  const CODES = ["FPT", "HPG", "VCB", "MSN", "MWG", "VNM", "VIC", "ACB", "VPB", "VRE"];
  
  const getInitialExpect = () => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    return dateStr + '001';
  };

  let vip1State = { timeLeft: INITIAL_TIMER, currentExpect: getInitialExpect(), futureResults: [] };
  let vip2State = { timeLeft: INITIAL_TIMER, currentExpect: getInitialExpect(), futureResults: [] };

  setInterval(() => {
    vip1State.timeLeft--;
    vip2State.timeLeft--;

    // Emit animation start 3 seconds before result
    if (vip1State.timeLeft === 3) {
      io.emit("lottery_animation_start", { roomId: 'VIP1' });
    }
    if (vip2State.timeLeft === 3) {
      io.emit("lottery_animation_start", { roomId: 'VIP2' });
    }

    if (vip1State.timeLeft <= 0) {
      let result = CODES[Math.floor(Math.random() * CODES.length)];
      if (vip1State.futureResults && vip1State.futureResults.length > 0) {
        result = vip1State.futureResults[0];
        vip1State.futureResults = vip1State.futureResults.slice(1);
      }
      const expect = vip1State.currentExpect;
      io.emit("lottery_result", { 
        roomId: 'VIP1', 
        expect, 
        result, 
        nextExpect: (parseInt(expect) + 1).toString(),
        futureResults: vip1State.futureResults
      });
      
      // Resolve orders on server
      resolveOrders('VIP1', expect, result);
      
      vip1State.timeLeft = INITIAL_TIMER;
      vip1State.currentExpect = (parseInt(expect) + 1).toString();
    }

    if (vip2State.timeLeft <= 0) {
      let result = CODES[Math.floor(Math.random() * CODES.length)];
      if (vip2State.futureResults && vip2State.futureResults.length > 0) {
        result = vip2State.futureResults[0];
        vip2State.futureResults = vip2State.futureResults.slice(1);
      }
      const expect = vip2State.currentExpect;
      io.emit("lottery_result", { 
        roomId: 'VIP2', 
        expect, 
        result, 
        nextExpect: (parseInt(expect) + 1).toString(),
        futureResults: vip2State.futureResults
      });
      
      // Resolve orders on server
      resolveOrders('VIP2', expect, result);

      vip2State.timeLeft = INITIAL_TIMER;
      vip2State.currentExpect = (parseInt(expect) + 1).toString();
    }

    io.emit("timer_update", { vip1Time: vip1State.timeLeft, vip2Time: vip2State.timeLeft });
  }, 1000);

  function resolveOrders(roomId, expect, result) {
    try {
      const pendingOrders = db.prepare("SELECT * FROM orders WHERE room = ? AND expect = ? AND status = 'pending'").all(roomId, expect);
      for (const order of pendingOrders) {
        const isWin = order.betCode === result;
        const status = isWin ? 'win' : 'loss';
        db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, order.id);
        if (isWin) {
          const user = db.prepare("SELECT * FROM users WHERE id = ?").get(order.userId);
          if (user) {
            const winAmount = order.amount * 2;
            const newBalance = user.balance + winAmount;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, order.userId);
            io.emit("user_updated", { ...user, balance: newBalance });
          }
        }
        io.emit("order_updated", { id: order.id, status, result });
      }
    } catch (e) {
      console.error("Resolve orders error:", e);
    }
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
