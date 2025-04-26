<script lang="ts">
    import { user } from './lib/stores/authStore';
    import { auth } from './lib/firebase/firebase';
    import { signOut } from 'firebase/auth';
    import { inject } from '@vercel/analytics';
    import Home from './lib/components/Home.svelte';
    import CharacterQuiz from './lib/components/CharacterQuiz.svelte';
    import Leaderboard from './lib/components/Leaderboard.svelte';
    import Login from './lib/components/Login.svelte';
    import Register from './lib/components/Register.svelte';
    
    inject();
    
    let currentView: 'home' | 'login' | 'register' | 'game' | 'leaderboard' = 'home';
    
    $: if ($user && (currentView === 'login' || currentView === 'register')) {
      currentView = 'home';
    }
    
    async function handleLogout() {
      try {
        await signOut(auth);
        currentView = 'home';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    
    function navigate(view: 'game' | 'leaderboard' | 'home' | 'login' | 'register') {
      if (view === 'game' && !$user) {
        currentView = 'login';
      } else {
        currentView = view;
      }
    }
  </script>
  
  <main>
    <nav class="modern-nav">
        <div class="nav-content">
            <div class="logo" on:click={() => navigate('home')}>
                <span class="logo-icon">🎯</span>
                <span class="logo-text">Brainrot Character Quiz</span>
            </div>
            
            <div class="nav-links">
              {#if $user}
                  <button class="nav-button" on:click={() => navigate('game')}>Play</button>
              {/if}
              <button class="nav-button" on:click={() => navigate('home')}>Home</button>
              <button class="nav-button" on:click={() => navigate('leaderboard')}>Leaderboard</button>
              {#if $user}
                  <div class="user-menu">
                      <span class="user-name">{$user.displayName || 'Player'}</span>
                      <button class="logout-button" on:click={handleLogout}>Logout</button>
                  </div>
              {:else}
                  <button class="nav-button primary" on:click={() => navigate('login')}>Login</button>
                  <button class="nav-button secondary" on:click={() => navigate('register')}>Register</button>
              {/if}
            </div>
        </div>
    </nav>
  
    <div class="content">
        {#if currentView === 'home'}
            <Home onNavigate={navigate} />
        {:else if currentView === 'login'}
            <Login />
            <p class="switch-auth">
                Don't have an account? 
                <button class="link-button" on:click={() => navigate('register')}>
                    Register here
                </button>
            </p>
        {:else if currentView === 'register'}
            <Register />
            <p class="switch-auth">
                Already have an account? 
                <button class="link-button" on:click={() => navigate('login')}>
                    Login here
                </button>
            </p>
        {:else if currentView === 'game'}
            {#if $user}
                <CharacterQuiz />
            {:else}
                <div class="access-denied">
                    <h2>Access Denied</h2>
                    <p>You must be logged in to play the game.</p>
                    <button class="primary-button" on:click={() => navigate('login')}>Login to Play</button>
                </div>
            {/if}
        {:else if currentView === 'leaderboard'}
            <Leaderboard />
        {/if}
    </div>
    
    <footer class="modern-footer">
        <div class="footer-content">
            <p>© 2025 Balionidas. All rights reserved.</p>
        </div>
    </footer>
  </main>
  
  <style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
        color: #2c3e50;
        line-height: 1.6;
        min-height: 100vh;
    }
    
    :global(*) {
        box-sizing: border-box;
    }
    
    main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    .modern-nav {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
        padding: 12px 20px;
        position: sticky;
        top: 0;
        z-index: 100;
        transition: all 0.3s ease;
    }
    
    .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .logo:hover {
        transform: scale(1.05);
    }
    
    .logo-icon {
        font-size: 1.5rem;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .logo-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2c3e50;
        background: linear-gradient(45deg, #4a90e2, #357abd);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .nav-links {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .nav-button {
        padding: 8px 16px;
        background: transparent;
        border: none;
        color: #4a5568;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .nav-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: 0.5s;
    }
    
    .nav-button:hover::before {
        left: 100%;
    }
    
    .nav-button:hover {
        background: #f3f4f6;
        color: #2c3e50;
        transform: translateY(-2px);
    }
    
    .nav-button.primary {
        background: linear-gradient(45deg, #4a90e2, #357abd);
        color: white;
    }
    
    .nav-button.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
    }
    
    .nav-button.secondary {
        border: 2px solid #4a90e2;
        color: #4a90e2;
    }
    
    .nav-button.secondary:hover {
        background: #f0f7ff;
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 12px;
        background: #f3f4f6;
        border-radius: 25px;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .user-name {
        font-weight: 500;
        color: #4a5568;
    }
    
    .logout-button {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .logout-button:hover {
        background: #c0392b;
        transform: translateY(-1px);
    }
    
    .content {
        flex: 1;
        padding: 20px;
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .switch-auth {
        text-align: center;
        margin-top: 20px;
        color: #4a5568;
        animation: fadeInUp 0.5s ease;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .link-button {
        background: none;
        border: none;
        color: #4a90e2;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .link-button:hover {
        color: #357abd;
    }
    
    .access-denied {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        max-width: 500px;
        margin: 40px auto;
        animation: bounceIn 0.6s ease;
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .access-denied h2 {
        color: #e74c3c;
        margin-bottom: 20px;
    }
    
    .access-denied p {
        color: #6b7280;
        margin-bottom: 30px;
    }
    
    .access-denied .primary-button {
        padding: 12px 24px;
        background: linear-gradient(45deg, #4a90e2, #357abd);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .access-denied .primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
    }
    
    .modern-footer {
        background: white;
        border-top: 1px solid #e5e7eb;
        padding: 20px;
        margin-top: auto;
        animation: fadeIn 0.5s ease;
    }
    
    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
        color: #6b7280;
    }
    
    @media (max-width: 768px) {
        .nav-content {
            flex-direction: column;
            gap: 15px;
        }
        
        .nav-links {
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .user-menu {
            margin-top: 10px;
        }
    }
</style>