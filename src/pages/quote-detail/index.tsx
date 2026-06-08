import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { mockQuotes } from '@/data/mock';
import Tag from '@/components/Tag';
import Card from '@/components/Card';
import { getQuoteStatusText, formatDate, formatMoney } from '@/utils';
import styles from './index.module.scss';
import type { Quote } from '@/types';

const QuoteDetailPage: React.FC = () => {
  const router = useRouter();
  const quoteId = router.params.id;
  
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (quoteId) {
      const found = mockQuotes.find(q => q.id === quoteId);
      if (found) {
        setQuote(found);
      }
    }
  }, [quoteId]);

  const handleViewOpportunity = () => {
    if (quote?.opportunityId) {
      Taro.navigateTo({ url: `/pages/opportunity-detail/index?id=${quote.opportunityId}` });
    }
  };

  const handleViewCustomer = () => {
    if (quote?.customerId) {
      Taro.navigateTo({ url: `/pages/customer-detail/index?id=${quote.customerId}` });
    }
  };

  const handleSubmit = () => {
    Taro.showModal({
      title: '提交审批',
      content: '确认提交此报价单给主管审批？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已提交审批', icon: 'success' });
        }
      }
    });
  };

  const handleRevoke = () => {
    Taro.showToast({ title: '撤回功能', icon: 'none' });
  };

  if (!quote) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '200rpx 0' }}>
          <Text style={{ color: '#86909c' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  const statusType = quote.status === 'approved' ? 'success' : quote.status === 'submitted' ? 'warning' : quote.status === 'draft' ? 'default' : 'error';

  return (
    <React.Fragment>
      <ScrollView scrollY className={styles.page}>
      {/* 顶部状态卡 */}
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <Tag text={getQuoteStatusText(quote.status)} type={statusType as any} size="md" />
          <Text className={styles.quoteNo}>报价单号：{quote.id.toUpperCase()}</Text>
        </View>
        <Text className={styles.quoteTitle}>{quote.title}</Text>
        <View className={styles.amountRow}>
          <Text className={styles.amountLabel}>报价金额</Text>
          <Text className={styles.amountValue}>¥{formatMoney(quote.amount)}</Text>
        </View>
      </View>

      {/* 客户信息 */}
      <Card className={styles.customerCard} onClick={handleViewCustomer}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>客户信息</Text>
          <Text className={styles.arrowText}>查看 ›</Text>
        </View>
        <Text className={styles.customerName}>{quote.customerName}</Text>
      </Card>

      {/* 报价明细 */}
      <Card className={styles.itemsCard}>
        <Text className={styles.cardTitle}>报价明细</Text>
        <View className={styles.itemsTable}>
          <View className={styles.tableHeader}>
            <Text className={styles.thName}>项目</Text>
            <Text className={styles.thNum}>数量</Text>
            <Text className={styles.thPrice}>单价</Text>
            <Text className={styles.thTotal}>小计</Text>
          </View>
          {quote.items.map(item => (
            <View key={item.id} className={styles.tableRow}>
              <Text className={styles.tdName}>{item.name}</Text>
              <Text className={styles.tdNum}>{item.quantity}</Text>
              <Text className={styles.tdPrice}>¥{formatMoney(item.unitPrice)}</Text>
              <Text className={styles.tdTotal}>¥{formatMoney(item.totalPrice)}</Text>
            </View>
          ))}
        </View>
        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>合计</Text>
          <Text className={styles.totalValue}>¥{formatMoney(quote.amount)}</Text>
        </View>
      </Card>

      {/* 报价信息 */}
      <Card className={styles.infoCard}>
        <Text className={styles.cardTitle}>报价信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{formatDate(quote.createdAt)}</Text>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>有效期至</Text>
          <Text className={styles.infoValue}>{formatDate(quote.validUntil)}</Text>
        </View>
        {quote.approver && (
          <>
            <View className={styles.infoDivider} />
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>审批人</Text>
              <Text className={styles.infoValue}>{quote.approver}</Text>
            </View>
          </>
        )}
        {quote.approvalAt && (
          <>
            <View className={styles.infoDivider} />
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>审批时间</Text>
              <Text className={styles.infoValue}>{formatDate(quote.approvalAt)}</Text>
            </View>
          </>
        )}
      </Card>

      {/* 相关商机 */}
      <Card className={styles.oppCard} onClick={handleViewOpportunity}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>相关商机</Text>
          <Text className={styles.arrowText}>查看 ›</Text>
        </View>
        <Text className={styles.oppName}>{quote.title}</Text>
        <Text className={styles.oppAmount}>商机金额：¥{formatMoney(quote.amount)}</Text>
      </Card>

      <View style={{ height: '160rpx' }} />
    </ScrollView>

    {/* 底部操作栏 */}
    <View className={styles.actionBar}>
      {quote.status === 'draft' && (
        <>
          <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={() => Taro.showToast({ title: '编辑功能', icon: 'none' })}>
            编辑
          </View>
          <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleSubmit}>
            提交审批
          </View>
        </>
      )}
      {quote.status === 'submitted' && (
        <>
          <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleRevoke}>
            撤回
          </View>
          <View className={`${styles.actionBtn} ${styles.primary}`} onClick={() => Taro.showToast({ title: '分享功能', icon: 'none' })}>
            分享
          </View>
        </>
      )}
      {(quote.status === 'approved' || quote.status === 'rejected') && (
        <View className={`${styles.actionBtn} ${styles.primary}`} onClick={() => Taro.showToast({ title: '导出PDF功能', icon: 'none' })}>
          导出PDF
        </View>
      )}
    </View>
    </React.Fragment>
  );
};

export default QuoteDetailPage;
