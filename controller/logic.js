const db = require("../model/database");

// หน้ารวมคำสัญญาทั้งหมดโดยที่จะแสดงด้วยว่าใครเป็นคนสัญญาไว้
exports.getAllPromises = (callback) => {
  db.all(
    `
    SELECT p.*, pol.name 
    FROM Promises p
    JOIN Politicians pol ON p.politician_id = pol.politician_id
    ORDER BY announce_date DESC
  `,
    callback,
  );
};

// รายละเอียดคำสัญญาตาม ID โดยที่เมื่อเข้าไปก็จะมีแสดงชื่อนักการเมือง
exports.getPromiseDetail = (id, callback) => {
  db.get(
    `
    SELECT 
      p.*,
      pol.name AS politician_name
    FROM Promises p
    JOIN Politicians pol 
      ON p.politician_id = pol.politician_id
    WHERE p.promise_id = ?
    `,
    [id],
    (err, promise) => {
      if (err) return callback(err);

      db.all(
        `SELECT * FROM PromiseUpdates WHERE promise_id = ?`,
        [id],
        (e, updates) => {
          callback(null, promise, updates);
        },
      );
    },
  );
};



// เพิ่มความคืบหน้าในสัญญาว่ามีการทำอะไรคืบหน้าไปแล้ว
exports.addUpdate = (id, detail, callback) => {
  db.get(
    `SELECT status FROM Promises WHERE promise_id = ?`,
    [id],
    (err, row) => {
      if (row.status === "เงียบหาย") return callback("CANNOT_UPDATE");

      db.run(
        `
      INSERT INTO PromiseUpdates (promise_id, update_date, detail)
      VALUES (?, date('now'), ?)
    `,
        [id, detail],
        callback,
      );
    },
  );
};

// หน้านักการเมืองทั้งหมด
exports.getPoliticians = (callback) => {
  db.all(
    `SELECT * FROM Politicians`,
    callback
  );
};

//หน้านักการเมืองรายคนตาม ID
exports.getPoliticianById = (id, callback) => {
  db.get(
    'SELECT * FROM Politicians WHERE politician_id = ?',
    [id],
    callback
  );
};

//ดึงข้อมูลสัญญาโดยอิงจากนักการเมืองคนนั้นๆ
exports.getPromisesByPolitician = (id, callback) => {
  db.all(
    'SELECT * FROM Promises WHERE politician_id = ?',
    [id],
    callback
  );
};
