import dayjs from 'dayjs';

export const formatDate = (date: string, format: string = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string, format: string = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const formatRelativeTime = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'day');
  
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  if (diff < 7) return `${diff}天前`;
  if (diff < 30) return `${Math.floor(diff / 7)}周前`;
  return formatDate(date);
};

export const formatMoney = (amount: number) => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString();
};

export const formatPercent = (value: number) => {
  return `${Math.round(value * 100)}%`;
};

export const getStageText = (stage: string) => {
  const stageMap: Record<string, string> = {
    lead: '线索',
    contact: '接触',
    requirement: '需求确认',
    quote: '报价',
    negotiate: '商务谈判',
    win: '赢单',
    lost: '输单'
  };
  return stageMap[stage] || stage;
};

export const getLevelText = (level: string) => {
  const levelMap: Record<string, string> = {
    vip: 'VIP客户',
    normal: '普通客户',
    potential: '潜在客户'
  };
  return levelMap[level] || level;
};

export const getVisitStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待拜访',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

export const getQuoteStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
  };
  return statusMap[status] || status;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const getInitials = (name: string) => {
  return name.charAt(0);
};
