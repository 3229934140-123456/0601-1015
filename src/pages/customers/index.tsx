import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { mockCustomers, mockRegions } from '@/data/mock';
import { getLevelText, formatDateTime } from '@/utils';
import styles from './index.module.scss';
import type { Customer } from '@/types';

const CustomersPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeRegion, setActiveRegion] = useState('全部区域');
  const [activeLevel, setActiveLevel] = useState('全部等级');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useReachBottom(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    
    if (searchText) {
      result = result.filter(c => 
        c.name.includes(searchText) || 
        c.industry.includes(searchText)
      );
    }
    
    if (activeRegion !== '全部区域') {
      result = result.filter(c => c.region === activeRegion);
    }
    
    if (activeLevel !== '全部等级') {
      const levelMap: Record<string, string> = {
        'VIP客户': 'vip',
        '普通客户': 'normal',
        '潜在客户': 'potential'
      };
      result = result.filter(c => c.level === levelMap[activeLevel]);
    }
    
    return result;
  }, [customers, searchText, activeRegion, activeLevel]);

  const handleCustomerClick = useCallback((customerId: string) => {
    console.log('[Customers] Customer clicked:', customerId);
    Taro.navigateTo({ url: `/pages/customer-detail/index?id=${customerId}` });
  }, []);

  const handleAddCustomer = useCallback(() => {
    console.log('[Customers] Add customer');
    Taro.showToast({ title: '新增客户功能开发中', icon: 'none' });
  }, []);

  const handleSearch = useCallback((e: any) => {
    setSearchText(e.detail.value);
  }, []);

  const levels = ['全部等级', 'VIP客户', '普通客户', '潜在客户'];

  return (
    <View className={styles.page}>
      {/* 搜索栏 */}
      <View className={styles.searchBar}>
        <View className={styles.searchInput}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.input}
            placeholder="搜索客户名称、行业"
            placeholderClass={styles.placeholder}
            value={searchText}
            onInput={handleSearch}
          />
        </View>
      </View>

      {/* 筛选栏 */}
      <ScrollView scrollX className={styles.filterBar} enhanced showScrollbar={false}>
        <View className={styles.filterScroll}>
          {mockRegions.map(region => (
            <View
              key={region.id}
              className={`${styles.filterItem} ${activeRegion === region.name ? styles.active : ''}`}
              onClick={() => setActiveRegion(region.name)}
            >
              <Text>{region.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 等级筛选 */}
      <ScrollView scrollY style={{ height: 'calc(100vh - 280rpx)' }}>
        <View style={{ padding: '16rpx 32rpx', display: 'flex', gap: '16rpx' }}>
          {levels.map(level => (
            <View
              key={level}
              className={`${styles.filterItem} ${activeLevel === level ? styles.active : ''}`}
              onClick={() => setActiveLevel(level)}
              style={{ marginRight: 0 }}
            >
              <Text>{level}</Text>
            </View>
          ))}
        </View>

        {/* 客户列表 */}
        <View className={styles.customerList}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <View
                key={customer.id}
                className={styles.customerCard}
                onClick={() => handleCustomerClick(customer.id)}
              >
                <View className={styles.customerHeader}>
                  <Image
                    className={styles.customerAvatar}
                    src={customer.avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.customerInfo}>
                    <View className={styles.customerName}>
                      <Text className={styles.nameText}>{customer.name}</Text>
                      <View className={`${styles.levelTag} ${styles[customer.level]}`}>
                        {getLevelText(customer.level)}
                      </View>
                    </View>
                    <Text className={styles.industryText}>{customer.industry}</Text>
                    <Text className={styles.regionText}>📍 {customer.region}</Text>
                  </View>
                </View>

                <View className={styles.customerStats}>
                  <View className={styles.statItem}>
                    <View className={styles.statNum}>{customer.contactCount}</View>
                    <Text className={styles.statLabel}>沟通次数</Text>
                  </View>
                  <View className={styles.statDivider} />
                  <View className={styles.statItem}>
                    <View className={styles.statNum}>{customer.opportunityCount}</View>
                    <Text className={styles.statLabel}>商机数</Text>
                  </View>
                  <View className={styles.statDivider} />
                  <View className={styles.statItem}>
                    <View className={styles.statNum}>{formatDateTime(customer.nextFollowUp, 'MM-DD')}</View>
                    <Text className={styles.statLabel}>下次跟进</Text>
                  </View>
                </View>

                <View className={styles.lastContact}>
                  <Text className={styles.contactLabel}>最近沟通</Text>
                  <Text className={styles.contactTime}>{formatDateTime(customer.lastContact, 'MM-DD HH:mm')}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.empty}>
              <View className={styles.emptyIcon}>🔍</View>
              <Text className={styles.emptyText}>暂无匹配的客户</Text>
              <Text className={styles.emptyTip}>试试其他筛选条件</Text>
            </View>
          )}

          {loading && (
            <View className={styles.loading}>加载中...</View>
          )}
        </View>
      </ScrollView>

      {/* 新增按钮 */}
      <View className={styles.addButton} onClick={handleAddCustomer}>
        <Text className={styles.addIcon}>+</Text>
      </View>
    </View>
  );
};

export default CustomersPage;
