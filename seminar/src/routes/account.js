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
    const balance = 10000;
    try {
      //console.log(AccountModel.count());
      // if (AccountModel.find().count() < 1) {
      //   console.log('making new account');
      //   const newItem = new AccountModel({ id, total });
      //   //const res = await newItem.save();
      //   const res = newItem.save();
      // }
      console.log('making new account');
      const newItem = new AccountModel({ id, balance });
      //const res = await newItem.save();
      const res = newItem.save();
      console.log('[Bank-DB] DB Init Completed');
    } catch (e) {
      console.log(`[Bank-DB] DB Init Error: ${e}`);
    }
  }

  getBalance = async (search) => {
    try {
      //if (count === 0) return { success: true, data: [] };
      // We'll Remove the Item Count Limit for Search... (Really, this is unnecessary)
      /*
            const DBItemCount = await FeedModel.countDocuments();
            if (count > DBItemCount) return { success: false, data: "Too many items queried"  };
            if (count < 0) return { success: false, data: "Invalid count provided" };
            */
      // const findArguments =
      //   search === ''
      //     ? {}
      //     : {
      //           { id: search },
      //       };
      console.log(`Entered getBalance witn search ID : ${search}`);
      const res = await AccountModel.findOne({ id: search });
      console.log(res);
      return { success: true, data: res };
    } catch (e) {
      console.log(`[Bank-DB] getBalance Error: ${e}`);
      return { success: false, data: `DB Error - ${e}` };
    }
  };

  transanction = async (id, amount) => {
    try {
      console.log('transaction called with id : ' + id + ' amount : ' + amount);
      const res = await AccountModel.findOneAndUpdate(
        { id: id },
        { $inc: { balance: amount } },
        { new: true } // 이 줄이 있어야 수정 후의 값을 리턴함!
      );
      console.log('findOneAndUpdate called : result = ' + res.balance);
      return { success: true, data: res }; // 일단 통째로 변경된 document를 data라는 이름으로 넘김
    } catch (e) {
      //console.log('transaction error occured');
      console.log(`[Bank-DB] transaction Error: ${e}`);
      return { success: false, msg: `DB Error - ${e}` };
    }
  };

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

router.post('/getInfo', authMiddleware, async (req, res) => {
  try {
    const searchId = req.body.id;
    const dbRes = await bankDBInst.getBalance(searchId);
    if (dbRes.success) return res.status(200).json(dbRes.data);
    else return res.status(500).json({ error: dbRes.data });
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  // try {
  //   console.log(`getInfo called with ${req.body.id}`);
  //   const findArguments = {
  //     $or: [{ id: req.body.id }],
  //   };
  //   console.log(`${'daystar' === req.body.id}`);
  //   console.log(AccountModel.findOne());
  //   const total = AccountModel.findOne().total; // undefined 뜸ㅠㅠㅠ
  //   //.sort({ createdAt: -1 })
  //   //.limit(1)
  //   //.exec();
  //   console.log(`total : ${total}`);
  //   // if (success) return res.status(200).json({ balance: total });
  //   return res.status(200).json({ balance: total });
  // } catch (e) {
  //   return res.status(500).json({ error: e });
  // }
});

router.post('/transaction', authMiddleware, async (req, res) => {
  try {
    //const amount = req.body.amount;
    //const balance = AccountModel.getBalance(req.body.id).balance;
    //console.log('transaction 요청 받음');
    const dbRes = await bankDBInst.transanction(req.body.id, req.body.amount);
    console.log('dbRes : ' + dbRes.data);
    if (dbRes.success) {
      return (
        res
          .status(200)
          //.json({ success: true, balance: newtotal, msg: 'Transaction success' });
          .json({ success: true, balance: dbRes.data.balance, msg: '' }) // data로 들어온 결과물을, frontend가 받을 수 있는 형태로 넘겨줌
      );
    }
  } catch (e) {
    //console.log('trasaction 요청 에러');
    return res.status(500).json({ error: e });
  }
});

module.exports = router;
