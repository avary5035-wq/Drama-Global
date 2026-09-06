'use client';

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clapperboard,
  ClipboardList,
  Database,
  FileText,
  Film,
  Lock,
  PenLine,
  RefreshCcw,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ProductionType = 'AI 剧' | '真人剧';
type GenerationMode = '结构事件库组合' | '爆款迭代';
type StepId = 'create' | 'brief' | 'beats' | 'result' | 'script';
type BeatKey =
  | '原生困境'
  | '宿命羁绊'
  | '宿命启动'
  | '生存危机'
  | '绑定关系';

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
    selected: '婚礼前发现未婚夫与继妹合谋骗取信托',
    functionText: '让女主原有生活当场崩塌，并制造羞辱、背叛和失去保护的压力。',
    emotion: '虐感 / 羞辱 / 反击期待',
    risk: '婚礼骗局常见，需要换场景或增加身份差异。',
  },
  {
    key: '宿命羁绊',
    question: '男女主为什么必须产生关系？',
    selected: '男主为躲避追杀闯入试衣间，被迫与女主假装亲密',
    functionText: '让男女主在高压场景中发生非正常连接，同时制造暧昧和危险感。',
    emotion: '刺激 / 禁忌 / 暧昧',
    risk: '亲密桥段需要根据平台尺度调整。',
  },
  {
    key: '宿命启动',
    question: '为什么这段关系不可替代？',
    selected: '女主掌握男主家族诅咒的唯一解除线索',
    functionText: '把偶然相遇升级为不可替代关系，让男主必须继续接近女主。',
    emotion: '宿命感 / 好奇 / 权力反转',
    risk: '诅咒线要避免设定过重拖慢前 3 集。',
  },
  {
    key: '生存危机',
    question: '为什么女主现在必须依靠男主？',
    selected: '前任带人围堵女主，逼她签放弃遗产协议',
    functionText: '让女主无法独立解决危机，男主出场展示保护能力和压迫感。',
    emotion: '爽感 / 救场 / 打脸',
    risk: '需要强视觉卡点，否则只是普通争吵。',
  },
  {
    key: '绑定关系',
    question: '为什么两人必须长期在一起？',
    selected: '契约婚姻换取庇护，女主成为男主家族名义继承人监护者',
    functionText: '将短期救援转成长期关系，让后续同居、误会和亲密升级合理发生。',
    emotion: '占有 / 拉扯 / 安全感',
    risk: '契约条件要具体，不能只写“为了保护”。',
  },
];

const eventPool: Record<BeatKey, string[]> = {
  原生困境: [
    '婚礼骗局曝光',
    '被丈夫和闺蜜双重背叛',
    '父亲欠债后把女主抵押给家族敌人',
    '被继妹抢走身份和继承权',
    '移民身份被前任威胁',
    '母亲病危但银行卡被冻结',
    '被家族当成联姻牺牲品',
    '假千金身份被公开羞辱',
  ],
  宿命羁绊: [
    '躲避追杀时被迫假装情侣',
    '救下男主的孩子后被叫 Mommy',
    '一夜情后发现灵魂印记',
    '误闯男主禁区并触发契约',
    '女主替别人完成危险交易',
    '男主失控时只有女主能靠近',
    '被献祭给昏迷王子',
    '同乘电梯遭遇停电危机',
  ],
  宿命启动: [
    '女主是唯一兼容体质',
    '女主血脉能解除诅咒',
    '女主掌握男主敌人的证据',
    '女主是失踪继承人的母亲',
    '女主与男主有王族婚约',
    '男主发现女主曾救过自己',
    '女主能唤醒男主第二人格',
    '女主身上的胎记对应预言',
  ],
  生存危机: [
    '前任围堵逼签协议',
    '酒吧骚扰男主救场',
    '被下药后男主及时出现',
    '家族晚宴公开羞辱',
    '黑帮追杀误伤女主',
    '医院缴费窗口崩溃',
    '被赶出家门遭暴雨围困',
    '直播现场被反派揭短',
  ],
  绑定关系: [
    '契约婚姻',
    '假订婚',
    '灵魂伴侣印记',
    '怀上继承人',
    '成为孩子名义母亲',
    '被男主家族宣告保护',
    '共同继承一笔遗产',
    '女主成为解除诅咒的长期对象',
  ],
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

export default function Home() {
  const [step, setStep] = useState<StepId>('create');
  const [productionType, setProductionType] = useState<ProductionType>('AI 剧');
  const [mode, setMode] = useState<GenerationMode>('结构事件库组合');
  const [selectedBeat, setSelectedBeat] = useState<BeatKey>('原生困境');
  const [locked, setLocked] = useState<BeatKey[]>(['宿命启动']);
  const [tone, setTone] = useState('强爽感');

  const currentBeat = beatCards.find((item) => item.key === selectedBeat)!;
  const progress = useMemo(
    () =>
      steps.findIndex((item) => item.id === step) === -1
        ? 0
        : ((steps.findIndex((item) => item.id === step) + 1) / steps.length) *
          100,
    [step],
  );

  const toggleLock = (beat: BeatKey) => {
    setLocked((items) =>
      items.includes(beat)
        ? items.filter((item) => item !== beat)
        : [...items, beat],
    );
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
              'Read the visible DramaScale prototype state, including step, production type, generation mode, selected beat, and locked beats.',
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
                selectedBeat,
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
                step?: StepId;
                selectedBeat?: BeatKey;
              };
              if (value.productionType) setProductionType(value.productionType);
              if (value.mode) setMode(value.mode);
              if (value.step) setStep(value.step);
              if (value.selectedBeat) setSelectedBeat(value.selectedBeat);
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
  }, [locked, mode, productionType, selectedBeat, step]);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#201b16]">
      <div className="grid min-h-screen grid-cols-[248px_minmax(0,1fr)_332px] max-xl:grid-cols-[220px_minmax(0,1fr)] max-lg:block">
        <aside className="border-r border-[#ded6c8] bg-[#191713] px-4 py-5 text-[#f9f2e7] max-lg:hidden">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6b84b] text-[#191713]">
              <Clapperboard size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold">DramaScale</p>
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
              {steps.map(({ id, label, icon: Icon }) => (
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
                setStep={setStep}
              />
            )}
            {step === 'brief' && (
              <BriefStep
                productionType={productionType}
                mode={mode}
                tone={tone}
                setTone={setTone}
                setStep={setStep}
              />
            )}
            {step === 'beats' && (
              <BeatsStep
                selectedBeat={selectedBeat}
                setSelectedBeat={setSelectedBeat}
                currentBeat={currentBeat}
                locked={locked}
                toggleLock={toggleLock}
                setStep={setStep}
              />
            )}
            {step === 'result' && <ResultStep setStep={setStep} />}
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
  setStep,
}: {
  productionType: ProductionType;
  setProductionType: (value: ProductionType) => void;
  mode: GenerationMode;
  setMode: (value: GenerationMode) => void;
  setStep: (value: StepId) => void;
}) {
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
      <div className="flex justify-end">
        <button
          onClick={() => setStep('brief')}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white"
        >
          进入 Brief
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function BriefStep({
  productionType,
  mode,
  tone,
  setTone,
  setStep,
}: {
  productionType: ProductionType;
  mode: GenerationMode;
  tone: string;
  setTone: (value: string) => void;
  setStep: (value: StepId) => void;
}) {
  const costFields =
    productionType === 'AI 剧'
      ? ['角色一致性：高', '复杂动作：少量', '奇幻特效：允许局部', '重生成风险：中']
      : ['演员数量：6 人以内', '外景：少量', '动作戏：轻量', '拍摄预算：中'];

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 2"
        title="把灵感配置成可生成的 Brief"
        text="这里不要求用户一次想清楚所有剧情，系统可以补全 Want / Need / 枷锁，再进入 beat 编排。"
      />
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-5 max-lg:grid-cols-1">
        <Panel title="基础信息">
          <Field label="一句话灵感" value="婚礼当天被背叛的新娘，被危险男人救下后卷入家族诅咒。" />
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Field label="目标市场" value="北美" />
            <Field label="目标平台" value="ReelShort / DramaBox" />
            <Field label="生产类型" value={productionType} />
            <Field label="生成模式" value={mode} />
            <Field label="总集数" value={mode === '爆款迭代' ? '继承参考爆款' : '60 集'} />
            <Field label="免费集" value={mode === '爆款迭代' ? '继承参考爆款' : '第 8 集'} />
          </div>
        </Panel>
        <Panel title="题材与情绪">
          <div className="flex flex-wrap gap-2">
            {['黑帮', '契约婚姻', '背叛', '复仇', '宿命诅咒', '身份反转'].map(
              (item) => (
                <Tag key={item}>{item}</Tag>
              ),
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['强爽感', '先虐后爽', '强制爱'].map((item) => (
              <button
                key={item}
                onClick={() => setTone(item)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  tone === item
                    ? 'border-[#cf4f35] bg-[#fff0ea] text-[#9d321d]'
                    : 'border-[#d8cdbc] bg-white text-[#64584c]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Panel>
      </div>

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
          onClick={() => setStep('beats')}
          className="flex items-center gap-2 rounded-md bg-[#cf4f35] px-4 py-2.5 text-sm font-semibold text-white"
        >
          生成 5 Beat
          <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
}

function BeatsStep({
  selectedBeat,
  setSelectedBeat,
  currentBeat,
  locked,
  toggleLock,
  setStep,
}: {
  selectedBeat: BeatKey;
  setSelectedBeat: (value: BeatKey) => void;
  currentBeat: (typeof beatCards)[number];
  locked: BeatKey[];
  toggleLock: (value: BeatKey) => void;
  setStep: (value: StepId) => void;
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 3"
        title="5 Beat 编排与事件替换"
        text="每个 beat 都先给一个主事件，同时首屏推荐 5-8 个可替换事件。编剧可以锁定满意事件，局部重生成其他部分。"
      />
      <div className="grid grid-cols-[1fr_360px] gap-5 max-xl:grid-cols-1">
        <div className="grid gap-3">
          {beatCards.map((beat, index) => (
            <button
              key={beat.key}
              onClick={() => setSelectedBeat(beat.key)}
              className={`rounded-lg border p-4 text-left shadow-sm ${
                selectedBeat === beat.key
                  ? 'border-[#cf4f35] bg-white'
                  : 'border-[#ded6c8] bg-[#fffcf6]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#9d321d]">
                    Beat {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{beat.key}</h3>
                </div>
                {locked.includes(beat.key) && (
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
            </button>
          ))}
        </div>
        <Panel title={`${currentBeat.key}：候选事件池`}>
          <p className="mb-3 text-sm text-[#6b5f52]">{currentBeat.risk}</p>
          <div className="grid gap-2">
            {eventPool[selectedBeat].map((event, index) => (
              <button
                key={event}
                className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm ${
                  index === 0
                    ? 'border-[#cf4f35] bg-[#fff0ea]'
                    : 'border-[#ded6c8] bg-white'
                }`}
              >
                <span>{event}</span>
                <span className="text-xs text-[#817363]">
                  匹配 {96 - index * 4}%
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toggleLock(selectedBeat)}
              className="flex-1 rounded-md border border-[#c9bba8] bg-white px-3 py-2 text-sm font-medium"
            >
              {locked.includes(selectedBeat) ? '取消锁定' : '锁定事件'}
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

function ResultStep({ setStep }: { setStep: (value: StepId) => void }) {
  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Step 4"
        title="故事方案与免费卡点"
        text="这里给策划判断项目是否值得继续写。重点看故事钩子、人物关系、免费卡点和付费驱动力。"
      />
      <div className="grid grid-cols-[1fr_320px] gap-5 max-xl:grid-cols-1">
        <Panel title="方案 A：The Bride Claimed by the Cursed Heir">
          <div className="space-y-4">
            <InfoBlock
              label="Logline"
              text="婚礼当天被未婚夫背叛的新娘，意外救下被追杀的黑帮继承人，却发现自己是解除他家族诅咒的唯一钥匙。"
            />
            <InfoBlock
              label="故事简介"
              text="Natalie 原本以为婚礼能拯救破产家族，却在婚礼前听见未婚夫和继妹合谋骗取信托。她被追杀中的 Alessio 卷入危险关系，随后发现母亲留下的纹章与 Moretti 家族诅咒有关。为了夺回继承权，她接受契约婚姻，也把自己推向一个更危险、更迷人的男人。"
            />
            <InfoBlock
              label="核心卖点"
              text="婚礼背叛、危险男人救场、契约婚姻、家族诅咒、女主身份价值反转。"
            />
          </div>
        </Panel>
        <Panel title="免费卡点">
          <div className="rounded-lg bg-[#201b16] p-4 text-white">
            <p className="text-xs text-[#d7c7b4]">第 8 集结尾</p>
            <h3 className="mt-1 text-lg font-semibold">女主即将签下婚姻协议时，母亲纹章亮起</h3>
            <p className="mt-3 text-sm leading-6 text-[#eadfce]">
              观众已经想看女主复仇，也想知道她与男主诅咒的关系。卡在“签还是不签”的瞬间，付费驱动力来自身份谜团和关系绑定。
            </p>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <Metric label="爆款潜力" value="86" />
            <Metric label="付费点强度" value="92" />
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

  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
      <Panel title="集数导航">
        <div className="grid gap-2">
          {episodes.map((episode, index) => (
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
        <button className="mt-4 w-full rounded-md bg-[#201b16] px-3 py-2 text-sm font-semibold text-white">
          生成到免费集
        </button>
      </Panel>
      <Panel title={`${episodes[selected].ep}：${episodes[selected].title}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          {['局部改写', '强化冲突', '修复逻辑', '压缩字数', '增强付费欲望'].map(
            (action) => (
              <button
                key={action}
                className="rounded-md border border-[#c9bba8] bg-white px-3 py-2 text-sm"
              >
                {action}
              </button>
            ),
          )}
        </div>
        <div className="rounded-lg border border-[#ded6c8] bg-[#fffdf9] p-4">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-[#6b5f52]">
            <span>{episodes[selected].words} 字</span>
            <span>{episodes[selected].duration}</span>
            <span>结尾卡点：{episodes[selected].hook}</span>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-[15px] leading-8 text-[#2d261f]">
            {episodes[selected].script}
          </pre>
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

        <Panel title="风险与建议">
          <div className="space-y-3 text-sm leading-6">
            <Risk
              title="Beat 配置"
              text={step === 'beats' ? '生存危机很强，但宿命启动需要前置线索，避免第 3 集突兀。' : '当前结构完整，建议继续检查免费集卡点。'}
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
