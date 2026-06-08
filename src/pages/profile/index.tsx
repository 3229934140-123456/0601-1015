import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh } from '@tarojs/taro';
import { mockUser, mockPerformance, mockMessages } from '@/data/mock';
import { formatMoney, formatPercent } from '@/utils';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const [performance] = useState(mockPerformance);
  const [unreadCount] = useState(mockMessages.filter(m => !m.read).length);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handlePerformanceClick = useCallback(() => {
    console.log('[Profile] Performance clicked');
    Taro.navigateTo({ url: '/pages/performance/index' });
  }, []);

  const handleMessagesClick = useCallback(() => {
    console.log('[Profile] Messages clicked');
    Taro.navigateTo({ url: '/pages/messages/index' });
  }, []);

  const handleCustomerClick = useCallback(() => {
    Taro.switchTab({ url: '/pages/customers/index' });
  }, []);

  const handleVisitClick = useCallback(() => {
    Taro.switchTab({ url: '/pages/visits/index' });
  }, []);

  const handleQuoteClick = useCallback(() => {
    Taro.showToast({ title: '报价记录功能开发中', icon: 'none' });
  }, []);

  const handleApprovalClick = useCallback(() => {
    Taro.showToast({ title: '审批同步功能开发中', icon: 'none' });
  }, []);

  const handleContactClick = useCallback(() => {
    Taro.showToast({ title: '联系人功能开发中', icon: 'none' });
  }, []);

  const handleSettingClick = useCallback(() => {
    Taro.showToast({ title: '设置功能开发中', icon: 'none' });
  }, []);

  const menuItems = [
    {
      key: 'performance',
      icon: '📊',
      iconClass: 'performance',
      title: '业绩看板',
      subtitle: '查看业绩详情和数据分析',
      onClick: handlePerformanceClick
    },
    {
      key: 'customer',
      icon: '👥',
      iconClass: 'customer',
      title: '我的客户',
      subtitle: `共 ${12} 位客户`,
      onClick: handleCustomerClick
    },
    {
      key: 'visit',
      icon: '📍',
      iconClass: 'visit',
      title: '拜访记录',
      subtitle: `本月 ${performance.visitCount} 次拜访`,
      onClick: handleVisitClick
    },
    {
      key: 'quote',
      icon: '📄',
      iconClass: 'quote',
      title: '报价记录',
      subtitle: '查看所有报价单',
      onClick: handleQuoteClick
    },
    {
      key: 'approval',
      icon: '✅',
      iconClass: 'approval',
      title: '同步审批',
      subtitle: '同步给主管审批',
      onClick: handleApprovalClick
    }
  ];

  const bottomMenuItems = [
    {
      key: 'message',
      icon: '🔔',
      iconClass: 'message',
      title: '消息中心',
      badge: unreadCount,
      onClick: handleMessagesClick
    },
    {
      key: 'contact',
      icon: '📱',
      iconClass: 'contact',
      title: '联系人管理',
      onClick: handleContactClick
    },
    {
      key: 'setting',
      icon: '⚙️',
      iconClass: 'setting',
      title: '设置',
      onClick: handleSettingClick
    }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 顶部用户信息 */}
      <View className={styles.header}>
        <View className={styles.userCard}>
          <Image
            className={styles.avatar}
            src={mockUser.avatar}
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{mockUser.name}</Text>
            <Text className={styles.userPosition}>{mockUser.position}</Text>
            <Text className={styles.userDept}>{mockUser.department} · {mockUser.region}</Text>
          </View>
          <View className={styles.settingIcon} onClick={handleSettingClick} />
        </View>

        {/* 业绩进度卡 */}
        <View className={styles.statsCard}>
          <View className={styles.statsRow}>
            <Text className={styles.statsLabel}>本月业绩</Text>
            <View>
              <Text className={styles.statsAmount}>¥{formatMoney(performance.totalAmount)}</Text>
              <Text className={styles.statsTarget}>/ 目标 ¥{formatMoney(performance.targetAmount)}</Text>
            </View>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${performance.completionRate * 100}%` }}
            />
          </View>
          <View className={styles.progressText}>
            <Text>完成率 {formatPercent(performance.completionRate)}</Text>
            <Text>还差 ¥{formatMoney(performance.targetAmount - performance.totalAmount)}</Text>
          </View>
        </View>
      </View>

      {/* 快速统计 */}
      <View className={styles.section} style={{ marginTop: -32 }}>
        <View className={styles.quickStats}>
          <View className={styles.quickStatItem}>
            <View className={styles.statNum}>{performance.weeklyVisitCount}</View>
            <Text className={styles.statLabel}>本周拜访</Text>
          </View>
          <View className={`${styles.quickStatItem} ${styles.success}`}>
            <View className={styles.statNum}>{performance.newCustomerCount}</View>
            <Text className={styles.statLabel}>新增客户</Text>
          </View>
          <View className={`${styles.quickStatItem} ${styles.warning}`}>
            <View className={styles.statNum}>{performance.opportunityCount}</View>
            <Text className={styles.statLabel}>进行中商机</Text>
          </View>
          <View className={styles.quickStatItem}>
            <View className={styles.statNum}>{formatPercent(performance.winRate)}</View>
            <Text className={styles.statLabel}>赢单率</Text>
          </View>
        </View>
      </View>

      {/* 业务功能 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>业务功能</Text>
        </View>
        {menuItems.map((item, index) => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={item.onClick}
          >
            <View className={`${styles.menuIcon} ${styles[item.iconClass]}`}>
              <Text>{item.icon}</Text>
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text className={styles.menuSubtitle}>{item.subtitle}</Text>
              )}
            </View>
            <View className={styles.menuRight}>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 其他功能 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>其他</Text>
        </View>
        {bottomMenuItems.map(item => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={item.onClick}
          >
            <View className={`${styles.menuIcon} ${styles[item.iconClass]}`}>
              <Text>{item.icon}</Text>
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuTitle}>{item.title}</Text>
            </View>
            <View className={styles.menuRight}>
              {item.badge && item.badge > 0 && (
                <View className={styles.menuBadge}>
                  {item.badge > 9 ? '9+' : item.badge}
                </View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
