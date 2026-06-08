import React, { useState } from 'react';
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import styles from './index.module.scss';
import type { Contact } from '@/types';

const ContactEditPage: React.FC = () => {
  const router = useRouter();
  const customerId = router.params.customerId;
  const contactId = router.params.id;

  const customers = useCRMStore((state) => state.customers);
  const contacts = useCRMStore((state) => state.contacts);
  const addContact = useCRMStore((state) => state.addContact);
  const updateContact = useCRMStore((state) => state.updateContact);

  const isEdit = !!contactId;
  const existingContact = contactId ? contacts.find(c => c.id === contactId) : null;

  const [name, setName] = useState(existingContact?.name || '');
  const [position, setPosition] = useState(existingContact?.position || '');
  const [phone, setPhone] = useState(existingContact?.phone || '');
  const [email, setEmail] = useState(existingContact?.email || '');
  const [wechat, setWechat] = useState(existingContact?.wechat || '');
  const [birthday, setBirthday] = useState(existingContact?.birthday || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    existingContact?.customerId || customerId || null
  );
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const selectedCustomer = selectedCustomerId
    ? customers.find(c => c.id === selectedCustomerId)
    : null;

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setShowCustomerPicker(false);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!selectedCustomerId) {
      Taro.showToast({ title: '请选择所属客户', icon: 'none' });
      return;
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    if (isEdit && contactId) {
      updateContact(contactId, {
        name: name.trim(),
        position: position.trim(),
        phone: phone.trim(),
        email: email.trim(),
        wechat: wechat.trim(),
        birthday: birthday || undefined,
        customerId: selectedCustomerId
      });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const customer = customers.find(c => c.id === selectedCustomerId);
      const newContact: Omit<Contact, 'id'> = {
        customerId: selectedCustomerId,
        name: name.trim(),
        position: position.trim(),
        phone: phone.trim(),
        email: email.trim(),
        wechat: wechat.trim() || undefined,
        birthday: birthday || undefined,
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 200}/200/200`,
        isPrimary: false
      };
      addContact(newContact);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        {/* 客户选择 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>所属客户</Text>
          <View className={styles.pickerValue} onClick={() => setShowCustomerPicker(true)}>
            <Text className={selectedCustomer ? styles.value : styles.placeholder}>
              {selectedCustomer ? selectedCustomer.name : '请选择客户'}
            </Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        {/* 姓名 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>姓名</Text>
          <Input
            className={styles.input}
            placeholder="请输入姓名"
            placeholderStyle="color: #c9cdd4"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>

        {/* 职位 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>职位</Text>
          <Input
            className={styles.input}
            placeholder="请输入职位"
            placeholderStyle="color: #c9cdd4"
            value={position}
            onInput={(e) => setPosition(e.detail.value)}
          />
        </View>

        {/* 手机号 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>手机号</Text>
          <Input
            className={styles.input}
            type="number"
            placeholder="请输入手机号"
            placeholderStyle="color: #c9cdd4"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
          />
        </View>

        {/* 邮箱 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>邮箱</Text>
          <Input
            className={styles.input}
            placeholder="请输入邮箱"
            placeholderStyle="color: #c9cdd4"
            value={email}
            onInput={(e) => setEmail(e.detail.value)}
          />
        </View>

        {/* 微信号 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>微信号</Text>
          <Input
            className={styles.input}
            placeholder="请输入微信号"
            placeholderStyle="color: #c9cdd4"
            value={wechat}
            onInput={(e) => setWechat(e.detail.value)}
          />
        </View>

        {/* 生日 */}
        <View className={styles.formItem}>
          <Text className={styles.label}>生日</Text>
          <Picker
            mode="date"
            value={birthday}
            onChange={(e) => setBirthday(e.detail.value)}
          >
            <View className={styles.pickerValue}>
              <Text className={birthday ? styles.value : styles.placeholder}>
                {birthday || '请选择生日'}
              </Text>
              <Text className={styles.arrow}>›</Text>
            </View>
          </Picker>
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
                  className={`${styles.customerOption} ${selectedCustomerId === customer.id ? styles.selected : ''}`}
                  onClick={() => handleSelectCustomer(customer.id)}
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
          {isEdit ? '保存' : '添加'}
        </View>
      </View>
    </View>
  );
};

export default ContactEditPage;
