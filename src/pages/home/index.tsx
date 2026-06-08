import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh } from '@tarojs/taro';
import Card from '@/components/Card';
import { mockUser, mockVisits, mockOpportunities, mockPerformance, mockMessages } from '@/data/mock';
import { formatMoney, formatPercent, getStageText, formatDateTime } from '@/utils';
import styles from './index.module.scss';
import type { Visit, Opportunity } from '@/types';

const HomePage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>(
    mockVisits.filter(v => v.status === 'pending').slice(0, 3)
  );
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    mockOpportunities.filter(o => o.stage !== 'win' && o.stage !== 'lost').slice(0, 3)
  );
  const [unreadCount, setUnreadCount] = useState(
    mockMessages.filter(m => !m.read).length
  );

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handleQuickAction = useCallback((action: string) => {
    console.log('[Home] Quick action:', action);
    switch (action) {
      case 'customer':
        Taro.switchTab({ url: '/pages/customers/index' });
        break;
      case 'visit':
        Taro.switchTab({ url: '/pages/visits/index' });
        break;
      case 'opportunity':
        Taro.switchTab({ url: '/pages/opportunities/index' });
        break;
      case 'checkin':
        Taro.navigateTo({ url: '/pages/check-in/index' });
        break;
      case 'performance':
        Taro.navigateTo({ url: '/pages/performance/index' });
        break;
      default:
        Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  }, []);

  const handleVisitClick = useCallback((visitId: string) => {
    console.log('[Home] Visit clicked:', visitId);
    Taro.navigateTo({ url: `/pages/check-in/index?id=${visitId}` });
  }, []);

  const handleOpportunityClick = useCallback((oppoId: string) => {
    console.log('[Home] Opportunity clicked:', oppoId);
    Taro.navigateTo({ url: `/pages/opportunity-detail/index?id=${oppoId}` });
  }, []);

  const handleMessageClick = useCallback(() => {
    console.log('[Home] Message clicked');
    Taro.navigateTo({ url: '/pages/messages/index' });
  }, []);

  const handleViewAllVisits = useCallback(() => {
    Taro.switchTab({ url: '/pages/visits/index' });
  }, []);

  const handleViewAllOpps = useCallback(() => {
    Taro.switchTab({ url: '/pages/opportunities/index' });
  }, []);

  const quickActions = [
    { key: 'customer', icon: '👥', text: '客户管理', color: 'customer' },
    { key: 'visit', icon: '📅', text: '拜访计划', color: 'visit' },
    { key: 'opportunity', icon: '💼', text: '商机跟进', color: 'opportunity' },
    { key: 'checkin', icon: '📍', text: '现场签到', color: 'checkin' },
    { key: 'quote', icon: '📄', text: '报价记录', color: 'quote' },
    { key: 'contact', icon: '📱', text: '联系人', color: 'contact' },
    { key: 'performance', icon: '📊', text: '业绩看板', color: 'performance' },
    { key: 'more', icon: '⋯', text: '更多', color: 'more' }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 顶部用户信息区 */}
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image
            className={styles.avatar}
            src={mockUser.avatar}
            mode="aspectFill"
          />
          <View className={styles.userText}>
            <Text className={styles.greeting}>早上好，今天也要加油哦！</Text>
            <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
              <Text className={styles.userName}>{mockUser.name}</Text>
              <Text className={styles.position}>{mockUser.position}</Text>
            </View>
          </View>
          <View className={styles.messageIcon} onClick={handleMessageClick}>
            {unreadCount > 0 && (
              <View className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</View>
            )}
          </View>
        </View>

        {/* 业绩概览 */}
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <View className={styles.statValue}>¥{formatMoney(mockPerformance.totalAmount)}</View>
            <Text className={styles.statLabel}>本月业绩</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statItem}>
            <View className={styles.statValue}>{formatPercent(mockPerformance.completionRate)}</View>
            <Text className={styles.statLabel}>完成率</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statItem}>
            <View className={styles.statValue}>{mockPerformance.weeklyVisitCount}</View>
            <Text className={styles.statLabel}>本周拜访</Text>
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className={styles.section}>
        <Card padding="lg">
          <View className={styles.quickGrid}>
            {quickActions.map(item => (
              <View
                key={item.key}
                className={styles.quickItem}
                onClick={() => handleQuickAction(item.key)}
              >
                <View className={`${styles.quickIcon} ${styles[item.color]}`}>
                  <Text>{item.icon}</Text>
                </View>
                <Text className={styles.quickText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* 今日拜访 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日拜访</Text>
          <Text className={styles.sectionMore} onClick={handleViewAllVisits}>
            查看全部
          </Text>
        </View>
        {visits.length > 0 ? (
          visits.map(visit => (
            <View
              key={visit.id}
              className={styles.visitCard}
              onClick={() => handleVisitClick(visit.id)}
            >
              <View className={styles.visitHeader}>
                <Image
                  className={styles.customerAvatar}
                  src={visit.customerAvatar}
                  mode="aspectFill"
                />
                <View className={styles.visitInfo}>
                  <Text className={styles.customerName}>{visit.customerName}</Text>
                  <Text className={styles.visitTime}>
                    {visit.planTime.slice(11, 16)} · {visit.distance ? `${visit.distance}km` : ''}
                  </Text>
                </View>
                <View className={`${styles.visitStatus} ${styles[visit.status]}`}>
                  {visit.status === 'pending' ? '待拜访' : '已完成'}
                </View>
              </View>
              <Text className={styles.visitPurpose}>{visit.purpose}</Text>
              <View className={styles.visitFooter}>
                <Text className={styles.visitLocation}>📍 {visit.location}</Text>
                <View className={styles.visitAction}>去签到</View>
              </View>
            </View>
          ))
        ) : (
          <Card>
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>🎉</View>
              <Text className={styles.emptyText}>今日暂无拜访计划</Text>
            </View>
          </Card>
        )}
      </View>

      {/* 重点商机 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>重点商机</Text>
          <Text className={styles.sectionMore} onClick={handleViewAllOpps}>
            查看全部
          </Text>
        </View>
        <Card padding="md">
          {opportunities.map(oppo => (
            <View
              key={oppo.id}
              className={styles.opportunityItem}
              onClick={() => handleOpportunityClick(oppo.id)}
            >
              <Image
                className={styles.oppoAvatar}
                src={oppo.customerAvatar}
                mode="aspectFill"
              />
              <View className={styles.oppoInfo}>
                <Text className={styles.oppoTitle}>{oppo.title}</Text>
                <Text className={styles.oppoCustomer}>{oppo.customerName}</Text>
                <View className={`${styles.stageTag} ${styles[oppo.stage]}`}>
                  {getStageText(oppo.stage)}
                </View>
              </View>
              <View>
                <Text className={styles.oppoAmount}>¥{formatMoney(oppo.amount)}</Text>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomePage;
