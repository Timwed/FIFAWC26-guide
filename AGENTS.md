# FIFAWC26-guide — Agent 参考手册

2026 世界杯观赛指南项目。React + TypeScript + Vite 前端，数据层为静态 JSON。

---

## 数据文件地图

| 文件 | 用途 | 说明 |
|------|------|------|
| `src/data/squads.json` | 48 队 26 人大名单 | 球员姓名(英文)、位置、年龄、出场/进球、俱乐部(英文) |
| `src/data/wiki-teams.json` | 球队百科介绍 | 以英文队名(如 Argentina)为 key，含 `extract`(英文) |
| `src/data/teams.json` | 球队中文介绍 | 以数字索引为 key，含 `cnExtract`(中文)、group 等 |
| `src/data/players-wiki.json` | **球员个人介绍(叙事)** | 以球员英文名(如 Lionel Messi)为 key，含 `careerReview` + `wcSpotlight` |
| `src/data/wiki-players.json` | 球员百科原始数据 | 仅部分球员有，raw wiki extract |
| `TEAM_INTROS.md` | 球队中文介绍(人工撰写) | 每队一段，用于页面展示，已全部完成 48 队 |

**核心编辑目标**：`players-wiki.json` 中所有 48 队 × 26 人 = 1248 人的 `careerReview` + `wcSpotlight`。

---

## 当前进度

| 状态 | 球队 |
|------|------|
| ✅ 已完成 | 阿根廷、巴西、德国、法国、英格兰、荷兰、葡萄牙、西班牙（8 豪门） |
| ✅ 已完成 | 捷克、墨西哥、南非、韩国（A 组） |
| ✅ 已完成 | 波黑、加拿大、卡塔尔、瑞士（B 组） |
| ✅ 已完成 | 海地、摩洛哥、苏格兰（C 组，巴西已在 8 豪门中完成） |
| ✅ 已完成 | 澳大利亚、巴拉圭、土耳其、美国（D 组） |
| ✅ 已完成 | 库拉索、厄瓜多尔、科特迪瓦（E 组，德国已在 8 豪门中完成） |
| ✅ 已完成 | 比利时、埃及、伊朗、新西兰（G 组） |
| ✅ 已完成 | 佛得角、沙特阿拉伯、乌拉圭（H 组） |
| ✅ 已完成 | 伊拉克、挪威、塞内加尔（I 组，法国已在 8 豪门中完成） |
| ✅ 已完成 | 阿尔及利亚、奥地利、约旦（J 组，阿根廷已在 8 豪门中完成） |
| ✅ 已完成 | 哥伦比亚、民主刚果、乌兹别克斯坦（K 组，葡萄牙已在 8 豪门中完成） |
| ✅ 已完成 | 克罗地亚、加纳、巴拿马（L 组，英格兰已在 8 豪门中完成） |

**总计**：48/48 队，1247/1248 人（Emiliano Martínez 同名校验差 1）

**全部团队完成！**

---

## 球员介绍格式

每个球员在 `players-wiki.json` 中有两个字段：

```json
"Lionel Messi": {
  "careerReview": "...",
  "wcSpotlight": "..."
}
```

### careerReview（职业生涯回顾）
- 内容：俱乐部生涯轨迹、关键转会、荣誉(联赛/杯赛/欧战)、技术特点、国家队贡献
- 语气：回顾性/总结性，数据密集但不枯燥
- 必须包含：俱乐部名称(以 squads.json 为准)、至少一项具体荣誉或数据

### wcSpotlight（世界杯聚焦）
- 内容：2026 世界杯角色定位、战术分析、看点/悬念、竞技状态
- 语气：前瞻性/分析性，类似赛前评论员
- 必须包含：年龄、世界杯出场数(如适用)、本届定位(主力/轮换/奇兵)

### 通用规则
- 使用**中文解说员口吻**，口语化但不随意
- 拒绝空泛形容词堆砌（"出色"、"顶级" 不用滥用，用具体数据替代）
- 每个球员至少有一个具体数据点（转会费、进球数、出场次数、冠军数量）
- 星球员允许一个弱点/争议点叙事
- 俱乐部名称必须与 `squads.json` 完全一致（英文），不可直译或臆造
- 禁止使用箭头记法（如 `2020 球员→俱乐部`），必须用自然叙事

---

## 球员分档与篇幅标准

按球员地位 + 叙事价值分四档。**以下范围是硬性边界，不是建议。写完必须落在区间内。**

| 档位 | 总篇幅 | CR 目标 | WS 目标 | 典型角色 |
|------|--------|---------|---------|----------|
| **S 档** | 500–600 | 280–340 | 220–280 | 全球巨星/队魂 (Messi, Neymar) |
| **A 档** | 380–480 | 220–280 | 160–220 | 球队脊梁/位置世界前三 (Lautaro, Vini Jr) |
| **B 档** | 300–380 | 170–220 | 130–170 | 主力/第一轮换 (Paredes, Raphinha) |
| **C 档** | 250–320 | 120–170 | 120–160 | 板凳/新秀/老将 (Musso, Weverton) |

**分档判断依据**：球员在 2026 世界杯的实际角色 > 历史地位 > 叙事价值。一个 19 岁板凳天才(Endrick)最多 B 档，不能因为故事好就挤进 A 档。

### 每队档位预算（硬性约束）

**先定档，再写作。** 一个队 26 人的档位分配必须在落笔前确定，不能写完多长就算什么档。按球队实力分四类：

| 球队类型 | S 档 | A 档 | B 档 | C 档 | 示例 |
|---------|------|------|------|------|------|
| **豪门** | 1–2 | 7–8 | 8–10 | 6–9 | Argentina, Brazil, France |
| **劲旅** | 0–1 | 4–6 | 8–10 | 9–13 | Switzerland, Mexico, South Korea |
| **中游** | 0 | 2–4 | 6–8 | 14–18 | Canada, Czech Republic, Qatar |
| **弱队** | 0 | 1–2 | 3–5 | 19–22 | Haiti, South Africa |

**S 档准入标准**：必须满足以下至少两条，否则最高 A 档：
- 金球奖/Ballon d'Or 前三候选级别
- 身价 8000 万欧元以上
- 世界杯四强/欧冠冠军的核心领军人物
- 国家队出场 100+ 且是公认的队史传奇

加拿大 4 个 S 档就是反面教材——Davies 是 S，但 Buchanan、Osorio、David 不是全球巨星。波黑 12 个 A 档同理——18 岁仅 10 次出场的球员最多 B 档。

### S 档硬上限
**总篇幅不超过 600 字。** Xhaka 写到 646、Džeko 写到 613 都是错误。巨星也需要克制，600 字已经足以讲完一个人的故事。

### 篇幅铁律

1. **先定档再写作**。打开 blank page 之前，这个球员的档位已经定了。写到目标区间就停，不要写到 S 档长度再回头降级。

2. **不靠扩句凑字数**。字数不够 → 查这个球员的真实经历：特定赛季数据、转会费、伤病复出故事。禁止把"他很快"扩成"他拥有出色的速度和爆发力"。

3. **每句都要过"删掉会丢什么信息"的测试**。如果删掉一句话后，读者知道的关于这个球员的事实没有任何减少，这句话就是注水。例如"他的经验无可替代"删掉后丢了什么事实？什么都没丢。

4. **具体 > 模糊**。
   - ❌ "在比利时联赛积累了经验"
   - ✅ "2022-2024 年在 KV Mechelen 出场 56 次打入 3 球"  
   - ❌ "本届世界杯最年轻的球员之一"（不可验证）
   - ✅ "全队最年轻的球员"（可从 squad 数据验证）

5. **档位间必须有肉眼可见的长度差异**。如果全队 26 人都在 250-320 之间，实际上只有一档。目标差距：C 档 250-290，B 档 310-360，A 档 390-450，S 档 500-590。允许少量重叠但整体曲线要分层。

6. **每队写完后必须跑验证脚本**，任何球员 CR 或 WS 超出区间即为不合格。不合格的队不进下一组。

---

## 阿根廷/巴西分档实例（参考模板）

### 阿根廷（26 人）
- **S**: Messi (592)
- **A**: Lautaro (435) · Otamendi (430) · De Paul (427) · Enzo (423) · Mac Allister (402) · Emiliano Martinez (451) · Alvarez (457)
- **B**: Lo Celso (387) · Paredes (378) · Lisandro (377) · Romero (364) · Molina (348) · Tagliafico (329) · Montiel (355)
- **C**: Musso (299) · Senesi (285) · Barco (300) · Rulli (260) · Palacios (297) · Gonzalez (302) · Almada (288) · Simeone (283) · Paz (288) · Lopez (278) · Medina (263)

### 巴西（26 人）
- **S**: Neymar (524)
- **A**: Marquinhos (444) · Casemiro (442) · Vini Jr (439) · Bruno G (438) · Alisson (427) · Paqueta (417) · Gabriel (459)
- **B**: Martinelli (371) · Endrick (378) · Cunha (359) · Raphinha (371) · Ederson Moraes (332) · Fabinho (342) · Bremer (304)
- **C**: Igor Thiago (276) · Rayan (311) · Alex Sandro (306) · Douglas Santos (301) · Danilo Luiz (295) · Luiz Henrique (290) · Weverton (288) · Leo Pereira (283) · Danilo Santos (282) · Ederson Silva (280) · Roger Ibanez (278)

---

## 质量审查清单

处理每队后必须逐项确认：

1. [ ] 所有 26 人都有 `careerReview` 和 `wcSpotlight`
2. [ ] 无俱乐部名称幻觉（全部与 `squads.json` 一致）
3. [ ] 无全局查找替换污染（如 "马丁内斯→葡萄牙主帅马丁内斯"、"西蒙尼→马竞主帅西蒙尼"）
4. [ ] 分档内篇幅符合硬性区间，无倒挂（A 档球员不能短于同队 B 档）
5. [ ] 无箭头记法残留（`→`）
6. [ ] 无 garbled 文本（乱码/截断的句子）
7. [ ] S 档球员是全队篇幅最长的一个，且 ≤600 字
8. [ ] 已完成的球队间篇幅大致均衡（同一档位球员跨队比较不差 100+ 字符）
9. [ ] **档位预算符合球队实力**（中游队不能有 12 个 A 档，弱队 S 档为 0）
10. [ ] **档位分层可辨**（C/B/A/S 档之间有可辨识的长度差距，不只是随机分布在 250-450 之间）

---

## 新增一队：完整工作流

每队 9 步，**必须全部通过才能进下一队**。第 7 步验证是硬性门禁。

### Step 1：拉球员名单
从 `squads.json` 找到目标球队的 players 数组，提取 26 人名单及其 `caps`、`goals`、`club`、`position`、`age`：
```js
// 快速查看
node -e "var s=require('./src/data/squads.json'); var t=s.find(function(x){return x.name==='Germany'}); t.players.forEach(function(p){console.log(p.name+' | '+p.position+' | '+p.age+'岁 | '+p.caps+'场 | '+p.club)})"
```
注意：俱乐部名是英文，写 careerReview 时**原样使用**（如 `Bayern Munich`，不是 "拜仁慕尼黑"）。

### Step 2：分档
根据球员地位和角色分入 S/A/B/C 四档。参考依据：
- `squads.json` 中的 `caps`（出场数越高通常地位越高）
- 俱乐部档次（皇马/拜仁/曼城 > 五大联赛中游 > 非五大联赛）
- 年龄（25–30 岁的核心 > 35+ 老将或 22– 新秀）
- 位置稀缺性（世界级门将/中卫可以进 A 档，替补门将通常 C 档）

分档结果**记录在任务列表里**，每个球员标注 `[S/A/B/C]`，后续写 wiki 时严格按此档位字数目标执行。

### Step 3：联网检索素材（必做）
**写任何内容前，先联网查 A/B 档球员的真实信息。** C 档球员如果已从 squad 数据中能提取足够信息可以不查，但不能凭空编造。

检索内容优先级：
1. 职业生涯关键转折（转会、伤病、位置变化）
2. 具体赛季数据（某赛季进球数、出场数、助攻数，越具体越好）
3. 大赛名场面（某场欧冠/世界杯的具体表现，对手是谁、做了什么）
4. 争议/故事点（改国籍、与主帅关系、生涯低谷后反弹）

**禁止凭空扩句**：如果查不到足够信息，宁可写一个短但有信息密度的 C 档 bio，不要靠 "他表现出色" "他是重要一员" 这类空话充数。

### Step 4：撰写 CR + WS
用 `.cjs` 脚本写入 `players-wiki.json`。**写每个球员时心里有目标总字数，写到区间就停，不要写到 S 档长度。**
```js
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

d['Player Name'] = {
  careerReview: "...",
  wcSpotlight: "..."
};
// ... 重复 26 次 ...

fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(d, null, 2), 'utf8');
// 验证篇幅
console.log('Player1:', (d['Player1'].careerReview||'').length + (d['Player1'].wcSpotlight||'').length);
```

### Step 5：核实俱乐部名
写完后逐条与 `squads.json` 比对，确保所有 `careerReview` 中出现的俱乐部名称准确。

### Step 6：篇幅审计（硬性门禁）
写一个验证脚本，输出全部 26 人的 CR/WS/TOTAL，标注是否在目标区间内。脚本模板：
```js
var d = require('./src/data/players-wiki.json');
var players = [
  {name:'Neuer', tier:'A', crMin:220, crMax:280, wsMin:160, wsMax:220},
  {name:'Kimmich', tier:'A', crMin:220, crMax:280, wsMin:160, wsMax:220},
  // ... 26 人全列 ...
];
var failures = [];
players.forEach(function(p) {
  var b = d[p.name];
  if (!b) { console.log('MISSING: '+p.name); return; }
  var cr = b.careerReview.length, ws = b.wcSpotlight.length, tot = cr + ws;
  var ok = cr >= p.crMin && cr <= p.crMax && ws >= p.wsMin && ws <= p.wsMax;
  if (!ok) failures.push(p.name + ' CR='+cr+' WS='+ws+' TOT='+tot);
  console.log((ok?'PASS':'FAIL')+' '+p.name+' CR='+cr+' WS='+ws+' TOT='+tot+' ['+p.tier+']');
});
if (failures.length > 0) {
  console.log('\n===== ' + failures.length + ' FAILURES — MUST FIX BEFORE CONTINUING =====');
  failures.forEach(function(f) { console.log('  '+f); });
}
```

### Step 7：修正超标/不足（必须 26/26 PASS 才能进 Step 8）
- **超标**（最常犯）：精简句子，去冗余修饰语，合并相似信息点。删掉那些删了不影响信息量的形容词。
- **不足**：不要扩句。去查这个球员到底还有什么故事——某个赛季的数据、一次关键转会、一场经典的比赛。如果实在查不到，接受它是一个扎实的 C 档 bio。**一个 280 字的干净 C 档 bio 比一个 380 字的注水 B 档 bio 好十倍。**

⚠️ **这一步未全部 PASS 前，绝对不进下一队。** 修改后重新跑 Step 6 验证。

### Step 8：跨队均衡检查
与已完成的阿根廷/巴西同档球员对比，确保没有某队整体偏长或偏短。

### Step 9：标记完成
更新 AGENTS.md 的当前进度表。

---

## 撰写示例：好 vs 坏

### careerReview
| ❌ 不好 | ✅ 好 |
|---------|------|
| 他在多个顶级俱乐部表现出色，获得众多荣誉 | 2014 年加盟拜仁，六座德甲冠军，2020 年欧冠决赛首发夺冠 |
| 2022 年从 A 俱乐部→B 俱乐部（箭头记法） | 2022 年夏天转会 B 俱乐部 |
| 是一名出色的中场 | 场均跑动 11.5 公里，拦截和抢断数据队内前三 |
| 在比利时和斯洛文尼亚联赛积累了经验 | 2021-2023 年在比甲 KV Mechelen 出场 56 次，2023 年随 NS Mura 夺得联赛冠军 |
| 他的经验无可替代 | （注水句——删掉，把字数留给具体事实） |

### wcSpotlight
| ❌ 不好 | ✅ 好 |
|---------|------|
| 将在这届世界杯有出色表现 | 本届大概率从板凳出发，面对控球型对手时可能成为 X 因素 |
| 值得期待 | 2025-26 赛季 14 球 8 助的状态让他带着自信进入世界杯 |
| 是球队重要一员 | 淘汰赛末段守领先时换上来保胜——他的经验无可替代 |
| 本届世界杯最年轻的球员之一 | 全队最年轻的球员，18 岁已获 10 次国家队出场 |
| 他的速度和爆发力会成为对手的噩梦 | 2024 赛季 MLS 场均跑动 11.2 公里，冲刺速度 34.3 km/h——这两个数字在加拿大阵中均列第二 |

---

## 技术惯例

### 脚本执行
- 修改 `players-wiki.json` 时始终使用 `.cjs` 脚本文件，**绝不使用 `node -e` 内联代码**
- 原因：`node -e` 在 PowerShell 中对中文引号、换行符处理不稳定，会导致语法错误
- 脚本放在 `scripts/` 目录，执行后清理

### 文件操作
- 读取大文件时使用 `Read` 工具的 offset/limit 参数分页
- 编辑 JSON 时使用 `Edit` 工具逐个字段修改，**不重写整个文件**
- 注意 `players-wiki.json` 中球员名可能含重音符号（如 `Nicolás`、`Martínez`、`Otamendi`）

### 数据校验
- 俱乐部名称：先在 `squads.json` 中查找该球员的 `club` 字段，**严格匹配**
- 出场/进球：优先使用 `squads.json` 的 `caps`/`goals` 字段
- 年龄以 2026 年 6 月为基准计算

---

## 已知陷阱

1. **全局替换串词**：像 "马丁内斯"、"西蒙尼" 这种常见姓氏如果做全局查找替换，会把球队介绍里的人也污染。始终用球员英文名做精确匹配。
2. **阿根廷球员与主帅混淆**：Scaloni → 斯卡洛尼(阿根廷主帅)，Simeone → 西蒙尼(马竞主帅)。写 Argentina 球员 intro 时注意语境。
3. **巴西球员中文名**：`Vini Jr` 写作 "维尼修斯"，`Endrick` 写作 "恩德里克"，`Paqueta` 写作 "帕奎塔"，`Gabriel Martinelli` 写作 "马丁内利"。保持全文一致。
4. **球员 key 命名**：`players-wiki.json` 的 key 与 `squads.json` 的 `name` 字段完全一致（英文带重音符号）。如 `Emiliano Martínez` 不是 `Emiliano Martinez`。
5. **重音符号匹配**：写脚本时验证数组里的名字必须与数据 key 完全一致。`Ché Adams` 不是 `Che Adams`，`Brahim Díaz` 不是 `Brahim Diaz`，`Marwane Saâdane` 不是 `Marwane Saadane`。写任何脚本前先用 `Object.keys()` 检查名字。
6. **JS 字符串中的中文引号**：中文字符 `""` 在 JS 代码中会被解析为字符串定界符导致语法错误。中文文本内需要强调时用 `「」`，**绝对不要**在 JS 字符串中使用 `"`
7. **字数超标比字数不足更隐蔽**：AI 天然倾向写长。写每个球员时心里必须有目标总字数，写完立即数。B 档球员写到 600 字和 C 档写到 200 字一样是失败。
8. **扩句 ≠ 补充信息**：一个原本 200 字的信息量，乘以 2 倍形容词变成 400 字，和原来 200 字没有区别——用户读到的是同样的内容。字数增长必须对应信息密度增长。

---

## 中文名音译

所有 1248 名球员的中文名存储在 src/data/player-names.json。
前端通过 src/utils/playerLookup.ts 查询。

- 8 大豪门 208 个中文名为手工录入，遵循人名翻译大辞典与足球媒体惯例
- 其余 40 队 1039 个中文名由 scripts/build_cn_names.cjs 程序化生成
- 39 名球星的测试集通过率 39/39 (100%)
- 整体估计准确率约 85-90%
- 已知系统性误差：Slavic -eš 结尾、西班牙 n+ch/g 音节、韩语连字符、荷兰 ij 双元音
- 疑义名称可在 player-names.json 直接修改，脚本不覆盖已有条目
