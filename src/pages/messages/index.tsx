import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockMessages } from '@/data/mock';
import Tag from '@/components/Tag';
import { formatRelativeTime } from '@/utils';
import styles from './index.module.scss';
import type { Message } from '@/types';

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'birthday', label: '生日提醒' },
    { key: 'followup', label: '跟进提醒' },
    { key: 'approval', label: '审批通知' },
    { key: 'system', label: '系统消息' }
  ];

  const getMessageIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      birthday: '🎂',
      followup: '📅',
      approval: '✅',
      system: '📢'
    };
    return iconMap[type] || '📬';
  };

  const filteredMessages = activeTab === 'all'
    ? messages
    : messages.filter(m => m.type === activeTab);

  const handleMessageClick = (msg: Message) => {
    if (!msg.read) {
      setMessages(prev => prev.map(m =>
        m.id === msg.id ? { ...m, read: true } : m
      ));
    }

    if (msg.relatedType && msg.relatedId) {
      const routeMap: Record<string, string> = {
        customer: '/pages/customer-detail/index',
        contact: '/pages/contact-detail/index',
        opportunity: '/pages/opportunity-detail/index',
        quote: '/pages/quote-detail/index',
        visit: '/pages/visits/index'
      };
      const route = routeMap[msg.relatedType];
      if (route) {
        Taro.navigateTo({ url: `${route}?id=${msg.relatedId}` });
      }
    }
  };

  const handleMarkAllRead = () => {
    Taro.showModal({
      title: '全部已读',
      content: '确认将所有消息标记为已读？',
      success: (res) => {
        if (res.confirm) {
          setMessages(prev => prev.map(m => ({ ...m, read: true })));
          Taro.showToast({ title: '已全部标记为已读', icon: 'success' });
        }
      }
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <View className={styles.page}>
      {/* 顶部 Tab 切换 */}
      <View className={styles.tabBar}>
        <ScrollView scrollX className={styles.tabScroll}>
          <View className={styles.tabList}>
            {tabs.map(tab => (
              <View
                key={tab.key}
                className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text className={styles.tabText}>{tab.label}</Text>
                {activeTab === tab.key && <View className={styles.tabIndicator} />}
              </View>
            ))}
          </View>
        </ScrollView>
        {unreadCount > 0 && (
          <View className={styles.markAllBtn} onClick={handleMarkAllRead}>
            <Text className={styles.markAllText}>全部已读</Text>
          </View>
        )}
      </View>

      {/* 消息列表 */}
      <ScrollView scrollY className={styles.messageList}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map(msg => (
            <View
              key={msg.id}
              className={`${styles.messageItem} ${!msg.read ? styles.unread : ''}`}
              onClick={() => handleMessageClick(msg)}
            >
              <View className={styles.messageIcon}>
                <Text className={styles.iconText}>{getMessageIcon(msg.type)}</Text>
                {!msg.read && <View className={styles.unreadDot} />}
              </View>
              <View className={styles.messageContent}>
                <View className={styles.messageHeader}>
                  <Text className={styles.messageTitle}>{msg.title}</Text>
                  <Text className={styles.messageTime}>{formatRelativeTime(msg.time)}</Text>
                </View>
                <Text className={styles.messageBody}>{msg.content}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
