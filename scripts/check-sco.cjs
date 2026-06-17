const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

const targets = [
  {name: 'Angus Gunn', field: 'careerReview', ending: '超过15次国'},
  {name: 'Angus Gunn', field: 'wcSpotlight', ending: '的门将选择，'},
  {name: 'Aaron Hickey', field: 'careerReview', ending: '纪律性。超过'},
  {name: 'Aaron Hickey', field: 'wcSpotlight', ending: '冲击时希基的'},
  {name: 'Andy Robertson', field: 'wcSpotlight', ending: '突围，罗伯逊'},
  {name: 'Scott McTominay', field: 'careerReview', ending: '射和头球抢点'},
  {name: 'Scott McTominay', field: 'wcSpotlight', ending: '场，反而可能'},
  {name: 'Grant Hanley', field: 'careerReview', ending: '的上下移动和'},
  {name: 'Grant Hanley', field: 'wcSpotlight', ending: '年龄带来的运'},
  {name: 'John McGinn', field: 'careerReview', ending: '的斗志和感染'},
  {name: 'John McGinn', field: 'wcSpotlight', ending: '斯和拜仁慕尼'},
  {name: 'Tyler Fletcher', field: 'careerReview', ending: '出色、传球的'},
  {name: 'Tyler Fletcher', field: 'wcSpotlight', ending: '今作为曼联教'},
  {name: 'Lyndon Dykes', field: 'careerReview', ending: '系中他是标准'},
  {name: 'Lyndon Dykes', field: 'wcSpotlight', ending: '克托米奈创造'},
  {name: 'Ché Adams', field: 'careerReview', ending: '出场打入约6'},
  {name: 'Ché Adams', field: 'wcSpotlight', ending: '能提供完全不'},
  {name: 'Ryan Christie', field: 'careerReview', ending: '次国家队出场'},
  {name: 'Ryan Christie', field: 'wcSpotlight', ending: '赛中——比如'},
  {name: 'Liam Kelly', field: 'careerReview', ending: '加盟流浪者后'},
  {name: 'Liam Kelly', field: 'wcSpotlight', ending: '。他可能整届'},
  {name: 'John Souttar', field: 'careerReview', ending: '队出场，在苏'},
  {name: 'John Souttar', field: 'wcSpotlight', ending: '和准备程度将'},
  {name: 'Dominic Hyam', field: 'careerReview', ending: '但教练们恰恰'},
  {name: 'Dominic Hyam', field: 'wcSpotlight', ending: '走远需要的不'},
  {name: 'Ben Gannon-Doak', field: 'careerReview', ending: '岁已成为英格'},
  {name: 'Ben Gannon-Doak', field: 'wcSpotlight', ending: '克斯的顺位在'},
  {name: 'Lewis Ferguson', field: 'careerReview', ending: '苏格兰战术体'},
  {name: 'Lewis Ferguson', field: 'wcSpotlight', ending: '森就是那个在'},
  {name: 'Lawrence Shankland', field: 'careerReview', ending: '头号得分手，'},
  {name: 'Lawrence Shankland', field: 'wcSpotlight', ending: '苏超多次替补'},
  {name: 'Craig Gordon', field: 'careerReview', ending: '稳居苏超前四'},
  {name: 'Craig Gordon', field: 'wcSpotlight', ending: '业素养课：他'},
  {name: 'Kenny McLean', field: 'careerReview', ending: '场的绝对组织'},
  {name: 'Kenny McLean', field: 'wcSpotlight', ending: '年轻中场都更'},
  {name: 'Anthony Ralston', field: 'careerReview', ending: '森之外最可靠'},
  {name: 'Anthony Ralston', field: 'wcSpotlight', ending: '左边锋的冲击'},
  {name: 'Findlay Curtis', field: 'careerReview', ending: '正的年轻爆点'},
  {name: 'Findlay Curtis', field: 'wcSpotlight', ending: '锋都会在冬季'},
  {name: 'Scott McKenna', field: 'careerReview', ending: '格勒布迪纳摩'},
  {name: 'Scott McKenna', field: 'wcSpotlight', ending: '逼抢时用精准'},
];

targets.forEach(t => {
  const player = d[t.name];
  if (!player) { console.log('MISSING: ' + t.name); return; }
  const text = player[t.field] || '';
  console.log('=== ' + t.name + ' | ' + t.field + ' ===');
  console.log(text);
  console.log('[ENDS]');
  console.log();
});
