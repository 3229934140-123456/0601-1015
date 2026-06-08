import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { mockVisits } from '@/data/mock';
import { formatDateTime } from '@/utils';
import styles from './index.module.scss';
import type { Visit } from '@/types';

const CheckInPage: React.FC = () => {
  const router = useRouter();
  const visitId = router.params.id;
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [status, setStatus] = useState<'pending' | 'checkedin' | 'completed'>('pending');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<{ url: string; type: string }[]>([]);
  const [checkInTime, setCheckInTime] = useState('');

  useEffect(() => {
    if (visitId) {
      const found = mockVisits.find(v => v.id === visitId);
      if (found) {
        setVisit(found);
        if (found.status === 'completed') {
          setStatus('completed');
          setNotes(found.notes || '');
          setPhotos(found.photos?.map(p => ({ url: p, type: '门头照' })) || []);
          setCheckInTime(found.checkInTime || '');
        }
      }
    }
    console.log('[CheckIn] Page loaded with visitId:', visitId);
  }, [visitId]);

  const handleCheckIn = useCallback(() => {
    console.log('[CheckIn] Check in');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setCheckInTime(now);
    setStatus('checkedin');
    Taro.showToast({ title: '签到成功', icon: 'success' });
  }, []);

  const handleAddPhoto = useCallback((type: string) => {
    console.log('[CheckIn] Add photo:', type);
    const newPhoto = {
      url: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/300`,
      type
    };
    setPhotos(prev => [...prev, newPhoto]);
  }, []);

  const handleDeletePhoto = useCallback((index: number) => {
    console.log('[CheckIn] Delete photo:', index);
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('[CheckIn] Submit visit notes');
    if (!notes.trim()) {
      Taro.showToast({ title: '请填写拜访纪要', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认完成拜访',
      content: '确认提交拜访纪要并完成本次拜访？',
      success: (res) => {
        if (res.confirm) {
          setStatus('completed');
          Taro.showToast({ title: '拜访已完成', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  }, [notes]);

  const handleNotesChange = useCallback((e: any) => {
    setNotes(e.detail.value);
  }, []);

  if (!visit) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '200rpx 0' }}>
          <Text style={{ color: '#86909c' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {/* 客户信息 */}
      <View className={styles.customerCard}>
        <View className={styles.customerInfo}>
          <Image
            className={styles.customerAvatar}
            src={visit.customerAvatar}
            mode="aspectFill"
          />
          <View className={styles.customerDetail}>
            <Text className={styles.customerName}>{visit.customerName}</Text>
            <Text className={styles.visitPurpose}>{visit.purpose}</Text>
            <Text className={styles.visitTime}>计划时间：{visit.planTime}</Text>
          </View>
        </View>

        <View className={styles.locationInfo}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>{visit.location}</Text>
          {visit.distance && (
            <Text className={styles.distanceText}>{visit.distance}km</Text>
          )}
        </View>
      </View>

      {/* 签到进度 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>拜访进度</Text>
        <View className={styles.statusSteps}>
          <View className={styles.step}>
            <View className={`${styles.stepDot} ${status !== 'pending' ? styles.completed : styles.active}`}>
              {status !== 'pending' ? '✓' : '1'}
            </View>
            <Text className={`${styles.stepLabel} ${status !== 'pending' ? styles.completed : styles.active}`}>到店签到</Text>
          </View>
          <View className={`${styles.stepLine} ${status === 'completed' ? styles.completed : ''}`} />
          <View className={styles.step}>
            <View className={`${styles.stepDot} ${status === 'completed' ? styles.completed : status === 'checkedin' ? styles.active : ''}`}>
              {status === 'completed' ? '✓' : '2'}
            </View>
            <Text className={`${styles.stepLabel} ${status === 'completed' ? styles.completed : status === 'checkedin' ? styles.active : ''}`}>拜访沟通</Text>
          </View>
          <View className={`${styles.stepLine} ${status === 'completed' ? styles.completed : ''}`} />
          <View className={styles.step}>
            <View className={`${styles.stepDot} ${status === 'completed' ? styles.completed : ''}`}>
              {status === 'completed' ? '✓' : '3'}
            </View>
            <Text className={`${styles.stepLabel} ${status === 'completed' ? styles.completed : ''}`}>提交完成</Text>
          </View>
        </View>

        {status !== 'pending' && checkInTime && (
          <View className={styles.timeDisplay}>
            <View className={styles.timeValue}>{checkInTime.slice(11, 16)}</View>
            <Text className={styles.timeLabel}>签到时间</Text>
          </View>
        )}
      </View>

      {/* 拜访纪要 */}
      {status !== 'pending' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>拜访纪要</Text>
          <Textarea
            className={styles.notesInput}
            placeholder="请记录本次拜访的主要内容、客户需求、下一步计划等..."
            placeholderStyle="color: #c9cdd4"
            value={notes}
            onInput={handleNotesChange}
            maxlength={1000}
            disabled={status === 'completed'}
          />
        </View>
      )}

      {/* 照片上传 */}
      {status !== 'pending' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>现场照片</Text>
          <View className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image
                  className={styles.photoImage}
                  src={photo.url}
                  mode="aspectFill"
                />
                <View className={styles.photoType}>{photo.type}</View>
                {status !== 'completed' && (
                  <View
                    className={styles.deleteBtn}
                    onClick={() => handleDeletePhoto(index)}
                  >
                    ×
                  </View>
                )}
              </View>
            ))}
            {status !== 'completed' && photos.length < 6 && (
              <>
                <View className={styles.photoAdd} onClick={() => handleAddPhoto('门头照')}>
                  <Text className={styles.addIcon}>📷</Text>
                  <Text className={styles.addText}>门头照</Text>
                </View>
                <View className={styles.photoAdd} onClick={() => handleAddPhoto('陈列照')}>
                  <Text className={styles.addIcon}>🖼️</Text>
                  <Text className={styles.addText}>陈列照</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        {status === 'pending' && (
          <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleCheckIn}>
            立即签到
          </View>
        )}
        {status === 'checkedin' && (
          <>
            <View
              className={`${styles.actionBtn} ${styles.secondary}`}
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              取消拜访
            </View>
            <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleSubmit}>
              完成拜访
            </View>
          </>
        )}
        {status === 'completed' && (
          <View className={`${styles.actionBtn} ${styles.success}`} onClick={() => Taro.navigateBack()}>
            返回列表
          </View>
        )}
      </View>
    </View>
  );
};

export default CheckInPage;
