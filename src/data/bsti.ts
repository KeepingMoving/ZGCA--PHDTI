
export type Rarity = 'N' | 'R' | 'SR' | 'UR';

export interface BSTIResult {
  id: string;
  bsti: string;
  title: string;
  desc: string;
  quote: string;
  rarity: Rarity;
  tags: string[];
  image?: string; // Optional custom image URL to replace the placeholder
}

export const BSTI_DATA: BSTIResult[] = [
  // Elegant Family
  { id: 'p1', bsti: 'AI-GENIUS', title: 'AI高雅天才', desc: '天生为AI而生，豆包、DeepSeek、ChatGPT、Claude 等AI的天才使用者。', quote: '豆包豆包，给我完整可运行代码', rarity: 'UR', tags: ['elegant', 'UR'],
  image: 'images/tc.jpg'
},
  { id: 'p2', bsti: 'COFFEE-CONNOISSEUR', title: '咖啡豆鉴赏家', desc: '负责看护机房里那几台算力节点，品着手冲咖啡，是实验室里最高雅的守护神。', quote: '显卡风扇的轰鸣，是我听过最美的摇篮曲。', rarity: 'SR', tags: ['elegant'],
  image: 'images/PJ.png'
 },
  { id: 'p3', bsti: 'ELEGANT-GEEK', title: '高雅极客', desc: '虽身处内卷泥沼，但依然优雅地敲击着HHKB键盘。', quote: 'Talk is cheap, show me the code, elegantly.', rarity: 'R', tags: ['elegant'],
  image: 'images/JK.jpg'
 },
  { id: 'p4', bsti: 'ARTISTIC-LOAFER', title: '摸鱼雅士', desc: '把摸鱼当成一种行为艺术，即使是发呆也要摆出思考宇宙真理的高雅姿态。', quote: '生命就该浪费在美好的事物上，比如发呆。', rarity: 'N', tags: ['elegant'],
  image: 'images/MoYu.jpg'
 },
  
  // Seasons of ZGC
  { id: 's1', bsti: 'SPRING-SAKURA', title: '春之樱·特征解析器', desc: '如中关村春天的樱花，善于在庞杂的数据中发现绚烂的特征之美。', quote: '万物复苏，模型开始收敛。', rarity: 'SR', tags: ['season'],
  image: 'images/c.png'
 },
  { id: 's2', bsti: 'SUMMER-RAIN', title: '夏之雨·数据清洗池', desc: '像夏天的暴雨一样猛烈，清洗起数据来毫不留情，绝不容许任何脏数据的存在。', quote: '让数据风暴来得更猛烈些吧！', rarity: 'R', tags: ['season'],
  image: 'images/x.png'
 },
  { id: 's3', bsti: 'AUTUMN-LEAF', title: '秋之叶·降本增效徒', desc: '秋意浓厚，果实累累。精通轻量化模型，能把巨大的显存消耗缩减到极致。', quote: '用最小的开销，跑最好的效果。', rarity: 'R', tags: ['season'],
  image: 'images/q.png'
 },
  { id: 's4', bsti: 'WINTER-SNOW', title: '冬之雪·看破红尘客', desc: '经历了无数个Deadline的磨砺，内心已经如冬日初雪般平静。', quote: '延期不惊，看庭前花开花落。', rarity: 'UR', tags: ['season', 'UR'],
  image: 'images/d.png'
 },

  // New Additions
  { id: 'n1', bsti: 'RESEARCH-OX', title: '科研牛马', desc: '早出晚归，全年无休。导师的超级代练，实验室无情的论文打工机器。', quote: '师兄，这组对比实验我今晚就能跑完！', rarity: 'N', tags: [],
  image: 'images/KYNM.jpg'
 },
  { id: 'n2', bsti: 'TOP-LEADER', title: '领军人才', desc: '实验室的绝对核心，发顶会如喝水，天生带有令人膜拜的不可思议学术光环。', quote: '那篇Best Paper其实也就随便写写。', rarity: 'UR', tags: ['UR'],
  image: 'images/LJRC.jpg'
 },
  { id: 'n3', bsti: 'PPT-ARCHITECT', title: 'PPT架构师', desc: '代码一行不写，全靠PPT指点江山，竟然能每次汇报拿A，深谙向上管理。', quote: '这个底层的Logic我们需要再对齐一下。', rarity: 'R', tags: [],
  image: 'images/PPT.jpg'
 },
  { id: 'n4', bsti: 'MIDNIGHT-CRISPY', title: '深夜脆皮', desc: '过着美国时间，喝着枸杞熬着夜，保温杯里泡着参，体检报告全是警告。', quote: '只要我按时吃护肝片，熬夜就伤不到我！', rarity: 'SR', tags: [],
  image: 'images/SYCP.png'
 },
  { id: 'n5', bsti: 'HAIRLINE-WATCHER', title: '发际线守望者', desc: '每多解决一个Bug，就感觉头顶又凉快了一分。生发精华消耗速度堪比GPU显存。', quote: '变秃了，但也变强了。', rarity: 'N', tags: [],
  image: 'images/FJX.png'
 },
  
  // Other AI Personas
  { id: 'o1', bsti: 'MICRO-TUNER', title: '显微镜调参侠', desc: '可以为了0.001的精度提升，在几十个超参数中反复横跳一整周。', quote: '参数差之毫厘，排名失之千里。', rarity: 'N', tags: [],
  image: 'images/xwj.png'
 },
  { id: 'o2', bsti: 'ALCHEMY-MASTER', title: '炼丹术士', desc: '对模型玄学有独特理解，玄学设定随机数种子，跑出的效果无人能复现。', quote: 'Seed=42，好运自然来。', rarity: 'R', tags: [],
  image: 'images/LDSS.jpg'
 },
  { id: 'o3', bsti: 'GPU-SCAVENGER', title: 'GPU拾荒者', desc: '永远在监控GPU的使用状况，别人代码一停，立刻无缝接入自己的任务。', quote: '显存是海绵里的水，挤一挤总会有的。', rarity: 'N', tags: [],
  image: 'images/shz.png'
 },
  { id: 'o4', bsti: 'BUG-SWEEPER', title: '报错清道夫', desc: '对各种诡异的编译错误免疫，看到飘红的终端只觉得索然无味。', quote: '只有我没见过的Bug，没有我修不好的错。', rarity: 'N', tags: [],
  image: 'images/bug.png'
 },
  { id: 'o5', bsti: 'ARXIV-RADAR', title: '论文人肉雷达', desc: '每天早上第一件事就是看论文，脑容量堪比一个向量数据库。', quote: '昨天那篇新发的Paper，我已经复现了。', rarity: 'R', tags: [],
  image: 'images/lw.png'
 },
  { id: 'o6', bsti: 'REVIEW-TYRANT', title: '天选Accept圣体', desc: '别人投稿不是被拒就是大修，只有他总能精准落在审稿人审美点上。实验未必最炸裂，故事未必最硬核，但运气、时机和措辞总能神奇对齐。', quote: '也没什么，就是命里带收。', rarity: 'SR', tags: [],
  image: 'images/ac.jpg'
 },

];

export const RARITY_WEIGHTS = { N: 50, R: 30, SR: 15, UR: 5 };

export const drawBSTI = (biasWeights: Record<string, number> = {}): BSTIResult => {
  const itemScores = BSTI_DATA.map(item => {
    const itemsInRarity = BSTI_DATA.filter(x => x.rarity === item.rarity).length;
    const baseScore = RARITY_WEIGHTS[item.rarity] / itemsInRarity;
    let bonus = 0;
    
    // Check tags for category bonuses
    item.tags.forEach(tag => {
      if (biasWeights[tag]) bonus += biasWeights[tag] * 20; // significant weight modifier
    });

    // Directly boost Rarity if a rarity tag is provided
    if (biasWeights[item.rarity]) {
       bonus += biasWeights[item.rarity] * 10;
    }

    return { item, score: Math.max(0.1, baseScore + bonus) };
  });

  const totalScore = itemScores.reduce((sum, x) => sum + x.score, 0);
  let random = Math.random() * totalScore;
  for (const x of itemScores) {
    random -= x.score;
    if (random <= 0) return x.item;
  }
  return BSTI_DATA[0];
};

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  condition: (unlockedIds: string[], totalDraws: number) => boolean;
}

const ELEGANT_IDS = ['p1', 'p2', 'p3', 'p4'];
const SEASON_IDS = ['s1', 's2', 's3', 's4'];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: '学术起航', desc: '完成你的第一次中关村学院博士人格测试', condition: (_, total) => total >= 1 },
  { id: 'a2', name: '高雅人设', desc: '齐聚中关村高雅人士圈子的四位核心成员', condition: (ids) => ELEGANT_IDS.every(id => ids.includes(id)) },
  { id: 'a3', name: '四季观赏者', desc: '集齐中关村春樱、夏雨、秋叶、冬雪四季', condition: (ids) => SEASON_IDS.every(id => ids.includes(id)) },
  { id: 'a4', name: '天选之子', desc: '在一次抽签中获得了极品(UR)级身份', condition: (ids) => ids.some(id => BSTI_DATA.find(i => i.id === id)?.rarity === 'UR') },
  { id: 'a5', name: '学术肝帝', desc: '累计进行摇签10次以上，继续保持！', condition: (_, total) => total >= 10 },
  { id: 'a6', name: '中关村图鉴', desc: '竟然集齐了所有的学术潜藏人格！', condition: (ids) => ids.length === BSTI_DATA.length }
];

export interface QuestionOption {
  text: string;
  bias: Record<string, number>;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1', text: '深夜两点模型Loss突然变成NaN，你的第一反应是？',
    options: [
      { text: '默默回寝室被窝逃避现实', bias: { 'season': 1, 'N': 1 } },
      { text: '怒把学习率下降10倍重跑', bias: { 'elegant': 1 } },
      { text: '敲钟祈福，请求祖师爷赏饭', bias: { 'UR': 1 } }
    ]
  },
  {
    id: 'q2', text: '发现机房有一张A100刚刚空闲下来...',
    options: [
      { text: '这不就是等我的吗？立刻插队运行', bias: { 'elegant': 1 } },
      { text: '太好了，继续挂在后台划水', bias: { 'N': 1 } },
      { text: '在群里高喊谁不用我用了', bias: { 'season': 1 } }
    ]
  },
  {
    id: 'q3', text: '最喜欢在哪种环境下疯狂输出代码？',
    options: [
      { text: '春天樱花烂漫，充满生机', bias: { 'season': 2 } },
      { text: '拉上窗帘，伴着赛博朋克的灯光', bias: { 'elegant': 1, 'UR': 1 } },
      { text: '只要不让我去办公室，哪儿都行', bias: { 'N': 1 } }
    ]
  },
  {
    id: 'q4', text: '如果中关村下雪了，你会怎么做？',
    options: [
      { text: '下楼打雪仗，不理paper', bias: { 'season': 1, 'N': 1 } },
      { text: '看着窗外的雪，突然感悟出新的Idea', bias: { 'season': 2, 'UR': 1 } }
    ]
  },
  {
    id: 'q5', text: '今天在食堂发现了售价98元的精品手冲...',
    options: [
      { text: '马上买一杯品鉴，保持高雅', bias: { 'elegant': 2 } },
      { text: '看一眼价格，默默走开去喝白水', bias: { 'N': 1 } }
    ]
  },
  {
    id: 'q6', text: '写论文排版时，你的态度是？',
    options: [
      { text: '公式没对齐绝对无法忍受', bias: { 'elegant': 1, 'SR': 1 } },
      { text: '反正是套模板，能运行就行', bias: { 'N': 1, 'season': 1 } }
    ]
  },
  {
    id: 'q7', text: '同门突然发了一篇顶会，你的心态？',
    options: [
      { text: '我酸了，今天晚上必须通宵', bias: { 'season': 1, 'SR': 1 } },
      { text: '抱大腿，求带飞', bias: { 'elegant': 1, 'N': 1 } }
    ]
  },
  {
    id: 'q8', text: '如何看待那些动辄数千亿参数的大模型？',
    options: [
      { text: '那是属于AGI的美妙未来', bias: { 'UR': 2 } },
      { text: '算力刺客，我选择轻量化', bias: { 'season': 1 } },
      { text: '关我啥事，我又跑不动', bias: { 'N': 1, 'elegant': 1 } }
    ]
  },
  {
    id: 'q9', text: '收到审稿意见：Strong Reject。你打算：',
    options: [
      { text: '当场怒批审稿人不懂欣赏', bias: { 'elegant': 1, 'SR': 1 } },
      { text: '看破红尘，慢慢修改再投', bias: { 'season': 2 } }
    ]
  },
  {
    id: 'q10', text: '桌面上最重要的解压物品是？',
    options: [
      { text: '梵高的星空复刻摆件', bias: { 'elegant': 2 } },
      { text: '四季不同的干花盲盒', bias: { 'season': 2 } },
      { text: '只有满桌的废纸和咖啡', bias: { 'UR': 1 } }
    ]
  },
  {
    id: 'q11', text: '别人说你做的方向很冷门，你会？',
    options: [
      { text: '冷门好发文章啊，嘿嘿', bias: { 'elegant': 1 } },
      { text: '我相信它未来会改变世界', bias: { 'UR': 2 } }
    ]
  },
  {
    id: 'q12', text: '开源社区的Issue被原作者点赞了！',
    options: [
      { text: '截图发几十个研究群炫耀', bias: { 'N': 1, 'elegant': 1 } },
      { text: '深藏功与名，继续提交PR', bias: { 'season': 1, 'SR': 1 } }
    ]
  },
  {
    id: 'q13', text: '组会要讲Paper，你一般怎么准备？',
    options: [
      { text: '通宵阅读源码，做几十页PPT', bias: { 'SR': 1, 'UR': 1 } },
      { text: '开局一张图，全靠临场发挥', bias: { 'elegant': 1, 'N': 1 } }
    ]
  },
  {
    id: 'q14', text: '实验室断网断电一天，你怎么办？',
    options: [
      { text: '终于有借口出门赏秋看景了', bias: { 'season': 2 } },
      { text: '跑到旁边的咖啡厅点杯手冲继续写', bias: { 'elegant': 1, 'SR': 1 } }
    ]
  },
  {
    id: 'q15', text: '你的代码经常会出现哪种类型的Bug？',
    options: [
      { text: '形状不匹配（Dimension Mismatch）', bias: { 'N': 1 } },
      { text: '根本不知道哪里在报错的离谱Bug', bias: { 'elegant': 1 } }
    ]
  },
  {
    id: 'q16', text: '读博以来，最让你开心的事情是？',
    options: [
      { text: '模型终于如期收敛了', bias: { 'season': 1, 'SR': 1 } },
      { text: '领补助的日子又到了', bias: { 'N': 1, 'elegant': 1 } }
    ]
  },
  {
    id: 'q17', text: '参加顶会交流，你的首要目标是？',
    options: [
      { text: '抓住大佬合影留念', bias: { 'elegant': 1 } },
      { text: '去宣扬我的AGI宏大理论', bias: { 'UR': 2 } },
      { text: '只是为了能趁机去旅游看风景', bias: { 'season': 2 } }
    ]
  },
  {
    id: 'q18', text: '如果中关村变成魔法世界，你想当？',
    options: [
      { text: '掌握自然法则的四季掌控者', bias: { 'season': 2 } },
      { text: '品味着红酒的高雅魔法师', bias: { 'elegant': 2 } }
    ]
  },
  {
    id: 'q19', text: '你最喜欢的学术黑话是？',
    options: [
      { text: 'End-to-end (端到端)', bias: { 'SR': 1 } },
      { text: 'State-of-the-art (SOTA)', bias: { 'UR': 1 } },
      { text: 'Robustness (鲁棒性)', bias: { 'season': 1 } }
    ]
  },
  {
    id: 'q20', text: '关于毕业，你现在的状态是？',
    options: [
      { text: '文章在手，随时可以走人', bias: { 'SR': 1, 'UR': 1 } },
      { text: '佛系读博，缘分到了自然毕业', bias: { 'season': 2, 'N': 1 } }
    ]
  }
];
