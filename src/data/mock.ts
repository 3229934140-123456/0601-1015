import type { Customer, Contact, Visit, Opportunity, Quote, Message, Performance, User, Region } from '@/types';

export const mockUser: User = {
  id: 'u001',
  name: '张明',
  avatar: 'https://picsum.photos/id/64/200/200',
  position: '高级销售经理',
  department: '华东销售部',
  phone: '138****8888',
  region: '华东区'
};

export const mockRegions: Region[] = [
  { id: 'r1', name: '全部区域', customerCount: 0 },
  { id: 'r2', name: '浦东新区', customerCount: 12 },
  { id: 'r3', name: '黄浦区', customerCount: 8 },
  { id: 'r4', name: '徐汇区', customerCount: 15 },
  { id: 'r5', name: '静安区', customerCount: 6 },
  { id: 'r6', name: '长宁区', customerCount: 10 }
];

export const mockCustomers: Customer[] = [
  {
    id: 'c001',
    name: '上海华信科技有限公司',
    level: 'vip',
    industry: '互联网科技',
    region: '浦东新区',
    address: '上海市浦东新区张江高科技园区博云路2号',
    phone: '021-58888888',
    lastContact: '2026-06-05 14:30',
    nextFollowUp: '2026-06-10 10:00',
    contactCount: 18,
    opportunityCount: 3,
    avatar: 'https://picsum.photos/id/1/200/200',
    description: '大型互联网科技公司，主营企业级SaaS服务，年采购额500万以上',
    birthday: '1990-06-15'
  },
  {
    id: 'c002',
    name: '鼎盛金融集团',
    level: 'vip',
    industry: '金融服务',
    region: '浦东新区',
    address: '上海市浦东新区陆家嘴环路1000号',
    phone: '021-68888888',
    lastContact: '2026-06-03 09:15',
    nextFollowUp: '2026-06-08 15:00',
    contactCount: 25,
    opportunityCount: 2,
    avatar: 'https://picsum.photos/id/2/200/200',
    description: '国内知名金融集团，业务涵盖银行、证券、保险'
  },
  {
    id: 'c003',
    name: '新锐医疗器械有限公司',
    level: 'normal',
    industry: '医疗器械',
    region: '徐汇区',
    address: '上海市徐汇区漕河泾开发区桂平路333号',
    phone: '021-64888888',
    lastContact: '2026-06-01 16:45',
    nextFollowUp: '2026-06-12 10:00',
    contactCount: 8,
    opportunityCount: 1,
    avatar: 'https://picsum.photos/id/3/200/200',
    description: '高新技术企业，专注于高端医疗器械研发生产'
  },
  {
    id: 'c004',
    name: '恒通物流股份有限公司',
    level: 'normal',
    industry: '物流运输',
    region: '静安区',
    address: '上海市静安区共和路219号',
    phone: '021-63558888',
    lastContact: '2026-05-28 11:20',
    nextFollowUp: '2026-06-15 09:30',
    contactCount: 12,
    opportunityCount: 1,
    avatar: 'https://picsum.photos/id/6/200/200',
    description: '国内知名物流企业，全国仓储网络完善'
  },
  {
    id: 'c005',
    name: '星辰教育培训中心',
    level: 'potential',
    industry: '教育培训',
    region: '长宁区',
    address: '上海市长宁区天山路789号',
    phone: '021-62288888',
    lastContact: '2026-05-25 10:00',
    nextFollowUp: '2026-06-18 14:00',
    contactCount: 3,
    opportunityCount: 0,
    avatar: 'https://picsum.photos/id/8/200/200',
    description: 'K12教育培训连锁机构，正在拓展在线教育业务'
  },
  {
    id: 'c006',
    name: '绿地商业地产集团',
    level: 'vip',
    industry: '房地产',
    region: '黄浦区',
    address: '上海市黄浦区打浦路218号',
    phone: '021-63058888',
    lastContact: '2026-06-04 15:30',
    nextFollowUp: '2026-06-09 10:30',
    contactCount: 30,
    opportunityCount: 5,
    avatar: 'https://picsum.photos/id/9/200/200',
    description: '大型商业地产开发商，在全国多个城市有商业综合体项目'
  },
  {
    id: 'c007',
    name: '智联人力资源服务公司',
    level: 'potential',
    industry: '人力资源',
    region: '徐汇区',
    address: '上海市徐汇区中山西路2025号',
    phone: '021-64288888',
    lastContact: '2026-05-20 16:00',
    nextFollowUp: '2026-06-20 11:00',
    contactCount: 2,
    opportunityCount: 0,
    avatar: 'https://picsum.photos/id/119/200/200',
    description: '区域型人力资源服务商，正在寻求数字化转型'
  },
  {
    id: 'c008',
    name: '宝钢集团采购中心',
    level: 'vip',
    industry: '钢铁制造',
    region: '浦东新区',
    address: '上海市浦东新区浦电路370号',
    phone: '021-58388888',
    lastContact: '2026-06-02 09:00',
    nextFollowUp: '2026-06-11 14:00',
    contactCount: 45,
    opportunityCount: 4,
    avatar: 'https://picsum.photos/id/160/200/200',
    description: '特大型钢铁企业，采购需求量大，供应商管理严格'
  },
  {
    id: 'c009',
    name: '东方航空信息部',
    level: 'normal',
    industry: '航空运输',
    region: '长宁区',
    address: '上海市长宁区虹桥机场空港三路',
    phone: '021-62688888',
    lastContact: '2026-05-30 13:30',
    nextFollowUp: '2026-06-16 10:00',
    contactCount: 15,
    opportunityCount: 2,
    avatar: 'https://picsum.photos/id/201/200/200',
    description: '国内三大航空公司之一，IT投入持续增长'
  },
  {
    id: 'c010',
    name: '百联集团电商事业部',
    level: 'normal',
    industry: '零售电商',
    region: '黄浦区',
    address: '上海市黄浦区南京东路830号',
    phone: '021-63228888',
    lastContact: '2026-05-26 15:00',
    nextFollowUp: '2026-06-13 09:00',
    contactCount: 10,
    opportunityCount: 1,
    avatar: 'https://picsum.photos/id/225/200/200',
    description: '大型零售集团电商业务板块，正在进行数字化升级'
  },
  {
    id: 'c011',
    name: '康师傅控股上海总部',
    level: 'potential',
    industry: '食品饮料',
    region: '徐汇区',
    address: '上海市徐汇区吴中路585号',
    phone: '021-64058888',
    lastContact: '2026-05-18 10:30',
    nextFollowUp: '2026-06-22 14:30',
    contactCount: 1,
    opportunityCount: 0,
    avatar: 'https://picsum.photos/id/292/200/200',
    description: '知名食品饮料企业，有供应链数字化需求'
  },
  {
    id: 'c012',
    name: '联合利华中国区',
    level: 'vip',
    industry: '快消品',
    region: '长宁区',
    address: '上海市长宁区临新路268弄',
    phone: '021-62388888',
    lastContact: '2026-06-06 11:00',
    nextFollowUp: '2026-06-10 15:30',
    contactCount: 22,
    opportunityCount: 3,
    avatar: 'https://picsum.photos/id/312/200/200',
    description: '全球知名快消品公司，数字化营销需求旺盛'
  }
];

export const mockContacts: Contact[] = [
  {
    id: 'ct001',
    customerId: 'c001',
    name: '李建国',
    position: '技术总监',
    phone: '13812345678',
    email: 'lijianguo@huaxin.com',
    wechat: 'lijianguo_wx',
    avatar: 'https://picsum.photos/id/91/200/200',
    isPrimary: true
  },
  {
    id: 'ct002',
    customerId: 'c001',
    name: '王芳',
    position: '采购经理',
    phone: '13987654321',
    email: 'wangfang@huaxin.com',
    avatar: 'https://picsum.photos/id/338/200/200',
    isPrimary: false
  },
  {
    id: 'ct003',
    customerId: 'c002',
    name: '陈伟强',
    position: 'CIO',
    phone: '13800001111',
    email: 'chenwq@dingsheng.com',
    avatar: 'https://picsum.photos/id/177/200/200',
    isPrimary: true
  },
  {
    id: 'ct004',
    customerId: 'c002',
    name: '刘雪梅',
    position: 'IT经理',
    phone: '13911112222',
    email: 'liuxm@dingsheng.com',
    avatar: 'https://picsum.photos/id/64/200/200',
    isPrimary: false
  },
  {
    id: 'ct005',
    customerId: 'c003',
    name: '张涛',
    position: '副总经理',
    phone: '13822223333',
    email: 'zhangtao@xinray.com',
    avatar: 'https://picsum.photos/id/1027/200/200',
    isPrimary: true
  }
];

export const mockVisits: Visit[] = [
  {
    id: 'v001',
    customerId: 'c001',
    customerName: '上海华信科技有限公司',
    customerAvatar: 'https://picsum.photos/id/1/200/200',
    planTime: '2026-06-08 10:00',
    status: 'pending',
    purpose: '季度业务回顾，洽谈Q3采购计划',
    location: '浦东新区张江高科技园区博云路2号',
    distance: 5.2
  },
  {
    id: 'v002',
    customerId: 'c006',
    customerName: '绿地商业地产集团',
    customerAvatar: 'https://picsum.photos/id/9/200/200',
    planTime: '2026-06-08 14:00',
    status: 'pending',
    purpose: '新项目需求沟通，演示智慧商业解决方案',
    location: '黄浦区打浦路218号',
    distance: 8.5
  },
  {
    id: 'v003',
    customerId: 'c002',
    customerName: '鼎盛金融集团',
    customerAvatar: 'https://picsum.photos/id/2/200/200',
    planTime: '2026-06-08 16:30',
    status: 'pending',
    purpose: '跟进年度框架协议签署',
    location: '浦东新区陆家嘴环路1000号',
    distance: 3.8
  },
  {
    id: 'v004',
    customerId: 'c008',
    customerName: '宝钢集团采购中心',
    customerAvatar: 'https://picsum.photos/id/160/200/200',
    planTime: '2026-06-05 09:30',
    checkInTime: '2026-06-05 09:25',
    checkOutTime: '2026-06-05 11:45',
    status: 'completed',
    purpose: '供应链数字化项目需求调研',
    notes: '客户对智能仓储系统表现出浓厚兴趣，预算在200万左右。关键决策人是采购中心王主任，需要安排技术团队做深入交流。',
    photos: [
      'https://picsum.photos/id/1082/400/300',
      'https://picsum.photos/id/787/400/300'
    ],
    location: '浦东新区浦电路370号'
  },
  {
    id: 'v005',
    customerId: 'c012',
    customerName: '联合利华中国区',
    customerAvatar: 'https://picsum.photos/id/312/200/200',
    planTime: '2026-06-06 14:00',
    checkInTime: '2026-06-06 13:55',
    checkOutTime: '2026-06-06 16:20',
    status: 'completed',
    purpose: '数字营销平台项目投标前沟通',
    notes: '详细了解了招标流程和评分标准，技术方案需要突出数据安全和多品牌管理能力。下次约好做产品演示。',
    location: '长宁区临新路268弄'
  },
  {
    id: 'v006',
    customerId: 'c003',
    customerName: '新锐医疗器械有限公司',
    customerAvatar: 'https://picsum.photos/id/3/200/200',
    planTime: '2026-06-09 10:00',
    status: 'pending',
    purpose: '新产品演示，了解采购预算',
    location: '徐汇区漕河泾开发区桂平路333号',
    distance: 12.3
  },
  {
    id: 'v007',
    customerId: 'c009',
    customerName: '东方航空信息部',
    customerAvatar: 'https://picsum.photos/id/201/200/200',
    planTime: '2026-06-10 14:00',
    status: 'pending',
    purpose: '移动应用升级项目交流',
    location: '长宁区虹桥机场空港三路',
    distance: 9.7
  },
  {
    id: 'v008',
    customerId: 'c004',
    customerName: '恒通物流股份有限公司',
    customerAvatar: 'https://picsum.photos/id/6/200/200',
    planTime: '2026-05-28 10:00',
    checkInTime: '2026-05-28 10:10',
    checkOutTime: '2026-05-28 11:50',
    status: 'completed',
    purpose: '物流管理系统二期需求沟通',
    notes: '客户希望增加运输轨迹追踪和智能调度功能，项目预算约150万。需要在两周内出方案。',
    location: '静安区共和路219号'
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o001',
    customerId: 'c001',
    customerName: '上海华信科技有限公司',
    customerAvatar: 'https://picsum.photos/id/1/200/200',
    title: '企业协同办公平台建设项目',
    stage: 'negotiate',
    amount: 1580000,
    probability: 0.7,
    expectedCloseDate: '2026-07-15',
    nextFollowUp: '2026-06-10 10:00',
    description: '客户需要建设统一的企业协同办公平台，涵盖即时通讯、文档管理、审批流等功能模块。',
    competitors: ['钉钉', '企业微信', '飞书'],
    budget: 2000000,
    createdAt: '2026-04-15'
  },
  {
    id: 'o002',
    customerId: 'c006',
    customerName: '绿地商业地产集团',
    customerAvatar: 'https://picsum.photos/id/9/200/200',
    title: '智慧商业综合体管理系统',
    stage: 'quote',
    amount: 3200000,
    probability: 0.5,
    expectedCloseDate: '2026-08-30',
    nextFollowUp: '2026-06-09 10:30',
    description: '为旗下10个商业综合体打造统一的智慧管理平台，包含客流分析、商户管理、会员系统等。',
    competitors: ['万达信息', '海鼎', '科传'],
    budget: 3500000,
    createdAt: '2026-03-20'
  },
  {
    id: 'o003',
    customerId: 'c002',
    customerName: '鼎盛金融集团',
    customerAvatar: 'https://picsum.photos/id/2/200/200',
    title: '数字化营销平台项目',
    stage: 'requirement',
    amount: 2800000,
    probability: 0.4,
    expectedCloseDate: '2026-09-15',
    nextFollowUp: '2026-06-08 15:00',
    description: '建设集团统一的数字化营销平台，实现客户画像、精准营销、活动管理等功能。',
    competitors: ['Adobe', 'Salesforce', '销售易'],
    budget: 3000000,
    createdAt: '2026-05-01'
  },
  {
    id: 'o004',
    customerId: 'c008',
    customerName: '宝钢集团采购中心',
    customerAvatar: 'https://picsum.photos/id/160/200/200',
    title: '智能仓储管理系统',
    stage: 'contact',
    amount: 2200000,
    probability: 0.3,
    expectedCloseDate: '2026-10-01',
    nextFollowUp: '2026-06-11 14:00',
    description: '升级现有仓储管理系统，引入AI智能调度和物联网设备，提升仓储作业效率30%以上。',
    competitors: ['今天国际', '音飞储存', '德马泰克'],
    budget: 2500000,
    createdAt: '2026-05-20'
  },
  {
    id: 'o005',
    customerId: 'c012',
    customerName: '联合利华中国区',
    customerAvatar: 'https://picsum.photos/id/312/200/200',
    title: '全渠道会员管理系统',
    stage: 'quote',
    amount: 4500000,
    probability: 0.55,
    expectedCloseDate: '2026-07-30',
    nextFollowUp: '2026-06-10 15:30',
    description: '建设统一的全渠道会员管理系统，整合线上线下会员数据，实现精准营销。',
    competitors: ['雅智捷', '驿氪', '微盟'],
    budget: 5000000,
    createdAt: '2026-04-01'
  },
  {
    id: 'o006',
    customerId: 'c003',
    customerName: '新锐医疗器械有限公司',
    customerAvatar: 'https://picsum.photos/id/3/200/200',
    title: 'CRM系统升级项目',
    stage: 'lead',
    amount: 680000,
    probability: 0.15,
    expectedCloseDate: '2026-11-15',
    nextFollowUp: '2026-06-12 10:00',
    description: '客户现有CRM系统功能老旧，希望升级到新一代CRM平台。',
    competitors: ['销售易', '纷享销客', 'Zoho'],
    budget: 800000,
    createdAt: '2026-05-28'
  },
  {
    id: 'o007',
    customerId: 'c009',
    customerName: '东方航空信息部',
    customerAvatar: 'https://picsum.photos/id/201/200/200',
    title: '移动办公App升级',
    stage: 'win',
    amount: 1200000,
    probability: 1,
    expectedCloseDate: '2026-06-01',
    nextFollowUp: '2026-06-20 09:00',
    description: '移动办公App二期升级项目，增加更多业务功能。已签合同，进入实施阶段。',
    competitors: [],
    budget: 1200000,
    createdAt: '2026-02-15'
  },
  {
    id: 'o008',
    customerId: 'c004',
    customerName: '恒通物流股份有限公司',
    customerAvatar: 'https://picsum.photos/id/6/200/200',
    title: '运输管理系统二期',
    stage: 'negotiate',
    amount: 1500000,
    probability: 0.65,
    expectedCloseDate: '2026-07-10',
    nextFollowUp: '2026-06-15 09:30',
    description: '物流管理系统二期，增加运输轨迹追踪、智能调度、费用结算等功能。',
    competitors: ['G7', '运满满', '货车帮'],
    budget: 1800000,
    createdAt: '2026-04-10'
  },
  {
    id: 'o009',
    customerId: 'c010',
    customerName: '百联集团电商事业部',
    customerAvatar: 'https://picsum.photos/id/225/200/200',
    title: '电商平台数字化升级',
    stage: 'requirement',
    amount: 2000000,
    probability: 0.35,
    expectedCloseDate: '2026-09-01',
    nextFollowUp: '2026-06-13 09:00',
    description: '电商平台技术架构升级，提升系统性能和用户体验。',
    competitors: ['有赞', '微盟', '商派'],
    budget: 2500000,
    createdAt: '2026-05-10'
  },
  {
    id: 'o010',
    customerId: 'c005',
    customerName: '星辰教育培训中心',
    customerAvatar: 'https://picsum.photos/id/8/200/200',
    title: '在线教育平台建设',
    stage: 'lost',
    amount: 500000,
    probability: 0,
    expectedCloseDate: '2026-05-01',
    nextFollowUp: '2026-09-01 10:00',
    description: '在线教育平台建设项目，客户选择了其他供应商。',
    competitors: ['云朵课堂', '因酷教育', '尚博思'],
    budget: 600000,
    createdAt: '2026-03-01'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'q001',
    opportunityId: 'o001',
    customerId: 'c001',
    customerName: '上海华信科技有限公司',
    title: '企业协同办公平台报价单',
    amount: 1580000,
    status: 'submitted',
    createdAt: '2026-06-01',
    validUntil: '2026-07-01',
    items: [
      { id: 'qi001', name: '平台软件许可费', quantity: 1, unitPrice: 680000, totalPrice: 680000 },
      { id: 'qi002', name: '系统实施服务费', quantity: 1, unitPrice: 500000, totalPrice: 500000 },
      { id: 'qi003', name: '首年运维服务费', quantity: 1, unitPrice: 200000, totalPrice: 200000 },
      { id: 'qi004', name: '定制化开发费', quantity: 1, unitPrice: 200000, totalPrice: 200000 }
    ],
    approver: '王总'
  },
  {
    id: 'q002',
    opportunityId: 'o005',
    customerId: 'c012',
    customerName: '联合利华中国区',
    title: '全渠道会员管理系统报价',
    amount: 4500000,
    status: 'approved',
    createdAt: '2026-05-15',
    validUntil: '2026-06-15',
    items: [
      { id: 'qi005', name: '会员平台软件', quantity: 1, unitPrice: 1800000, totalPrice: 1800000 },
      { id: 'qi006', name: '数据中台对接', quantity: 1, unitPrice: 1200000, totalPrice: 1200000 },
      { id: 'qi007', name: '实施服务', quantity: 1, unitPrice: 900000, totalPrice: 900000 },
      { id: 'qi008', name: '首年维保', quantity: 1, unitPrice: 600000, totalPrice: 600000 }
    ],
    approver: '李总',
    approvalAt: '2026-05-18'
  },
  {
    id: 'q003',
    opportunityId: 'o002',
    customerId: 'c006',
    customerName: '绿地商业地产集团',
    title: '智慧商业综合体管理系统报价',
    amount: 3200000,
    status: 'draft',
    createdAt: '2026-06-05',
    validUntil: '2026-07-05',
    items: [
      { id: 'qi009', name: '智慧商业平台', quantity: 1, unitPrice: 1500000, totalPrice: 1500000 },
      { id: 'qi010', name: '客流分析系统', quantity: 1, unitPrice: 800000, totalPrice: 800000 },
      { id: 'qi011', name: '会员管理系统', quantity: 1, unitPrice: 600000, totalPrice: 600000 },
      { id: 'qi012', name: '实施服务', quantity: 1, unitPrice: 300000, totalPrice: 300000 }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm001',
    type: 'birthday',
    title: '客户生日提醒',
    content: '上海华信科技有限公司 李建国 明天生日，记得送上祝福哦！',
    time: '2026-06-08 08:00',
    read: false,
    relatedId: 'ct001',
    relatedType: 'contact'
  },
  {
    id: 'm002',
    type: 'followup',
    title: '今日拜访提醒',
    content: '您今天有3个拜访计划，请合理安排时间。第一站：上海华信科技 10:00',
    time: '2026-06-08 07:30',
    read: false,
    relatedId: 'v001',
    relatedType: 'visit'
  },
  {
    id: 'm003',
    type: 'approval',
    title: '报价审批通过',
    content: '联合利华会员管理系统报价单已通过审批，金额450万元。',
    time: '2026-06-07 16:30',
    read: true,
    relatedId: 'q002',
    relatedType: 'quote'
  },
  {
    id: 'm004',
    type: 'system',
    title: '业绩目标更新',
    content: '您的Q2业绩目标已调整为5000万元，请及时跟进重点商机。',
    time: '2026-06-06 09:00',
    read: true
  },
  {
    id: 'm005',
    type: 'followup',
    title: '商机跟进提醒',
    content: '鼎盛金融集团 数字化营销平台项目 需要在今天下午跟进。',
    time: '2026-06-08 12:00',
    read: false,
    relatedId: 'o003',
    relatedType: 'opportunity'
  },
  {
    id: 'm006',
    type: 'system',
    title: '周拜访统计',
    content: '本周您已完成5次拜访，距离目标8次还差3次，加油！',
    time: '2026-06-07 20:00',
    read: true
  }
];

export const mockPerformance: Performance = {
  totalAmount: 26800000,
  targetAmount: 50000000,
  completionRate: 0.536,
  visitCount: 128,
  weeklyVisitCount: 5,
  newCustomerCount: 12,
  opportunityCount: 28,
  winRate: 0.38,
  collectionAmount: 18500000,
  pendingCollection: 8300000
};
