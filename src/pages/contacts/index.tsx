import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import styles from './index.module.scss';
import type { Contact } from '@/types';

const ContactsPage: React.FC = () => {
  const storeContacts = useCRMStore((state) => state.contacts);
  const storeCustomers = useCRMStore((state) => state.customers);

  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(storeContacts);

  useDidShow(() => {
    setContacts(storeContacts);
  });

  const filteredContacts = useMemo(() => {
    if (!searchText) return contacts;
    return contacts.filter(c =>
      c.name.includes(searchText) ||
      c.phone.includes(searchText) ||
      c.position.includes(searchText)
    );
  }, [contacts, searchText]);

  const getCustomerName = (customerId: string) => {
    const customer = storeCustomers.find(c => c.id === customerId);
    return customer?.name || '';
  };

  const handleContactClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/contact-detail/index?id=${id}` });
  };

  const handleSearch = (e: any) => {
    setSearchText(e.detail.value);
  };

  const handleAddContact = () => {
    Taro.navigateTo({ url: '/pages/contact-edit/index' });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 搜索栏 */}
      <View className={styles.searchBar}>
        <View className={styles.searchInput}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.input}
            placeholder="搜索联系人姓名、电话、职位"
            value={searchText}
            onInput={handleSearch}
          />
        </View>
      </View>

      {/* 联系人列表 */}
      <View className={styles.contactList}>
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <View
              key={contact.id}
              className={styles.contactItem}
              onClick={() => handleContactClick(contact.id)}
            >
              <Image
                className={styles.avatar}
                src={contact.avatar}
                mode="aspectFill"
              />
              <View className={styles.contactInfo}>
                <View className={styles.nameRow}>
                  <Text className={styles.name}>{contact.name}</Text>
                  <Text className={styles.position}>{contact.position}</Text>
                </View>
                <Text className={styles.company}>{getCustomerName(contact.customerId)}</Text>
                <View className={styles.phoneRow}>
                  <View className={styles.phoneItem}>
                    <Text className={styles.phoneIcon}>📱</Text>
                    <Text>{contact.phone}</Text>
                  </View>
                  {contact.wechat && (
                    <View className={styles.phoneItem}>
                      <Text className={styles.phoneIcon}>💚</Text>
                      <Text>{contact.wechat}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text className={styles.arrow}>›</Text>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>📇</View>
            <Text className={styles.emptyText}>暂无联系人</Text>
            <Text className={styles.emptyTip}>点击右上角添加新联系人</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ContactsPage;
