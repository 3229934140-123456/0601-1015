import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCRMStore } from '@/store';
import styles from './index.module.scss';
import type { Customer } from '@/types';

const RoutePlanPage: React.FC = () => {
  const customers = useCRMStore((state) => state.customers);
  const visits = useCRMStore((state) => state.visits);
  const addVisit = useCRMStore((state) => state.addVisit);

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [plannedVisits, setPlannedVisits] = useState<{ customerId: string; time: string }[]>([]);

  const todayVisits = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return visits.filter(v => v.planTime.startsWith(today) && v.status === 'pending');
  }, [visits]);

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      }
      return [...prev, customerId];
    });
  };

  const generateRoute = () => {
    if (selectedCustomers.length === 0) {
      Taro.showToast({ title: '请选择客户', icon: 'none' });
      return;
    }

    const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];
    const plans = selectedCustomers.slice(0, 5).map((customerId, index) => ({
      customerId,
      time: times[index] || '10:00'
    }));
    setPlannedVisits(plans);

    Taro.showToast({ title: '路线已生成', icon: 'success' });
  };

  const savePlan = () => {
    if (plannedVisits.length === 0) {
      Taro.showToast({ title: '请先生成路线', icon: 'none' });
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    plannedVisits.forEach(plan => {
      const customer = customers.find(c => c.id === plan.customerId);
      if (customer) {
        addVisit({
          customerId: customer.id,
          customerName: customer.name,
          customerAvatar: customer.avatar,
          planTime: `${today} ${plan.time}`,
          status: 'pending',
          purpose: '日常拜访',
          location: customer.address,
          distance: Math.round(Math.random() * 15 * 10) / 10
        });
      }
    });

    Taro.showToast({ title: '已保存到拜访计划', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const getSelectedCustomerList = () => {
    return selectedCustomers.map(id => customers.find(c => c.id === id)).filter(Boolean) as Customer[];
  };

  return (
    <View className={styles.page}>
      {/* 今日已有拜访 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>今日已有拜访 ({todayVisits.length})</Text>
        {todayVisits.length > 0 ? (
          <View className={styles.visitList}>
            {todayVisits.map(visit => (
              <View key={visit.id} className={styles.visitItem}>
                <Text className={styles.visitTime}>{visit.planTime.slice(11, 16)}</Text>
                <Text className={styles.visitName}>{visit.customerName}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className={styles.emptyText}>今日暂无拜访计划</Text>
        )}
      </View>

      {/* 选择客户 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>选择客户</Text>
          <Text className={styles.selectedCount}>已选 {selectedCustomers.length}</Text>
        </View>
        <ScrollView scrollY className={styles.customerList}>
          {customers.map(customer => (
            <View
              key={customer.id}
              className={`${styles.customerItem} ${selectedCustomers.includes(customer.id) ? styles.selected : ''}`}
              onClick={() => toggleCustomer(customer.id)}
            >
              <View className={styles.checkbox}>
                {selectedCustomers.includes(customer.id) && <Text className={styles.checkmark}>✓</Text>}
              </View>
              <Image
                className={styles.customerAvatar}
                src={customer.avatar}
                mode="aspectFill"
              />
              <View className={styles.customerInfo}>
                <Text className={styles.customerName}>{customer.name}</Text>
                <Text className={styles.customerAddr}>{customer.address}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 路线预览 */}
      {plannedVisits.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>路线预览</Text>
          <View className={styles.routeList}>
            {plannedVisits.map((plan, index) => {
              const customer = customers.find(c => c.id === plan.customerId);
              return (
                <View key={plan.customerId} className={styles.routeItem}>
                  <View className={styles.routeIndex}>{index + 1}</View>
                  <View className={styles.routeInfo}>
                    <Text className={styles.routeTime}>{plan.time}</Text>
                    <Text className={styles.routeName}>{customer?.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        <View className={styles.secondaryBtn} onClick={generateRoute}>
          生成路线
        </View>
        <View className={styles.primaryBtn} onClick={savePlan}>
          保存计划
        </View>
      </View>
    </View>
  );
};

export default RoutePlanPage;
