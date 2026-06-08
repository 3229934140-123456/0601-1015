import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import Tag from '@/components/Tag';
import Card from '@/components/Card';
import { formatDate } from '@/utils';
import styles from './index.module.scss';
import type { Contact, Customer } from '@/types';

const ContactDetailPage: React.FC = () => {
  const router = useRouter();
  const contactId = router.params.id;

  const contacts = useCRMStore((state) => state.contacts);
  const customers = useCRMStore((state) => state.customers);
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const loadData = () => {
    if (contactId) {
      const found = contacts.find(c => c.id === contactId);
      if (found) {
        setContact(found);
        const cust = customers.find(c => c.id === found.customerId);
        setCustomer(cust || null);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [contactId, contacts, customers]);

  useDidShow(() => {
    loadData();
  });

  const handleCall = () => {
    if (contact?.phone) {
      Taro.showToast({ title: `拨打 ${contact.phone}`, icon: 'none' });
    }
  };

  const handleMessage = () => {
    Taro.showToast({ title: '发送短信功能', icon: 'none' });
  };

  const handleWechat = () => {
    Taro.showToast({ title: '添加微信功能', icon: 'none' });
  };

  const handleEmail = () => {
    Taro.showToast({ title: '发送邮件功能', icon: 'none' });
  };

  const handleViewCustomer = () => {
    if (customer) {
      Taro.navigateTo({ url: `/pages/customer-detail/index?id=${customer.id}` });
    }
  };

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/contact-edit/index?id=${contactId}` });
  };

  if (!contact) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '200rpx 0' }}>
          <Text style={{ color: '#86909c' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 顶部联系人信息 */}
      <View className={styles.header}>
        <Image
          className={styles.avatar}
          src={contact.avatar}
          mode="aspectFill"
        />
        <View className={styles.nameRow}>
          <Text className={styles.name}>{contact.name}</Text>
          {contact.isPrimary && (
            <Tag text="主要联系人" type="primary" size="sm" />
          )}
        </View>
        <Text className={styles.position}>{contact.position}</Text>
      </View>

      {/* 快捷操作 */}
      <View className={styles.actionGrid}>
        <View className={styles.actionItem} onClick={handleCall}>
          <View className={styles.actionIcon}>📞</View>
          <Text className={styles.actionText}>电话</Text>
        </View>
        <View className={styles.actionItem} onClick={handleMessage}>
          <View className={styles.actionIcon}>💬</View>
          <Text className={styles.actionText}>短信</Text>
        </View>
        <View className={styles.actionItem} onClick={handleWechat}>
          <View className={styles.actionIcon}>💚</View>
          <Text className={styles.actionText}>微信</Text>
        </View>
        <View className={styles.actionItem} onClick={handleEmail}>
          <View className={styles.actionIcon}>📧</View>
          <Text className={styles.actionText}>邮件</Text>
        </View>
      </View>

      {/* 所属客户 */}
      <Card className={styles.customerCard} onClick={handleViewCustomer}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>所属客户</Text>
          <Text className={styles.arrowText}>查看 ›</Text>
        </View>
        <View className={styles.customerInfo}>
          <Image
            className={styles.customerAvatar}
            src={customer?.avatar || ''}
            mode="aspectFill"
          />
          <View className={styles.customerDetail}>
            <Text className={styles.customerName}>{customer?.name}</Text>
            <Text className={styles.customerDesc}>{customer?.industry} · {customer?.region}</Text>
          </View>
        </View>
      </Card>

      {/* 联系信息 */}
      <Card className={styles.infoCard}>
        <Text className={styles.cardTitle}>联系信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📱 手机号码</Text>
          <View className={styles.infoValueRow}>
            <Text className={styles.infoValue}>{contact.phone}</Text>
            <Text className={styles.infoAction} onClick={handleCall}>拨打</Text>
          </View>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📧 电子邮箱</Text>
          <View className={styles.infoValueRow}>
            <Text className={styles.infoValue}>{contact.email}</Text>
            <Text className={styles.infoAction} onClick={handleEmail}>发送</Text>
          </View>
        </View>
        {contact.wechat && (
          <React.Fragment>
            <View className={styles.infoDivider} />
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>💚 微信号</Text>
              <View className={styles.infoValueRow}>
                <Text className={styles.infoValue}>{contact.wechat}</Text>
                <Text className={styles.infoAction} onClick={handleWechat}>添加</Text>
              </View>
            </View>
          </React.Fragment>
        )}
      </Card>

      {/* 生日提醒 */}
      {contact.birthday && (
        <Card className={styles.birthdayCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>生日提醒</Text>
            <Tag text="已设置" type="success" size="sm" />
          </View>
          <View className={styles.birthdayInfo}>
            <Text className={styles.birthdayIcon}>🎂</Text>
            <View className={styles.birthdayDetail}>
              <Text className={styles.birthdayDate}>{formatDate(contact.birthday, 'MM月DD日')}</Text>
              <Text className={styles.birthdayDesc}>距离生日还有 15 天，记得送上祝福哦！</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 编辑按钮 */}
      <View className={styles.editBtn} onClick={handleEdit}>
        <Text className={styles.editBtnText}>编辑联系人</Text>
      </View>

      <View style={{ height: '120rpx' }} />
    </ScrollView>
  );
};

export default ContactDetailPage;
