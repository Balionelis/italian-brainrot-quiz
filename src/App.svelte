<script lang="ts">
  import { user } from './lib/stores/authStore';
  import { auth } from './lib/firebase/firebase';
  import { signOut } from 'firebase/auth';
  import Home from './lib/components/Home.svelte';
  import CharacterQuiz from './lib/components/CharacterQuiz.svelte';
  import Leaderboard from './lib/components/Leaderboard.svelte';
  import Login from './lib/components/Login.svelte';
  import Register from './lib/components/Register.svelte';
  
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
    currentView = view;
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
            <button class="nav-button" on:click={() => navigate('game')}>Play</button>
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
          <CharacterQuiz />
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
      background-color: #f8f9fa;
      color: #2c3e50;
      line-height: 1.6;
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
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 12px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
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
      transition: transform 0.2s ease;
  }
  
  .logo:hover {
      transform: scale(1.05);
  }
  
  .logo-icon {
      font-size: 1.5rem;
  }
  
  .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2c3e50;
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
      transition: all 0.2s ease;
  }
  
  .nav-button:hover {
      background: #f3f4f6;
      color: #2c3e50;
  }
  
  .nav-button.primary {
      background: #4a90e2;
      color: white;
  }
  
  .nav-button.primary:hover {
      background: #357abd;
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
  }
  
  .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
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
      transition: background 0.2s ease;
  }
  
  .logout-button:hover {
      background: #c0392b;
  }
  
  .content {
      flex: 1;
      padding: 20px;
  }
  
  .switch-auth {
      text-align: center;
      margin-top: 20px;
      color: #4a5568;
  }
  
  .link-button {
      background: none;
      border: none;
      color: #4a90e2;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      font-weight: 500;
  }
  
  .link-button:hover {
      color: #357abd;
  }
  
  .modern-footer {
      background: white;
      border-top: 1px solid #e5e7eb;
      padding: 20px;
      margin-top: auto;
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