import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useCRMStore } from '@/store';
import { formatMoney, generateId } from '@/utils';
import styles from './index.module.scss';
import type { QuoteItem, Quote } from '@/types';

const QuoteEditPage: React.FC = () => {
  const router = useRouter();
  const opportunityId = router.params.opportunityId;

  const opportunities = useCRMStore((state) => state.opportunities);
  const quotes = useCRMStore((state) => state.quotes);
  const addQuote = useCRMStore((state) => state.addQuote);

  const opportunity = opportunityId ? opportunities.find(o => o.id === opportunityId) : null;

  const [title, setTitle] = useState(opportunity ? `${opportunity.title}报价单` : '');
  const [validDays, setValidDays] = useState('30');
  const [items, setItems] = useState<QuoteItem[]>([
    { id: generateId(), name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    setItems(prev => {
      const newItems = [...prev];
      const item = { ...newItems[index] };
      
      if (field === 'name') {
        item.name = value as string;
      } else if (field === 'quantity') {
        const qty = parseInt(value as string) || 0;
        item.quantity = qty;
        item.totalPrice = qty * item.unitPrice;
      } else if (field === 'unitPrice') {
        const price = parseFloat(value as string) || 0;
        item.unitPrice = price;
        item.totalPrice = item.quantity * price;
      }
      
      newItems[index] = item;
      return newItems;
    });
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, { id: generateId(), name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      Taro.showToast({ title: '至少保留一项', icon: 'none' });
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入报价单标题', icon: 'none' });
      return;
    }
    if (items.some(item => !item.name.trim())) {
      Taro.showToast({ title: '请填写所有项目名称', icon: 'none' });
      return;
    }
    if (totalAmount <= 0) {
      Taro.showToast({ title: '报价金额不能为0', icon: 'none' });
      return;
    }

    const today = new Date();
    const validDate = new Date(today.getTime() + parseInt(validDays) * 24 * 60 * 60 * 1000);
    const formatDate = (d: Date) => d.toISOString().slice(0, 10);

    const newQuote: Omit<Quote, 'id'> = {
      opportunityId: opportunityId || '',
      customerId: opportunity?.customerId || '',
      customerName: opportunity?.customerName || '',
      title: title.trim(),
      amount: totalAmount,
      status: 'draft',
      createdAt: formatDate(today),
      validUntil: formatDate(validDate),
      items: items.map(item => ({
        ...item,
        id: 'qi' + item.id
      }))
    };

    addQuote(newQuote);

    Taro.showToast({ title: '报价单已创建', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollView}>
        {/* 报价单标题 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>基本信息</Text>
          <View className={styles.formItem}>
            <Text className={styles.label}>报价单标题</Text>
            <Input
              className={styles.input}
              placeholder="请输入报价单标题"
              placeholderStyle="color: #c9cdd4"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
          {opportunity && (
            <View className={styles.formItem}>
              <Text className={styles.label}>关联商机</Text>
              <View className={styles.opportunityInfo}>
                <Text className={styles.opportunityName}>{opportunity.title}</Text>
                <Text className={styles.opportunityAmount}>商机金额：¥{formatMoney(opportunity.amount)}</Text>
              </View>
            </View>
          )}
          <View className={styles.formItem}>
            <Text className={styles.label}>有效期（天）</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="请输入有效期天数"
              placeholderStyle="color: #c9cdd4"
              value={validDays}
              onInput={(e) => setValidDays(e.detail.value)}
            />
          </View>
        </View>

        {/* 报价明细 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>报价明细</Text>
            <Text className={styles.addItemBtn} onClick={handleAddItem}>+ 添加项目</Text>
          </View>
          {items.map((item, index) => (
            <View key={item.id} className={styles.itemCard}>
              <View className={styles.itemHeader}>
                <Text className={styles.itemIndex}>项目 {index + 1}</Text>
                <Text className={styles.removeBtn} onClick={() => handleRemoveItem(index)}>删除</Text>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.label}>项目名称</Text>
                <Input
                  className={styles.input}
                  placeholder="请输入项目名称"
                  placeholderStyle="color: #c9cdd4"
                  value={item.name}
                  onInput={(e) => handleItemChange(index, 'name', e.detail.value)}
                />
              </View>
              <View className={styles.itemRow}>
                <View className={styles.itemCol}>
                  <Text className={styles.label}>数量</Text>
                  <Input
                    className={styles.input}
                    type="number"
                    placeholder="数量"
                    placeholderStyle="color: #c9cdd4"
                    value={item.quantity.toString()}
                    onInput={(e) => handleItemChange(index, 'quantity', e.detail.value)}
                  />
                </View>
                <View className={styles.itemCol}>
                  <Text className={styles.label}>单价(元)</Text>
                  <Input
                    className={styles.input}
                    type="digit"
                    placeholder="单价"
                    placeholderStyle="color: #c9cdd4"
                    value={item.unitPrice.toString()}
                    onInput={(e) => handleItemChange(index, 'unitPrice', e.detail.value)}
                  />
                </View>
              </View>
              <View className={styles.itemTotal}>
                <Text className={styles.itemTotalLabel}>小计：</Text>
                <Text className={styles.itemTotalValue}>¥{formatMoney(item.totalPrice)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 合计 */}
        <View className={styles.totalSection}>
          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>合计金额</Text>
            <Text className={styles.totalValue}>¥{formatMoney(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          创建报价单
        </View>
      </View>
    </View>
  );
};

export default QuoteEditPage;
