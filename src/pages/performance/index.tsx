import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockPerformance, mockUser } from '@/data/mock';
import { formatMoney, formatPercent } from '@/utils';
import styles from './index.module.scss';

const PerformancePage: React.FC = () => {
  const [performance] = useState(mockPerformance);

  const weekData = [
    { day: '周一', count: 2, active: false },
    { day: '周二', count: 3, active: false },
    { day: '周三', count: 1, active: false },
    { day: '周四', count: 4, active: false },
    { day: '周五', count: 2, active: false },
    { day: '周六', count: 1, active: false },
    { day: '周日', count: 0, active: true }
  ];

  const rankData = [
    { rank: 1, name: '张明', dept: '华东销售部', amount: 2680000, avatar: 'https://picsum.photos/id/64/100/100' },
    { rank: 2, name: '李华', dept: '华东销售部', amount: 2350000, avatar: 'https://picsum.photos/id/91/100/100' },
    { rank: 3, name: '王芳', dept: '华东销售部', amount: 1980000, avatar: 'https://picsum.photos/id/338/100/100' },
    { rank: 4, name: '陈伟', dept: '华东销售部', amount: 1650000, avatar: 'https://picsum.photos/id/177/100/100' },
    { rank: 5, name: '刘洋', dept: '华东销售部', amount: 1420000, avatar: 'https://picsum.photos/id/1027/100/100' }
  ];

  const maxCount = Math.max(...weekData.map(d => d.count));

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 顶部业绩总览 */}
      <View className={styles.header}>
        <Text className={styles.headerTitle}>本月业绩</Text>
        
        <View className={styles.amountDisplay}>
          <Text className={styles.amountLabel}>业绩总额</Text>
          <View className={styles.amountValue}>¥{formatMoney(performance.totalAmount)}</View>
          <Text className={styles.amountSub}>
            目标 ¥{formatMoney(performance.targetAmount)}
          </Text>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressRow}>
            <Text className={styles.progressLabel}>完成进度</Text>
            <Text className={styles.progressPercent}>
              {formatPercent(performance.completionRate)}
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${performance.completionRate * 100}%` }}
            />
          </View>
        </View>
      </View>

      {/* 核心指标 */}
      <View className={styles.statsGrid}>
        <View className={styles.statCard}>
          <View className={`${styles.statIcon} ${styles.visit}`}>
            <Text>📍</Text>
          </View>
          <View className={styles.statValue}>{performance.visitCount}</View>
          <Text className={styles.statLabel}>本月拜访</Text>
          <Text className={`${styles.statTrend} ${styles.up}`}>↑ 12% 较上月</Text>
        </View>
        <View className={styles.statCard}>
          <View className={`${styles.statIcon} ${styles.customer}`}>
            <Text>👥</Text>
          </View>
          <View className={styles.statValue}>{performance.newCustomerCount}</View>
          <Text className={styles.statLabel}>新增客户</Text>
          <Text className={`${styles.statTrend} ${styles.up}`}>↑ 8% 较上月</Text>
        </View>
        <View className={styles.statCard}>
          <View className={`${styles.statIcon} ${styles.opportunity}`}>
            <Text>💼</Text>
          </View>
          <View className={styles.statValue}>{performance.opportunityCount}</View>
          <Text className={styles.statLabel}>进行中商机</Text>
          <Text className={`${styles.statTrend} ${styles.up}`}>↑ 5个 较上月</Text>
        </View>
        <View className={styles.statCard}>
          <View className={`${styles.statIcon} ${styles.winrate}`}>
            <Text>🎯</Text>
          </View>
          <View className={styles.statValue}>{formatPercent(performance.winRate)}</View>
          <Text className={styles.statLabel}>赢单率</Text>
          <Text className={`${styles.statTrend} ${styles.down}`}>↓ 2% 较上月</Text>
        </View>
      </View>

      {/* 回款进度 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>回款进度</Text>
        </View>
        <View className={styles.collectionInfo}>
          <Text className={styles.collectionLabel}>已回款金额</Text>
          <Text className={`${styles.collectionValue} ${styles.success}`}>
            ¥{formatMoney(performance.collectionAmount)}
          </Text>
        </View>
        <View className={styles.collectionInfo}>
          <Text className={styles.collectionLabel}>待回款金额</Text>
          <Text className={`${styles.collectionValue} ${styles.warning}`}>
            ¥{formatMoney(performance.pendingCollection)}
          </Text>
        </View>
        <View className={styles.collectionInfo}>
          <Text className={styles.collectionLabel}>回款率</Text>
          <Text className={styles.collectionValue}>
            {formatPercent(performance.collectionAmount / (performance.collectionAmount + performance.pendingCollection))}
          </Text>
        </View>
      </View>

      {/* 本周拜访统计 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本周拜访统计</Text>
          <Text className={styles.sectionMore}>共 {performance.weeklyVisitCount} 次</Text>
        </View>
        <View className={styles.weekBars}>
          {weekData.map((item, index) => (
            <View key={index} className={styles.weekBarItem}>
              <Text className={styles.weekCount}>{item.count}</Text>
              <View
                className={`${styles.weekBar} ${item.active ? styles.active : ''}`}
                style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 140 + 20 : 20}rpx` }}
              />
              <Text className={`${styles.weekDay} ${item.active ? styles.active : ''}`}>
                {item.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 业绩排行榜 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>团队业绩榜</Text>
          <Text className={styles.sectionMore}>本月</Text>
        </View>
        <View className={styles.rankList}>
          {rankData.map((item, index) => (
            <View key={index} className={styles.rankItem}>
              <View className={`${styles.rankNum} ${item.rank === 1 ? styles.first : item.rank === 2 ? styles.second : item.rank === 3 ? styles.third : ''}`}>
                {item.rank}
              </View>
              <Image
                className={styles.rankAvatar}
                src={item.avatar}
                mode="aspectFill"
              />
              <View className={styles.rankInfo}>
                <Text className={styles.rankName}>{item.name}</Text>
                <Text className={styles.rankDept}>{item.dept}</Text>
              </View>
              <Text className={styles.rankAmount}>¥{formatMoney(item.amount)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default PerformancePage;
