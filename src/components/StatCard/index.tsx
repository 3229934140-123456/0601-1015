import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  color = 'primary',
  className,
  onClick
}) => {
  return (
    <View
      className={classNames(styles.statCard, styles[color], className)}
      onClick={onClick}
    >
      <View className={styles.header}>
        <Text className={styles.label}>{label}</Text>
        {trend && trendValue && (
          <View className={classNames(styles.trend, styles[trend])}>
            <Text className={styles.trendText}>{trendValue}</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={styles.value}>{value}</Text>
      </View>
      {subValue && (
        <View className={styles.footer}>
          <Text className={styles.subValue}>{subValue}</Text>
        </View>
      )}
    </View>
  );
};

export default StatCard;
