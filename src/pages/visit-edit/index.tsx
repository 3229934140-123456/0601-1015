import React, { useState } from 'react';
import { View, Text, Input, Textarea, Picker, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import { formatDate } from '@/utils';
import styles from './index.module.scss';
import type { Customer } from '@/types';

const VisitEditPage: React.FC = () => {
  const router = useRouter();
  const customerId = router.params.customerId;

  const customers = useCRMStore((state) => state.customers);
  const addVisit = useCRMStore((state) => state.addVisit);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => {
    if (customerId) {
      return customers.find(c => c.id === customerId) || null;
    }
    return null;
  });
  const [planDate, setPlanDate] = useState(formatDate(new Date().toISOString()));
  const [planTime, setPlanTime] = useState('10:00');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setLocation(customer.address);
    setShowCustomerPicker(false);
  };

  const handleSave = () => {
    if (!selectedCustomer) {
      Taro.showToast({ title: '请选择客户', icon: 'none' });
      return;
    }
    if (!purpose.trim()) {
      Taro.showToast({ title: '请填写拜访目的', icon: 'none' });
      return;
    }

    const planTimeStr = `${planDate} ${planTime}`;
    const newVisit = addVisit({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerAvatar: selectedCustomer.avatar,
      planTime: planTimeStr,
      status: 'pending',
      purpose: purpose.trim(),
      location: location || selectedCustomer.address,
      distance: Math.round(Math.random() * 15 * 10) / 10
    });

    Taro.showToast({ title: '创建成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const todayStr = formatDate(new Date().toISOString());

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        {/* 客户选择 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>客户</Text>
          <View className={styles.pickerValue} onClick={() => setShowCustomerPicker(true)}>
            <Text className={selectedCustomer ? styles.value : styles.placeholder}>
              {selectedCustomer ? selectedCustomer.name : '请选择客户'}
            </Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        {/* 拜访日期 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>拜访日期</Text>
          <Picker
            mode="date"
            value={planDate}
            start={todayStr}
            onChange={(e) => setPlanDate(e.detail.value)}
          >
            <View className={styles.pickerValue}>
              <Text className={styles.value}>{planDate}</Text>
              <Text className={styles.arrow}>›</Text>
            </View>
          </Picker>
        </View>

        {/* 拜访时间 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>拜访时间</Text>
          <Picker
            mode="time"
            value={planTime}
            onChange={(e) => setPlanTime(e.detail.value)}
          >
            <View className={styles.pickerValue}>
              <Text className={styles.value}>{planTime}</Text>
              <Text className={styles.arrow}>›</Text>
            </View>
          </Picker>
        </View>

        {/* 拜访目的 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>拜访目的</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入拜访目的"
            placeholderStyle="color: #c9cdd4"
            value={purpose}
            onInput={(e) => setPurpose(e.detail.value)}
            maxlength={200}
          />
        </View>

        {/* 拜访地址 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>拜访地址</Text>
          <Input
            className={styles.input}
            placeholder="请输入拜访地址"
            placeholderStyle="color: #c9cdd4"
            value={location}
            onInput={(e) => setLocation(e.detail.value)}
          />
        </View>
      </View>

      {/* 客户选择弹窗 */}
      {showCustomerPicker && (
        <View className={styles.modalMask} onClick={() => setShowCustomerPicker(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择客户</Text>
              <Text className={styles.modalClose} onClick={() => setShowCustomerPicker(false)}>×</Text>
            </View>
            <ScrollView scrollY className={styles.customerList}>
              {customers.map(customer => (
                <View
                  key={customer.id}
                  className={styles.customerOption}
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <Text className={styles.customerName}>{customer.name}</Text>
                  <Text className={styles.customerRegion}>{customer.region}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          保存
        </View>
      </View>
    </View>
  );
};

export default VisitEditPage;
