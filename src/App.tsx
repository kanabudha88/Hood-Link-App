import { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { CommunityPulseTab } from './components/CommunityPulseTab';
import { DmInboxDrawer } from './components/DmInboxDrawer';
import { LocalEatsMarketTab } from './components/LocalEatsMarketTab';
import { Navigation } from './components/Navigation';
import { PeerMentoringTab } from './components/PeerMentoringTab';
import { ResourceDirectoryTab } from './components/ResourceDirectoryTab';
import { UpgradePlanModal } from './components/UpgradePlanModal';
import { CommunityProvider } from './context/CommunityContext';
import type { MainTab } from './types/community';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('pulse');

  return (
    <CommunityProvider>
      <div className="min-h-screen flex flex-col bg-[#F6F7F4] text-[#181D1A]">
        <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Bottom padding leaves room for fixed mobile bottom tab bar */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-12">
          {activeTab === 'pulse' && <CommunityPulseTab />}
          {activeTab === 'eats-market' && <LocalEatsMarketTab />}
          {activeTab === 'mentoring' && <PeerMentoringTab />}
          {activeTab === 'directory' && <ResourceDirectoryTab />}
        </main>

        <footer className="hidden lg:block border-t border-[#E4E6E0] bg-white">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-[#5A635D]">
            <span>Hood Link · Oakwood Neighborhood Hub</span>
            <span>Central · Eastside · Westside</span>
          </div>
        </footer>

        <AuthModal />
        <UpgradePlanModal />
        <DmInboxDrawer />
      </div>
    </CommunityProvider>
  );
}
