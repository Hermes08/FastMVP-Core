'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Boxes, 
  Brain, 
  Mouse, 
  Github, 
  Code as CodeIcon, 
  Database, 
  Rocket, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState('Untitled Project');
  const [expandedSections, setExpandedSections] = useState({
    research: true,
    features: false,
    ai: false,
    cursor: false,
    github: false,
    claude: false,
    supabase: false,
    vercel: false,
    generate: false,
  });

  const [projectData, setProjectData] = useState({
    description: '',
    features: [] as string[],
    aiModels: [] as string[],
    cursor: { installed: false, ready: false },
    github: { repo: '', ready: false },
    claudeCode: { installed: false, ready: false },
    supabase: {
      projectId: '',
      url: '',
      anonKey: '',
      serviceKey: '',
      ready: false,
    },
    vercel: { url: '', ready: false },
  });

  const [generatedCommand, setGeneratedCommand] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const features = [
    { id: 'user-management', name: 'User Management', desc: 'Authentication & user profiles' },
    { id: 'data-handling', name: 'Data Handling', desc: 'CRUD operations & data management' },
    { id: 'csv-upload', name: 'CSV Upload', desc: 'Bulk data import from CSV files' },
    { id: 'manual-entry', name: 'Manual Entry', desc: 'Form-based data entry interface' },
    { id: 'export-results', name: 'Export Results', desc: 'Export data to CSV/JSON formats' },
    { id: 'saved-lists', name: 'Saved Lists', desc: 'Save and manage custom data lists' },
  ];

  const aiModels = [
    { id: 'claude-sonnet', name: 'Anthropic Claude Sonnet 4', desc: 'Best for analysis and reasoning' },
    { id: 'gpt-5', name: 'OpenAI GPT-5', desc: 'General purpose AI assistant' },
    { id: 'gemini', name: 'Google Gemini 2.5 Pro', desc: 'Multimodal AI capabilities' },
  ];

  const imageModels = [
    { id: 'imagen', name: 'Google Imagen 4', disabled: true },
    { id: 'gpt-image', name: 'GPT Image 1', disabled: true },
    { id: 'stable-diffusion', name: 'Stable Diffusion', disabled: false },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  const toggleFeature = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter(f => f !== id)
        : [...prev.features, id]
    }));
  };

  const toggleAIModel = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      aiModels: prev.aiModels.includes(id)
        ? prev.aiModels.filter(m => m !== id)
        : [...prev.aiModels, id]
    }));
  };

  const canGenerateFramework = () => {
    return projectData.description &&
           projectData.features.length > 0 &&
           projectData.supabase.projectId;
  };

  const generateFramework = () => {
    const config = {
      name: projectName,
      description: projectData.description,
      features: projectData.features,
      ai: projectData.aiModels,
      supabase: {
        id: projectData.supabase.projectId,
        url: projectData.supabase.url,
      },
      github: projectData.github.repo,
    };

    const configId = btoa(JSON.stringify(config)).substring(0, 24);
    const projectSlug = projectName.toLowerCase().replace(/\s+/g, '-');
    const command = `npx @5daysprint/framework ${configId}-${projectSlug}`;

    setGeneratedCommand(command);
    setShowInstructions(true);
    toggleSection('generate');
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
    alert('✅ Command copied to clipboard!');
  };

  const SectionCard = ({ id, title, desc, icon: Icon, children, ready = false }: any) => (
    <Card className={expandedSections[id as keyof typeof expandedSections] ? 'border-blue-500' : ''}>
      <CardHeader className="cursor-pointer" onClick={() => toggleSection(id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              ready ? 'bg-green-600' : expandedSections[id as keyof typeof expandedSections] ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {ready ? <Check size={20} className="text-white" /> : <Icon size={20} className="text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ready && <span className="text-xs text-green-500 font-semibold">● Ready</span>}
            {expandedSections[id as keyof typeof expandedSections] ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </div>
        </div>
      </CardHeader>
      {expandedSections[id as keyof typeof expandedSections] && <CardContent>{children}</CardContent>}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">5 Day Sprint › New Project</div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-gray-700 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div className="space-y-4">
          {/* Research */}
          <SectionCard id="research" title="Research" desc="Define your project vision" icon={Search}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What do you want to build?
                </label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white min-h-[120px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="A streamlined tool for checking domain availability in bulk using CSV uploads. Perfect for domain investors, brand managers, and startup founders who need to quickly validate multiple domain names."
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                />
              </div>
              {projectData.description && (
                <Button onClick={() => toggleSection('features')} className="w-full">
                  Continue to Core Features →
                </Button>
              )}
            </div>
          </SectionCard>

          {/* Core Features */}
          <SectionCard
            id="features"
            title="Core Features"
            desc="Select features for your project"
            icon={Boxes}
            ready={projectData.features.length > 0}
          >
            <div className="space-y-4">
              {projectData.description && (
                <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Project Overview</h4>
                  <p className="text-sm text-gray-300">{projectData.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-white mb-3">Choose features:</h4>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        projectData.features.includes(feature.id)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        projectData.features.includes(feature.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-600'
                      }`}>
                        {projectData.features.includes(feature.id) && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white">{feature.name}</div>
                        <div className="text-xs text-gray-400 truncate">{feature.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {projectData.features.length > 0 && (
                <Button onClick={() => toggleSection('ai')} className="w-full">
                  Continue to AI Integration →
                </Button>
              )}
            </div>
          </SectionCard>

          {/* Integrate AI */}
          <SectionCard
            id="ai"
            title="Integrate AI"
            desc="Add AI capabilities to your project"
            icon={Brain}
            ready={projectData.aiModels.length > 0}
          >
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Language AI</h4>
                <p className="text-sm text-gray-400 mb-3">Enhance your project with AI capabilities</p>
                <div className="space-y-2">
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => toggleAIModel(model.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        projectData.aiModels.includes(model.id)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        projectData.aiModels.includes(model.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-600'
                      }`} />
                      <div className="text-left">
                        <div className="text-white font-medium">{model.name}</div>
                        <div className="text-xs text-gray-400">{model.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Image Generation</h4>
                <p className="text-sm text-gray-400 mb-3">Optional image generation models</p>
                <div className="space-y-2 opacity-50">
                  {imageModels.map((model) => (
                    <div
                      key={model.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-800 bg-gray-900"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-gray-700" />
                      <span className="text-gray-500">{model.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => toggleSection('cursor')} className="w-full">
                Continue to Setup →
              </Button>
            </div>
          </SectionCard>

          {/* Cursor */}
          <SectionCard
            id="cursor"
            title="Cursor"
            desc="Download & install Cursor"
            icon={Mouse}
            ready={projectData.cursor.ready}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Cursor is an AI-powered code editor that helps you build faster with intelligent code completion and chat.
              </p>
              <div className="space-y-3">
                <a
                  href="https://cursor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <span>1. Visit cursor.com and download</span>
                  <ExternalLink size={14} />
                </a>
                <div className="text-gray-300">2. Install and open Cursor</div>
              </div>
              <Button
                onClick={() => setProjectData({...projectData, cursor: { installed: true, ready: true }})}
                variant={projectData.cursor.ready ? 'outline' : 'default'}
                className="w-full"
              >
                {projectData.cursor.ready ? '✓ Mark Done' : 'Mark as Done'}
              </Button>
            </div>
          </SectionCard>

          {/* GitHub */}
          <SectionCard
            id="github"
            title="GitHub"
            desc="Create your GitHub repository"
            icon={Github}
            ready={projectData.github.ready}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Store your code on GitHub for version control and collaboration.
              </p>
              <input
                type="text"
                placeholder="Repository name (e.g., my-awesome-project)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={projectData.github.repo}
                onChange={(e) => setProjectData({...projectData, github: { repo: e.target.value, ready: !!e.target.value }})}
              />
            </div>
          </SectionCard>

          {/* Claude Code */}
          <SectionCard
            id="claude"
            title="Claude Code"
            desc="Install Claude Code CLI for AI assistance"
            icon={CodeIcon}
            ready={projectData.claudeCode.ready}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Claude Code CLI provides AI-powered assistance directly in your terminal.
              </p>
              <Button
                onClick={() => setProjectData({...projectData, claudeCode: { installed: true, ready: true }})}
                variant={projectData.claudeCode.ready ? 'outline' : 'default'}
                className="w-full"
              >
                {projectData.claudeCode.ready ? '✓ Installed' : 'Mark as Installed'}
              </Button>
            </div>
          </SectionCard>

          {/* Supabase */}
          <SectionCard
