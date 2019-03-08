const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function add(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.question_id = Uuid.random();
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.type = params.options;
          PARAM_IS_VALID.group_id = params.group;
          PARAM_IS_VALID.answer = params.answer || [];
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addQuestion(callback) {
        const questionObject = {
          question_id: PARAM_IS_VALID.question_id,
          title: PARAM_IS_VALID.title,
          type: PARAM_IS_VALID.type,
          answer: PARAM_IS_VALID.answer,
          group_id: models.uuidFromString(PARAM_IS_VALID.group_id),
        };
        const instance = new models.instance.question(questionObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function update(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.question_id = models.uuidFromString(params.question_id);
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.type = params.options;
          PARAM_IS_VALID.answer = params.answer || [];
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function updateQuestion(callback) {
        const questionObject = {
          title: PARAM_IS_VALID.title,
          type: PARAM_IS_VALID.type,
          answer: PARAM_IS_VALID.answer,
        };
        const queryObject = { question_id: PARAM_IS_VALID.question_id };
        const options = { if_exists: true };
        models.instance.question(queryObject, questionObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function fetch(req, res) {
  let data = [];
  async.series(
    [
      function fetchQuestion(callback) {
        const { question } = models.instance;
        question.find({}, (err, item) => {
          data = item;
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data });
    }
  );
}
function fetchBy(req, res) {
  const PARAM_IS_VALID = {};
  const { params } = req;
  let data = {};
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.question_id = models.uuidFromString(params.question_id);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function fetchQuestion(callback) {
        const { question } = models.instance;
        question.find({ question_id: PARAM_IS_VALID.question_id }, (err, item) => {
          data = item[0] || {};
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data });
    }
  );
}
function del(req, res) {
  const PARAM_IS_VALID = {};
  const { params } = req;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.question_id = models.uuidFromString(params.question_id);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function delQuestion(callback) {
        const queryObject = { question_id: PARAM_IS_VALID.question_id };
        models.instance.question.delete(queryObject, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok' });
    }
  );
}
router.post('/form/add', add);
router.put('/form/update', update);
router.get('/fetch', fetch);
router.get('/fetch/:question_id', fetchBy);
router.delete('/del/:question_id', del);
module.exports = router;
