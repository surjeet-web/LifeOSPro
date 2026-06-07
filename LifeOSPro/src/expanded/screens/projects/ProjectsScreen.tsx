// ============================================================================
// PROJECT MANAGEMENT SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Professional Project Management
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  Animated,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';

const { width } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate?: string;
  owner: string;
  members: number;
  tasks: number;
  completedTasks: number;
  color: string;
  icon: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  subtasks: number;
  completedSubtasks: number;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  tasks: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasksAssigned: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'LifeOS Pro App', description: 'Build the ultimate productivity mobile app', status: 'active', priority: 'high', progress: 65, startDate: '2024-01-01', endDate: '2024-06-30', owner: 'Alex Johnson', members: 5, tasks: 42, completedTasks: 27, color: '#6366F1', icon: 'phone-portrait' },
  { id: '2', name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'active', priority: 'medium', progress: 40, startDate: '2024-01-15', endDate: '2024-04-15', owner: 'Sarah Miller', members: 3, tasks: 28, completedTasks: 11, color: '#10B981', icon: 'globe' },
  { id: '3', name: 'Q1 Marketing Campaign', description: 'Execute Q1 marketing initiatives', status: 'planning', priority: 'high', progress: 15, startDate: '2024-02-01', endDate: '2024-03-31', owner: 'Mike Chen', members: 4, tasks: 18, completedTasks: 3, color: '#F59E0B', icon: 'megaphone' },
  { id: '4', name: 'Mobile App Beta', description: 'Beta testing for new mobile features', status: 'on-hold', priority: 'low', progress: 80, startDate: '2023-11-01', endDate: '2024-01-31', owner: 'Emma Wilson', members: 6, tasks: 15, completedTasks: 12, color: '#8B5CF6', icon: 'phone-portrait' },
  { id: '5', name: 'API Integration', description: 'Integrate third-party APIs', status: 'completed', priority: 'medium', progress: 100, startDate: '2023-10-01', endDate: '2023-12-31', owner: 'James Brown', members: 2, tasks: 12, completedTasks: 12, color: '#EF4444', icon: 'plug' },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Design home screen', description: 'Create wireframes and mockups for the home screen', status: 'completed', priority: 'high', assignee: 'Alex Johnson', dueDate: '2024-01-15', tags: ['design', 'ui'], subtasks: 5, completedSubtasks: 5 },
  { id: '2', title: 'Implement authentication', description: 'Build login and signup flows', status: 'in-progress', priority: 'high', assignee: 'Sarah Miller', dueDate: '2024-01-20', tags: ['backend', 'security'], subtasks: 8, completedSubtasks: 5 },
  { id: '3', title: 'Write API documentation', description: 'Document all API endpoints', status: 'todo', priority: 'medium', assignee: 'Mike Chen', dueDate: '2024-01-25', tags: ['docs'], subtasks: 3, completedSubtasks: 0 },
  { id: '4', title: 'UI testing', description: 'Test all UI components', status: 'todo', priority: 'medium', assignee: 'Emma Wilson', dueDate: '2024-01-30', tags: ['testing', 'qa'], subtasks: 6, completedSubtasks: 0 },
  { id: '5', title: 'Performance optimization', description: 'Optimize app performance', status: 'review', priority: 'low', assignee: 'James Brown', dueDate: '2024-02-05', tags: ['performance'], subtasks: 4, completedSubtasks: 3 },
];

const MOCK_MILESTONES: Milestone[] = [
  { id: '1', title: 'MVP Launch', date: '2024-03-01', completed: false, tasks: 15 },
  { id: '2', title: 'Beta Release', date: '2024-04-15', completed: false, tasks: 8 },
  { id: '3', title: 'Public Launch', date: '2024-06-30', completed: false, tasks: 12 },
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'Lead Developer', avatar: 'code-slash', tasksAssigned: 8 },
  { id: '2', name: 'Sarah Miller', role: 'UI Designer', avatar: 'color-palette', tasksAssigned: 5 },
  { id: '3', name: 'Mike Chen', role: 'Backend Developer', avatar: 'server', tasksAssigned: 6 },
  { id: '4', name: 'Emma Wilson', role: 'QA Engineer', avatar: 'bug', tasksAssigned: 4 },
  { id: '5', name: 'James Brown', role: 'DevOps', avatar: 'cloud', tasksAssigned: 3 },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProjectsScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'timeline' | 'team'>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };
  
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'planning': colors.dark.warning,
      'active': colors.dark.success,
      'on-hold': colors.dark.textTertiary,
      'completed': colors.dark.primary,
      'archived': colors.dark.gray500,
    };
    return statusColors[status] || colors.dark.textTertiary;
  };
  
  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, string> = {
      'low': 'arrow-down',
      'medium': 'arrow-forward',
      'high': 'arrow-up',
      'urgent': 'caret-up',
    };
    return icons[priority] || 'arrow-forward';
  };
  
  const renderProjectCard = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={[styles.projectCard, { borderLeftColor: item.color }]}
      onPress={() => setSelectedProject(item)}
    >
      <View style={styles.projectHeader}>
        <View style={[styles.projectIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectDescription}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.projectMeta}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        <Ionicons name={getPriorityIcon(item.priority) as any} size={16} color={colors.dark.textSecondary} />
      </View>
      
      <View style={styles.projectProgress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <View style={styles.projectStats}>
        <View style={styles.projectStat}>
          <Text style={styles.projectStatValue}>{item.tasks}</Text>
          <Text style={styles.projectStatLabel}>Tasks</Text>
        </View>
        <View style={styles.projectStat}>
          <Text style={styles.projectStatValue}>{item.completedTasks}</Text>
          <Text style={styles.projectStatLabel}>Done</Text>
        </View>
        <View style={styles.projectStat}>
          <Ionicons name="people" size={16} color={colors.dark.textSecondary} />
          <Text style={styles.projectStatValue}> {item.members}</Text>
          <Text style={styles.projectStatLabel}>Team</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusColors: Record<string, string> = {
      'todo': colors.dark.textTertiary,
      'in-progress': colors.dark.primary,
      'review': colors.dark.warning,
      'completed': colors.dark.success,
    };
    
    return (
      <TouchableOpacity style={styles.taskCard}>
        <View style={styles.taskCheckbox}>
          <Ionicons name={item.status === 'completed' ? "checkmark-circle" : "square-outline"} size={20} color={item.status === 'completed' ? colors.dark.success : colors.dark.textSecondary} />
        </View>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.status === 'completed' && styles.taskCompleted]}>{item.title}</Text>
          <View style={styles.taskMeta}>
            <View style={styles.taskAssigneeContainer}>
              <Ionicons name="person" size={14} color={colors.dark.textSecondary} />
              <Text style={styles.taskAssignee}> {item.assignee}</Text>
            </View>
            {item.dueDate && <View style={styles.taskDueContainer}>
              <Ionicons name="calendar" size={14} color={colors.dark.textSecondary} />
              <Text style={styles.taskDue}> {item.dueDate}</Text>
            </View>}
          </View>
        </View>
        <View style={[styles.taskPriority, { backgroundColor: item.priority === 'urgent' ? colors.dark.error : item.priority === 'high' ? colors.dark.warning : colors.dark.gray700 }]}>
          <Text style={styles.taskPriorityText}>{item.priority}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderMilestone = ({ item }: { item: Milestone }) => (
    <TouchableOpacity style={[styles.milestoneCard, item.completed && styles.milestoneCompleted]}>
      <View style={styles.milestoneIcon}>
        <Ionicons name={item.completed ? "party-popper" : "flag"} size={20} color={item.completed ? colors.dark.success : colors.dark.warning} />
      </View>
      <View style={styles.milestoneInfo}>
        <Text style={[styles.milestoneTitle, item.completed && styles.milestoneTitleCompleted]}>{item.title}</Text>
        <Text style={styles.milestoneDate}>{item.date}</Text>
      </View>
      <View style={styles.milestoneTasks}>
        <Text style={styles.milestoneTasksText}>{item.tasks} tasks</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderTeamMember = ({ item }: { item: TeamMember }) => (
    <TouchableOpacity style={styles.teamMemberCard}>
      <View style={styles.teamMemberAvatar}>
      <Ionicons name={item.avatar as any} size={20} color={colors.dark.primary} />
    </View>
      <View style={styles.teamMemberInfo}>
        <Text style={styles.teamMemberName}>{item.name}</Text>
        <Text style={styles.teamMemberRole}>{item.role}</Text>
      </View>
      <View style={styles.teamMemberTasks}>
        <Text style={styles.teamMemberTasksValue}>{item.tasksAssigned}</Text>
        <Text style={styles.teamMemberTasksLabel}>tasks</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <>
            <View style={styles.viewToggle}>
              <TouchableOpacity 
                style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]} 
                onPress={() => setViewMode('grid')}
              >
                <Text style={styles.viewButtonText}>Grid</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]} 
                onPress={() => setViewMode('list')}
              >
                <Text style={styles.viewButtonText}>List</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={MOCK_PROJECTS}
              renderItem={renderProjectCard}
              keyExtractor={item => item.id}
              numColumns={viewMode === 'grid' ? 2 : 1}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={viewMode === 'grid' ? { gap: spacing.sm } : undefined}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
              }
            />
          </>
        );
      case 'tasks':
        return (
          <FlatList
            data={MOCK_TASKS}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'timeline':
        return (
          <ScrollView contentContainerStyle={styles.listContent}>
            <View style={styles.timelineContainer}>
              {MOCK_MILESTONES.map((milestone, index) => (
                <View key={milestone.id} style={styles.timelineItem}>
                  <View style={styles.timelineLine}>
                    <View style={[styles.timelineDot, milestone.completed && styles.timelineDotCompleted]} />
                    {index < MOCK_MILESTONES.length - 1 && <View style={styles.timelineVerticalLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    {renderMilestone({ item: milestone })}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'team':
        return (
          <FlatList
            data={MOCK_TEAM_MEMBERS}
            renderItem={renderTeamMember}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSubtitle}>Manage your work efficiently</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['projects', 'tasks', 'timeline', 'team'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.dark.white,
    fontWeight: '300',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.base,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: colors.dark.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textTertiary,
  },
  tabTextActive: {
    color: colors.dark.white,
  },
  viewToggle: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  viewButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.base,
    backgroundColor: colors.dark.surface,
    marginRight: spacing.sm,
  },
  viewButtonActive: {
    backgroundColor: colors.dark.primary,
  },
  viewButtonText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  projectCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.xs,
    borderLeftWidth: 4,
    ...shadows.md,
  },
  projectHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  projectEmoji: {
    fontSize: 22,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  projectDescription: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    marginTop: 2,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priorityIcon: {
    fontSize: 16,
  },
  projectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.dark.gray700,
    borderRadius: 3,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: spacing.sm,
  },
  projectStat: {
    alignItems: 'center',
  },
  projectStatValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  projectStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  taskCheckbox: {
    marginRight: spacing.sm,
  },
  taskCheckboxIcon: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: 4,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: colors.dark.textTertiary,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  taskAssignee: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  taskDue: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  taskPriority: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  taskPriorityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.dark.white,
    textTransform: 'capitalize',
  },
  timelineContainer: {
    paddingVertical: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLine: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.dark.gray700,
    borderWidth: 2,
    borderColor: colors.dark.primary,
  },
  timelineDotCompleted: {
    backgroundColor: colors.dark.success,
    borderColor: colors.dark.success,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.dark.border,
    marginVertical: spacing.sm,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  milestoneCompleted: {
    opacity: 0.7,
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  milestoneIconText: {
    fontSize: 20,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  milestoneTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.dark.textTertiary,
  },
  milestoneDate: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  milestoneTasks: {
    backgroundColor: colors.dark.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  milestoneTasksText: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textSecondary,
  },
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  teamMemberAvatar: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  teamMemberRole: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  teamMemberTasks: {
    alignItems: 'center',
  },
  teamMemberTasksValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  teamMemberTasksLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
});

export default ProjectsScreen;
