import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import Tag from '@/components/Tag';
import Card from '@/components/Card';
import { getLevelText, getStageText, formatDate, formatMoney } from '@/utils';
import styles from './index.module.scss';
import type { Customer, Contact, Visit, Opportunity } from '@/types';

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const customerId = router.params.id;
  
  const customers = useCRMStore((state) => state.customers);
  const contacts = useCRMStore((state) => state.contacts);
  const visits = useCRMStore((state) => state.visits);
  const opportunities = useCRMStore((state) => state.opportunities);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerContacts, setCustomerContacts] = useState<Contact[]>([]);
  const [customerVisits, setCustomerVisits] = useState<Visit[]>([]);
  const [customerOpportunities, setCustomerOpportunities] = useState<Opportunity[]>([]);

  const loadData = () => {
    if (customerId) {
      const found = customers.find(c => c.id === customerId);
      if (found) {
        setCustomer(found);
        setCustomerContacts(contacts.filter(c => c.customerId === customerId));
        setCustomerVisits(visits.filter(v => v.customerId === customerId).slice(0, 3));
        setCustomerOpportunities(opportunities.filter(o => o.customerId === customerId));
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [customerId, customers, contacts, visits, opportunities]);

  useDidShow(() => {
    loadData();
  });

  const handleCall = () => {
    if (customer?.phone) {
      Taro.showToast({ title: '拨打电话功能', icon: 'none' });
    }
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能', icon: 'none' });
  };

  const handleCheckIn = () => {
    Taro.navigateTo({ url: `/pages/check-in/index?customerId=${customerId}` });
  };

  const handleAddContact = () => {
    Taro.navigateTo({ url: `/pages/contact-edit/index?customerId=${customerId}` });
  };

  const handleViewOpportunity = (id: string) => {
    Taro.navigateTo({ url: `/pages/opportunity-detail/index?id=${id}` });
  };

  const handleViewContact = (id: string) => {
    Taro.navigateTo({ url: `/pages/contact-detail/index?id=${id}` });
  };

  const handleViewAllVisits = () => {
    Taro.switchTab({ url: '/pages/visits/index' });
  };

  if (!customer) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '200rpx 0' }}>
          <Text style={{ color: '#86909c' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <React.Fragment>
      <ScrollView scrollY className={styles.page}>
      {/* 顶部客户信息 */}
      <View className={styles.header}>
        <View className={styles.customerInfo}>
          <Image
            className={styles.customerAvatar}
            src={customer.avatar}
            mode="aspectFill"
          />
          <View className={styles.customerDetail}>
            <View className={styles.nameRow}>
              <Text className={styles.customerName}>{customer.name}</Text>
              <Tag text={getLevelText(customer.level)} type={customer.level === 'vip' ? 'warning' : customer.level === 'normal' ? 'primary' : 'info'} size="sm" />
            </View>
            <Text className={styles.industryText}>{customer.industry} · {customer.region}</Text>
          </View>
        </View>
      </View>

      {/* 数据统计 */}
      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{customer.contactCount}</Text>
          <Text className={styles.statLabel}>沟通次数</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{customerOpportunities.length}</Text>
          <Text className={styles.statLabel}>商机数量</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{customerVisits.length}</Text>
          <Text className={styles.statLabel}>拜访记录</Text>
        </View>
      </View>

      {/* 基本信息 */}
      <Card className={styles.infoCard}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📞 联系电话</Text>
          <Text className={styles.infoValue}>{customer.phone}</Text>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📍 详细地址</Text>
          <Text className={styles.infoValue}>{customer.address}</Text>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>🕐 最近沟通</Text>
          <Text className={styles.infoValue}>{customer.lastContact}</Text>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📅 下次跟进</Text>
          <Text className={styles.infoValue}>{customer.nextFollowUp}</Text>
        </View>
      </Card>

      {/* 客户简介 */}
      <Card className={styles.descCard}>
        <Text className={styles.cardTitle}>客户简介</Text>
        <Text className={styles.descText}>{customer.description}</Text>
      </Card>

      {/* 联系人 */}
      <Card className={styles.sectionCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>联系人</Text>
          <View className={styles.addBtn} onClick={handleAddContact}>
            <Text className={styles.addText}>+ 新增</Text>
          </View>
        </View>
        {customerContacts.length > 0 ? (
          <View className={styles.contactList}>
            {customerContacts.map(contact => (
              <View
                key={contact.id}
                className={styles.contactItem}
                onClick={() => handleViewContact(contact.id)}
              >
                <Image
                  className={styles.contactAvatar}
                  src={contact.avatar}
                  mode="aspectFill"
                />
                <View className={styles.contactInfo}>
                  <View className={styles.contactNameRow}>
                    <Text className={styles.contactName}>{contact.name}</Text>
                    {contact.isPrimary && (
                      <Tag text="主要联系人" type="primary" size="sm" />
                    )}
                  </View>
                  <Text className={styles.contactPosition}>{contact.position}</Text>
                  <Text className={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Text className={styles.arrow}>›</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text style={{ color: '#c9cdd4' }}>暂无联系人</Text>
          </View>
        )}
      </Card>

      {/* 商机列表 */}
      <Card className={styles.sectionCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>相关商机</Text>
          <Text className={styles.moreText} onClick={() => Taro.switchTab({ url: '/pages/opportunities/index' })}>
            全部 ›
          </Text>
        </View>
        {customerOpportunities.length > 0 ? (
          <View className={styles.opportunityList}>
            {customerOpportunities.slice(0, 3).map(opp => (
              <View
                key={opp.id}
                className={styles.opportunityItem}
                onClick={() => handleViewOpportunity(opp.id)}
              >
                <View className={styles.oppHeader}>
                  <Text className={styles.oppTitle}>{opp.title}</Text>
                  <Tag text={getStageText(opp.stage)} type="primary" size="sm" />
                </View>
                <View className={styles.oppAmount}>
                  <Text className={styles.oppAmountValue}>¥{formatMoney(opp.amount)}</Text>
                  <Text className={styles.oppWinRate}>赢率 {Math.round(opp.probability * 100)}%</Text>
                </View>
                <View className={styles.oppFooter}>
                  <Text className={styles.oppDate}>预计成交：{formatDate(opp.expectedCloseDate)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text style={{ color: '#c9cdd4' }}>暂无商机</Text>
          </View>
        )}
      </Card>

      {/* 最近拜访 */}
      <Card className={styles.sectionCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>最近拜访</Text>
          <Text className={styles.moreText} onClick={handleViewAllVisits}>全部 ›</Text>
        </View>
        {customerVisits.length > 0 ? (
          <View className={styles.visitList}>
            {customerVisits.map(visit => (
              <View key={visit.id} className={styles.visitItem}>
                <View className={styles.visitDate}>
                  <Text className={styles.visitDateText}>{formatDate(visit.planTime, 'MM-DD')}</Text>
                  <Text className={styles.visitTimeText}>{visit.planTime.slice(11, 16)}</Text>
                </View>
                <View className={styles.visitContent}>
                  <Text className={styles.visitPurpose}>{visit.purpose}</Text>
                  <Tag
                    text={visit.status === 'completed' ? '已完成' : visit.status === 'ongoing' ? '进行中' : '待拜访'}
                    type={visit.status === 'completed' ? 'success' : visit.status === 'ongoing' ? 'primary' : 'default'}
                    size="sm"
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text style={{ color: '#c9cdd4' }}>暂无拜访记录</Text>
          </View>
        )}
      </Card>

      <View style={{ height: '160rpx' }} />
    </ScrollView>

    {/* 底部操作栏 */}
    <View className={styles.actionBar}>
      <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleCall}>
        📞 电话
      </View>
      <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleNavigate}>
        📍 导航
      </View>
      <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleCheckIn}>
        立即签到
      </View>
    </View>
    </React.Fragment>
  );
};

export default CustomerDetailPage;
