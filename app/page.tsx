'use client';

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Clapperboard,
  Copy,
  ClipboardList,
  Database,
  FileText,
  Film,
  Lock,
  PenLine,
  RefreshCcw,
  Search,
  Sparkles,
  Plus,
  Trash2,
  Wand2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ProductionType = 'AI 剧' | '真人剧';
type GenerationMode = '结构事件库组合' | '爆款迭代';
type ContentTrack = '女频爱情剧' | '女频逆袭爽剧';
type StepId = 'create' | 'brief' | 'beats' | 'result' | 'script';
type BeatKey =
  | '原生困境'
  | '宿命羁绊'
  | '宿命启动'
  | '生存危机'
  | '绑定关系';

type BeatInstance = { id: string; key: BeatKey };
type EventCandidate = {
  title: string;
  functionText: string;
  scenes: string[];
  hook: string;
  emotion: string;
  sources: string[];
};

const themeTags = [
  '现代豪门',
  '黑帮家族',
  '皇室宫廷',
  '狼人 / 吸血鬼',
  '魔法奇幻',
  '末日生存',
  '西部小镇',
  '小镇秘密',
  '校园青春',
  '职场精英',
  '娱乐圈',
  '医疗 / 律政',
  '军旅 / 特工',
  '体育竞技',
  '历史时代剧',
  '节日 / 度假地',
  '家族继承',
  '契约婚姻',
  '秘密孩子',
  '单亲育儿',
  '重生 / 第二次机会',
  '穿越 / 灵魂互换',
  '身份掉马',
  '复仇打脸',
  '悬疑谜案',
  '禁忌关系',
  '豪门联姻',
  '假身份潜伏',
  '救赎与治愈',
];

const storyTypes = [
  '先虐后爽',
  '复仇打脸',
  '强制爱 / 占有欲',
  '甜宠治愈',
  '追妻火葬场',
  '宿命虐恋',
  '禁忌拉扯',
  '身份逆袭',
  '悬疑救赎',
  '成长独立',
];

const coreBonds = [
  '契约婚姻',
  '救命恩人',
  '仇人共谋',
  '宿命印记',
  '真假身份',
  '共同孩子 / 单亲育儿',
  '继承与监护',
  '秘密同盟',
  '雇佣关系变真爱',
  '旧爱重逢',
];

const emotionModes = [
  '强爽感',
  '先虐后爽',
  '强制爱',
  '甜宠高糖',
  '高压悬疑',
  '宿命虐感',
  '暧昧拉扯',
  '治愈成长',
];

type HitShow = {
  id: string;
  title: string;
  genre: string;
  platform: string;
  updated: string;
  episodes: string;
  tags: string[];
  score: string;
  hook: string;
};

const hitShows: HitShow[] = [
  {
    id: 'hit-1',
    title: 'The Bride Claimed by the Cursed Heir',
    genre: '女频爱情剧',
    platform: 'ReelShort',
    updated: '今日更新',
    episodes: '60 集 · 免费第 8 集',
    tags: ['婚礼背叛', '契约婚姻', '家族诅咒'],
    score: '92',
    hook: '婚礼背叛 → 危险救援 → 契约绑定',
  },
  {
    id: 'hit-2',
    title: 'My Alpha’s Rejected Mate',
    genre: '女频爱情剧',
    platform: 'DramaBox',
    updated: '昨日更新',
    episodes: '72 集 · 免费第 10 集',
    tags: ['狼人王族', '拒绝婚约', '身份掉马'],
    score: '89',
    hook: '公开拒绝 → 生存危机 → Alpha 反悔追妻',
  },
  {
    id: 'hit-3',
    title: 'The Billionaire’s Secret Baby',
    genre: '女频爱情剧',
    platform: 'ShortMax',
    updated: '3 天前',
    episodes: '48 集 · 免费第 7 集',
    tags: ['豪门', '秘密孩子', '旧爱重逢'],
    score: '86',
    hook: '五年后重逢 → 孩子身份暴露 → 共同监护',
  },
  {
    id: 'hit-4',
    title: 'Married to My Enemy King',
    genre: '女频爱情剧',
    platform: 'NetShort',
    updated: '本周热门',
    episodes: '80 集 · 免费第 9 集',
    tags: ['王室权谋', '仇人共谋', '强制爱'],
    score: '84',
    hook: '家国仇恨 → 敌国联姻 → 王位反转',
  },
  {
    id: 'hit-5',
    title: 'The Heiress Returns to Ruin Them All',
    genre: '女频逆袭爽剧',
    platform: 'ShortMax',
    updated: '今日新入库',
    episodes: '56 集 · 免费第 8 集',
    tags: ['真假千金', '复仇打脸', '身份逆袭'],
    score: '91',
    hook: '被逐出家门 → 隐藏身份回归 → 公开清算全家',
  },
  {
    id: 'hit-6',
    title: 'The Emperor’s Hidden Blade',
    genre: '其他类型',
    platform: 'DramaBox',
    updated: '本周热门',
    episodes: '64 集 · 免费第 9 集',
    tags: ['权谋', '复仇', '隐藏身份'],
    score: '88',
    hook: '被迫称臣 → 掌握底牌 → 反转夺权',
  },
  {
    id: 'hit-7',
    title: 'The Locked Room Witness',
    genre: '其他类型',
    platform: 'FlexTV',
    updated: '昨日更新',
    episodes: '42 集 · 免费第 6 集',
    tags: ['悬疑', '密室', '身份谜案'],
    score: '85',
    hook: '唯一目击者 → 被迫合作 → 真凶即将现身',
  },
];

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title?: string;
          description: string;
          inputSchema: object;
          annotations?: {
            readOnlyHint?: boolean;
            untrustedContentHint?: boolean;
          };
          execute: (input: unknown) => unknown;
        },
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const steps: { id: StepId; label: string; icon: typeof ClipboardList }[] = [
  { id: 'create', label: '新建项目', icon: ClipboardList },
  { id: 'brief', label: '填写 Brief', icon: PenLine },
  { id: 'beats', label: '5 Beat 编排', icon: Database },
  { id: 'result', label: '故事方案', icon: Sparkles },
  { id: 'script', label: '前 3 集剧本', icon: BookOpenText },
];

const beatCards: {
  key: BeatKey;
  question: string;
  selected: string;
  functionText: string;
  emotion: string;
  risk: string;
}[] = [
  {
    key: '原生困境',
    question: '女主为什么必须改变？',
    selected: '女主被公开羞辱、背叛或诬陷，观众开始等待她翻盘',
    functionText: '建立女主的初始低位和情绪债，让观众知道她为什么必须逃离、反击或改命。',
    emotion: '憋屈 / 羞辱 / 反击期待',
    risk: '原生困境不能只靠吵架，需要身份、证据、孩子或生命风险叠加。',
  },
  {
    key: '宿命羁绊',
    question: '男女主为什么必须产生关系？',
    selected: '女主误认男主身份，并把他拉进假关系对抗外部压力',
    functionText: '用误会、契约、救命、孩子或身份错认，让男女主形成不可回避的连接。',
    emotion: '好奇 / 反转 / 暧昧',
    risk: '羁绊必须有外部压力和情绪吸引，不能只是普通偶遇。',
  },
  {
    key: '宿命启动',
    question: '为什么这段关系不可替代？',
    selected: '女主或男主身上的隐藏身份、血脉、证据、孩子线被启动',
    functionText: '把偶然连接升级为不可替代关系，让双方必须继续靠近。',
    emotion: '宿命感 / 好奇 / 权力反转',
    risk: '宿命设定要尽早落到具体事件，避免解释过重。',
  },
  {
    key: '生存危机',
    question: '为什么女主现在必须依靠男主，或男主必须保护女主？',
    selected: '反派把女主推入生命、名誉、孩子或权力危机，男主保护与误伤并存',
    functionText: '用强危机推动保护、误会、救援和追悔，放大爱情线的甜虐张力。',
    emotion: '紧张 / 救场 / 甜虐',
    risk: '危机要有强视觉或强情绪，不然只是普通冲突升级。',
  },
  {
    key: '绑定关系',
    question: '为什么两人必须长期在一起？',
    selected: '契约、婚约、合法身份、孩子或秘密任务让两人关系不可逆',
    functionText: '将短期救援转成长期绑定，让同居、误会、亲密升级和身份引爆合理发生。',
    emotion: '占有 / 拉扯 / 安全感 / 高燃',
    risk: '绑定条件要具体，不能只写“为了保护”。',
  },
];

const initialBeatSequence: BeatInstance[] = beatCards.map((beat, index) => ({
  id: `beat-${index + 1}`,
  key: beat.key,
}));

const eventPool: Record<BeatKey, EventCandidate[]> = {
  原生困境: [
    {
      title: '公开羞辱女主身份',
      functionText: '快速建立女主低位，制造观众对反击的期待。',
      scenes: ['高端餐厅', '晚宴', '学校', '公司', '医院', '贵族聚会'],
      hook: '卡在女主无法自证清白。',
      emotion: '憋屈 / 愤怒',
      sources: ['Brides in Smoke', 'XXL Outcast'],
    },
    {
      title: '小三或假妻子登场',
      functionText: '挑战女主的合法性，把婚恋关系推向正面对峙。',
      scenes: ['婚礼', '医院', '别墅门口', '慈善宴'],
      hook: '卡在男主即将选择谁。',
      emotion: '憋屈 / 紧张',
      sources: ['Brides in Smoke', 'DramaWave_A Rainha Voltou ao Jogo'],
    },
    {
      title: '孩子或怀孕危机',
      functionText: '用母性和生命风险放大女主困境。',
      scenes: ['产房', '楼梯', '行李箱', '急救室', '车祸现场'],
      hook: '卡在医生或救援者带来坏消息。',
      emotion: '恐惧 / 心疼',
      sources: ["They Don't Know I'm the Don's Pregnant Queen", 'DramaWave_A Rainha Voltou ao Jogo'],
    },
    {
      title: '被诬陷出轨、偷窃或伤人',
      functionText: '让女主名誉崩塌，推动证据线和反击线。',
      scenes: ['酒店房间', '展会', '监控盲区', '直播间'],
      hook: '卡在证据被反派掌控。',
      emotion: '憋屈 / 反击期待',
      sources: ['XXL Outcast', 'Brides in Smoke'],
    },
  ],
  宿命羁绊: [
    {
      title: '女主误认男主身份',
      functionText: '女主把真实未婚夫、权贵、黑帮老大误认为男模、司机、保镖或普通人。',
      scenes: ['酒吧', '酒店', '机场', '婚礼后台', '医院走廊'],
      hook: '卡在男主知道真相但不说。',
      emotion: '反转 / 暧昧',
      sources: ['Fated to Love You', 'Brides in Smoke'],
    },
    {
      title: '假情侣或假婚姻挡箭牌',
      functionText: '女主为对抗逼婚、家族羞辱或前任刺激，临时拉男主假扮伴侣。',
      scenes: ['家宴', '订婚宴', '发布会', '公司会议'],
      hook: '卡在假关系被迫公开。',
      emotion: '刺激 / 好奇',
      sources: ['Fated to Love You'],
    },
    {
      title: '救命关系埋钩',
      functionText: '一方救过另一方，但身份被隐藏、遗忘或被别人冒领。',
      scenes: ['车祸', '火灾', '雨夜', '绑架', '狼人袭击'],
      hook: '卡在真正救命证据即将出现。',
      emotion: '宿命 / 亏欠',
      sources: ['XXL Outcast', "They Don't Know I'm the Don's Pregnant Queen"],
    },
    {
      title: '禁忌三角连接',
      functionText: '女主在名义伴侣和真正吸引对象之间被迫撕扯，制造危险亲密。',
      scenes: ['公路旅行', '豪宅同住', '家族度假', '密闭车厢'],
      hook: '卡在即将被第三方发现。',
      emotion: '甜 / 危险 / 拉扯',
      sources: ['Endless Desire Highway'],
    },
  ],
  宿命启动: [
    {
      title: '男主真实身份线启动',
      functionText: '用一句称呼、一个权限或一次救场，让观众意识到男主不是普通人。',
      scenes: ['董事会', '黑帮集会', '王室议会', '医院 VIP 通道'],
      hook: '卡在众人跪服或称呼出口。',
      emotion: '震惊 / 高燃',
      sources: ["They Don't Know I'm the Don's Pregnant Queen", 'Fated to Love You'],
    },
    {
      title: '女主真实身份线启动',
      functionText: '女主的血脉、继承、马甲、前世记忆或旧物开始发挥作用。',
      scenes: ['亲子鉴定', '王室血脉', '集团继承', '前世记忆', '隐藏马甲'],
      hook: '卡在证据打开前一秒。',
      emotion: '爽 / 震惊',
      sources: ['XXL Outcast', 'Fated to Love You'],
    },
    {
      title: '救命恩被重新指认',
      functionText: '过去的救命关系被唤醒，男女主关系从偶然变成命定。',
      scenes: ['旧照片', '伤疤', '母亲遗物', '监控回放', '证人口供'],
      hook: '卡在真正救命证据即将出现。',
      emotion: '宿命 / 亏欠',
      sources: ['XXL Outcast', 'Fated to Love You'],
    },
    {
      title: '假身份开始露馅',
      functionText: '假妻子、假千金或冒领救命恩人的反派出现破绽。',
      scenes: ['监控', 'DNA', '旧物', '证人', '伤疤'],
      hook: '卡在反派还嘴硬。',
      emotion: '悬念 / 解气预期',
      sources: ['Brides in Smoke', 'DramaWave_A Rainha Voltou ao Jogo'],
    },
  ],
  生存危机: [
    {
      title: '男主暗中保护',
      functionText: '保持甜感，同时继续保留身份悬念。',
      scenes: ['资金救场', '医生安排', '保镖清场', '舆论压制'],
      hook: '卡在女主不知道是谁帮她。',
      emotion: '甜 / 安全感',
      sources: ['Fated to Love You'],
    },
    {
      title: '男主因信息差误伤女主',
      functionText: '制造虐点和追悔空间，但需要让误会有可信理由。',
      scenes: ['误信小三', '误认假证据', '为大局隐瞒真相'],
      hook: '卡在女主心碎离开。',
      emotion: '虐 / 追悔',
      sources: ["They Don't Know I'm the Don's Pregnant Queen"],
    },
    {
      title: '男主暴力救援',
      functionText: '制造强保护欲和强爽点，让男主权力短暂外露。',
      scenes: ['黑帮围攻', '直升机救援', '破门而入', '婚礼抢人'],
      hook: '卡在男主真实权力暴露。',
      emotion: '爽 / 高燃',
      sources: ["They Don't Know I'm the Don's Pregnant Queen", 'Fated to Love You'],
    },
    {
      title: '男主第一次动摇',
      functionText: '男主从冷漠或误会转向相信女主，感情开始真正变化。',
      scenes: ['医院陪护', '独自带娃', '看到伤口', '听到真相片段'],
      hook: '卡在他要不要道歉。',
      emotion: '心疼 / 甜虐',
      sources: ['XXL Outcast', 'Fated to Love You'],
    },
  ],
  绑定关系: [
    {
      title: '假情侣或假婚姻转长期契约',
      functionText: '女主为对抗逼婚、羞辱或前任，和男主形成长期绑定。',
      scenes: ['家宴', '订婚宴', '发布会', '公司会议'],
      hook: '卡在假关系被迫公开。',
      emotion: '刺激 / 好奇',
      sources: ['Fated to Love You'],
    },
    {
      title: '男女主合法关系公开',
      functionText: '把暧昧或误认关系升级成“她才是真正的妻子/未婚妻”。',
      scenes: ['婚礼', '家宴', '记者会', '警局', '医院'],
      hook: '卡在男主会不会承认她。',
      emotion: '甜 / 高燃',
      sources: ['Brides in Smoke', 'Fated to Love You'],
    },
    {
      title: '女主用专业能力换取留在男主身边',
      functionText: '女主证明自己不可替代，绑定关系从被保护变成互相需要。',
      scenes: ['珠宝展', '击剑对决', '商业谈判', '医学诊断', '设计大赛'],
      hook: '卡在她刚要开口或出手。',
      emotion: '解气 / 反转',
      sources: ['Fated to Love You', 'XXL Outcast'],
    },
    {
      title: '女主不再求男主',
      functionText: '让女主从情感低位转为主动选择，倒逼男主追悔并重新绑定。',
      scenes: ['离婚声明', '搬离豪宅', '拒绝回家', '公开切割'],
      hook: '卡在男主追上来。',
      emotion: '爽 / 心疼',
      sources: ['DramaWave_A Rainha Voltou ao Jogo', 'XXL Outcast'],
    },
  ],
};

// Weekly learning update: events distilled from the 12 overseas AI short-drama titles
// read from the Feishu source on 2026-09-08. Each event is stored by its fixed
// female-romance mother beat so Mode A can reuse the function without copying plot text.
const weeklyLearnedEvents: Record<BeatKey, EventCandidate[]> = {
  原生困境: [
    {
      title: '豪门育儿岗位羞辱式面试',
      functionText: '把求职、生存和阶层羞辱压缩到一个开场事件，立即建立女主低位和照护动机。',
      scenes: ['豪门面试厅', '育儿房', '贵族宅邸'],
      hook: '卡在女主被要求接受更屈辱的检查，或孩子突然只认她。',
      emotion: '羞辱 / 心疼 / 反击期待',
      sources: ["The Billionaire's Wet Nurse"],
    },
    {
      title: '贫穷丈夫误认与婚姻压力',
      functionText: '用贫富错位和婚姻现实压力建立女主的情感缺口，为后续身份反转留空间。',
      scenes: ['登记处', '租住公寓', '家族家宴'],
      hook: '卡在丈夫露出不符合“贫穷”身份的资源或权限。',
      emotion: '委屈 / 好奇 / 期待反转',
      sources: ['Mi Pobre Esposo es Billonario (Doblado)'],
    },
    {
      title: '底层身份长期受辱',
      functionText: '让主角被当作清洁工、实习生或无名小人物，先压低社会位置，再为强者回归蓄力。',
      scenes: ['写字楼', '后勤通道', '公开宴会'],
      hook: '卡在所有人要求他背锅，而他即将第一次出手。',
      emotion: '憋屈 / 忍耐 / 爽感预期',
      sources: ['THE JANITOR Rise of The Prime'],
    },
    {
      title: '家人失踪留下唯一线索',
      functionText: '用亲人失踪把家庭情感和超能谜团绑定，给主角一个必须继续追查的目标。',
      scenes: ['失踪现场', '监控室', '太空/实验线索'],
      hook: '卡在失踪者留下异常影像或仍然活着的证据。',
      emotion: '焦虑 / 心疼 / 悬念',
      sources: ['Their Brother Lost In Space'],
    },
    {
      title: '专业女性被资本系统压制',
      functionText: '用职场权力差制造女主的现实困境，让后续专业反击具备情绪收益。',
      scenes: ['律所', '航空公司会议室', '听证会'],
      hook: '卡在女主拿到能击穿对手的第一份证据。',
      emotion: '压抑 / 愤怒 / 反击期待',
      sources: ['The Lawyer Who Bankrupted the Airline'],
    },
  ],
  宿命羁绊: [
    {
      title: '救命者与照护对象形成豪门绑定',
      functionText: '把育儿、救命和豪门家主关系合并，让女主进入男主生活有具体理由。',
      scenes: ['豪门育儿房', '庄园走廊', '坠落救援现场'],
      hook: '卡在男主以隐藏身份救下女主，女主却不知道救命者是谁。',
      emotion: '依赖 / 暧昧 / 宿命感',
      sources: ["The Billionaire's Wet Nurse"],
    },
    {
      title: '封闭空间同行放大危险亲密',
      functionText: '用公路、车辆或临时共处把身体吸引和控制权争夺变成不可回避的关系。',
      scenes: ['公路', '车内', '临时落脚点'],
      hook: '卡在身体界限被打破，双方必须面对关系后果。',
      emotion: '暧昧 / 危险 / 拉扯',
      sources: ['Endless Desire Highway'],
    },
    {
      title: '萌宝认亲成为 CEO 关系入口',
      functionText: '让孩子成为男女主重连的主动连接器，同时带出家族与亲子冲突。',
      scenes: ['公司大厅', '幼儿园', '豪门家宴'],
      hook: '卡在孩子喊出关键称呼或亲子鉴定结果即将公布。',
      emotion: '惊喜 / 心软 / 甜宠期待',
      sources: ["The Baby Came Knocking CEO Daddy You're Mine"],
    },
    {
      title: '五位兽夫契约启动多关系线',
      functionText: '用契约把多位功能型角色绑定到女主复仇任务，形成可分层推进的关系群。',
      scenes: ['契约仪式', '兽人领地', '团队集结'],
      hook: '卡在第一位伴侣站队，或第二位伴侣带着敌意出现。',
      emotion: '新鲜 / 占有 / 多线期待',
      sources: ['Taming My Five Beast Husbands'],
    },
  ],
  宿命启动: [
    {
      title: '黑狼变身暴露男主异常身份',
      functionText: '用一次强视觉救援把关系从偶然相遇升级为世界规则和身份秘密。',
      scenes: ['悬崖边', '雨夜', '禁区'],
      hook: '卡在女主看见黑狼真身，却还不知道他就是身边的男人。',
      emotion: '震惊 / 救赎 / 好奇',
      sources: ["The Billionaire's Wet Nurse"],
    },
    {
      title: '隐藏继承人露出权限破绽',
      functionText: '用一次专业判断、权限调用或家族物件启动女主真实身份线。',
      scenes: ['医院', '董事会', '继承文件室'],
      hook: '卡在旁人发现她拥有不该拥有的权限。',
      emotion: '爽感 / 紧张 / 身份悬念',
      sources: ['The Undercover Heiress in Ward'],
    },
    {
      title: '亿万富翁身份从资源使用中露馅',
      functionText: '不直接揭示身份，而是先让男主动用不匹配的资源，逐步制造身份破绽。',
      scenes: ['豪门家宴', '危机现场', '公司会议'],
      hook: '卡在女主追问“你到底是谁”，男主仍然拒答。',
      emotion: '好奇 / 甜宠 / 反转预期',
      sources: ['Mi Pobre Esposo es Billonario (Doblado)'],
    },
    {
      title: '归来女王亮出第一张底牌',
      functionText: '用一次公开亮相和旧敌失势，把女主从失势者切换成主动操盘者。',
      scenes: ['归来宴会', '董事会', '公开发布会'],
      hook: '卡在女主说出旧敌最害怕的身份或证据。',
      emotion: '高燃 / 解气 / 期待升级',
      sources: ['DramaWave_A Rainha Voltou ao Jogo'],
    },
  ],
  生存危机: [
    {
      title: '黑狼接住坠落女主',
      functionText: '以强视觉救援同时完成危险升级、男主保护和身份悬念。',
      scenes: ['高处坠落', '禁区', '狼群追击'],
      hook: '卡在女主被黑狼接住后，抬头看见熟悉的眼睛。',
      emotion: '恐惧 / 救赎 / 心跳',
      sources: ["The Billionaire's Wet Nurse"],
    },
    {
      title: '黑帮孕情与追杀并行',
      functionText: '把孩子、身体风险和黑帮权力斗争叠加，快速提高女主的生存成本。',
      scenes: ['黑帮仓库', '医院', '逃亡车辆'],
      hook: '卡在追杀者发现孕情，或男主为保护孩子暴露权力。',
      emotion: '恐惧 / 心疼 / 高压',
      sources: ["They Don't Know I'm the Don's Pregnant Queen"],
    },
    {
      title: '资本系统反扑封锁证据',
      functionText: '让女主的专业反击面对现实代价，避免“拿到证据就立即胜利”。',
      scenes: ['听证会', '公司封锁', '媒体发布会'],
      hook: '卡在关键证人被带走或证据即将被销毁。',
      emotion: '紧张 / 愤怒 / 追击',
      sources: ['The Lawyer Who Bankrupted the Airline'],
    },
    {
      title: '超能追踪逼近失踪真相',
      functionText: '将家人线索转化为现实追杀，让寻找任务具备即时危险。',
      scenes: ['实验室', '地下通道', '城市追踪'],
      hook: '卡在主角发现追踪者拥有与失踪者相同的能力。',
      emotion: '悬疑 / 恐惧 / 追查',
      sources: ['Their Brother Lost In Space'],
    },
  ],
  绑定关系: [
    {
      title: '照护岗位转为长期同居契约',
      functionText: '把短期育儿工作升级为长期共处，让日常照护自然承载暧昧和身份秘密。',
      scenes: ['豪门庄园', '育儿房', '家庭晚餐'],
      hook: '卡在男主提出只有女主能留下的特殊条件。',
      emotion: '依赖 / 暧昧 / 安全感',
      sources: ["The Billionaire's Wet Nurse"],
    },
    {
      title: '孩子把陌生男女锁进共同监护',
      functionText: '以亲子责任迫使男女主长期合作，使关系推进不依赖偶然见面。',
      scenes: ['共同监护协议', '学校', '豪门家宴'],
      hook: '卡在亲子关系被公开，双方必须共同面对家族。',
      emotion: '甜宠 / 紧张 / 责任感',
      sources: ["The Baby Came Knocking CEO Daddy You're Mine"],
    },
    {
      title: '重生女主与多位伴侣建立功能契约',
      functionText: '让每一位伴侣承担不同能力和情感功能，支撑长剧多线并行。',
      scenes: ['契约大厅', '任务地图', '共同战斗'],
      hook: '卡在新契约签下后，前世仇人同步现身。',
      emotion: '占有 / 团队感 / 爽感',
      sources: ['Taming My Five Beast Husbands'],
    },
    {
      title: '婚姻误认转为真实伴侣选择',
      functionText: '先用贫富误认制造关系错位，再让男主用真实资源证明保护和承诺。',
      scenes: ['登记处', '家族晚宴', '危机救场'],
      hook: '卡在男主第一次公开站到女主身边，身份却仍未揭开。',
      emotion: '误会 / 甜宠 / 期待揭示',
      sources: ['Mi Pobre Esposo es Billonario (Doblado)'],
    },
  ],
};

Object.entries(weeklyLearnedEvents).forEach(([beat, events]) => {
  eventPool[beat as BeatKey].push(...events);
});

type LearningPattern = {
  title: string;
  structure: string;
  writing: string;
  cliffhanger: string;
};

// These are benchmark patterns for scoring and generation. They describe reusable
// craft functions, not copied text or a promise that the model has been retrained.
const weeklyLearningCorpus: LearningPattern[] = [
  { title: "The Billionaire's Wet Nurse", structure: '照护入口→身份错位→强视觉救援→豪门长期绑定', writing: '用短对白和权力差快速建立人物位置', cliffhanger: '面试羞辱、黑狼救人、身份追问' },
  { title: 'Endless Desire Highway', structure: '封闭同行→身体界限试探→控制失效→关系后果', writing: '用空间限制把欲望写成连续动作', cliffhanger: '车内越界、身体距离、下一步选择' },
  { title: 'The Lawyer Who Bankrupted the Airline', structure: '职场压制→证据搜集→专业反击→资本反扑', writing: '让专业行动承担情绪爽点', cliffhanger: '证据出现、证人失联、对手反制' },
  { title: "They Don't Know I'm the Don's Pregnant Queen", structure: '孕情暴露→黑帮追杀→母子保护→女王身份回归', writing: '把身体风险和权力风险叠加', cliffhanger: '孕情、孩子筹码、暴力救援' },
  { title: 'Their Brother Lost In Space', structure: '亲人失踪→异常线索→超能追踪→失踪真相', writing: '每次解释都带出更大的问题', cliffhanger: '影像、坐标、能力同源' },
  { title: 'The Undercover Heiress in Ward', structure: '潜伏受压→专业露锋→身份试探→继承人反击', writing: '用可验证的专业动作代替空泛马甲', cliffhanger: '权限破绽、遗嘱线索、身份暴露' },
  { title: "The Hockey Captain's Secret Lessons", structure: '秘密课程→校园压力→特殊保护→关系公开', writing: '用训练动作承载暧昧和冲突', cliffhanger: '队长保护、误会、公开承认' },
  { title: 'DramaWave_A Rainha Voltou ao Jogo', structure: '失势离场→女王归来→旧敌挑衅→公开清算', writing: '回归场景先给情绪兑现，再补底牌', cliffhanger: '归来亮相、旧敌失势、底牌亮出' },
  { title: "The Baby Came Knocking CEO Daddy You're Mine", structure: '萌宝认亲→共同照护→家族阻力→亲子兑现', writing: '用孩子主动行为推动成人关系', cliffhanger: '关键称呼、鉴定结果、家族阻拦' },
  { title: 'THE JANITOR Rise of The Prime', structure: '底层受辱→隐藏能力→第一次救场→强者回归', writing: '先延迟能力展示，集中释放一次', cliffhanger: '受辱、救场、强敌认出' },
  { title: 'Taming My Five Beast Husbands', structure: '重生目标→多伴侣契约→团队组建→前世仇人', writing: '用角色功能差异支撑多线关系', cliffhanger: '第一契约、第二角色、前世仇人' },
  { title: 'Mi Pobre Esposo es Billonario (Doblado)', structure: '贫富误认→婚姻共处→资源破绽→财富身份反转', writing: '身份反转通过资源细节逐步露出', cliffhanger: '契约婚姻、豪门救场、身份破绽' },
];

const weeklyLearningStats = {
  titles: weeklyLearningCorpus.length,
  sourceDocs: 23,
  learnedEvents: Object.values(weeklyLearnedEvents).reduce((total, events) => total + events.length, 0),
  benchmarkDimensions: ['Beat 编排', '开场抓点', '关系升级', '集尾卡点', '付费驱动力', '差异化风险'],
};

const episodes = [
  {
    ep: '第 1 集',
    title: '婚礼前的背叛',
    words: 826,
    duration: '2 分 18 秒',
    hook: '女主听见未婚夫和继妹计划骗走她的信托基金。',
    script:
      'INT. 酒店试衣间 - 夜\nNatalie 穿着婚纱站在镜前，手指轻轻压着母亲留下的蓝宝石项链。\n门外传来 Julian 的声音。\nJULIAN：等她说完“我愿意”，信托就会自动转到夫妻共同账户。\n继妹 Elle 笑了一声。\nELLE：那你还要装多久爱她？\nNatalie 的脸色一点点失去血色。她推开门，Julian 先是慌乱，随后冷笑。\nJULIAN：你终于听见了。那又怎样？没有我，你连今天的酒店钱都付不起。\nElle 上前扯住 Natalie 的头纱。\nELLE：姐姐，别哭花了妆。等会儿你还要上台呢。\nNatalie 抬手想夺回头纱，门外忽然响起枪声。一个满身血迹的男人撞进试衣间，反手锁门。\n他抬眼看向 Natalie。\nALESSIO：想活，就配合我。\n枪手的脚步停在门外。男人一把搂住 Natalie，将她压向镜前。\n门被推开一条缝。Natalie 的眼泪还挂在睫毛上，男人却低声说。\nALESSIO：看着我。别看门。',
  },
  {
    ep: '第 2 集',
    title: '危险男人的救场',
    words: 912,
    duration: '2 分 35 秒',
    hook: '男主发现羞辱女主的未婚夫正是背叛自己的人。',
    script:
      'INT. 婚礼大厅 - 夜\nNatalie 被父亲推着走向红毯。宾客鼓掌，Julian 站在尽头，笑得像什么都没有发生。\n神父刚要开口，二楼传来一声轻响。\nAlessio 站在栏杆后，手下在他耳边低语。\n手下：Boss，南区交易泄露的人查到了，是 Julian。\nAlessio 的目光落在红毯尽头的男人身上，又看向几乎站不稳的 Natalie。\nJULIAN：Natalie，说你愿意。\nNatalie 沉默。Elle 在台下举起手机，屏幕上是 Natalie 父亲欠债的转账记录。\nELLE：你不说，我就让所有人知道你父亲是骗子。\nNatalie 抬头，声音发颤。\nNATALIE：我愿意...\n砰。大厅灯光骤灭一半。\nAlessio 从二楼缓步走下，所有保镖同时让路。他停在 Julian 面前。\nALESSIO：你欠我的账，还敢用我的女人还？\nJulian 脸色惨白。\nJULIAN：她不是你的女人。\nAlessio 转身，脱下外套披在 Natalie 肩上。\nALESSIO：从现在开始，是了。',
  },
  {
    ep: '第 3 集',
    title: '契约还是占有',
    words: 968,
    duration: '2 分 52 秒',
    hook: '男主提出契约婚姻，条件是女主帮他找出诅咒线索。',
    script:
      'INT. 黑色轿车 - 夜\n雨水砸在车窗上。Natalie 抓着门把手，声音冷硬。\nNATALIE：停车。我不是你的战利品。\nAlessio 抬手，司机立刻升起隔板。\nALESSIO：你当然不是。战利品不会让我损失三千万的货。\nNatalie 一怔。\nALESSIO：Julian 背叛我，也背叛你。我们有同一个敌人。\n他递来一份文件。封面写着“婚姻协议”。\nNATALIE：你疯了。\nALESSIO：嫁给我，你父亲的债我还，你的信托我帮你拿回来。作为交换，你留在我身边三个月。\nNatalie 刚要拒绝，目光落在文件夹里的旧照片上。照片中，母亲站在一座古老庄园前，手腕上有和 Alessio 戒指一模一样的纹章。\nNATALIE：你为什么有我母亲的照片？\nAlessio 第一次沉默。\nALESSIO：因为她知道怎么解除 Moretti 家族的诅咒。\n车子停下。窗外是灯火森冷的庄园。\nAlessio 推开车门，向她伸手。\nALESSIO：现在，轮到你选择。回去被他们撕碎，还是跟我进门。',
  },
];

const freeArcEpisodes = [
  {
    ep: '第 4 集',
    title: '住进危险庄园',
    words: 884,
    duration: '2 分 31 秒',
    hook: '女主发现庄园所有佣人都像早就认识她。',
    script:
      'INT. MORETTI 庄园大厅 - 夜\nNatalie 跟着 Alessio 踏进庄园。壁炉火光映在墙上的家族画像上，每一双眼睛都像在盯着她。\n老管家弯腰行礼。\n管家：欢迎回来，小姐。\nNatalie 停住。\nNATALIE：回来？我从没来过这里。\nAlessio 的手指在戒面上轻轻一扣，管家立刻低头。\nALESSIO：他认错人了。\nNatalie 看向楼梯尽头。一扇门半开着，里面传来女人低低的哼唱声，旋律和母亲生前唱给她的摇篮曲一模一样。\n她不顾 Alessio 阻拦冲上楼，推开门。房间里没有人，只有一件保存完好的白色礼服。\n衣领内侧绣着母亲的名字。\nNatalie 抬头，镜子里却映出一个和她长得几乎一样的女人。',
  },
  {
    ep: '第 5 集',
    title: '未婚夫反咬一口',
    words: 907,
    duration: '2 分 38 秒',
    hook: '反派把女主包装成骗婚犯，逼她公开道歉。',
    script:
      'INT. 庄园餐厅 - 日\nNatalie 刚坐下，手机开始疯狂震动。新闻推送铺满屏幕：落跑新娘勾结黑帮，骗取未婚夫家产。\nJulian 在直播里红着眼。\nJULIAN：我爱她，所以愿意给她最后一次机会。只要她回来道歉，我可以不追究。\nElle 坐在他身边抹眼泪。\nELLE：姐姐，不要再被那个男人利用了。\nNatalie 气得手指发抖。\nNATALIE：他们颠倒黑白。\nAlessio 把平板推到她面前，上面是 Julian 转移信托的证据。\nALESSIO：哭没有用。反击才有用。\nNatalie 深吸一口气，打开直播。镜头亮起的一瞬间，所有弹幕都在骂她。\n她抬起眼。\nNATALIE：Julian，你敢不敢当着所有人的面解释，这笔钱去了哪里？\n屏幕那头，Julian 的笑容僵住。',
  },
  {
    ep: '第 6 集',
    title: '第一次公开反击',
    words: 936,
    duration: '2 分 44 秒',
    hook: '女主拿出关键证据，却被父亲逼着删掉直播。',
    script:
      'INT. 庄园书房 - 日\n直播人数暴涨到十万。Natalie 把转账记录一张张放到镜头前。\nNATALIE：婚礼前一天，你把我母亲留下的信托转到了 Elle 名下的空壳公司。\nJulian 慌了。\nJULIAN：这些都是伪造的！\n弹幕开始倒戈。就在这时，Natalie 的父亲打来电话。她接通外放，父亲的怒吼传出。\n父亲：立刻删掉直播！Julian 家能救我们，你别毁了一切！\nNatalie 的眼眶红了。\nNATALIE：所以你早就知道？\n电话那头沉默。沉默比承认更锋利。\nAlessio 站在阴影里，第一次没有替她做决定。\nNatalie 看着镜头，声音发哑却清楚。\nNATALIE：从今天起，我不会再替任何人牺牲。\n门外忽然响起巨响。Julian 带着律师和警察站在门口。\nJULIAN：Natalie，你涉嫌盗窃商业机密，跟我们走一趟。',
  },
  {
    ep: '第 7 集',
    title: '男主家族审判',
    words: 951,
    duration: '2 分 50 秒',
    hook: '男主家族逼女主离开，男主却当众宣布她是未婚妻。',
    script:
      'INT. MORETTI 家族会议厅 - 夜\n长桌两侧坐满 Moretti 家族成员。Natalie 站在中央，像被推上审判席。\n长老：一个被自己家族抛弃的女人，没有资格进入 Moretti。\n另一人把 Julian 的报警文件摔在桌上。\n家族成员：她会把警方、媒体和敌人一起带进来。\nNatalie 握紧手指。\nNATALIE：我没有求你们接纳我。\n长老冷笑。\n长老：那就签字离开。Alessio 会给你一笔钱。\n文件推到她面前。Natalie 刚要开口，Alessio 从门外走进来。\nALESSIO：她不会签。\n长老：你为了她违抗家族？\nAlessio 走到 Natalie 身边，摘下自己的家族戒指，套在她手上。\nALESSIO：从今晚开始，她是我的未婚妻。\n全场哗然。戒指碰到 Natalie 项链的一瞬间，墙上的古老纹章亮了起来。',
  },
  {
    ep: '第 8 集',
    title: '免费卡点：纹章亮起',
    words: 744,
    duration: '2 分 40 秒',
    hook: '女主签下婚姻协议前，母亲留下的纹章突然亮起。',
    script:
      'INT. 庄园书房 - 夜\nNatalie 的笔尖停在婚姻协议最后一页。Alessio 站在她身后，没有催促。\nNATALIE：签下它，我会失去什么？\nALESSIO：你现在还没有资格问这个问题。\n她低头看向母亲留下的项链。蓝宝石忽然裂开，一道古老纹章映在协议上。\n墙后的暗门应声打开，里面挂着一幅母亲年轻时的画像。画像里的女人，正戴着 Moretti 家族的戒指。\nNatalie 抬头，脸色发白。\nNATALIE：你早就知道我母亲来过这里？\nAlessio 的沉默比回答更危险。门外传来继妹的声音。\nELLE：姐姐，签完字，你就会知道自己到底是谁。',
  },
];

export default function Home() {
  const [step, setStep] = useState<StepId>('create');
  const [productionType, setProductionType] = useState<ProductionType>('AI 剧');
  const [mode, setMode] = useState<GenerationMode>('结构事件库组合');
  const [contentTrack, setContentTrack] = useState<ContentTrack>('女频爱情剧');
  const [selectedHitId, setSelectedHitId] = useState<string | null>(null);
  const [customHit, setCustomHit] = useState<HitShow | null>(null);
  const [beatSequence, setBeatSequence] = useState<BeatInstance[]>(
    initialBeatSequence,
  );
  const [selectedBeatId, setSelectedBeatId] = useState('beat-1');
  const [locked, setLocked] = useState<string[]>(['beat-3']);
  const [tone, setTone] = useState('强爽感');

  const selectedInstance =
    beatSequence.find((item) => item.id === selectedBeatId) ?? beatSequence[0];
  const selectedBeat = selectedInstance?.key ?? '原生困境';
  const currentBeat =
    beatCards.find((item) => item.key === selectedBeat) ?? beatCards[0];
  const visibleSteps = useMemo(
    () => (mode === '爆款迭代' ? steps.filter((item) => item.id !== 'beats') : steps),
    [mode],
  );
  const progress = useMemo(() => {
    const index = visibleSteps.findIndex((item) => item.id === step);
    return index === -1 ? 0 : ((index + 1) / visibleSteps.length) * 100;
  }, [step, visibleSteps]);

  const toggleLock = (beatId: string) => {
    setLocked((items) =>
      items.includes(beatId)
        ? items.filter((item) => item !== beatId)
        : [...items, beatId],
    );
  };

  const moveBeat = (beatId: string, direction: -1 | 1) => {
    setBeatSequence((items) => {
      const index = items.findIndex((item) => item.id === beatId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;
      const next = [...items];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const duplicateBeat = (beatId: string) => {
    setBeatSequence((items) => {
      const index = items.findIndex((item) => item.id === beatId);
      if (index < 0) return items;
      const copy = { ...items[index], id: `beat-${Date.now()}` };
      const next = [...items];
      next.splice(index + 1, 0, copy);
      setSelectedBeatId(copy.id);
      return next;
    });
  };

  const deleteBeat = (beatId: string) => {
    setBeatSequence((items) => {
      if (items.length <= 1) return items;
      const index = items.findIndex((item) => item.id === beatId);
      if (index < 0) return items;
      const next = items.filter((item) => item.id !== beatId);
      if (beatId === selectedBeatId) {
        setSelectedBeatId(next[Math.min(index, next.length - 1)].id);
      }
      setLocked((locks) => locks.filter((id) => id !== beatId));
      return next;
    });
  };

  const addBeat = (key: BeatKey) => {
    const item = { id: `beat-${Date.now()}`, key };
    setBeatSequence((items) => [...items, item]);
    setSelectedBeatId(item.id);
  };

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const reportError = (error: unknown) => {
      console.error('WebMCP tool registration failed', error);
    };

    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'read_project_state',
            title: 'Read project state',
            description:
              'Read the visible Mango Drama Global prototype state, including step, production type, generation mode, selected beat, editable beat sequence, and locked beats.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute() {
              return {
                step,
                productionType,
                mode,
                contentTrack,
                selectedHitId,
                selectedHit:
                  (selectedHitId === 'custom-hit'
                    ? customHit
                    : hitShows.find((item) => item.id === selectedHitId)) ?? null,
                selectedBeat,
                selectedBeatId,
                beatSequence,
                lockedBeats: locked,
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(reportError);

      void Promise.resolve(
        context.registerTool(
          {
            name: 'configure_project_flow',
            title: 'Configure project flow',
            description:
              'Update the visible prototype flow by setting production type, generation mode, current step, or selected beat.',
            inputSchema: {
              type: 'object',
              properties: {
                productionType: { enum: ['AI 剧', '真人剧'] },
                mode: { enum: ['结构事件库组合', '爆款迭代'] },
                contentTrack: { enum: ['女频爱情剧', '女频逆袭爽剧'] },
                selectedHitId: { type: 'string' },
                step: {
                  enum: ['create', 'brief', 'beats', 'result', 'script'],
                },
                selectedBeat: {
                  enum: [
                    '原生困境',
                    '宿命羁绊',
                    '宿命启动',
                    '生存危机',
                    '绑定关系',
                  ],
                },
              },
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              const value = input as {
                productionType?: ProductionType;
                mode?: GenerationMode;
                contentTrack?: ContentTrack;
                selectedHitId?: string | null;
                step?: StepId;
                selectedBeat?: BeatKey;
                selectedBeatId?: string;
              };
              if (value.productionType) setProductionType(value.productionType);
              if (value.mode) setMode(value.mode);
              if (value.contentTrack) setContentTrack(value.contentTrack);
              if (value.selectedHitId !== undefined) setSelectedHitId(value.selectedHitId);
              if (value.step) setStep(value.step);
              if (value.selectedBeatId) setSelectedBeatId(value.selectedBeatId);
              if (value.selectedBeat) {
                const next = beatSequence.find((item) => item.key === value.selectedBeat);
                if (next) setSelectedBeatId(next.id);
              }
              return { status: 'updated', ...value };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(reportError);
    } catch (error) {
      reportError(error);
    }

    return () => lifecycle.abort();
  }, [beatSequence, contentTrack, customHit, locked, mode, productionType, selectedBeat, selectedBeatId, selectedHitId, step]);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#201b16]">
      <div className="grid min-h-screen grid-cols-[248px_minmax(0,1fr)_332px] max-xl:grid-cols-[220px_minmax(0,1fr)] max-lg:block">
        <aside className="border-r border-[#ded6c8] bg-[#191713] px-4 py-5 text-[#f9f2e7] max-lg:hidden">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6b84b] text-[#191713]">
              <Clapperboard size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold">Mango Drama</p>
              <p className="text-xs text-[#b8ad9b]">剧本生产工作台</p>
            </div>
          </div>

          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#f6b84b] px-3 py-2.5 text-sm font-semibold text-[#191713]">
            <Sparkles size={16} />
            新建短剧项目
          </button>

          <nav className="space-y-1 text-sm">
            {[
              ['项目列表', FileText],
              ['事件库', Database],
              ['爆款案例库', Film],
              ['待拆解队列', Search],
            ].map(([label, Icon]) => (
              <button
                key={label as string}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[#d8cebd] hover:bg-white/8"
              >
                <Icon size={16} />
                {label as string}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-[#b8ad9b]">当前项目</p>
            <p className="mt-1 text-sm font-semibold">被背叛的新娘与黑帮继承人</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge>女频</Badge>
              <Badge>黑帮</Badge>
              <Badge>契约婚姻</Badge>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-[#ded6c8] bg-[#f6f4ef]/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#817363]">
                  MVP 核心闭环
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  从灵感到前 3 集剧本
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Pill active>{productionType}</Pill>
                <Pill active>{mode}</Pill>
                {mode === '结构事件库组合' && <Pill active>{contentTrack}</Pill>}
                <button className="rounded-md border border-[#c9bba8] bg-white px-3 py-2 text-sm font-medium">
                  保存草稿
                </button>
                <button className="flex items-center gap-2 rounded-md bg-[#201b16] px-4 py-2 text-sm font-semibold text-white">
                  生成
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e4dccf]">
              <div
                className="h-full rounded-full bg-[#cf4f35]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {visibleSteps.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setStep(id)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    step === id
                      ? 'border-[#201b16] bg-[#201b16] text-white'
                      : 'border-[#d8cdbc] bg-white text-[#5f5347]'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-5 p-6">
            {step === 'create' && (
              <CreateStep
                productionType={productionType}
                setProductionType={setProductionType}
                mode={mode}
                setMode={setMode}
                contentTrack={contentTrack}
                setContentTrack={setContentTrack}
                selectedHitId={selectedHitId}
                setSelectedHitId={setSelectedHitId}
                customHit={customHit}
                setCustomHit={setCustomHit}
                setStep={setStep}
              />
            )}
            {step === 'brief' && (
              <BriefStep
                productionType={productionType}
                mode={mode}
                contentTrack={contentTrack}
                selectedHit={selectedHitId === 'custom-hit' ? customHit : hitShows.find((item) => item.id === selectedHitId) ?? null}
                tone={tone}
                setTone={setTone}
                setStep={setStep}
              />
            )}
            {step === 'beats' && (
              <BeatsStep
                selectedBeatId={selectedBeatId}
                setSelectedBeatId={setSelectedBeatId}
                beatSequence={beatSequence}
                moveBeat={moveBeat}
                duplicateBeat={duplicateBeat}
                deleteBeat={deleteBeat}
                addBeat={addBeat}
                currentBeat={currentBeat}
                locked={locked}
                toggleLock={toggleLock}
                setStep={setStep}
              />
            )}
            {step === 'result' && (
              <ResultStep
                setStep={setStep}
                mode={mode}
                selectedHit={selectedHitId === 'custom-hit' ? customHit : hitShows.find((item) => item.id === selectedHitId) ?? null}
              />
            )}
            {step === 'script' && <ScriptStep />}
          </div>
        </section>

        <RightPanel productionType={productionType} mode={mode} step={step} />
      </div>
    </main>
  );
}

function CreateStep({
  productionType,
  setProductionType,
  mode,
  setMode,
  contentTrack,
  setContentTrack,
  selectedHitId,
  setSelectedHitId,
  customHit,
  setCustomHit,
  setStep,
}: {
  productionType: ProductionType;
  setProductionType: (value: ProductionType) => void;
  mode: GenerationMode;
  setMode: (value: GenerationMode) => void;
  contentTrack: ContentTrack;
  setContentTrack: (value: ContentTrack) => void;
  selectedHitId: string | null;
  setSelectedHitId: (value: string) => void;
  customHit: HitShow | null;
  setCustomHit: (value: HitShow | null) => void;
  setStep: (value: StepId) => void;
}) {
  const [referenceSource, setReferenceSource] = useState<'library' | 'upload'>('library');
  const [uploadKind, setUploadKind] = useState<'text' | 'video' | 'link'>('text');
  const [uploadText, setUploadText] = useState('');
  const [uploadLink, setUploadLink] = useState('');
  const [fileName, setFileName] = useState('');
  const [parseStatus, setParseStatus] = useState('');
  const [genreFilter, setGenreFilter] = useState('全部类型');

  const parseUploadedReference = () => {
    const hasInput = uploadKind === 'link' ? uploadLink.trim() : uploadKind === 'text' ? uploadText.trim() || fileName : fileName;
    if (!hasInput) {
      setParseStatus('请先粘贴文本、选择文件或填写播放链接');
      return;
    }
    const parsed: HitShow = {
      id: 'custom-hit',
      title: uploadKind === 'link' ? '来自播放链接的待解析爆款' : fileName || '用户上传的爆款剧',
      genre: '待解析类型',
      platform: uploadKind === 'video' ? '视频解析' : uploadKind === 'link' ? '链接解析' : '文本解析',
      updated: '刚刚加入',
      episodes: '解析后识别集数 · 卡点待确认',
      tags: ['待解析', '用户上传', '可生成迭代模板'],
      score: '待评估',
      hook: '系统将提取 5 Beat、关系设定、人物功能、情绪曲线和付费卡点',
    };
    setCustomHit(parsed);
    setSelectedHitId('custom-hit');
    setParseStatus('已加入当前项目，进入 Brief 后会继承解析结果');
    setReferenceSource('library');
  };

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 1"
        title="先确定生产方式和生成路径"
        text="策划和编剧从一个设定开始，先选 AI 剧或真人剧，再决定用事件库组合，还是按爆款节奏做迭代。"
      />
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <ChoiceCard
          active={productionType === 'AI 剧'}
          icon={<Wand2 size={22} />}
          title="AI 剧"
          desc="按角色一致性、镜头连续性、特效、动作难度和重生成风险评估成本。"
          onClick={() => setProductionType('AI 剧')}
        />
        <ChoiceCard
          active={productionType === '真人剧'}
          icon={<Film size={22} />}
          title="真人剧"
          desc="按演员、场景、服化道、动作调度、拍摄周期和安全合规评估预算。"
          onClick={() => setProductionType('真人剧')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <ChoiceCard
          active={mode === '结构事件库组合'}
          icon={<Database size={22} />}
          title="模式 A：结构事件库组合"
          desc="用 5 beat 和事件库，从题材、人设、情绪模式里组合一个新项目。"
          onClick={() => setMode('结构事件库组合')}
        />
        <ChoiceCard
          active={mode === '爆款迭代'}
          icon={<RefreshCcw size={22} />}
          title="模式 B：爆款迭代"
          desc="继承参考爆款的集数、节奏、免费卡点和情绪曲线，换世界观与表达。"
          onClick={() => setMode('爆款迭代')}
        />
      </div>
      {mode === '结构事件库组合' && (
        <Panel title="选择内容赛道">
          <p className="mb-3 text-sm leading-6 text-[#6b5f52]">
            模式 A 会根据赛道加载不同的 Beat 模板、事件库和人物功能库。通用事件可以被多个赛道复用，但在不同赛道中会映射到不同的叙事功能。
          </p>
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <TrackCard
              active={contentTrack === '女频爱情剧'}
              title="女频爱情剧"
              status="已配置"
              desc="婚恋关系、宿命羁绊、救援绑定、身份秘密和情绪拉扯。"
              onClick={() => setContentTrack('女频爱情剧')}
            />
            <TrackCard
              active={contentTrack === '女频逆袭爽剧'}
              title="女频逆袭爽剧"
              status="Beat 模板建设中"
              desc="真假身份、公开打脸、阶层逆袭、复仇清算和能力证明。"
              onClick={() => setContentTrack('女频逆袭爽剧')}
            />
          </div>
          {contentTrack === '女频逆袭爽剧' && (
            <div className="mt-3 rounded-md border border-[#ead2c2] bg-[#fff7f0] px-3 py-2 text-sm leading-6 text-[#66584b]">
              该赛道已经预留入口，但当前版本还没有正式的 Beat 模板和事件映射，暂时只能保存方向，不能生成完整故事。
            </div>
          )}
        </Panel>
      )}
      {mode === '爆款迭代' && (
        <Panel title="先选择要迭代的爆款剧">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-[#6b5f52]">
              系统会从历史爆款和每日更新的拆解队列中加载参考剧，选中后自动继承它的节奏、关系和付费结构。
            </p>
            <span className="shrink-0 rounded-full bg-[#eef4e9] px-2.5 py-1 text-xs text-[#4d7b4a]">每日更新</span>
          </div>
          <div className="mb-4 flex gap-2 border-b border-[#eadfce] pb-2">
            {[
              ['library', '系统爆款案例库'],
              ['upload', '上传今天的新爆款'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setReferenceSource(value as 'library' | 'upload')}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  referenceSource === value ? 'bg-[#201b16] text-white' : 'bg-[#f8f2e9] text-[#64584c]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {referenceSource === 'upload' && (
            <div className="mb-4 rounded-lg border border-[#d8cdbc] bg-[#fffcf6] p-4">
              <div className="mb-3 grid grid-cols-3 gap-2 max-md:grid-cols-1">
                {[
                  ['text', '剧本文本 / 文档'],
                  ['video', '视频文件'],
                  ['link', '播放链接'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setUploadKind(value as 'text' | 'video' | 'link')}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      uploadKind === value ? 'border-[#cf4f35] bg-[#fff0ea] text-[#9d321d]' : 'border-[#d8cdbc] bg-white text-[#64584c]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {uploadKind === 'text' && (
                <div className="grid gap-2">
                  <textarea
                    value={uploadText}
                    onChange={(event) => setUploadText(event.target.value)}
                    placeholder="粘贴剧本文本、分集大纲，或上传 .txt / .docx / .pdf"
                    className="min-h-24 rounded-md border border-[#d8cdbc] bg-white px-3 py-2 text-sm outline-none focus:border-[#cf4f35]"
                  />
                  <input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
                    className="text-sm text-[#6b5f52]"
                  />
                </div>
              )}
              {uploadKind === 'video' && (
                <div className="grid gap-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
                    className="rounded-md border border-[#d8cdbc] bg-white px-3 py-2 text-sm"
                  />
                  <p className="text-xs leading-5 text-[#817363]">系统会从视频中提取对白、场景、人物关系和分集节奏，再生成可编辑的结构摘要。</p>
                </div>
              )}
              {uploadKind === 'link' && (
                <input
                  value={uploadLink}
                  onChange={(event) => setUploadLink(event.target.value)}
                  placeholder="粘贴视频播放链接或平台剧集链接"
                  className="w-full rounded-md border border-[#d8cdbc] bg-white px-3 py-2 text-sm outline-none focus:border-[#cf4f35]"
                />
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={parseUploadedReference}
                  className="rounded-md bg-[#cf4f35] px-3 py-2 text-sm font-semibold text-white"
                >
                  解析并加入迭代
                </button>
                {fileName && <span className="text-xs text-[#6b5f52]">已选择：{fileName}</span>}
                {parseStatus && <span className="text-xs text-[#4d7b4a]">{parseStatus}</span>}
              </div>
            </div>
          )}
          {customHit && referenceSource === 'library' && (
            <button
              onClick={() => setSelectedHitId('custom-hit')}
              className={`mb-3 w-full rounded-lg border p-3 text-left ${selectedHitId === 'custom-hit' ? 'border-[#cf4f35] bg-[#fff0ea]' : 'border-[#ded6c8] bg-white'}`}
            >
              <p className="text-xs font-semibold text-[#9d321d]">刚刚上传 · {customHit.platform}</p>
              <p className="mt-1 font-semibold">{customHit.title}</p>
              <p className="mt-1 text-xs text-[#6b5f52]">点击继续使用这部待解析爆款</p>
            </button>
          )}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#817363]">案例类型</span>
            {['全部类型', '女频爱情剧', '女频逆袭爽剧', '其他类型'].map((genre) => (
              <button
                key={genre}
                onClick={() => setGenreFilter(genre)}
                className={`rounded-full border px-2.5 py-1 text-xs ${genreFilter === genre ? 'border-[#cf4f35] bg-[#fff0ea] text-[#9d321d]' : 'border-[#d8cdbc] bg-white text-[#64584c]'}`}
              >
                {genre}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
            {hitShows.filter((hit) => genreFilter === '全部类型' || hit.genre === genreFilter).map((hit) => (
              <button
                key={hit.id}
                onClick={() => setSelectedHitId(hit.id)}
                className={`rounded-lg border p-4 text-left transition ${
                  selectedHitId === hit.id
                    ? 'border-[#cf4f35] bg-[#fff0ea]'
                    : 'border-[#ded6c8] bg-[#fffcf6] hover:border-[#bcae9a]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#9d321d]">{hit.genre} · {hit.platform} · {hit.updated}</p>
                    <h3 className="mt-1 font-semibold">{hit.title}</h3>
                  </div>
                  <span className="rounded-full bg-[#201b16] px-2 py-1 text-xs text-white">{hit.score} 分</span>
                </div>
                <p className="mt-2 text-sm text-[#5d5147]">{hit.hook}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hit.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
                <p className="mt-3 text-xs text-[#817363]">{hit.episodes}</p>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-md border border-[#d8cdbc] bg-white px-3 py-2 text-xs text-[#6b5f52]">
            已拆解数据包含：5 Beat 对应关系、人物功能、情绪峰值、免费卡点、付费点密度和单集节奏分布。
          </div>
        </Panel>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setStep('brief')}
          disabled={mode === '爆款迭代' && !selectedHitId}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {mode === '爆款迭代' && !selectedHitId ? '先选择参考爆款' : contentTrack === '女频逆袭爽剧' && mode === '结构事件库组合' ? '进入配置预览' : '进入 Brief'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function BriefStep({
  productionType,
  mode,
  contentTrack,
  selectedHit,
  tone,
  setTone,
  setStep,
}: {
  productionType: ProductionType;
  mode: GenerationMode;
  contentTrack: ContentTrack;
  selectedHit: HitShow | null;
  tone: string;
  setTone: (value: string) => void;
  setStep: (value: StepId) => void;
}) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([
    '现代豪门',
    '黑帮家族',
    '契约婚姻',
    '身份掉马',
  ]);
  const [storyType, setStoryType] = useState('先虐后爽');
  const [coreBond, setCoreBond] = useState('契约婚姻');

  const costFields =
    productionType === 'AI 剧'
      ? ['角色一致性：高', '复杂动作：少量', '奇幻特效：允许局部', '重生成风险：中']
      : ['演员数量：6 人以内', '外景：少量', '动作戏：轻量', '拍摄预算：中'];

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 2"
        title={mode === '爆款迭代' ? '锁定爆款骨架，只替换可变设定' : contentTrack === '女频逆袭爽剧' ? '女频逆袭爽剧配置预览' : '用四个维度配置 Brief'}
        text={
          mode === '爆款迭代'
            ? '模式 B 会继承参考剧的关系设定、人物功能、核心类型和情绪曲线。你只需要换世界观和人物社会身份，避免把迭代剧写成另一部结构松散的原创剧。'
            : contentTrack === '女频逆袭爽剧'
              ? '女频逆袭爽剧的入口已经保留，但对应的 Beat、事件映射和人物功能库还在拆解中。当前页面用于确认产品配置方式，暂不生成故事。'
              : '四个维度先确定观众期待，再交给 Beat 编排展开。题材/世界观提供素材边界，类型、核心羁绊和情绪共同决定剧情的爽点方向。'
        }
      />

      {mode === '结构事件库组合' && contentTrack === '女频逆袭爽剧' && (
        <div className="rounded-lg border border-[#ead2c2] bg-[#fff7f0] p-4 text-sm leading-6 text-[#66584b]">
          当前赛道状态：<strong className="text-[#9d321d]">Beat 模板建设中</strong>。建议先完成“原生困境 / 逆袭触发 / 能力证明 / 公开打脸 / 身份跃迁”等主线的拆解，再开放事件推荐和剧本生成。
        </div>
      )}

      {mode === '爆款迭代' ? (
        <Panel title="模式 B：参考爆款的继承边界">
          <div className="mb-4 rounded-md border border-[#ead2c2] bg-[#fff7f0] p-3 text-sm leading-6 text-[#66584b]">
            参考爆款：<strong className="text-[#3b3229]">{selectedHit?.title ?? '未选择'}</strong> · {selectedHit?.platform ?? '案例库'} · 已抽取 5 Beat、人物功能、关系推进和情绪曲线。以下继承项锁定，只允许改写世界观、人物社会身份和具体事件表达。
          </div>
          <div className="grid gap-4">
            <DimensionBlock
              title="题材 / 世界观 · 可替换"
              hint="选择新的世界规则和故事舞台，事件功能与节奏仍沿用参考剧。"
              items={themeTags}
              selected={selectedThemes}
              onToggle={(item) =>
                setSelectedThemes((items) =>
                  items.includes(item)
                    ? items.filter((value) => value !== item)
                    : [...items, item],
                )
              }
            />
            <LockedDimension title="类型 · 继承参考爆款" value="先虐后爽 / 复仇打脸" />
            <LockedDimension title="核心羁绊 · 继承参考爆款" value="契约婚姻 + 救命恩人" />
            <LockedDimension title="关系设定 · 继承参考爆款" value="危险救援 → 契约绑定 → 共同对抗外部敌人" />
            <LockedDimension title="人物功能设定 · 继承参考爆款" value="女主：被背叛后反击并掌握关键线索；男主：保护者、权力入口和情感压迫者" />
            <LockedDimension title="情绪 · 继承参考爆款" value="强爽感 / 暧昧拉扯 / 宿命虐感" />
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              <EditableField label="女主社会身份替换" value="落魄王室的流亡公主" />
              <EditableField label="男主社会身份替换" value="掌控边境贸易的冷面公爵" />
            </div>
            <div className="rounded-md border border-[#d8cdbc] bg-white p-3">
              <p className="text-sm font-semibold">具体事件 · 只换表达，不换功能</p>
              <p className="mt-1 text-xs leading-5 text-[#817363]">例如把“婚礼背叛”换成“王室加冕礼上的继承权陷阱”，但仍然承担“原生困境：公开羞辱 + 女主必须改变”的结构功能。</p>
              <div className="mt-3 grid gap-2 text-sm">
                {['原生困境：婚礼骗局 → 加冕礼继承权陷阱', '宿命羁绊：试衣间救援 → 雪夜边境救援', '生存危机：被逼签协议 → 被迫交出王室印章'].map((item) => (
                  <div key={item} className="rounded bg-[#f8f2e9] px-3 py-2 text-[#5d5147]">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel title="四个核心维度">
          <div className="grid gap-5">
            <DimensionBlock
              title="1. 题材 / 世界观"
              hint="可多选。先选故事发生在哪里、受什么规则约束。"
              items={themeTags}
              selected={selectedThemes}
              onToggle={(item) =>
                setSelectedThemes((items) =>
                  items.includes(item)
                    ? items.filter((value) => value !== item)
                    : [...items, item],
                )
              }
            />
            <DimensionBlock
              title="2. 类型"
              hint="确定观众期待的核心情感模式，建议先选一个主类型。"
              items={storyTypes}
              selected={[storyType]}
              onToggle={setStoryType}
              single
            />
            <DimensionBlock
              title="3. 核心羁绊"
              hint="回答男女主为什么会产生连接，以及为什么不能轻易分开。"
              items={coreBonds}
              selected={[coreBond]}
              onToggle={setCoreBond}
              single
            />
            <DimensionBlock
              title="4. 情绪"
              hint="确定每集的观看感受和付费驱动力。"
              items={emotionModes}
              selected={[tone]}
              onToggle={setTone}
              single
            />
          </div>
        </Panel>
      )}

      <Panel title="项目参数">
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          <Field label="目标市场" value="北美 / 英语区" />
          <Field label="目标平台" value="ReelShort / DramaBox" />
          <Field label="生产类型" value={productionType} />
          <Field label="总集数" value={mode === '爆款迭代' ? '继承参考爆款' : '60 集（可选 40-80）'} />
          <Field label="免费集" value={mode === '爆款迭代' ? '继承参考爆款' : '第 8 集（可选 6-10）'} />
          <Field label="单集长度" value={mode === '爆款迭代' ? '继承参考爆款' : '默认 1000 字以内'} />
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
        <Panel title="人物小传">
          <div className="grid gap-3">
            <Field label="女主" value="Natalie，破产家族继承人，被未婚夫设计骗婚。" />
            <Field label="女主 Want" value="拿回母亲留下的信托，摆脱父亲债务。" />
            <Field label="女主 Need" value="重新获得安全感、尊严和人生掌控权。" />
            <Field label="男主" value="Alessio，危险的黑帮继承人，掌握权力但背负家族诅咒。" />
            <Field label="男主给予" value="庇护、身份转换、复仇资源、权力背书。" />
          </div>
        </Panel>
        <Panel title={productionType === 'AI 剧' ? 'AI 制作约束' : '真人拍摄约束'}>
          <div className="grid gap-2">
            {costFields.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-md bg-[#f8f2e9] px-3 py-2 text-sm"
              >
                <Check size={15} className="text-[#4d7b4a]" />
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('create')}
          className="rounded-md border border-[#c9bba8] bg-white px-4 py-2.5 text-sm font-medium"
        >
          返回
        </button>
        <button
          onClick={() => setStep(mode === '爆款迭代' ? 'result' : 'beats')}
          disabled={mode === '结构事件库组合' && contentTrack === '女频逆袭爽剧'}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {mode === '爆款迭代' ? '生成迭代故事方案' : contentTrack === '女频逆袭爽剧' ? '等待 Beat 模板' : '生成 5 Beat'}
          {mode === '爆款迭代' ? <ArrowRight size={16} /> : <Sparkles size={16} />}
        </button>
      </div>
    </div>
  );
}

function BeatsStep({
  selectedBeatId,
  setSelectedBeatId,
  beatSequence,
  moveBeat,
  duplicateBeat,
  deleteBeat,
  addBeat,
  currentBeat,
  locked,
  toggleLock,
  setStep,
}: {
  selectedBeatId: string;
  setSelectedBeatId: (value: string) => void;
  beatSequence: BeatInstance[];
  moveBeat: (beatId: string, direction: -1 | 1) => void;
  duplicateBeat: (beatId: string) => void;
  deleteBeat: (beatId: string) => void;
  addBeat: (key: BeatKey) => void;
  currentBeat: (typeof beatCards)[number];
  locked: string[];
  toggleLock: (value: string) => void;
  setStep: (value: StepId) => void;
}) {
  const currentInstance = beatSequence.find((item) => item.id === selectedBeatId);
  const selectedBeat = currentInstance?.key ?? '原生困境';

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 3"
        title="Beat 编排与事件替换"
        text="5 个 Beat 是可编辑的结构积木：可以调整先后、重复出现或删除。每个实例再选择一个主事件，编剧可以锁定满意事件，局部重生成其他部分。"
      />
      <div className="grid grid-cols-[1fr_360px] gap-5 max-xl:grid-cols-1">
        <div className="grid gap-3">
          {beatSequence.map((instance, index) => {
            const beat = beatCards.find((item) => item.key === instance.key)!;
            const sameBeatCount = beatSequence
              .slice(0, index + 1)
              .filter((item) => item.key === instance.key).length;
            return (
            <button
              key={instance.id}
              onClick={() => setSelectedBeatId(instance.id)}
              className={`rounded-lg border p-4 text-left shadow-sm ${
                selectedBeatId === instance.id
                  ? 'border-[#cf4f35] bg-white'
                  : 'border-[#ded6c8] bg-[#fffcf6]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#9d321d]">
                    Beat {index + 1}{sameBeatCount > 1 ? ` · 第 ${sameBeatCount} 次出现` : ''}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{beat.key}</h3>
                </div>
                {locked.includes(instance.id) && (
                  <span className="flex items-center gap-1 rounded-full bg-[#eef4e9] px-2 py-1 text-xs text-[#4d7b4a]">
                    <Lock size={12} />
                    已锁定
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-[#6b5f52]">{beat.question}</p>
              <p className="mt-3 font-medium">{beat.selected}</p>
              <p className="mt-2 text-sm leading-6 text-[#5d5147]">
                {beat.functionText}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-[#f8f2e9] px-2 py-1 text-xs text-[#817363]">{beat.emotion}</span>
                <span className="ml-auto flex items-center gap-1">
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="上移 Beat"
                    onClick={(event) => {
                      event.stopPropagation();
                      moveBeat(instance.id, -1);
                    }}
                    className="rounded border border-[#d8cdbc] bg-white p-1.5 hover:bg-[#f8f2e9]"
                  >
                    <ChevronUp size={14} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="下移 Beat"
                    onClick={(event) => {
                      event.stopPropagation();
                      moveBeat(instance.id, 1);
                    }}
                    className="rounded border border-[#d8cdbc] bg-white p-1.5 hover:bg-[#f8f2e9]"
                  >
                    <ChevronDown size={14} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="重复 Beat"
                    onClick={(event) => {
                      event.stopPropagation();
                      duplicateBeat(instance.id);
                    }}
                    className="rounded border border-[#d8cdbc] bg-white p-1.5 hover:bg-[#f8f2e9]"
                  >
                    <Copy size={14} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="删除 Beat"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteBeat(instance.id);
                    }}
                    className="rounded border border-[#ead2c2] bg-white p-1.5 text-[#9d321d] hover:bg-[#fff0ea]"
                  >
                    <Trash2 size={14} />
                  </span>
                </span>
              </div>
            </button>
            );
          })}
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#c9bba8] bg-[#fffcf6] p-3">
            <Plus size={16} className="text-[#9d321d]" />
            <select
              defaultValue=""
              aria-label="添加一个 Beat"
              onChange={(event) => {
                if (event.target.value) addBeat(event.target.value as BeatKey);
                event.currentTarget.value = '';
              }}
              className="flex-1 rounded-md border border-[#d8cdbc] bg-white px-3 py-2 text-sm"
            >
              <option value="">添加 Beat（可重复）</option>
              {beatCards.map((beat) => (
                <option key={beat.key} value={beat.key}>
                  {beat.key}
                </option>
              ))}
            </select>
            <span className="text-xs text-[#817363]">当前 {beatSequence.length} 个</span>
          </div>
        </div>
        <Panel title={`${currentBeat.key}：候选事件池`}>
          <p className="mb-3 text-sm text-[#6b5f52]">{currentBeat.risk}</p>
          <div className="grid gap-2">
            {eventPool[selectedBeat].map((event, index) => (
              <button
                key={event.title}
                onClick={() => toggleLock(selectedBeatId)}
                className={`rounded-md border px-3 py-3 text-left text-sm ${
                  index === 0
                    ? 'border-[#cf4f35] bg-[#fff0ea]'
                    : 'border-[#ded6c8] bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-[#2d261f]">{event.title}</span>
                  <span className="shrink-0 text-xs text-[#817363]">匹配 {96 - index * 4}%</span>
                </div>
                <p className="mt-2 leading-6 text-[#5d5147]">{event.functionText}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded bg-white/80 px-2 py-1 text-[#817363]">{event.emotion}</span>
                  <span className="rounded bg-white/80 px-2 py-1 text-[#817363]">
                    场景：{event.scenes.slice(0, 3).join(' / ')}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-[#9d321d]">{event.hook}</p>
                <p className="mt-1 text-xs text-[#817363]">样本：{event.sources.join('、')}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toggleLock(selectedBeatId)}
              className="flex-1 rounded-md border border-[#c9bba8] bg-white px-3 py-2 text-sm font-medium"
            >
              {locked.includes(selectedBeatId) ? '取消锁定' : '锁定事件'}
            </button>
            <button className="flex-1 rounded-md bg-[#201b16] px-3 py-2 text-sm font-semibold text-white">
              重新推荐
            </button>
          </div>
        </Panel>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setStep('result')}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white"
        >
          生成故事方案
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ResultStep({
  setStep,
  mode,
  selectedHit,
}: {
  setStep: (value: StepId) => void;
  mode: GenerationMode;
  selectedHit: HitShow | null;
}) {
  const [logline, setLogline] = useState(
    '婚礼当天被未婚夫背叛的新娘，意外救下被追杀的黑帮继承人，却发现自己是解除他家族诅咒的唯一钥匙。',
  );
  const [storySummary, setStorySummary] = useState(
    'Natalie 原本以为婚礼能拯救破产家族，却在婚礼前听见未婚夫和继妹合谋骗取信托。她被追杀中的 Alessio 卷入危险关系，随后发现母亲留下的纹章与 Moretti 家族诅咒有关。为了夺回继承权，她接受契约婚姻，也把自己推向一个更危险、更迷人的男人。',
  );
  const [sellingPoints, setSellingPoints] = useState(
    '婚礼背叛、危险男人救场、契约婚姻、家族诅咒、女主身份价值反转。',
  );
  const [freeHook, setFreeHook] = useState('女主即将签下婚姻协议时，母亲纹章亮起');
  const [evaluationStatus, setEvaluationStatus] = useState<'已评估' | '待重新评估'>('已评估');
  const [evaluationVersion, setEvaluationVersion] = useState(1);

  const markEdited = () => setEvaluationStatus('待重新评估');
  const reevaluate = () => {
    setEvaluationStatus('已评估');
    setEvaluationVersion((version) => version + 1);
  };

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 4"
        title={mode === '爆款迭代' ? '迭代故事方案与免费卡点' : '故事方案与免费卡点'}
        text={mode === '爆款迭代' ? '已跳过 5 Beat 编排，直接沿用参考爆款的结构功能和节奏模板。这里重点检查替换后的世界观、人物身份、事件表达和相似度风险。' : '这里给策划判断项目是否值得继续写。重点看故事钩子、人物关系、免费卡点和付费驱动力。'}
      />
      {mode === '爆款迭代' && selectedHit && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#ead2c2] bg-[#fff7f0] px-4 py-3 text-sm">
          <span className="font-semibold text-[#9d321d]">参考爆款</span>
          <span>{selectedHit.title}</span>
          <span className="text-[#817363]">{selectedHit.platform} · {selectedHit.episodes}</span>
          <span className="ml-auto rounded-full bg-[#201b16] px-2.5 py-1 text-xs text-white">已继承节奏模板</span>
        </div>
      )}
      <div className="grid grid-cols-[1fr_320px] gap-5 max-xl:grid-cols-1">
        <Panel title="方案 A：The Bride Claimed by the Cursed Heir">
          <div className="space-y-4">
            <EditableInfoBlock
              label="Logline"
              value={logline}
              onChange={(value) => { setLogline(value); markEdited(); }}
            />
            <EditableInfoBlock
              label="故事简介"
              value={storySummary}
              onChange={(value) => { setStorySummary(value); markEdited(); }}
            />
            <EditableInfoBlock
              label="核心卖点"
              value={sellingPoints}
              onChange={(value) => { setSellingPoints(value); markEdited(); }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfce] pt-3">
            <span className={`text-sm ${evaluationStatus === '已评估' ? 'text-[#4d7b4a]' : 'text-[#9d321d]'}`}>
              {evaluationStatus} · 第 {evaluationVersion} 次方案评估
            </span>
            <button onClick={reevaluate} className="rounded-md bg-[#201b16] px-3 py-2 text-sm font-semibold text-white">
              重新评估方案
            </button>
          </div>
        </Panel>
        <Panel title="免费卡点">
          <div className="rounded-lg bg-[#201b16] p-4 text-white">
            <p className="text-xs text-[#d7c7b4]">第 8 集结尾</p>
            <textarea
              value={freeHook}
              onChange={(event) => { setFreeHook(event.target.value); markEdited(); }}
              className="mt-1 min-h-16 w-full resize-y bg-transparent text-lg font-semibold text-white outline-none placeholder:text-[#d7c7b4]"
            />
            <p className="mt-3 text-sm leading-6 text-[#eadfce]">
              观众已经想看女主复仇，也想知道她与男主诅咒的关系。卡在“签还是不签”的瞬间，付费驱动力来自身份谜团和关系绑定。
            </p>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <Metric label="爆款潜力" value={evaluationStatus === '已评估' ? '88' : '86'} />
            <Metric label="付费点强度" value={evaluationStatus === '已评估' ? '94' : '92'} />
            <Metric label="相似度风险" value="31" />
          </div>
        </Panel>
      </div>
      <Panel title="到免费集的节奏预览">
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {[
            ['1', '婚礼背叛', '羞辱 + 追杀闯入'],
            ['2', '男主救场', '公开占有宣告'],
            ['3', '契约提出', '母亲纹章出现'],
            ['4', '进入庄园', '女主被家族审视'],
            ['5', '前任反扑', '女主第一次反击'],
            ['6', '诅咒试探', '男主失控只有她能靠近'],
            ['7', '继妹设局', '女主被迫背锅'],
            ['8', '免费卡点', '签约前纹章亮起'],
          ].map(([ep, title, text]) => (
            <div key={ep} className="rounded-lg border border-[#ded6c8] bg-white p-3">
              <p className="text-xs font-semibold text-[#9d321d]">第 {ep} 集</p>
              <p className="mt-1 font-semibold">{title}</p>
              <p className="mt-2 text-sm text-[#6b5f52]">{text}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="flex justify-end">
        <button
          onClick={() => setStep('script')}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white"
        >
          生成前 3 集剧本
          <BookOpenText size={16} />
        </button>
      </div>
    </div>
  );
}

function ScriptStep() {
  const [selected, setSelected] = useState(0);
  const freeEpisodes = [...episodes, ...freeArcEpisodes];
  const [scriptStage, setScriptStage] = useState<'opening' | 'free' | 'full'>('opening');
  const visibleEpisodes = scriptStage === 'opening' ? episodes : freeEpisodes;
  const [drafts, setDrafts] = useState(() => freeEpisodes.map((episode) => episode.script));
  const [evaluationStatus, setEvaluationStatus] = useState<'已评估' | '待重新评估'>('已评估');
  const [evaluationVersion, setEvaluationVersion] = useState(1);
  const currentEpisode = visibleEpisodes[selected];
  const currentDraft = drafts[selected] ?? currentEpisode.script;
  const stageCopy = {
    opening: {
      label: '前 3 集已生成',
      helper: '修改并评估通过后，系统会继续生成第 4-8 集，组成完整一卡免费集。',
      button: '保存修改并生成 1-8 集免费剧本',
    },
    free: {
      label: '1-8 集免费段已生成',
      helper: '现在可以检查完整免费段的节奏、钩子和第 8 集付费卡点。',
      button: '保存修改并进入全集生成',
    },
    full: {
      label: '已进入全集生成',
      helper: '测试阶段先记录流程状态；真实版本会继续生成后续付费集与全集。',
      button: '保存修改并重新评估',
    },
  }[scriptStage];

  const updateDraft = (value: string) => {
    setDrafts((items) => items.map((item, index) => (index === selected ? value : item)));
    setEvaluationStatus('待重新评估');
  };

  const applyAction = (action: string) => {
    setEvaluationStatus('待重新评估');
    if (action === '压缩字数') {
      updateDraft(`${currentDraft}\n\n[已标记：请压缩重复动作与说明，保留结尾卡点]`);
    } else if (action === '增强付费欲望') {
      updateDraft(`${currentDraft}\n\n[已标记：请在结尾增加身份揭示或关系不可逆变化]`);
    }
  };

  const saveAndContinue = () => {
    setEvaluationStatus('已评估');
    setEvaluationVersion((version) => version + 1);
    if (scriptStage === 'opening') {
      setScriptStage('free');
      setSelected(3);
    } else if (scriptStage === 'free') {
      setScriptStage('full');
    }
  };

  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
      <Panel title="集数导航">
        <div className="mb-3 rounded-md border border-[#d8cdbc] bg-[#fffdf9] p-3">
          <p className="text-sm font-semibold text-[#2d261f]">{stageCopy.label}</p>
          <p className="mt-1 text-xs leading-5 text-[#6b5f52]">{stageCopy.helper}</p>
        </div>
        <div className="grid gap-2">
          {visibleEpisodes.map((episode, index) => (
            <button
              key={episode.ep}
              onClick={() => setSelected(index)}
              className={`rounded-md border p-3 text-left ${
                selected === index
                  ? 'border-[#cf4f35] bg-[#fff0ea]'
                  : 'border-[#ded6c8] bg-white'
              }`}
            >
              <p className="text-sm font-semibold">{episode.ep}</p>
              <p className="mt-1 text-sm text-[#6b5f52]">{episode.title}</p>
              <p className="mt-2 text-xs text-[#817363]">
                {episode.words} 字 · {episode.duration}
              </p>
            </button>
          ))}
        </div>
        {scriptStage === 'opening' && (
          <button
            onClick={() => {
              setScriptStage('free');
              setSelected(3);
              setEvaluationStatus('已评估');
            }}
            className="mt-4 w-full rounded-md bg-[#201b16] px-3 py-2 text-sm font-semibold text-white"
          >
            生成 1-8 集免费剧本
          </button>
        )}
        {scriptStage === 'full' && (
          <div className="mt-4 rounded-md border border-[#c9bba8] bg-[#f8f2e9] p-3 text-sm text-[#5d5147]">
            全集生成入口已触发。当前测试版先停在状态确认，后续接入真实生成后会展开第 9 集以后内容。
          </div>
        )}
      </Panel>
      <Panel title={`${currentEpisode.ep}：${currentEpisode.title}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {['局部改写', '强化冲突', '修复逻辑', '压缩字数', '增强付费欲望'].map(
            (action) => (
              <button
                key={action}
                onClick={() => applyAction(action)}
                className="rounded-md border border-[#c9bba8] bg-white px-3 py-2 text-sm"
              >
                {action}
              </button>
            ),
          )}
          <span className={`ml-auto text-sm ${evaluationStatus === '已评估' ? 'text-[#4d7b4a]' : 'text-[#9d321d]'}`}>
            {evaluationStatus} · 第 {evaluationVersion} 次评估
          </span>
        </div>
        <div className="rounded-lg border border-[#ded6c8] bg-[#fffdf9] p-4">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-[#6b5f52]">
            <span>{currentDraft.length} 字符 · 目标 {currentEpisode.words} 字</span>
            <span>{currentEpisode.duration}</span>
            <span>结尾卡点：{currentEpisode.hook}</span>
          </div>
          <textarea
            value={currentDraft}
            onChange={(event) => updateDraft(event.target.value)}
            className="min-h-[520px] w-full resize-y bg-transparent font-sans text-[15px] leading-8 text-[#2d261f] outline-none"
            aria-label={`${currentEpisode.ep} 剧本正文`}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#d8cdbc] bg-[#f8f2e9] px-3 py-3">
          <div className="text-sm text-[#5d5147]">
            <strong>自动评估：</strong> 检查逻辑连续性、单集节奏、结尾卡点、付费驱动力和制作复杂度。
          </div>
          <button onClick={saveAndContinue} className="rounded-md bg-[#201b16] px-3 py-2 text-sm font-semibold text-white">
            {stageCopy.button}
          </button>
        </div>
      </Panel>
    </div>
  );
}

function RightPanel({
  productionType,
  mode,
  step,
}: {
  productionType: ProductionType;
  mode: GenerationMode;
  step: StepId;
}) {
  return (
    <aside className="border-l border-[#ded6c8] bg-[#fffaf2] p-5 max-xl:hidden">
      <div className="sticky top-5 space-y-4">
        <Panel title="质量评分">
          <div className="grid gap-3">
            <Metric label="5 Beat 完整度" value="88" />
            <Metric label="开场钩子" value="91" />
            <Metric label="付费点强度" value="92" />
            <Metric label="人物动机" value="78" />
          </div>
        </Panel>

        <Panel title="爆款学习基准">
          <div className="space-y-3 text-sm leading-6 text-[#5d5147]">
            <div className="grid grid-cols-2 gap-2">
              <LearningStat label="本周剧本" value={`${weeklyLearningStats.titles} 部`} />
              <LearningStat label="已读文档" value={`${weeklyLearningStats.sourceDocs} 份`} />
              <LearningStat label="回填事件" value={`${weeklyLearningStats.learnedEvents} 条`} />
              <LearningStat label="评分维度" value={`${weeklyLearningStats.benchmarkDimensions.length} 项`} />
            </div>
            <p>
              评分与生成会参考本周样本的 Beat 编排、开场抓点、关系升级、集尾卡点、付费驱动力和差异化风险。
            </p>
            <p className="text-xs text-[#817363]">
              参考的是事件功能和写作规律，不复制原剧文本、角色名或具体台词。
            </p>
          </div>
        </Panel>

        <Panel title="风险与建议">
          <div className="space-y-3 text-sm leading-6">
            <Risk
              title="Beat 配置"
              text={
                mode === '爆款迭代'
                  ? '当前沿用参考爆款的 Beat 顺序和叙事功能，重点检查替换事件是否仍承担原功能。'
                  : step === 'beats'
                    ? '生存危机很强，但宿命启动需要前置线索，避免第 3 集突兀。'
                    : '当前结构完整，建议继续检查免费集卡点。'
              }
            />
            <Risk
              title="相似度"
              text={mode === '爆款迭代' ? '节奏可继承，婚礼中断和车内契约需要换表达。' : '婚礼骗局属于常见桥段，风险较低但需要差异化场景。'}
            />
            <Risk
              title="制作成本"
              text={
                productionType === 'AI 剧'
                  ? '庄园、雨夜、纹章发光可控；狼人变身类镜头建议后置。'
                  : '婚礼大厅群演成本偏高，可改成试衣间和小型仪式。'
              }
            />
          </div>
        </Panel>

        <Panel title="下一步">
          <div className="space-y-2 text-sm">
            {['补强女主 Need', '锁定免费卡点', '生成前 3 集', '检查每集结尾钩子'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <BadgeCheck size={15} className="text-[#4d7b4a]" />
                  {item}
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>
    </aside>
  );
}

function LearningStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#ded6c8] bg-[#fffdf9] px-2 py-2">
      <div className="text-xs text-[#817363]">{label}</div>
      <div className="mt-1 font-semibold text-[#2d261f]">{value}</div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#9d321d]">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b5f52]">{text}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#ded6c8] bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ChoiceCard({
  active,
  icon,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-5 text-left shadow-sm transition ${
        active
          ? 'border-[#cf4f35] bg-[#fff0ea]'
          : 'border-[#ded6c8] bg-white hover:border-[#bcae9a]'
      }`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-[#201b16] text-white">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6b5f52]">{desc}</p>
    </button>
  );
}

function TrackCard({
  active,
  title,
  status,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  status: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active
          ? 'border-[#cf4f35] bg-[#fff0ea]'
          : 'border-[#ded6c8] bg-white hover:border-[#bcae9a]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs ${status === '已配置' ? 'bg-[#eef4e9] text-[#4d7b4a]' : 'bg-[#f8f2e9] text-[#817363]'}`}>
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#6b5f52]">{desc}</p>
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#817363]">{label}</span>
      <span className="mt-1 block rounded-md border border-[#d8cdbc] bg-[#fffdf9] px-3 py-2 text-sm">
        {value}
      </span>
    </label>
  );
}

function EditableField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#817363]">{label}</span>
      <input
        defaultValue={value}
        className="mt-1 block w-full rounded-md border border-[#d8cdbc] bg-[#fffdf9] px-3 py-2 text-sm outline-none focus:border-[#cf4f35]"
      />
    </label>
  );
}

function DimensionBlock({
  title,
  hint,
  items,
  selected,
  onToggle,
  single = false,
}: {
  title: string;
  hint: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  single?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[#817363]">{hint}</p>
      </div>
      <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-md bg-[#f8f2e9] p-3">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? 'border-[#cf4f35] bg-[#fff0ea] text-[#9d321d]'
                  : 'border-[#d8cdbc] bg-white text-[#64584c] hover:border-[#bcae9a]'
              }`}
            >
              {active ? '✓ ' : ''}
              {item}
            </button>
          );
        })}
      </div>
      {single && <p className="mt-1 text-xs text-[#9d321d]">当前选择：{selected.join('、')}</p>}
    </div>
  );
}

function LockedDimension({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#ded6c8] bg-[#f8f2e9] px-3 py-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-[#5d5147]">{value}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#201b16] px-2.5 py-1 text-xs text-white">
        <Lock size={12} />
        已锁定
      </span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-[#eadfce]">
        <div
          className="h-2 rounded-full bg-[#cf4f35]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#9d321d]">{label}</p>
      <p className="mt-1 text-sm leading-7 text-[#3b3229]">{text}</p>
    </div>
  );
}

function EditableInfoBlock({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#9d321d]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-16 w-full resize-y rounded-md border border-[#d8cdbc] bg-[#fffdf9] px-3 py-2 text-sm leading-6 text-[#3b3229] outline-none focus:border-[#cf4f35]"
      />
    </label>
  );
}

function Risk({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-[#ead2c2] bg-[#fff7f0] p-3">
      <div className="mb-1 flex items-center gap-2 font-semibold text-[#9d321d]">
        <AlertTriangle size={15} />
        {title}
      </div>
      <p className="text-[#66584b]">{text}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#d8cdbc] bg-[#fffdf9] px-3 py-1.5 text-sm">
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-[#f5e8d2]">
      {children}
    </span>
  );
}

function Pill({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        active ? 'bg-[#fff0ea] text-[#9d321d]' : 'bg-white text-[#64584c]'
      }`}
    >
      {children}
    </span>
  );
}
