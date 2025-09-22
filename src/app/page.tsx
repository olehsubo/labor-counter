"use client";

import { useState } from "react";

import { ConfirmationModal } from "../components/ConfirmationModal";
import { EditEntryModal } from "../components/EditEntryModal";
import { HistoryView } from "../components/HistoryView";
import { LiveView } from "../components/LiveView";
import { StorageWarningBanner } from "../components/StorageWarningBanner";
import { ViewMode, ViewToggle } from "../components/ViewToggle";
import { useContractionTracker } from "../hooks/useContractionTracker";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("live");

  const {
    contractionState,
    displayElapsed,
    timelineEntries,
    recentEntries,
    stats,
    storageWarning,
    sessions,
    currentSessionId,
    undoLast,
    startNewSession,
    toggleContraction,
    clearCurrentSession,
    openEditor,
    editing,
    adjustEditingTime,
    resetEditingDraft,
    saveEdit,
    cancelEdit,
    confirmationModal,
    closeConfirmationModal,
  } = useContractionTracker();

  return (
    <div className="min-h-screen bg-[#F8F3ED] text-[#333333]">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        {storageWarning && <StorageWarningBanner />}

        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#CFE5D6]">
            Labor Counter
          </p>
          <h1 className="text-3xl font-semibold text-[#333333]">
            Gentle support for tracking contractions
          </h1>
          <p className="text-sm text-[#666666]">
            Tap once to begin timing and again to log each contraction.
            Everything is saved for you, even offline.
          </p>
        </div>

        <ViewToggle mode={viewMode} onChange={setViewMode} />

        {viewMode === "live" ? (
          <LiveView
            contractionState={contractionState}
            displayElapsed={displayElapsed}
            recentEntries={recentEntries}
            onToggle={toggleContraction}
            onUndo={undoLast}
            onNewSession={startNewSession}
            onShowHistory={() => setViewMode("history")}
            onEditEntry={(entryId) => openEditor(currentSessionId, entryId)}
          />
        ) : (
          <HistoryView
            currentSessionId={currentSessionId}
            sessions={sessions}
            timelineEntries={timelineEntries}
            stats={stats}
            onEditEntry={openEditor}
            onClearToday={clearCurrentSession}
          />
        )}

        <EditEntryModal
          editing={editing}
          onClose={cancelEdit}
          onSave={saveEdit}
          onReset={resetEditingDraft}
          onAdjust={adjustEditingTime}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          cancelText={confirmationModal.cancelText}
          variant={confirmationModal.variant}
          onConfirm={confirmationModal.onConfirm}
          onCancel={closeConfirmationModal}
        />
      </main>
    </div>
  );
}
