const express = require('express');
const router = express.Router();
const logic = require('./logic');

// หน้ารวมคำสัญญาทั้งหมด
router.get('/', (req, res) => {
  logic.getAllPromises((err, data) => {
    res.render('promises', { promises: data });
  });
});

// หน้ารายละเอียดคำสัญญาของแต่ละสัญญา
router.get('/promise/:id', (req, res) => {
  logic.getPromiseDetail(req.params.id, (err, promise, updates) => {
    res.render('promiseDetail', { promise, updates });
  });
});

// หน้าเพิ่มความคืบหน้าในการกรอกข้อมูล
router.get('/promise/:id/progress', (req, res) => {
  res.render('updatePromise', { id: req.params.id });
});

// POST อัปเดตความคืบหน้าไปใน DB
router.post('/promise/:id/progress', (req, res) => {
  logic.addUpdate(req.params.id, req.body.detail, (result) => {
    res.redirect(`/promise/${req.params.id}`);
  });
});

// หน้านักการเมืองทั้งหมด
router.get('/politicians', (req, res) => {
  logic.getPoliticians((err, data) => {
    res.render('politicians', { politicians : data });
  });
});

// หน้านักการเมืองรายคนดึงข้อมูลของนักการเมืองคนนั้น กับสัญญาทั้งหมดที่เขาให้ไว้
router.get('/politician/:id', (req, res) => {
  const id = req.params.id;

  logic.getPoliticianById(id, (err, politician) => {
    if (err) throw err;
    logic.getPromisesByPolitician(id, (err, promises) => {
      if (err) throw err;

      res.render('politicianPromises', {
        politician,
        promises
      });
    });
  });
});

module.exports = router;
