import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import { formatMoney, formatDate } from '@/utils';
import styles from './index.module.scss';
import type { Quote } from '@/types';

const QuotesPage: React.FC = () => {
  const storeQuotes = useCRMStore((state) => state.quotes);

  const [activeTab, setActiveTab] = useState('all');
  const [quotes, setQuotes] = useState<Quote[]>(storeQuotes);

  useDidShow(() => {
    setQuotes(storeQuotes);
  });

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'draft', label: '草稿' },
    { key: 'submitted', label: '待审批' },
    { key: 'approved', label: '已通过' }
  ];

  const statusMap: Record<string, { text: string; className: string }> = {
    draft: { text: '草稿', className: 'draft' },
    submitted: { text: '待审批', className: 'submitted' },
    approved: { text: '已通过', className: 'approved' },
    rejected: { text: '已拒绝', className: 'rejected' }
  };

  const filteredQuotes = useMemo(() => {
    if (activeTab === 'all') return quotes;
    return quotes.filter(q => q.status === activeTab);
  }, [quotes, activeTab]);

  const handleQuoteClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/quote-detail/index?id=${id}` });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      {/* 筛选栏 */}
      <View className={styles.filterBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.filterTab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {/* 报价单列表 */}
      <View className={styles.quoteList}>
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map(quote => (
            <View
              key={quote.id}
              className={styles.quoteCard}
              onClick={() => handleQuoteClick(quote.id)}
            >
              <View className={styles.quoteHeader}>
                <View className={styles.quoteInfo}>
                  <Text className={styles.quoteTitle}>{quote.title}</Text>
                  <Text className={styles.quoteCustomer}>{quote.customerName}</Text>
                </View>
                <View className={`${styles.quoteStatus} ${styles[statusMap[quote.status]?.className || '']}`}>
                  {statusMap[quote.status]?.text || quote.status}
                </View>
              </View>
              <View className={styles.quoteBody}>
                <View>
                  <Text className={styles.quoteAmountLabel}>报价金额</Text>
                  <Text className={styles.quoteAmount}>¥{formatMoney(quote.amount)}</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                  <Text className={styles.quoteDate}>{formatDate(quote.createdAt, 'YYYY-MM-DD')}</Text>
                  <Text className={styles.quoteValid}>有效期至 {formatDate(quote.validUntil, 'YYYY-MM-DD')}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>📄</View>
            <Text className={styles.emptyText}>暂无报价单</Text>
            <Text className={styles.emptyTip}>去商机详情创建新报价单</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default QuotesPage;
