import React from 'react';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, padding = 'md', onClick }) => {
  return (
    <View
      className={classNames(styles.card, styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`], className)}
      onClick={onClick}
    >
      {children}
    </View>
  );
};

export default Card;
