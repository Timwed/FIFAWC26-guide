const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

const fixes = {
  // Switzerland — 21 fixes
  'Silvan Widmer': {
    careerReview: '让他成为瑞士右后卫位置上最可靠的战术选项。',
  },
  'Nico Elvedi': {
    careerReview: '地位和长期价值。',
  },
  'Manuel Akanji': {
    wcSpotlight: '彻——没有他在场上，瑞士的控球打法会从根本上失去稳定性。',
  },
  'Denis Zakaria': {
    careerReview: '场3个进球的记录虽然不如扎卡那样耀眼，但他的战术价值在于让瑞士中场在对抗和覆盖上永远不处于人数劣势。',
  },
  'Breel Embolo': {
    careerReview: '环境中延续进球节奏，27岁时他仍有时间去兑现那个从未真正消散的巨星标签。',
  },
  'Johan Manzambi': {
    careerReview: '同龄球员需要几届大赛才能积累的数据，他在第一次入选大名单时就已经带在身边了。',
    wcSpotlight: '提供最宝贵的战术新鲜度。',
  },
  'Yvon Mvogo': {
    careerReview: '迷不必为此担心——替补门将的价值从来不在于出场次数而在于随时准备好的状态。',
  },
  'Ricardo Rodriguez': {
    careerReview: '15个进球的史诗级数据让他稳居瑞士队史传奇的前排位置。',
  },
  'Ardon Jashari': {
    careerReview: '他和AC米兰的合同已经宣示了他的长期价值。',
    wcSpotlight: '定会在未来几年内开花——本届世界杯是他在这条路上最重要的一站加速。',
  },
  'Christian Fassnacht': {
    careerReview: '单——他已经不需要向任何人证明自己属于这个级别。',
  },
  'Rub\u00e9n Vargas': {
    careerReview: '杯淘汰赛中的进球证明他在高水平舞台上从不畏惧出手。',
  },
  'Michel Aebischer': {
    careerReview: '是他对瑞士中场的核心价值：在扎卡身边无痕地嵌入比赛并保持节奏。',
  },
  'Fabian Rieder': {
    careerReview: '他的进球记录更能说明他在前场的实际破坏力。',
  },
  'Aur\u00e8le Amenda': {
    careerReview: '位置的全部细节——这届世界杯将是他职业生涯中最重要的一个学习站。',
    wcSpotlight: '的比赛中经受了充分的检验，他在训练场上的每一天都在为未来首发做积累。',
  },
  'Luca Jaquez': {
    careerReview: '作为一个独特的防空武器储备。',
    wcSpotlight: '难忘的成长印记。',
  },
  'Cedric Itten': {
    careerReview: '——在需要板凳深度时，一个能保持进球节奏的替补前锋是被低估的奢侈品。',
    wcSpotlight: '个在禁区内找到球门的人时，他会从替补席上站起来完成最后的信号。',
  },

  // Qatar — 12 fixes
  'Mahmud Abunada': {
    wcSpotlight: '就是在机会来临时不让卡塔尔失望。',
  },
  'Pedro Miguel': {
    wcSpotlight: '世界杯征程，他会比任何年轻球员都更珍惜禁区里的每一次争顶。',
  },
  'Lucas Mendes': {
    wcSpotlight: '威胁。',
  },
  'Jassem Gaber': {
    wcSpotlight: '界杯的尺度上，这就是对一个边后卫最高的战术要求。',
  },
  'Ahmed Alaaeldin': {
    wcSpotlight: '为他积累的对抗经验是他的全部底气——但世界杯是完全不同的试炼场。',
  },
  'Ayoub Al-Oui': {
    wcSpotlight: '生涯最早也是最重要的一堂实战课。',
  },
  'Yusuf Abdurisag': {
    wcSpotlight: '次定位球都变成得分的起点。',
  },
  'Boualem Khoukhi': {
    wcSpotlight: '球在任何一次死球时刻都是对手必须严防的第一目标。',
  },
  'Almoez Ali': {
    wcSpotlight: '可以轻描淡写的任务——而是整个卡塔尔足球的尊严所系。',
  },
  'Meshaal Barsham': {
    careerReview: '和在与顶级球员对位时不畏缩的心理资本。',
  },
  'Tahsin Jamshid': {
    wcSpotlight: '塔里的对抗训练提供模拟——每一堂训练课都是他的世界杯。',
  },
  'Mohamed Manai': {
    wcSpotlight: '种差距会立刻被放大——马奈需要证明自己能在这种升级中保持有效输出。',
  },

  // Bosnia — 2 fixes
  'Amar Memi\u0107': {
    wcSpotlight: '——他的登场往往意味着波黑在前场增加了一个直接的爆破点。',
  },
  'Kerim Alajbegovi\u0107': {
    wcSpotlight: '点和起跑线。',
  },
};

let count = 0;
const errors = [];

Object.keys(fixes).forEach(function(name) {
  const player = d[name];
  if (!player) {
    errors.push('NOT FOUND: ' + name);
    return;
  }
  const playerFixes = fixes[name];
  Object.keys(playerFixes).forEach(function(field) {
    const oldVal = player[field];
    const append = playerFixes[field];
    const newVal = oldVal + append;
    player[field] = newVal;
    count++;
    console.log('FIXED: ' + name + ' | ' + field);
  });
});

fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(d, null, 2), 'utf8');

console.log('\nTotal fixes applied: ' + count);
if (errors.length > 0) {
  console.log('ERRORS:');
  errors.forEach(function(e) { console.log('  ' + e); });
}

// Verify all fixed fields end with punctuation
Object.keys(fixes).forEach(function(name) {
  const player = d[name];
  if (!player) return;
  const playerFixes = fixes[name];
  Object.keys(playerFixes).forEach(function(field) {
    const val = player[field];
    const endsOk = /[。！？]/.test(val.slice(-1));
    if (!endsOk) {
      console.log('WARNING: ' + name + ' ' + field + ' does not end with punctuation');
    }
  });
});
console.log('\nVerification complete.');
