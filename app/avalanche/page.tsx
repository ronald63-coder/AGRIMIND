"use client";

import { useAvalanche } from '../../src/hooks/useAvalanche';
import BlockchainStatusCard from '../../src/components/avalanche/BlockchainStatusCard';
import SupplyChainViz from '../../src/components/avalanche/SupplyChainViz';
import CropVerificationCard from '../../src/components/avalanche/CropVerificationCard';
import FarmerIdentityCard from '../../src/components/avalanche/FarmerIdentityCard';
import CarbonCreditTracker from '../../src/components/avalanche/CarbonCreditTracker';
import ContractActivityFeed from '../../src/components/avalanche/ContractActivityFeed';
const F = {
  bg: "#f0f7f0", text: "#1a2e1a", muted: "#6b7c6b",
};

export default function AvalancheTrustLayerPage() {
  const {
    network, supplyChain, cropVerification, farmer,
    carbonCredits, events, loading, verifyHarvest,
  } = useAvalanche();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, margin: "0 auto", padding: "0 0 40px" }}>
      <div style={{ animation: "fadeUp .4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>🌋</span>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 28, color: F.text, margin: 0 }}>
            Avalanche Trust Layer
          </h1>
        </div>
        <p style={{ fontSize: 15, color: F.muted, margin: 0, lineHeight: 1.6 }}>
          Blockchain-verified agricultural data. Every harvest, every transaction, every claim — permanently recorded and auditable.
        </p>
      </div>

      <BlockchainStatusCard network={network} loading={loading.network} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SupplyChainViz batches={supplyChain} loading={loading.supplyChain} />
        <CropVerificationCard
          data={cropVerification}
          loading={loading.crop}
          onVerify={verifyHarvest}
          verifying={loading.action}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <FarmerIdentityCard farmer={farmer} loading={loading.farmer} />
        <CarbonCreditTracker data={carbonCredits} loading={loading.carbon} />
      </div>

      <ContractActivityFeed events={events} loading={loading.events} />
    </div>
  );
}