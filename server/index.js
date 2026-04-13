const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Epic = require('./models/Epic');

dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://aurumchain-tracker-client.vercel.app", "https://aurumchain-tracker.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurumchain-tracker';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initial Data Seed
const DATA = [
  {
    id: 'E1', title: 'Project Registry on-chain program', pill: 'Epic 1', pillClass: 'pill-e1', barClass: 'bar-e1', stories: [
      {
        id: 'AC-BC-101', title: 'Project Account Initialization', tasks: [
          { id: 'AC-BC-101-1', text: 'Define ProjectAccount PDA schema (project_account.rs)', completed: false },
          { id: 'AC-BC-101-2', text: 'Implement create_project instruction', completed: false },
          { id: 'AC-BC-101-3', text: 'Write unit tests for create_project', completed: false },
        ]
      },
      {
        id: 'AC-BC-102', title: 'Project Status Control — Pause / Unpause', tasks: [
          { id: 'AC-BC-102-1', text: 'Implement update_project_status instruction', completed: false },
          { id: 'AC-BC-102-2', text: 'Write unit tests for update_project_status', completed: false },
        ]
      },
      {
        id: 'AC-BC-103', title: 'ControlAccount & Authority Management', tasks: [
          { id: 'AC-BC-103-1', text: 'Define and initialize ControlAccount PDA', completed: false },
          { id: 'AC-BC-103-2', text: 'Implement initialize_control instruction', completed: false },
          { id: 'AC-BC-103-3', text: 'Implement transfer_authority instruction', completed: false },
        ]
      },
      {
        id: 'AC-BC-104', title: 'Project Registry Devnet Deployment', tasks: [
          { id: 'AC-BC-104-1', text: 'Build and verify program binary (anchor build)', completed: false },
          { id: 'AC-BC-104-2', text: 'Deploy to Devnet from client-controlled wallet', completed: false },
          { id: 'AC-BC-104-3', text: 'Initialize ControlAccount on Devnet via RPC', completed: false },
          { id: 'AC-BC-104-4', text: 'Update .env and programs.ts with deployed program ID', completed: false },
        ]
      },
    ]
  },
  {
    id: 'E2', title: 'Compliance / Transfer Control on-chain program', pill: 'Epic 2', pillClass: 'pill-e2', barClass: 'bar-e2', stories: [
      {
        id: 'AC-BC-201', title: 'Investor Eligibility Account — on-chain allow-list', tasks: [
          { id: 'AC-BC-201-1', text: 'Define InvestorEligibilityAccount PDA schema', completed: false },
          { id: 'AC-BC-201-2', text: 'Implement record_verified_wallet instruction', completed: false },
          { id: 'AC-BC-201-3', text: 'Implement refresh_eligibility instruction', completed: false },
          { id: 'AC-BC-201-4', text: 'Write unit tests for eligibility management', completed: false },
        ]
      },
      {
        id: 'AC-BC-202', title: 'Transfer Validation Gate', tasks: [
          { id: 'AC-BC-202-1', text: 'Implement transfer_validate instruction with 6 reason codes', completed: false },
          { id: 'AC-BC-202-2', text: 'Write transfer validation tests (all 5 failure scenarios)', completed: false },
        ]
      },
      {
        id: 'AC-BC-203', title: 'Investment Subscription Account', tasks: [
          { id: 'AC-BC-203-1', text: 'Define InvestmentSubscriptionAccount PDA schema', completed: false },
          { id: 'AC-BC-203-2', text: 'Implement subscribe_investment instruction', completed: false },
          { id: 'AC-BC-203-3', text: 'Implement finalize_subscription instruction', completed: false },
          { id: 'AC-BC-203-4', text: 'Write subscription lifecycle tests', completed: false },
        ]
      },
      {
        id: 'AC-BC-204', title: 'Compliance Program Devnet Deployment', tasks: [
          { id: 'AC-BC-204-1', text: 'Build and verify compliance program binary', completed: false },
          { id: 'AC-BC-204-2', text: 'Deploy to Devnet', completed: false },
          { id: 'AC-BC-204-3', text: 'Seed Devnet with 3 test eligibility wallets', completed: false },
          { id: 'AC-BC-204-4', text: 'Update .env and programs.ts with program ID', completed: false },
        ]
      },
    ]
  },
  {
    id: 'E3', title: 'Wallet Connection Setup', pill: 'Epic 3', pillClass: 'pill-e3', barClass: 'bar-e3', stories: [
      {
        id: 'AC-BC-301', title: 'Wallet Provider Configuration', tasks: [
          { id: 'AC-BC-301-1', text: 'Install wallet adapter dependencies (package.json)', completed: false },
          { id: 'AC-BC-301-2', text: 'Create WalletProviders wrapper component', completed: false },
          { id: 'AC-BC-301-3', text: 'Integrate WalletProviders into app/layout.tsx', completed: false },
          { id: 'AC-BC-301-4', text: 'Create useWalletConnection custom hook', completed: false },
        ]
      },
      {
        id: 'AC-BC-302', title: 'Wallet UI Component', tasks: [
          { id: 'AC-BC-302-1', text: 'Build WalletButton component (3 states: idle, connecting, connected)', completed: false },
          { id: 'AC-BC-302-2', text: 'Build WalletStatusBadge component', completed: false },
          { id: 'AC-BC-302-3', text: 'Integrate WalletButton into global Navbar', completed: false },
          { id: 'AC-BC-302-4', text: 'Write component tests (WalletButton.test.tsx)', completed: false },
        ]
      },
      {
        id: 'AC-BC-303', title: 'Signed-Message Wallet Linking — backend integration', tasks: [
          { id: 'AC-BC-303-1', text: 'Create useWalletLink hook', completed: false },
          { id: 'AC-BC-303-2', text: 'Implement wallet challenge / sign flow (walletLinkService.ts)', completed: false },
          { id: 'AC-BC-303-3', text: 'Trigger link flow post-connection in useWalletConnection', completed: false },
          { id: 'AC-BC-303-4', text: 'Write integration tests for wallet link flow', completed: false },
        ]
      },
    ]
  },
  {
    id: 'E4', title: 'Web3.js Integration Layer', pill: 'Epic 4', pillClass: 'pill-e4', barClass: 'bar-e4', stories: [
      {
        id: 'AC-BC-401', title: 'Anchor Client Setup & IDL Integration', tasks: [
          { id: 'AC-BC-401-1', text: 'Copy and version-control generated IDL files', completed: false },
          { id: 'AC-BC-401-2', text: 'Generate TypeScript types from IDL', completed: false },
          { id: 'AC-BC-401-3', text: 'Create Anchor program client factory (anchorClients.ts)', completed: false },
          { id: 'AC-BC-401-4', text: 'Create Solana connection config singleton (connection.ts)', completed: false },
        ]
      },
      {
        id: 'AC-BC-402', title: 'Project Registry Integration Service', tasks: [
          { id: 'AC-BC-402-1', text: 'Implement ProjectRegistryService class (4 methods)', completed: false },
          { id: 'AC-BC-402-2', text: 'Implement PDA utility functions for Project Registry', completed: false },
          { id: 'AC-BC-402-3', text: 'Create useProjectRegistry React hook', completed: false },
          { id: 'AC-BC-402-4', text: 'Write service tests', completed: false },
        ]
      },
      {
        id: 'AC-BC-403', title: 'Compliance Integration Service', tasks: [
          { id: 'AC-BC-403-1', text: 'Implement ComplianceService class (6 methods)', completed: false },
          { id: 'AC-BC-403-2', text: 'Implement PDA utilities for Compliance Program', completed: false },
          { id: 'AC-BC-403-3', text: 'Create useWalletEligibility React hook', completed: false },
          { id: 'AC-BC-403-4', text: 'Create transfer validation utility (transferValidator.ts)', completed: false },
          { id: 'AC-BC-403-5', text: 'Write service and hook tests', completed: false },
        ]
      },
      {
        id: 'AC-BC-404', title: 'Transaction Builder & Confirmation Utilities', tasks: [
          { id: 'AC-BC-404-1', text: 'Create sendAndConfirmTransaction wrapper (transactionUtils.ts)', completed: false },
          { id: 'AC-BC-404-2', text: 'Create useSolanaTransaction hook', completed: false },
          { id: 'AC-BC-404-3', text: 'Create event listener utility (eventListener.ts)', completed: false },
        ]
      },
      {
        id: 'AC-BC-405', title: 'Blockchain Interface Migration — Solana-native', tasks: [
          { id: 'AC-BC-405-1', text: 'Update blockchain-interfaces.ts — replace viem types with Solana', completed: false },
          { id: 'AC-BC-405-2', text: 'Implement SolanaTokenizationService', completed: false },
          { id: 'AC-BC-405-3', text: 'Update getBlockchainServices factory', completed: false },
        ]
      },
      {
        id: 'AC-BC-406', title: 'Backend RPC Integration — server-side Web3.js', tasks: [
          { id: 'AC-BC-406-1', text: 'Create server-side Anchor provider factory (serverAnchorProvider.ts)', completed: false },
          { id: 'AC-BC-406-2', text: 'Create backend blockchain service entry point', completed: false },
          { id: 'AC-BC-406-1', text: 'Create API helper for /investments/confirm endpoint', completed: false },
          { id: 'AC-BC-406-2', text: 'Create API helper stub for /admin/distributions/{id}/execute', completed: false },
        ]
      },
    ]
  },
];

const seedDB = async () => {
  const count = await Epic.countDocuments();
  if (count === 0) {
    await Epic.insertMany(DATA);
    console.log('Database seeded');
  }
};
seedDB();

app.get('/', (req, res) => {
  res.json({ message: 'AurumChain Tracker API' });
});

app.get('/api/data', async (req, res) => {
  try {
    const epics = await Epic.find();
    res.json(epics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks/toggle', async (req, res) => {
  const { taskId } = req.body;
  try {
    const epic = await Epic.findOne({ 'stories.tasks.id': taskId });
    if (epic) {
      epic.stories.forEach(story => {
        story.tasks.forEach(task => {
          if (task.id === taskId) {
            task.completed = !task.completed;
          }
        });
      });
      await epic.save();
      res.json({ success: true, epic });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stories/status', async (req, res) => {
  const { storyId, status } = req.body;
  try {
    const epic = await Epic.findOne({ 'stories.id': storyId });
    if (epic) {
      epic.stories.forEach(story => {
        if (story.id === storyId) {
          story.status = status;
        }
      });
      await epic.save();
      res.json({ success: true, epic });
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks/add', async (req, res) => {
  const { storyId, text } = req.body;
  try {
    const epic = await Epic.findOne({ 'stories.id': storyId });
    if (epic) {
      epic.stories.forEach(story => {
        if (story.id === storyId) {
          const newId = `${storyId}-${story.tasks.length + 1}-${Math.floor(Math.random() * 1000)}`;
          story.tasks.push({ id: newId, text, completed: false });
        }
      });
      await epic.save();
      res.json({ success: true, epic });
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks/delete', async (req, res) => {
  const { taskId } = req.body;
  try {
    const epic = await Epic.findOne({ 'stories.tasks.id': taskId });
    if (epic) {
      epic.stories.forEach(story => {
        story.tasks = story.tasks.filter(task => task.id !== taskId);
      });
      await epic.save();
      res.json({ success: true, epic });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
