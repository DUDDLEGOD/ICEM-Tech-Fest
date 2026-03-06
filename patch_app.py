import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { CustomCursor } from './components/CustomCursor';", "")
content = content.replace("import { AppView, Registration } from './types';", "import { AdminDashboard } from './components/AdminDashboard';\nimport { AppView, Registration } from './types';")

# 2. RenderView
old_render = '''  const renderView = () => {
    switch (view) {
      case 'register':
        return (
          <RegistrationForm 
            onSuccess={onRegistrationSuccess} 
            initialEventId={selectedEventId}
          />
        );
      case 'about':
        return <AboutPage onNavigateBack={() => setView('home')} />;
      default:
        return (
          <>
            <Hero />
            <EventCatalog onRegister={handleRegister} />
            <Marquee />
            <div id="social-section">
              <SocialFeed />
            </div>
          </>
        );
    }
  };'''

new_render = '''  const renderView = () => {
    switch (view) {
      case 'register':
        return (
          <RegistrationForm 
            onSuccess={onRegistrationSuccess} 
            initialEventId={selectedEventId}
          />
        );
      case 'about':
        return <AboutPage onNavigateBack={() => setView('home')} />;
      case 'admin':
        return <AdminDashboard onNavigateBack={() => setView('home')} />;
      default:
        return (
          <>
            <Hero />
            <EventCatalog onRegister={handleRegister} brochureVisibility={brochureVisibility} />
            <Marquee />
            <div id="social-section">
              <SocialFeed />
            </div>
          </>
        );
    }
  };'''
content = content.replace(old_render, new_render)

# 3. CustomCursor and Main Container
content = content.replace('selection:text-white cursor-none bg-[#0c0a09]">', 'selection:text-white bg-[#0c0a09]">')
content = content.replace('      <CustomCursor />\n', '')
content = content.replace('<main className="relative z-10 pt-20 md:pt-24">', '<main className="relative z-10 pt-20 md:pt-24 min-h-[80vh]">')
content = content.replace('<Footer />', '<Footer setView={setView} />')

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied")
