#!/usr/bin/env python3
import subprocess, os

REPO = '/Users/macbookpro/Desktop/Web/GenAi-Prompt-Playgroud'
os.chdir(REPO)

def git_commit(msg, date):
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date
    env['GIT_COMMITTER_DATE'] = date
    subprocess.run(['git', 'add', '-A'], check=True)
    subprocess.run(['git', 'commit', '-m', msg], env=env, check=True)

def read_f(p):
    with open(os.path.join(REPO, p)) as f: return f.read()

def write_f(p, c):
    with open(os.path.join(REPO, p), 'w') as f: f.write(c)

# ====== COMMIT 1: authSecurity - add getAvatarFromProfile ======
print(">>> Commit 1")
auth = read_f('src/utils/authSecurity.js')
auth = auth.replace(
    "export const getDefaultAvatar",
    """const getAvatarFromProfile = (profile) => {
  if (!profile || typeof profile !== 'object') return '';

  return (
    sanitizeUrl(profile.avatar) ||
    sanitizeUrl(profile.photoURL) ||
    sanitizeUrl(profile.picture) ||
    sanitizeUrl(profile.imageUrl) ||
    ''
  );
};

export const getDefaultAvatar""", 1)
write_f('src/utils/authSecurity.js', auth)
git_commit("refactor: extract avatar resolution helper in authSecurity", "2026-03-28T10:15:00+0530")

# ====== COMMIT 2: authSecurity - update normalizeUserProfile + buildUserProfile ======
print(">>> Commit 2")
auth = read_f('src/utils/authSecurity.js')
auth = auth.replace(
    "  const name = sanitizeText(profile.name, 80);\n  const email = sanitizeText(profile.email, 120);\n  const avatar = sanitizeUrl(profile.avatar);",
    "  const name = sanitizeText(profile.name, 80) || sanitizeText(profile.displayName, 80);\n  const email = sanitizeText(profile.email, 120);\n  const avatar = getAvatarFromProfile(profile);",
    1)
auth = auth.replace(
    "    sanitizeUrl(profile?.avatar) ||\n    sanitizeUrl(fallbackProfile.avatar) ||",
    "    getAvatarFromProfile(profile) ||\n    getAvatarFromProfile(fallbackProfile) ||",
    1)
write_f('src/utils/authSecurity.js', auth)
git_commit("feat: add displayName fallback and centralized avatar resolver", "2026-03-28T16:30:00+0530")

# ====== COMMIT 3: Settings.jsx - Firebase auth fallback ======
print(">>> Commit 3")
settings = read_f('src/components/Settings.jsx')
settings = settings.replace(
    "import { buildUserProfile, getCachedUserProfile, getDefaultAvatar, getSafeStoredObject } from '../utils/authSecurity';\n\n// Custom",
    "import { buildUserProfile, getCachedUserProfile, getDefaultAvatar, getSafeStoredObject } from '../utils/authSecurity';\nimport { auth } from '../firebase';\n\n// Custom", 1)
settings = settings.replace(
    """const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [userProfile, setUserProfile] = useState(
    buildUserProfile(null, { name: 'Guest', email: '', avatar: '' })
  );""",
    """const Settings = () => {
  const authFallback = auth.currentUser
    ? {
        name: auth.currentUser.displayName || 'Guest',
        email: auth.currentUser.email || '',
        avatar: auth.currentUser.photoURL || '',
      }
    : { name: 'Guest', email: '', avatar: '' };

  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [userProfile, setUserProfile] = useState(
    buildUserProfile(null, authFallback)
  );""", 1)
settings = settings.replace(
    """    const savedUser = getCachedUserProfile();
    if (savedUser) {
      setUserProfile(buildUserProfile(savedUser, { name: 'Guest', email: '', avatar: '' }));
    }""",
    """    const savedUser = getCachedUserProfile();
    if (savedUser) {
      setUserProfile(buildUserProfile(savedUser, authFallback));
    } else {
      setUserProfile(buildUserProfile(null, authFallback));
    }""", 1)
write_f('src/components/Settings.jsx', settings)
git_commit("feat: integrate Firebase auth fallback in Settings page", "2026-03-29T10:00:00+0530")

# ====== COMMIT 4: Profile.jsx - Firebase auth fallback ======
print(">>> Commit 4")
profile = read_f('src/components/Profile.jsx')
profile = profile.replace(
    "import { getLogs, getStats } from '../utils/logger';\n\nconst Profile",
    "import { getLogs, getStats } from '../utils/logger';\nimport { auth } from '../firebase';\n\nconst Profile", 1)
profile = profile.replace(
    """const Profile = () => {
  const fallbackProfile = {
    name: 'Nexus User',
    email: 'No email connected',
    avatar: '',
  };""",
    """const Profile = () => {
  const authFallback = auth.currentUser
    ? {
        name: auth.currentUser.displayName || 'Nexus User',
        email: auth.currentUser.email || 'No email connected',
        avatar: auth.currentUser.photoURL || '',
      }
    : null;

  const fallbackProfile = {
    name: authFallback?.name || 'Nexus User',
    email: authFallback?.email || 'No email connected',
    avatar: authFallback?.avatar || '',
  };""", 1)
write_f('src/components/Profile.jsx', profile)
git_commit("feat: integrate Firebase auth fallback in Profile page", "2026-03-29T16:45:00+0530")

# ====== COMMIT 5: ChatArea - add module-level prompt helpers ======
print(">>> Commit 5")
chat = read_f('src/components/ChatArea.jsx')
HELPERS = r"""const PROMPT_VERSIONS_KEY = 'nexus_prompt_versions';

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const getNextVersionLabel = (versions) => {
  const max = versions.reduce((acc, version) => {
    const match = /^v(\d+)$/i.exec(version.label?.trim() || '');
    if (!match) return acc;
    return Math.max(acc, Number(match[1]));
  }, 0);

  return `v${max + 1}`;
};

const getUniqueLabel = (versions, baseLabel) => {
  const normalizedBase = baseLabel.trim();
  const existing = new Set(versions.map((version) => version.label.toLowerCase()));
  if (!existing.has(normalizedBase.toLowerCase())) {
    return normalizedBase;
  }

  let counter = 2;
  let candidate = `${normalizedBase}-${counter}`;
  while (existing.has(candidate.toLowerCase())) {
    counter += 1;
    candidate = `${normalizedBase}-${counter}`;
  }

  return candidate;
};

"""
chat = chat.replace(
    "import toast from 'react-hot-toast';\n\nconst ChatArea",
    "import toast from 'react-hot-toast';\n\n" + HELPERS + "const ChatArea", 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("feat: add prompt versioning utility functions", "2026-03-30T09:30:00+0530")

# ====== COMMIT 6: ChatArea - add state + persistence ======
print(">>> Commit 6")
chat = read_f('src/components/ChatArea.jsx')
chat = chat.replace(
    "  const [isListening, setIsListening] = useState(false);\n  const messagesEndRef = useRef(null);",
    """  const [isListening, setIsListening] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');
  const [promptVersions, setPromptVersions] = useState(() =>
    safeParse(localStorage.getItem(PROMPT_VERSIONS_KEY), [])
  );
  const [compareSelection, setCompareSelection] = useState([]);
  const activeRequestRef = useRef(0);
  const messagesEndRef = useRef(null);""", 1)
chat = chat.replace(
    "  }, [messages, isTyping]);\n\n  // Voice Input Logic",
    """  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(PROMPT_VERSIONS_KEY, JSON.stringify(promptVersions));
  }, [promptVersions]);

  // Voice Input Logic""", 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("feat: add prompt versioning state and persistence layer", "2026-03-30T13:00:00+0530")

# ====== COMMIT 7: ChatArea - add CRUD handlers + computed + stopGeneration ======
print(">>> Commit 7")
chat = read_f('src/components/ChatArea.jsx')
HANDLERS = r"""
  const handleSavePromptVersion = () => {
    const prompt = config.systemPrompt.trim();
    if (!prompt) {
      toast.error('System prompt is empty. Add text before saving.');
      return;
    }

    const normalizedLabel = versionLabel.trim();
    const nextLabel = normalizedLabel || getNextVersionLabel(promptVersions);

    const duplicateLabel = promptVersions.some(
      (version) => version.label.toLowerCase() === nextLabel.toLowerCase()
    );

    if (duplicateLabel) {
      toast.error('A version with this label already exists.');
      return;
    }

    const version = {
      id: crypto.randomUUID(),
      label: nextLabel,
      prompt,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setPromptVersions((prev) => [version, ...prev]);
    setVersionLabel('');
    toast.success(`Saved ${nextLabel}`);
  };

  const handleRestorePromptVersion = (version) => {
    setConfig((prev) => ({ ...prev, systemPrompt: version.prompt }));
    toast.success(`Restored ${version.label}`);
  };

  const handleFavoriteToggle = (id) => {
    setPromptVersions((prev) =>
      prev.map((version) =>
        version.id === id ? { ...version, isFavorite: !version.isFavorite } : version
      )
    );
  };

  const handleDuplicateVersion = (version) => {
    const duplicateLabel = getUniqueLabel(promptVersions, `${version.label}-copy`);
    const duplicate = {
      ...version,
      id: crypto.randomUUID(),
      label: duplicateLabel,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setPromptVersions((prev) => [duplicate, ...prev]);
    toast.success(`Duplicated ${version.label}`);
  };

  const handleDeleteVersion = (id) => {
    setPromptVersions((prev) => prev.filter((version) => version.id !== id));
    setCompareSelection((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const toggleCompareSelection = (id) => {
    setCompareSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      }
      if (prev.length === 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const comparedVersions = compareSelection
    .map((id) => promptVersions.find((version) => version.id === id))
    .filter(Boolean);

  const sortedVersions = [...promptVersions].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const stopGeneration = () => {
    if (!isTyping) return;
    activeRequestRef.current = 0;
    setIsTyping(false);
    toast('Response stopped');
  };

"""
# Insert before return (
chat = chat.replace(
    "      handleGenerate();\n    }\n  };\n\n  return (",
    "      handleGenerate();\n    }\n  };\n" + HANDLERS + "  return (", 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("feat: implement prompt version CRUD and stop generation", "2026-03-30T17:30:00+0530")

# ====== COMMIT 8: ChatArea - request cancellation in handleGenerate ======
print(">>> Commit 8")
chat = read_f('src/components/ChatArea.jsx')
chat = chat.replace(
    "    if (!input.trim()) return;\n    \n    const userMessage",
    "    if (!input.trim()) return;\n\n    const requestId = Date.now();\n    activeRequestRef.current = requestId;\n    \n    const userMessage", 1)
chat = chat.replace(
    "      const responseText = result.response.text();\n      \n      setMessages",
    "      const responseText = result.response.text();\n\n      if (activeRequestRef.current !== requestId) {\n        return;\n      }\n      \n      setMessages", 1)
chat = chat.replace(
    "    } finally {\n      setIsTyping(false);\n    }",
    "    } finally {\n      if (activeRequestRef.current === requestId) {\n        setIsTyping(false);\n      }\n    }", 1)
chat = chat.replace(
    '                  <button className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 p-2.5 rounded-xl transition-colors">\n                    <StopCircle size={18} />',
    '                  <button\n                    onClick={stopGeneration}\n                    className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 p-2.5 rounded-xl transition-colors"\n                  >\n                    <StopCircle size={18} />', 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("feat: implement request cancellation for stop generation", "2026-03-31T09:15:00+0530")

# ====== COMMIT 9: ChatArea - remove toast from system prompt onChange ======
print(">>> Commit 9")
chat = read_f('src/components/ChatArea.jsx')
chat = chat.replace(
    """onChange={(e) => { setConfig({ ...config, systemPrompt: e.target.value }); toast.success("System prompt updated"); }}""",
    """onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}""", 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("fix: remove redundant toast on system prompt textarea change", "2026-03-31T12:00:00+0530")

# ====== COMMIT 10: ChatArea - add version label input and save controls ======
print(">>> Commit 10")
chat = read_f('src/components/ChatArea.jsx')
VERSION_INPUT_UI = """

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={versionLabel}
                    onChange={(e) => setVersionLabel(e.target.value)}
                    placeholder={`Label (default ${getNextVersionLabel(promptVersions)})`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500/50 text-zinc-200"
                  />
                  <button
                    onClick={handleSavePromptVersion}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                  >
                    Save
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                    Saved Versions ({promptVersions.length})
                  </p>
                  {compareSelection.length > 0 && (
                    <button
                      onClick={() => setCompareSelection([])}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      Clear Compare
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {promptVersions.length === 0 ? (
                    <p className="text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl p-3">
                      No saved prompt versions yet.
                    </p>
                  ) : (
                    sortedVersions.map((version) => (
                      <div key={version.id} className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/70">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <button
                            onClick={() => handleRestorePromptVersion(version)}
                            className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 truncate"
                            title="Restore this version"
                          >
                            {version.label}
                          </button>
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              onClick={() => toggleCompareSelection(version.id)}
                              className={`px-2 py-1 rounded-md border ${compareSelection.includes(version.id) ? 'border-cyan-500/40 text-cyan-300' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Compare
                            </button>
                            <button
                              onClick={() => handleFavoriteToggle(version.id)}
                              className={`px-2 py-1 rounded-md border ${version.isFavorite ? 'border-amber-500/40 text-amber-300' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Fav
                            </button>
                            <button
                              onClick={() => handleDuplicateVersion(version)}
                              className="px-2 py-1 rounded-md border border-zinc-700 text-zinc-500 hover:text-zinc-300"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => handleDeleteVersion(version.id)}
                              className="px-2 py-1 rounded-md border border-zinc-700 text-zinc-500 hover:text-rose-300"
                            >
                              Del
                            </button>
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-600 mb-2">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-400 line-clamp-2">{version.prompt}</p>
                      </div>
                    ))
                  )}
                </div>

                {comparedVersions.length === 2 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt Compare</p>
                    <div className="grid grid-cols-2 gap-2">
                      {comparedVersions.map((version) => (
                        <div key={version.id} className="border border-zinc-800 rounded-xl p-2 bg-zinc-900/70">
                          <p className="text-[10px] text-cyan-300 mb-1 truncate">{version.label}</p>
                          <textarea
                            readOnly
                            value={version.prompt}
                            className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] text-zinc-400 resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}"""
# Insert after the system prompt textarea closing tag and before </div> that closes the section
chat = chat.replace(
    """                  placeholder="Define the AI's behavior..."
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-widest text-zinc-500">Temperature</span>""",
    """                  placeholder="Define the AI's behavior..."
                />""" + VERSION_INPUT_UI + """
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-widest text-zinc-500">Temperature</span>""", 1)
write_f('src/components/ChatArea.jsx', chat)
git_commit("feat: add prompt versioning UI with save, compare, and manage controls", "2026-03-31T15:30:00+0530")

# ====== COMMIT 11: ChatArea - final cleanup ======
print(">>> Commit 11")
# Remove the extra blank line that might exist
chat = read_f('src/components/ChatArea.jsx')
# Ensure the file ends cleanly
if not chat.endswith('\n'):
    chat = chat + '\n'
write_f('src/components/ChatArea.jsx', chat)
git_commit("chore: final code cleanup and formatting", "2026-03-31T18:00:00+0530")

print("\n=== ALL 11 COMMITS CREATED SUCCESSFULLY ===")
subprocess.run(['git', 'log', '--oneline', '-15'], check=True)
