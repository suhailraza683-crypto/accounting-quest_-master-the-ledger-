import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS } from './data.ts';
import { useGameState } from './hooks/useGameState.ts';
import { useSound } from './hooks/useSound.ts';
import { useDailyMissions } from './hooks/useDailyMissions.ts';
import { useToast } from './hooks/useToast.ts';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ToastContainer } from './components/layout/ToastContainer.tsx';
import { HomeView } from './components/views/HomeView.tsx';
import { Level1TermMatcher } from './components/views/Level1TermMatcher.tsx';
import { Level2JournalSimulator } from './components/views/Level2JournalSimulator.tsx';
import { Level3AdjustmentMaster } from './components/views/Level3AdjustmentMaster.tsx';
import { Level4BossChallenge } from './components/views/Level4BossChallenge.tsx';
import { StudyGuideModal } from './components/views/StudyGuideModal.tsx';
import { StatsModal } from './components/views/StatsModal.tsx';
import { GeminiChatModal } from './components/views/GeminiChatModal.tsx';
import { GlossaryModal } from './components/views/GlossaryModal.tsx';
import { LeaderboardModal } from './components/views/LeaderboardModal.tsx';

export default function App() {
  // Audio synthesizer
  const sound = useSound();

  // Toast notification & floating XP animation system
  const {
    toasts,
    floatingXps,
    removeToast,
    triggerXpGain,
    triggerMissionCompleted,
    addToast,
  } = useToast();

  // Game state & persistence
  const {
    stats,
    rankInfo,
    currentMultiplier,
    recordAnswer,
    updateHighScore,
    recordBossDefeated,
    addXp,
    resetProgress,
    advanceSimulationDay,
    claimDailyCheckIn,
  } = useGameState(
    (event) => {
      triggerXpGain(event.amount, event.reason, event.multiplier, event.streak);
      sound.playCombo();
    },
    (newRank) => {
      addToast({
        type: 'rank_up',
        title: 'Promotion Achieved!',
        message: `Outstanding! You reached the rank of ${newRank}!`,
        icon: '👑',
        durationMs: 5000,
      });
      sound.playVictory();
    },
    (badgeId, name, icon) => {
      addToast({
        type: 'mission_completed',
        title: `${name} Unlocked!`,
        message: badgeId === 'consistency_badge'
          ? 'Legendary commitment! You hit a 7-day login streak and earned the Consistency Badge + 250 XP!'
          : `Congratulations! You unlocked the ${name} badge!`,
        icon: icon || '🏅',
        xpAmount: badgeId === 'consistency_badge' ? 250 : undefined,
        durationMs: 6000,
      });
      sound.playVictory();
    }
  );

  // Daily Missions system
  const {
    missions,
    completedCount,
    unclaimedCount,
    totalCount: totalMissionsCount,
    claimReward: handleClaimMissionReward,
    claimAllRewards: handleClaimAllMissionRewards,
    updateProgress: updateMissionProgress,
  } = useDailyMissions(
    (bonusXp, missionTitle) => {
      addXp(bonusXp, 0, missionTitle ? `Claimed: ${missionTitle}` : 'Daily Mission Reward');
      sound.playVictory();
    },
    (completedMission) => {
      triggerMissionCompleted(completedMission);
      sound.playVictory();
    }
  );

  // Navigation & level states
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  // Chapters selection (All 12 selected by default)
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>(() =>
    CHAPTERS.map((c) => c.id)
  );

  // Modals
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState<boolean>(false);
  const [studyGuideChapterId, setStudyGuideChapterId] = useState<number>(1);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [glossaryTermQuery, setGlossaryTermQuery] = useState<string>('');

  // Chapter selection handlers
  const handleToggleChapter = (id: number) => {
    sound.playClick();
    setSelectedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllChapters = () => {
    sound.playClick();
    setSelectedChapterIds(CHAPTERS.map((c) => c.id));
  };

  const handleSelectCategory = (category: 'Foundations' | 'Recording' | 'Final Accounts') => {
    sound.playClick();
    const ids = CHAPTERS.filter((c) => c.category === category).map((c) => c.id);
    setSelectedChapterIds(ids);
  };

  const handleClearChapters = () => {
    sound.playClick();
    setSelectedChapterIds([]);
  };

  const handleStartLevel = (levelNum: 1 | 2 | 3 | 4) => {
    sound.playClick();
    setActiveLevel(levelNum);
  };

  const handleReturnHome = () => {
    sound.playClick();
    setActiveLevel(null);
  };

  // Glossary and Study Guide cross-linking handlers
  const handleOpenGlossary = (termQuery?: string) => {
    sound.playClick();
    setGlossaryTermQuery(termQuery || '');
    setIsGlossaryOpen(true);
  };

  const handleOpenStudyGuideWithChapter = (chapterId: number) => {
    sound.playClick();
    setStudyGuideChapterId(chapterId);
    setIsStudyGuideOpen(true);
  };

  const handleSelectChapterAndPlay = (level: 1 | 2 | 3 | 4) => {
    sound.playClick();
    setActiveLevel(level);
  };

  // Wrapped record answer to track daily missions
  const handleRecordAnswer = (isCorrect: boolean, baseScore = 100, baseExp = 25) => {
    recordAnswer(isCorrect, baseScore, baseExp);
    if (isCorrect) {
      updateMissionProgress('answer_count', 1);
      updateMissionProgress('streak_target', stats.currentStreak + 1, true);
      if (activeLevel === 2) {
        updateMissionProgress('play_level2', 1);
      } else if (activeLevel === 3) {
        updateMissionProgress('play_level3', 1);
      }
    }
  };

  const handleBossDefeated = () => {
    recordBossDefeated();
    updateMissionProgress('boss_defeat', 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Header */}
      <Header
        stats={stats}
        rankInfo={rankInfo}
        currentMultiplier={currentMultiplier}
        soundEnabled={sound.soundEnabled}
        onToggleSound={() => sound.setSoundEnabled(!sound.soundEnabled)}
        onOpenStudyGuide={() => {
          setStudyGuideChapterId(1);
          setIsStudyGuideOpen(true);
        }}
        onOpenGlossary={() => handleOpenGlossary()}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        activeLevel={activeLevel}
        onReturnHome={handleReturnHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel ?? 'home'}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {activeLevel === null && (
              <HomeView
                selectedChapterIds={selectedChapterIds}
                onToggleChapter={handleToggleChapter}
                onSelectAllChapters={handleSelectAllChapters}
                onSelectCategory={handleSelectCategory}
                onClearChapters={handleClearChapters}
                onStartLevel={handleStartLevel}
                stats={stats}
                rankInfo={rankInfo}
                onOpenStudyGuide={() => {
                  setStudyGuideChapterId(1);
                  setIsStudyGuideOpen(true);
                }}
                onOpenGlossary={() => handleOpenGlossary()}
                onOpenChat={() => setIsChatOpen(true)}
                missions={missions}
                completedCount={completedCount}
                unclaimedCount={unclaimedCount}
                totalMissionsCount={totalMissionsCount}
                onClaimMissionReward={handleClaimMissionReward}
                onClaimAllMissionRewards={handleClaimAllMissionRewards}
                onAdvanceSimulationDay={advanceSimulationDay}
                onClaimDailyCheckIn={claimDailyCheckIn}
              />
            )}

            {activeLevel === 1 && (
              <Level1TermMatcher
                selectedChapterIds={selectedChapterIds}
                onReturnHome={handleReturnHome}
                recordAnswer={handleRecordAnswer}
                updateHighScore={updateHighScore}
                currentStreak={stats.currentStreak}
                currentMultiplier={currentMultiplier}
                sound={sound}
                onOpenGlossary={handleOpenGlossary}
              />
            )}

            {activeLevel === 2 && (
              <Level2JournalSimulator
                selectedChapterIds={selectedChapterIds}
                onReturnHome={handleReturnHome}
                recordAnswer={handleRecordAnswer}
                updateHighScore={updateHighScore}
                currentStreak={stats.currentStreak}
                currentMultiplier={currentMultiplier}
                sound={sound}
                onOpenGlossary={handleOpenGlossary}
              />
            )}

            {activeLevel === 3 && (
              <Level3AdjustmentMaster
                selectedChapterIds={selectedChapterIds}
                onReturnHome={handleReturnHome}
                recordAnswer={handleRecordAnswer}
                updateHighScore={updateHighScore}
                currentStreak={stats.currentStreak}
                currentMultiplier={currentMultiplier}
                sound={sound}
                onOpenGlossary={handleOpenGlossary}
              />
            )}

            {activeLevel === 4 && (
              <Level4BossChallenge
                selectedChapterIds={selectedChapterIds}
                onReturnHome={handleReturnHome}
                recordAnswer={handleRecordAnswer}
                updateHighScore={updateHighScore}
                recordBossDefeated={handleBossDefeated}
                currentStreak={stats.currentStreak}
                currentMultiplier={currentMultiplier}
                sound={sound}
                onOpenGlossary={handleOpenGlossary}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer
        onResetProgress={resetProgress}
        completedCount={stats.completedChapters.length}
        totalChapters={CHAPTERS.length}
      />

      {/* Modals */}
      <StudyGuideModal
        isOpen={isStudyGuideOpen}
        onClose={() => setIsStudyGuideOpen(false)}
        initialChapterId={studyGuideChapterId}
        onOpenGlossaryTerm={(termName) => handleOpenGlossary(termName)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialTermQuery={glossaryTermQuery}
        onOpenStudyGuideWithChapter={handleOpenStudyGuideWithChapter}
        onSelectChapterAndPlay={handleSelectChapterAndPlay}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        playerStats={stats}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        playerStats={stats}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        rankInfo={rankInfo}
        onResetProgress={resetProgress}
      />

      {/* Gemini AI Tutor Multi-Turn Chat Modal */}
      <GeminiChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Toast Notification & Floating XP Overlay */}
      <ToastContainer
        toasts={toasts}
        floatingXps={floatingXps}
        onDismissToast={removeToast}
      />
    </div>
  );
}

