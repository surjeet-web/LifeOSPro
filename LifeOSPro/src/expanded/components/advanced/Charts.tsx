// ============================================================================
// ADVANCED COMPONENTS FOR LifeOS Pro
// 70,000+ Lines Edition - Complex UI Components
// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  SectionList,
  Modal,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Linking,
  Share,
  Image,
  ViewPropTypes,
  TextPropTypes,
  TouchableOpacityProps,
  ScrollViewProps,
  FlatListProps,
  TextInputProps,
  PlatformIOSProps,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, theme } from '../utils/theme';

// ============================================================================
// DATA VISUALIZATION COMPONENTS
// ============================================================================

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: { x: number; y: number }[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 300,
  height = 200,
  color = colors.dark.primary,
  showDots = true,
  showGrid = true,
}) => {
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const range = maxY - minY || 1;

  return (
    <View style={{ width, height }}>
      {showGrid && (
        <View style={StyleSheet.absoluteFill}>
          {[0, 1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: (height / 4) * i,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: colors.dark.border,
                opacity: 0.3,
              }}
            />
          ))}
        </View>
      )}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((point.y - minY) / range) * height;
          return (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: x - 4,
                top: y - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: color,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

interface BarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 300,
  height = 200,
  horizontal = false,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={{ width, height }}>
      <View style={{ flex: 1, flexDirection: horizontal ? 'column' : 'row', alignItems: 'flex-end' }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height;
          return (
            <View
              key={index}
              style={{
                flex: 1,
                height: barHeight,
                marginHorizontal: 2,
                backgroundColor: item.color || colors.dark.primary,
                borderRadius: 4,
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: colors.dark.textTertiary }} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface PieChartProps {
  data: ChartData[];
  size?: number;
  innerRadius?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200, innerRadius = 0 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: item.color || colors.dark.primary,
              borderRadius: size / 2,
              transform: [{ rotate: `${index * 30}deg` }],
              opacity: 0.8,
            }}
          />
        );
      })}
      {innerRadius > 0 && (
        <View
          style={{
            position: 'absolute',
            width: innerRadius * 2,
            height: innerRadius * 2,
            borderRadius: innerRadius,
            backgroundColor: colors.dark.background,
            top: (size - innerRadius * 2) / 2,
            left: (size - innerRadius * 2) / 2,
          }}
        />
      )}
    </View>
  );
};

interface DonutChartProps {
  data: ChartData[];
  size?: number;
  strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 150,
  strokeWidth = 20,
}) => {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.dark.border,
          transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        }}
      />
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.dark.textPrimary }}>
          {data.reduce((sum, item) => sum + item.value, 0)}
        </Text>
        <Text style={{ fontSize: 12, color: colors.dark.textTertiary }}>Total</Text>
      </View>
    </View>
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = colors.dark.primary,
  backgroundColor = colors.dark.gray700,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
 radius * 2  const circumference = * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: backgroundColor }} />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: `${(progress / 100) * 360 - 45}deg` }],
        }}
      />
      {children && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>{children}</View>}
    </View>
  );
};

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={{ width: size, height: size }}>
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: size * scale,
            height: size * scale,
            borderRadius: (size * scale) / 2,
            borderWidth: 1,
            borderColor: colors.dark.border,
            left: (size - size * scale) / 2,
            top: (size - size * scale) / 2,
          }}
        />
      ))}
      {data.map((point, index) => {
        const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
        const distance = (point.value / maxValue) * (size / 2);
        const x = size / 2 + Math.cos(angle) * distance;
        const y = size / 2 + Math.sin(angle) * distance;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.dark.primary,
              left: x - 4,
              top: y - 4,
            }}
          />
        );
      })}
    </View>
  );
};

// ============================================================================
// CALENDAR COMPONENTS
// ============================================================================

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  markedDates?: { [date: string]: { marked?: boolean; dotColor?: string } };
  minDate?: Date;
  maxDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  markedDates = {},
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  }, [currentMonth]);

  const renderHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
        <Text style={styles.calendarNavText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.calendarMonthText}>
        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
      <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
        <Text style={styles.calendarNavText}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDaysHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.calendarDaysHeader}>
        {days.map(day => (
          <Text key={day} style={styles.calendarDayText}>{day}</Text>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    const days = [];
    const { firstDay, daysInMonth } = daysInMonth;
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = selectedDate?.toISOString().split('T')[0] === dateStr;
      const isToday = today.getDate() === i && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);

      days.push(
        <TouchableOpacity
          key={i}
          style={[styles.calendarDay, isSelected && styles.calendarDaySelected, isToday && styles.calendarDayToday]}
          onPress={() => !isDisabled && onDateSelect?.(date)}
          disabled={isDisabled}
        >
          <Text style={[styles.calendarDayNumber, isSelected && styles.calendarDayNumberSelected, isDisabled && styles.calendarDayDisabled]}>
            {i}
          </Text>
          {markedDates[dateStr]?.marked && (
            <View style={[styles.calendarDot, { backgroundColor: markedDates[dateStr].dotColor || colors.dark.primary }]} />
          )}
        </TouchableOpacity>
      );
    }

    return <View style={styles.calendarDays}>{days}</View>;
  };

  return (
    <View style={styles.calendar}>
      {renderHeader()}
      {renderDaysHeader()}
      {renderDays()}
    </View>
  );
};

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onRangeSelect?: (start: Date, end: Date) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onRangeSelect }) => {
  const [selectedStart, setSelectedStart] = useState<Date | undefined>(startDate);
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>(endDate);

  const handleDateSelect = (date: Date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(undefined);
    } else if (date < selectedStart) {
      setSelectedStart(date);
    } else {
      setSelectedEnd(date);
      onRangeSelect?.(selectedStart!, date);
    }
  };

  return <Calendar selectedDate={selectedStart} onDateSelect={handleDateSelect} />;
};

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, required, children }) => (
  <View style={styles.formField}>
    {label && (
      <Text style={styles.formLabel}>
        {label} {required && <Text style={styles.formRequired}>*</Text>}
      </Text>
    )}
    {children}
    {error && <Text style={styles.formError}>{error}</Text>}
  </View>
);

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => (
  <View style={styles.formSection}>
    {title && <Text style={styles.formSectionTitle}>{title}</Text>}
    {description && <Text style={styles.formSectionDescription}>{description}</Text>}
    {children}
  </View>
);

interface FormActionsProps {
  children: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({ children }) => (
  <View style={styles.formActions}>{children}</View>
);

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, separator = '›' }) => (
  <View style={styles.breadcrumbs}>
    {items.map((item, index) => (
      <View key={index} style={styles.breadcrumbItem}>
        {index > 0 && <Text style={styles.breadcrumbSeparator}>{separator}</Text>}
        {index === items.length - 1 ? (
          <Text style={styles.breadcrumbCurrent}>{item.label}</Text>
        ) : (
          <TouchableOpacity onPress={item.onPress}>
            <Text style={styles.breadcrumbLink}>{item.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationButtonText}>Previous</Text>
      </TouchableOpacity>
      
      <View style={styles.paginationPages}>
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <TouchableOpacity
              key={index}
              style={[styles.paginationPage, page === currentPage && styles.paginationPageActive]}
              onPress={() => onPageChange(page)}
            >
              <Text style={[styles.paginationPageText, page === currentPage && styles.paginationPageTextActive]}>
                {page}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text key={index} style={styles.paginationEllipsis}>{page}</Text>
          )
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange }) => (
  <View style={styles.stepper}>
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;
      
      return (
        <View key={index} style={styles.stepperItem}>
          <TouchableOpacity
            style={[styles.stepperCircle, isCompleted && styles.stepperCircleCompleted, isActive && styles.stepperCircleActive]}
            onPress={() => onStepChange?.(index)}
          >
            <Text style={[styles.stepperNumber, isCompleted && styles.stepperNumberCompleted]}>
              {isCompleted ? '✓' : index + 1}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.stepperLabel, isActive && styles.stepperLabelActive]}>{step}</Text>
          {index < steps.length - 1 && (
            <View style={[styles.stepperLine, isCompleted && styles.stepperLineCompleted]} />
          )}
        </View>
      );
    })}
  </View>
);

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  activeTab: number;
  onTabChange: (index: number) => void;
  variant?: 'default' | 'pills' | 'segmented';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, variant = 'default' }) => (
  <View>
    <View style={[styles.tabs, variant === 'segmented' && styles.tabsSegmented]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === index && styles.tabActive, variant === 'pills' && styles.tabPill, variant === 'pills' && activeTab === index && styles.tabPillActive]}
          onPress={() => onTabChange(index)}
        >
          <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.tabContent}>{tabs[activeTab]?.content}</View>
  </View>
);

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, borderRadius = 4 }) => {
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.dark.gray200,
        opacity,
      }}
    />
  );
};

interface PlaceholderProps {
  children: React.ReactNode;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ children }) => (
  <View style={styles.placeholder}>{children}</View>
);

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'large', color = colors.dark.primary }) => (
  <View style={styles.loading}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <View style={styles.emptyState}>
    {icon && <Text style={styles.emptyStateIcon}>{icon}</Text>}
    <Text style={styles.emptyStateTitle}>{title}</Text>
    {description && <Text style={styles.emptyStateDescription}>{description}</Text>}
    {action && (
      <TouchableOpacity style={styles.emptyStateAction} onPress={action.onPress}>
        <Text style={styles.emptyStateActionText}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          description="Please try again later"
          action={{ label: 'Try Again', onPress: () => this.setState({ hasError: false }) }}
        />
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  breakpoints?: { [key: number]: number };
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ children, columns = 2, gap = 16, breakpoints }) => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const numColumns = breakpoints ? Object.entries(breakpoints).find(([width]) => screenWidth <= parseInt(width))?.[1] || columns : columns;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -gap / 2 }}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={{ width: `${100 / numColumns}%`, padding: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
};

interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: number;
}

export const SplitView: React.FC<SplitViewProps> = ({ left, right, leftWidth = 0.5 }) => (
  <View style={styles.splitView}>
    <View style={{ width: `${leftWidth * 100}%` }}>{left}</View>
    <View style={{ flex: 1 }}>{right}</View>
  </View>
);

interface CardStackProps {
  children: React.ReactNode[];
}

export const CardStack: React.FC<CardStackProps> = ({ children }) => (
  <View style={styles.cardStack}>
    {React.Children.map(children, (child, index) => (
      <View
        key={index}
        style={[
          styles.cardStackItem,
          { zIndex: children.length - index, marginTop: index * 10 },
        ]}
      >
        {child}
      </View>
    ))}
  </View>
);

interface StickyHeaderProps {
  children: React.ReactNode;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({ children }) => (
  <View style={styles.stickyHeader}>{children}</View>
);

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

interface ShowProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Show: React.FC<ShowProps> = ({ when, children, fallback }) => (
  when ? <>{children}</> : <>{fallback}</>
);

interface ForProps<T> {
  each: T[];
  children: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
}

export const For: React.FC<ForProps<any>> = ({ each, children, keyExtractor }) => (
  <>
    {each.map((item, index) => (
      <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
        {children(item, index)}
      </React.Fragment>
    ))}
  </>
);

interface IfProps {
  condition: boolean;
  children: React.ReactNode;
}

export const If: React.FC<IfProps> = ({ condition, children }) => (
  condition ? <>{children}</> : null
);

interface SwitchProps {
  value: string | number;
  cases: { [key: string]: React.ReactNode };
  default?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({ value, cases, default: defaultCase }) => (
  <>{cases[value] || defaultCase}</>
);

interface MatchProps {
  condition: boolean;
  children: React.ReactNode;
}

export const Match: React.FC<MatchProps> = ({ condition, children }) => (
  condition ? <>{children}</> : null
);

// ============================================================================
// EXPORT STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Calendar
  calendar: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  calendarNavText: { fontSize: 24, color: colors.dark.primary, padding: spacing.sm },
  calendarMonthText: { fontSize: typography.fontSizes.lg, fontWeight: '600', color: colors.dark.textPrimary },
  calendarDaysHeader: { flexDirection: 'row', marginBottom: spacing.sm },
  calendarDayText: { flex: 1, textAlign: 'center', fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  calendarDays: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calendarDaySelected: { backgroundColor: colors.dark.primary, borderRadius: 20 },
  calendarDayToday: { borderWidth: 2, borderColor: colors.dark.primary, borderRadius: 20 },
  calendarDayNumber: { fontSize: typography.fontSizes.sm, color: colors.dark.textPrimary },
  calendarDayNumberSelected: { color: colors.dark.white },
  calendarDayDisabled: { color: colors.dark.textTertiary, opacity: 0.5 },
  calendarDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },

  // Form
  formField: { marginBottom: spacing.lg },
  formLabel: { fontSize: typography.fontSizes.sm, fontWeight: '600', color: colors.dark.textPrimary, marginBottom: spacing.xs },
  formRequired: { color: colors.dark.error },
  formError: { fontSize: typography.fontSizes.sm, color: colors.dark.error, marginTop: spacing.xs },
  formSection: { marginBottom: spacing.xl },
  formSectionTitle: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: colors.dark.textPrimary, marginBottom: spacing.xs },
  formSectionDescription: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, marginBottom: spacing.md },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },

  // Breadcrumbs
  breadcrumbs: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  breadcrumbItem: { flexDirection: 'row', alignItems: 'center' },
  breadcrumbSeparator: { marginHorizontal: spacing.sm, color: colors.dark.textTertiary },
  breadcrumbLink: { color: colors.dark.primary, fontSize: typography.fontSizes.sm },
  breadcrumbCurrent: { color: colors.dark.textSecondary, fontSize: typography.fontSizes.sm },
  breadcrumbText: { fontSize: typography.fontSizes.sm, color: colors.dark.textPrimary },

  // Pagination
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  paginationButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.dark.surface, borderRadius: borderRadius.base },
  paginationButtonDisabled: { opacity: 0.5 },
  paginationButtonText: { color: colors.dark.primary, fontSize: typography.fontSizes.sm },
  paginationPages: { flexDirection: 'row', marginHorizontal: spacing.md },
  paginationPage: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  paginationPageActive: { backgroundColor: colors.dark.primary, borderRadius: 16 },
  paginationPageText: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  paginationPageTextActive: { color: colors.dark.white },
  paginationEllipsis: { marginHorizontal: 4 },

  // Stepper
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepperCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
  stepperCircleCompleted: { backgroundColor: colors.dark.success },
  stepperCircleActive: { backgroundColor: colors.dark.primary },
  stepperNumber: { fontSize: typography.fontSizes.sm, fontWeight: '600', color: colors.dark.textSecondary },
  stepperNumberCompleted: { color: colors.dark.white },
  stepperLabel: { marginLeft: spacing.sm, fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, flex: 1 },
  stepperLabelActive: { color: colors.dark.textPrimary, fontWeight: '600' },
  stepperLine: { flex: 1, height: 2, backgroundColor: colors.dark.border, marginHorizontal: spacing.sm },
  stepperLineCompleted: { backgroundColor: colors.dark.success },

  // Tabs
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  tabsSegmented: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.base, padding: 4 },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.dark.primary },
  tabPill: { flex: 0, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  tabPillActive: { backgroundColor: colors.dark.primary },
  tabText: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  tabTextActive: { color: colors.dark.primary, fontWeight: '600' },
  tabContent: { paddingTop: spacing.lg },

  // Loading
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },

  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyStateIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyStateTitle: { fontSize: typography.fontSizes.lg, fontWeight: '600', color: colors.dark.textPrimary, marginBottom: spacing.sm },
  emptyStateDescription: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  emptyStateAction: { backgroundColor: colors.dark.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.base },
  emptyStateActionText: { color: colors.dark.white, fontWeight: '600' },

  // Placeholder
  placeholder: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },

  // Layout
  splitView: { flexDirection: 'row', flex: 1 },
  cardStack: { flex: 1 },
  cardStackItem: { position: 'absolute', left: 0, right: 0 },
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: colors.dark.background },
});

export default {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  ProgressRing,
  RadarChart,
  Calendar,
  DateRangePicker,
  FormField,
  FormSection,
  FormActions,
  Breadcrumbs,
  Pagination,
  Stepper,
  Tabs,
  Skeleton,
  Placeholder,
  Loading,
  EmptyState,
  ErrorBoundary,
  ResponsiveGrid,
  SplitView,
  CardStack,
  StickyHeader,
  Show,
  For,
  If,
  Switch,
  Match,
};
