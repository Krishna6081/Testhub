import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/storeHooks';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { TestsPage } from '../pages/TestsPage';
import { TestDetailsPage } from '../pages/TestDetailsPage';
import { SectionsPage } from '../pages/SectionsPage';
import { SectionDetailsPage } from '../pages/SectionDetailsPage';
import { TopicDetailsPage } from '../pages/TopicDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { PracticeModePage } from '../pages/PracticeModePage';
import { DailyTestPage } from '../pages/DailyTestPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';

// Protected User Pages
import { TestAttemptPage } from '../pages/TestAttemptPage';
import { AttemptResultPage } from '../pages/AttemptResultPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MyTestsPage } from '../pages/MyTestsPage';
import { BookmarksPage } from '../pages/BookmarksPage';
import { PerformancePage } from '../pages/PerformancePage';

// Protected Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSectionsPage } from '../pages/admin/AdminSectionsPage';
import { AdminTopicsPage } from '../pages/admin/AdminTopicsPage';
import { AdminQuestionsPage } from '../pages/admin/AdminQuestionsPage';
import { AdminTestsPage } from '../pages/admin/AdminTestsPage';
import { AdminImportPage } from '../pages/admin/AdminImportPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Test Attempt Engine - Full Screen Layout */}
      <Route
        path="/tests/:testId/attempt"
        element={
          <ProtectedRoute>
            <TestAttemptPage />
          </ProtectedRoute>
        }
      />

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:testId" element={<TestDetailsPage />} />
        <Route path="/sections" element={<SectionsPage />} />
        <Route path="/sections/:sectionId" element={<SectionDetailsPage />} />
        <Route path="/topics/:topicId" element={<TopicDetailsPage />} />
        <Route path="/practice" element={<PracticeModePage />} />
        <Route path="/daily-test" element={<DailyTestPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/attempts/:attemptId/result"
          element={
            <ProtectedRoute>
              <AttemptResultPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* User Dashboard Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-tests" element={<MyTestsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Route>

      {/* Admin Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/sections" element={<AdminSectionsPage />} />
        <Route path="/admin/topics" element={<AdminTopicsPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/admin/tests" element={<AdminTestsPage />} />
        <Route path="/admin/import" element={<AdminImportPage />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
