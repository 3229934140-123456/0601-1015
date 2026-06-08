import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import { getVisitStatusText, formatDate } from '@/utils';
import styles from './index.module.scss';
import type { Visit } from '@/types';

const VisitsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const visits = useCRMStore((state) => state.visits);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  });

  useDidShow(() => {
    // 页面显示时刷新数据
  });

  const tabs = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本周' },
    { key: 'all', label: '全部' }
  ];

  const todayStr = '2026-06-08';

  const filteredVisits = useMemo(() => {
    if (activeTab === 'today') {
      return visits.filter(v => v.planTime.startsWith(todayStr));
    }
    if (activeTab === 'week') {
      return visits.filter(v => v.status === 'pending');
    }
    return visits;
  }, [visits, activeTab]);

  const sortedVisits = useMemo(() => {
    return [...filteredVisits].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return a.planTime.localeCompare(b.planTime);
    });
  }, [filteredVisits]);

  const stats = useMemo(() => {
    const todayVisits = visits.filter(v => v.planTime.startsWith(todayStr));
    const completed = todayVisits.filter(v => v.status === 'completed').length;
    const pending = todayVisits.filter(v => v.status === 'pending').length;
    return { total: todayVisits.length, completed, pending };
  }, [visits]);

  const handleVisitClick = useCallback((visitId: string, status: string) => {
    if (status === 'pending') {
      Taro.navigateTo({ url: `/pages/check-in/index?id=${visitId}` });
    } else if (status === 'completed') {
      Taro.navigateTo({ url: `/pages/check-in/index?id=${visitId}` });
    }
  }, []);

  const handleAddVisit = useCallback(() => {
    Taro.navigateTo({ url: '/pages/visit-edit/index' });
  }, []);

  const handleRoutePlan = useCallback(() => {
    Taro.navigateTo({ url: '/pages/route-plan/index' });
  }, []);

  const handleCheckIn = useCallback((visitId: string) => {
    Taro.navigateTo({ url: `/pages/check-in/index?id=${visitId}` });
  }, []);

  return (
    <View className={styles.page}>
      {/* Tab栏 */}
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* 统计栏 */}
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{stats.total}</View>
          <Text className={styles.statLabel}>今日计划</Text>
        </View>
        <View className={`${styles.statItem} ${styles.success}`}>
          <View className={styles.statNum}>{stats.completed}</View>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
        <View className={`${styles.statItem} ${styles.warning}`}>
          <View className={styles.statNum}>{stats.pending}</View>
          <Text className={styles.statLabel}>待拜访</Text>
        </View>
      </View>

      {/* 日期和路线 */}
      <View className={styles.dateHeader}>
        <View>
          <Text className={styles.dateTitle}>6月8日 星期一</Text>
          <Text className={styles.dateSubtitle}>共 {stats.total} 个拜访</Text>
        </View>
        <View className={styles.routeButton} onClick={handleRoutePlan}>
          <Text className={styles.routeIcon}>🗺️</Text>
          <Text className={styles.routeText}>路线规划</Text>
        </View>
      </View>

      {/* 拜访列表 */}
      <ScrollView scrollY style={{ height: 'calc(100vh - 360rpx)' }}>
        <View className={styles.visitList}>
          {sortedVisits.length > 0 ? (
            sortedVisits.map((visit, index) => (
              <View
                key={visit.id}
                className={styles.visitItem}
                onClick={() => handleVisitClick(visit.id, visit.status)}
              >
                <View className={`${styles.timeLine} ${index === sortedVisits.length - 1 ? styles.last : ''}`} />
                <View className={styles.visitHeader}>
                  <View className={`${styles.timeDot} ${visit.status === 'completed' ? styles.completed : ''}`} />
                  <View className={styles.visitContent}>
                    <View className={styles.visitTimeRow}>
                      <Text className={styles.visitTime}>{visit.planTime.slice(11, 16)}</Text>
                      {visit.checkInTime && visit.checkOutTime && (
                        <Text className={styles.visitDuration}>
                          用时 {Math.round((new Date(visit.checkOutTime).getTime() - new Date(visit.checkInTime).getTime()) / 60000)}分钟
                        </Text>
                      )}
                      <View className={`${styles.visitStatus} ${styles[visit.status]}`}>
                        {getVisitStatusText(visit.status)}
                      </View>
                    </View>

                    <View className={styles.customerRow}>
                      <Image
                        className={styles.customerAvatar}
                        src={visit.customerAvatar}
                        mode="aspectFill"
                      />
                      <View className={styles.customerInfo}>
                        <Text className={styles.customerName}>{visit.customerName}</Text>
                      </View>
                    </View>

                    <Text className={styles.visitPurpose}>{visit.purpose}</Text>

                    <View className={styles.visitFooter}>
                      <Text className={styles.visitLocation}>📍 {visit.location}</Text>
                      {visit.distance && visit.distance > 0 && (
                        <Text className={styles.visitDistance}>{visit.distance}km</Text>
                      )}
                      {visit.status === 'pending' && (
                        <View
                          className={styles.visitAction}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckIn(visit.id);
                          }}
                        >
                          去签到
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>📅</View>
              <Text className={styles.emptyText}>暂无拜访计划</Text>
              <Text className={styles.emptyTip}>点击右下角添加新的拜访</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 新增按钮 */}
      <View className={styles.addButton} onClick={handleAddVisit}>
        <Text className={styles.addIcon}>+</Text>
      </View>
    </View>
  );
};

export default VisitsPage;
