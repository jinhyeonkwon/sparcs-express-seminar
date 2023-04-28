const express = require('express');
const authMiddleware = require('../middleware/auth');
const AccountModel = require('../models/account');

const router = express.Router();

class BankDB {
  static _inst_;
  static getInst = () => {
    if (!BankDB._inst_) BankDB._inst_ = new BankDB();
    return BankDB._inst_;
  };

  #total = 10000;

  constructor() {
    console.log('init account');
    const id = 'daystar';
    const total = 10000;
    try {
      if (AccountModel.find().count() < 1) {
        const newItem = new AccountModel({ id, total });
        //const res = await newItem.save();
        const res = newItem.save();
      }
      console.log('[Bank-DB] DB Init Completed');
    } catch (e) {
      console.log(`[Bank-DB] DB Init Error: ${e}`);
    }
  }

  // getBalance = () => {
  //   return { success: true, data: this.#total };
  // };
  //
  // transaction = (amount) => {
  //   this.#total += amount;
  //   return { success: true, data: this.#total };
  // };
}

const bankDBInst = BankDB.getInst();
BankDB.insertAccount;

router.post('/getInfo', authMiddleware, (req, res) => {
  try {
    console.log(`getInfo called with ${req.body.id}`);
    const findArguments = {
      $or: [{ id: req.body.id }],
    };
    console.log(`${'daystar' === req.body.id}`);
    console.log(AccountModel.findOne({ id: req.body.id }));
    const total = AccountModel.findOne({ id: req.body.id }).total; // undefined 뜸ㅠㅠㅠ
    //.sort({ createdAt: -1 })
    //.limit(1)
    //.exec();
    console.log(`total : ${total}`);
    // if (success) return res.status(200).json({ balance: total });
    return res.status(200).json({ balance: total });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post('/transaction', authMiddleware, (req, res) => {
  try {
    const { amount } = req.body;
    const { id, total } = AccountModel.findOne({ id: req.body.id });
    const { newtotal } = AccountModel.updateOne(
      { id: id },
      { $set: { total: total + amount } }
    );
    res
      .status(200)
      .json({ success: true, balance: newtotal, msg: 'Transaction success' });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

module.exports = router;
