import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface TagProps {
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'sm', className }) => {
  return (
    <View className={classNames(styles.tag, styles[type], styles[size], className)}>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default Tag;
