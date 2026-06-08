// 客户类型
export interface Customer {
  id: string;
  name: string;
  level: 'vip' | 'normal' | 'potential';
  industry: string;
  region: string;
  address: string;
  phone: string;
  lastContact: string;
  nextFollowUp: string;
  contactCount: number;
  opportunityCount: number;
  avatar: string;
  description: string;
  birthday?: string;
}

// 联系人类型
export interface Contact {
  id: string;
  customerId: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  wechat?: string;
  avatar: string;
  isPrimary: boolean;
  birthday?: string;
}

// 拜访记录类型
export interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  planTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  purpose: string;
  notes?: string;
  photos?: string[];
  location?: string;
  distance?: number;
}

// 商机类型
export interface Opportunity {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  title: string;
  stage: 'lead' | 'contact' | 'requirement' | 'quote' | 'negotiate' | 'win' | 'lost';
  amount: number;
  probability: number;
  expectedCloseDate: string;
  nextFollowUp: string;
  description: string;
  competitors: string[];
  budget: number;
  createdAt: string;
}

// 报价单类型
export interface Quote {
  id: string;
  opportunityId: string;
  customerId: string;
  customerName: string;
  title: string;
  amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  validUntil: string;
  items: QuoteItem[];
  approver?: string;
  approvalAt?: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

// 消息类型
export interface Message {
  id: string;
  type: 'birthday' | 'followup' | 'approval' | 'system';
  title: string;
  content: string;
  time: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
}

// 业绩统计类型
export interface Performance {
  totalAmount: number;
  targetAmount: number;
  completionRate: number;
  visitCount: number;
  weeklyVisitCount: number;
  newCustomerCount: number;
  opportunityCount: number;
  winRate: number;
  collectionAmount: number;
  pendingCollection: number;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  position: string;
  department: string;
  phone: string;
  region: string;
}

// 区域类型
export interface Region {
  id: string;
  name: string;
  customerCount: number;
}
