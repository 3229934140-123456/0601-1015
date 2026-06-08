import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Picker } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import Tag from '@/components/Tag';
import Card from '@/components/Card';
import { getStageText, formatDate, formatMoney, formatPercent } from '@/utils';
import styles from './index.module.scss';
import type { Opportunity, Quote, Visit } from '@/types';

const OpportunityDetailPage: React.FC = () => {
  const router = useRouter();
  const opportunityId = router.params.id;
  
  const opportunities = useCRMStore((state) => state.opportunities);
  const customers = useCRMStore((state) => state.customers);
  const quotes = useCRMStore((state) => state.quotes);
  const visits = useCRMStore((state) => state.visits);
  const updateOpportunityStage = useCRMStore((state) => state.updateOpportunityStage);
  const updateOpportunity = useCRMStore((state) => state.updateOpportunity);
  const syncOpportunityForApproval = useCRMStore((state) => state.syncOpportunityForApproval);

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [opportunityQuotes, setOpportunityQuotes] = useState<Quote[]>([]);
  const [customerVisits, setCustomerVisits] = useState<Visit[]>([]);
  const [showStagePicker, setShowStagePicker] = useState(false);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:00');

  const stages = [
    { key: 'lead', label: '线索' },
    { key: 'contact', label: '接触' },
    { key: 'requirement', label: '需求确认' },
    { key: 'quote', label: '报价' },
    { key: 'negotiate', label: '商务谈判' },
    { key: 'win', label: '赢单' },
    { key: 'lost', label: '输单' }
  ];

  const loadData = () => {
    if (opportunityId) {
      const found = opportunities.find(o => o.id === opportunityId);
      if (found) {
        setOpportunity(found);
        const cust = customers.find(c => c.id === found.customerId);
        setCustomer(cust);
        setOpportunityQuotes(quotes.filter(q => q.opportunityId === opportunityId));
        setCustomerVisits(visits.filter(v => v.customerId === found.customerId).slice(0, 3));
        setFollowUpDate(found.nextFollowUp.slice(0, 10));
        setFollowUpTime(found.nextFollowUp.slice(11, 16) || '10:00');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [opportunityId, opportunities, customers, quotes, visits]);

  useDidShow(() => {
    loadData();
  });

  const currentStageIndex = stages.findIndex(s => s.key === opportunity?.stage);

  const handleViewCustomer = () => {
    if (customer) {
      Taro.navigateTo({ url: `/pages/customer-detail/index?id=${customer.id}` });
    }
  };

  const handleViewQuote = (id: string) => {
    Taro.navigateTo({ url: `/pages/quote-detail/index?id=${id}` });
  };

  const handleAddQuote = () => {
    Taro.navigateTo({ url: `/pages/quote-edit/index?opportunityId=${opportunityId}` });
  };

  const handleUpdateStage = () => {
    setSelectedStage(opportunity?.stage || 'lead');
    setShowStagePicker(true);
  };

  const handleStageChange = (e: any) => {
    const stageIndex = parseInt(e.detail.value);
    setSelectedStage(stages[stageIndex].key);
  };

  const handleConfirmStage = () => {
    if (opportunityId && selectedStage) {
      updateOpportunityStage(opportunityId, selectedStage as any);
      Taro.showToast({ title: '阶段已更新', icon: 'success' });
      setShowStagePicker(false);
    }
  };

  const handleSetFollowUp = () => {
    setShowFollowUpPicker(true);
  };

  const handleFollowUpDateChange = (e: any) => {
    setFollowUpDate(e.detail.value);
  };

  const handleFollowUpTimeChange = (e: any) => {
    setFollowUpTime(e.detail.value);
  };

  const handleConfirmFollowUp = () => {
    if (opportunityId && followUpDate) {
      const followUpStr = `${followUpDate} ${followUpTime}`;
      updateOpportunity(opportunityId, { nextFollowUp: followUpStr });
      Taro.showToast({ title: '跟进时间已更新', icon: 'success' });
      setShowFollowUpPicker(false);
    }
  };

  const handleSubmitForApproval = () => {
    Taro.showModal({
      title: '同步主管审批',
      content: '确认将此商机同步给主管审批？',
      success: (res) => {
        if (res.confirm) {
          if (opportunityId) {
            syncOpportunityForApproval(opportunityId);
            Taro.showToast({ title: '已同步给主管', icon: 'success' });
          }
        }
      }
    });
  };

  if (!opportunity) {
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
      {/* 顶部商机信息 */}
      <View className={styles.header}>
        <View className={styles.oppHeader}>
          <Tag text={getStageText(opportunity.stage)} type="success" size="md" />
          <Text className={styles.oppAmount}>¥{formatMoney(opportunity.amount)}</Text>
        </View>
        <Text className={styles.oppTitle}>{opportunity.title}</Text>
        <View className={styles.oppMeta}>
          <Text className={styles.oppMetaText}>赢率 {formatPercent(opportunity.probability)}</Text>
          <Text className={styles.oppMetaText}>·</Text>
          <Text className={styles.oppMetaText}>预算 ¥{formatMoney(opportunity.budget)}</Text>
        </View>
      </View>

      {/* 阶段进度 */}
      <Card className={styles.stageCard}>
        <Text className={styles.cardTitle}>商机阶段</Text>
        <View className={styles.stageTimeline}>
          {stages.map((stage, index) => (
            <View key={stage.key} className={styles.stageItem}>
              <View
                className={`${styles.stageDot} ${
                  index <= currentStageIndex ? styles.active : ''
                } ${opportunity.stage === 'lost' && stage.key === 'lost' ? styles.lost : ''}`}
              >
                {index < currentStageIndex && '✓'}
              </View>
              <Text
                className={`${styles.stageLabel} ${
                  index <= currentStageIndex ? styles.active : ''
                }`}
              >
                {stage.label}
              </Text>
              {index < stages.length - 1 && (
                <View
                  className={`${styles.stageLine} ${
                    index < currentStageIndex ? styles.active : ''
                  }`}
                />
              )}
            </View>
          ))}
        </View>
        <View className={styles.updateStageBtn} onClick={handleUpdateStage}>
          <Text className={styles.updateStageBtnText}>更新阶段</Text>
        </View>
      </Card>

      {/* 同步信息 */}
      {opportunity.lastSyncTime && (
        <Card className={styles.syncCard}>
          <View className={styles.syncRow}>
            <Text className={styles.syncLabel}>最近同步</Text>
            <View className={styles.syncInfo}>
              <Tag 
                text={opportunity.approvalStatus === 'pending' ? '待审批' : '已同步'} 
                type={opportunity.approvalStatus === 'pending' ? 'warning' : 'success'} 
                size="sm" 
              />
              <Text className={styles.syncTime}>{opportunity.lastSyncTime}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 客户信息 */}
      <Card className={styles.customerCard} onClick={handleViewCustomer}>
        <View className={styles.customerInfo}>
          <Image
            className={styles.customerAvatar}
            src={opportunity.customerAvatar}
            mode="aspectFill"
          />
          <View className={styles.customerDetail}>
            <Text className={styles.customerName}>{opportunity.customerName}</Text>
            <Text className={styles.customerDesc}>{customer?.industry} · {customer?.region}</Text>
          </View>
        </View>
        <Text className={styles.arrow}>›</Text>
      </Card>

      {/* 商机详情 */}
      <Card className={styles.infoCard}>
        <Text className={styles.cardTitle}>商机详情</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>预计成交日期</Text>
          <Text className={styles.infoValue}>{formatDate(opportunity.expectedCloseDate)}</Text>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>下次跟进时间</Text>
          <View className={styles.followUpRow}>
            <Text className={styles.infoValue}>{opportunity.nextFollowUp}</Text>
            <Text className={styles.followUpBtn} onClick={handleSetFollowUp}>设置</Text>
          </View>
        </View>
        <View className={styles.infoDivider} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{formatDate(opportunity.createdAt)}</Text>
        </View>
      </Card>

      {/* 需求描述 */}
      <Card className={styles.descCard}>
        <Text className={styles.cardTitle}>需求描述</Text>
        <Text className={styles.descText}>{opportunity.description}</Text>
      </Card>

      {/* 竞争对手 */}
      {opportunity.competitors.length > 0 && (
        <Card className={styles.competitorCard}>
          <Text className={styles.cardTitle}>竞争对手</Text>
          <View className={styles.competitorTags}>
            {opportunity.competitors.map((comp, index) => (
              <Tag key={index} text={comp} type="error" size="sm" />
            ))}
          </View>
        </Card>
      )}

      {/* 报价单 */}
      <Card className={styles.quoteCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>报价单</Text>
          <View className={styles.addBtn} onClick={handleAddQuote}>
            <Text className={styles.addText}>+ 新建</Text>
          </View>
        </View>
        {opportunityQuotes.length > 0 ? (
          <View className={styles.quoteList}>
            {opportunityQuotes.map(quote => (
              <View
                key={quote.id}
                className={styles.quoteItem}
                onClick={() => handleViewQuote(quote.id)}
              >
                <View className={styles.quoteInfo}>
                  <Text className={styles.quoteTitle}>{quote.title}</Text>
                  <View className={styles.quoteMeta}>
                    <Tag
                      text={quote.status === 'approved' ? '已通过' : quote.status === 'submitted' ? '待审批' : quote.status === 'draft' ? '草稿' : '已拒绝'}
                      type={quote.status === 'approved' ? 'success' : quote.status === 'submitted' ? 'warning' : quote.status === 'draft' ? 'default' : 'error'}
                      size="sm"
                    />
                    <Text className={styles.quoteDate}>{formatDate(quote.createdAt)}</Text>
                  </View>
                </View>
                <View className={styles.quoteAmount}>
                  <Text className={styles.quoteAmountValue}>¥{formatMoney(quote.amount)}</Text>
                  <Text className={styles.arrow}>›</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text style={{ color: '#c9cdd4' }}>暂无报价单</Text>
          </View>
        )}
      </Card>

      {/* 相关拜访 */}
      <Card className={styles.visitCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>相关拜访</Text>
          <Text
            className={styles.moreText}
            onClick={() => Taro.switchTab({ url: '/pages/visits/index' })}
          >
            全部 ›
          </Text>
        </View>
        {customerVisits.length > 0 ? (
          <View className={styles.visitList}>
            {customerVisits.map(visit => (
              <View key={visit.id} className={styles.visitItem}>
                <View className={styles.visitDate}>
                  <Text className={styles.visitDateText}>{formatDate(visit.planTime, 'MM-DD')}</Text>
                </View>
                <View className={styles.visitContent}>
                  <Text className={styles.visitPurpose}>{visit.purpose}</Text>
                  <Tag
                    text={visit.status === 'completed' ? '已完成' : visit.status === 'ongoing' ? '进行中' : '待拜访'}
                    type={visit.status === 'completed' ? 'success' : visit.status === 'ongoing' ? 'primary' : 'default'}
                    size="sm"
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text style={{ color: '#c9cdd4' }}>暂无拜访记录</Text>
          </View>
        )}
      </Card>

      <View style={{ height: '160rpx' }} />

      {/* 阶段选择弹窗 */}
      {showStagePicker && (
        <View className={styles.modalMask} onClick={() => setShowStagePicker(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalCancel} onClick={() => setShowStagePicker(false)}>取消</Text>
              <Text className={styles.modalTitle}>选择阶段</Text>
              <Text className={styles.modalConfirm} onClick={handleConfirmStage}>确定</Text>
            </View>
            <Picker
              mode="selector"
              range={stages.map(s => s.label)}
              value={stages.findIndex(s => s.key === selectedStage)}
              onChange={handleStageChange}
            >
              <View className={styles.pickerView}>
                <Text className={styles.pickerText}>{getStageText(selectedStage)}</Text>
              </View>
            </Picker>
          </View>
        </View>
      )}

      {/* 跟进时间设置弹窗 */}
      {showFollowUpPicker && (
        <View className={styles.modalMask} onClick={() => setShowFollowUpPicker(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalCancel} onClick={() => setShowFollowUpPicker(false)}>取消</Text>
              <Text className={styles.modalTitle}>设置下次跟进</Text>
              <Text className={styles.modalConfirm} onClick={handleConfirmFollowUp}>确定</Text>
            </View>
            <View className={styles.dateTimePicker}>
              <Picker mode="date" value={followUpDate} onChange={handleFollowUpDateChange}>
                <View className={styles.datePickerItem}>
                  <Text className={styles.datePickerText}>{followUpDate}</Text>
                </View>
              </Picker>
              <Picker mode="time" value={followUpTime} onChange={handleFollowUpTimeChange}>
                <View className={styles.datePickerItem}>
                  <Text className={styles.datePickerText}>{followUpTime}</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>
      )}

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        <View className={styles.actionBtnSecondary} onClick={handleSetFollowUp}>
          设跟进
        </View>
        <View className={styles.actionBtnPrimary} onClick={handleSubmitForApproval}>
          同步主管审批
        </View>
      </View>
    </ScrollView>
  );
};

export default OpportunityDetailPage;
