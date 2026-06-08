import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import { getStageText, formatMoney, formatDate, formatPercent } from '@/utils';
import styles from './index.module.scss';
import type { Opportunity } from '@/types';

const OpportunitiesPage: React.FC = () => {
  const storeOpportunities = useCRMStore((state) => state.opportunities);

  const [searchText, setSearchText] = useState('');
  const [activeStage, setActiveStage] = useState('all');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(storeOpportunities);

  useDidShow(() => {
    setOpportunities(storeOpportunities);
  });

  usePullDownRefresh(() => {
    setTimeout(() => {
      setOpportunities(storeOpportunities);
      Taro.stopPullDownRefresh();
    }, 500);
  });

  const stages = [
    { key: 'all', label: '全部' },
    { key: 'lead', label: '线索' },
    { key: 'contact', label: '接触' },
    { key: 'requirement', label: '需求确认' },
    { key: 'quote', label: '报价' },
    { key: 'negotiate', label: '商务谈判' },
    { key: 'win', label: '赢单' },
    { key: 'lost', label: '输单' }
  ];

  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];
    
    if (searchText) {
      result = result.filter(o => 
        o.title.includes(searchText) || 
        o.customerName.includes(searchText)
      );
    }
    
    if (activeStage !== 'all') {
      result = result.filter(o => o.stage === activeStage);
    }
    
    return result.sort((a, b) => b.amount - a.amount);
  }, [opportunities, searchText, activeStage]);

  const stats = useMemo(() => {
    const activeOpps = opportunities.filter(o => o.stage !== 'win' && o.stage !== 'lost');
    const totalAmount = activeOpps.reduce((sum, o) => sum + o.amount, 0);
    const winOpps = opportunities.filter(o => o.stage === 'win');
    const winAmount = winOpps.reduce((sum, o) => sum + o.amount, 0);
    return {
      total: activeOpps.length,
      amount: totalAmount,
      winCount: winOpps.length,
      winAmount
    };
  }, [opportunities]);

  const handleOpportunityClick = useCallback((oppoId: string) => {
    console.log('[Opportunities] Opportunity clicked:', oppoId);
    Taro.navigateTo({ url: `/pages/opportunity-detail/index?id=${oppoId}` });
  }, []);

  const handleAddOpportunity = useCallback(() => {
    console.log('[Opportunities] Add opportunity');
    Taro.showToast({ title: '新增商机功能开发中', icon: 'none' });
  }, []);

  const handleSearch = useCallback((e: any) => {
    setSearchText(e.detail.value);
  }, []);

  const handleFilter = useCallback(() => {
    Taro.showToast({ title: '筛选功能开发中', icon: 'none' });
  }, []);

  return (
    <View className={styles.page}>
      {/* 搜索和筛选 */}
      <View className={styles.header}>
        <View className={styles.searchRow}>
          <View className={styles.searchInput}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.input}
              placeholder="搜索商机、客户"
              value={searchText}
              onInput={handleSearch}
            />
          </View>
          <View className={styles.filterButton} onClick={handleFilter}>
            <Text className={styles.filterText}>筛选</Text>
          </View>
        </View>

        {/* 阶段筛选 */}
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View className={styles.stageScroll}>
            {stages.map(stage => (
              <View
                key={stage.key}
                className={`${styles.stageTab} ${activeStage === stage.key ? styles.active : ''}`}
                onClick={() => setActiveStage(stage.key)}
              >
                <Text>{stage.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 统计卡片 */}
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <View className={styles.statNum}>{stats.total}</View>
          <Text className={styles.statLabel}>进行中商机</Text>
        </View>
        <View className={`${styles.statCard} ${styles.warning}`}>
          <View className={styles.statNum}>¥{formatMoney(stats.amount)}</View>
          <Text className={styles.statLabel}>商机金额</Text>
        </View>
        <View className={`${styles.statCard} ${styles.success}`}>
          <View className={styles.statNum}>{stats.winCount}</View>
          <Text className={styles.statLabel}>本月赢单</Text>
        </View>
      </View>

      {/* 商机列表 */}
      <ScrollView scrollY style={{ height: 'calc(100vh - 440rpx)' }}>
        <View className={styles.opportunityList}>
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(oppo => (
              <View
                key={oppo.id}
                className={styles.opportunityCard}
                onClick={() => handleOpportunityClick(oppo.id)}
              >
                <View className={styles.oppoHeader}>
                  <Image
                    className={styles.customerAvatar}
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
                  <View className={styles.oppoAmount}>
                    ¥{formatMoney(oppo.amount)}
                  </View>
                </View>

                <View className={styles.oppoBody}>
                  <View className={styles.oppoBodyItem}>
                    <View className={styles.bodyNum}>{formatPercent(oppo.probability)}</View>
                    <Text className={styles.bodyLabel}>赢率</Text>
                  </View>
                  <View className={styles.bodyDivider} />
                  <View className={styles.oppoBodyItem}>
                    <View className={styles.bodyNum}>¥{formatMoney(oppo.budget)}</View>
                    <Text className={styles.bodyLabel}>客户预算</Text>
                  </View>
                  <View className={styles.bodyDivider} />
                  <View className={styles.oppoBodyItem}>
                    <View className={styles.bodyNum}>{formatDate(oppo.expectedCloseDate, 'MM-DD')}</View>
                    <Text className={styles.bodyLabel}>预计成交</Text>
                  </View>
                </View>

                <View className={styles.oppoFooter}>
                  <View className={styles.followUp}>
                    <Text className={styles.followLabel}>下次跟进:</Text>
                    <Text className={styles.followTime}>{formatDate(oppo.nextFollowUp, 'MM-DD HH:mm')}</Text>
                  </View>
                  {oppo.competitors.length > 0 && (
                    <View className={styles.competitors}>
                      <Text className={styles.compLabel}>竞品:</Text>
                      <View className={styles.compTags}>
                        {oppo.competitors.slice(0, 2).map((comp, idx) => (
                          <View key={idx} className={styles.compTag}>{comp}</View>
                        ))}
                        {oppo.competitors.length > 2 && (
                          <View className={styles.compTag}>+{oppo.competitors.length - 2}</View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>💼</View>
              <Text className={styles.emptyText}>暂无匹配的商机</Text>
              <Text className={styles.emptyTip}>点击右下角添加新商机</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 新增按钮 */}
      <View className={styles.addButton} onClick={handleAddOpportunity}>
        <Text className={styles.addIcon}>+</Text>
      </View>
    </View>
  );
};

export default OpportunitiesPage;
