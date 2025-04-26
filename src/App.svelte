<!-- src/App.svelte -->
<script lang="ts">
    import { user } from './lib/stores/authStore';
    import { auth } from './lib/firebase/firebase';
    import { signOut } from 'firebase/auth';
    import CharacterQuiz from './lib/components/CharacterQuiz.svelte';
    import Leaderboard from './lib/components/Leaderboard.svelte';
    import Login from './lib/components/Login.svelte';
    import Register from './lib/components/Register.svelte';
    
    let currentView: 'login' | 'register' | 'game' | 'leaderboard' = 'login';
    
    async function handleLogout() {
      try {
        await signOut(auth);
        currentView = 'login';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    
    $: if ($user && currentView === 'login') {
      currentView = 'game';
    }
  </script>
  
  <main>
    <nav>
      {#if $user}
        <div class="user-info">
          <span>Welcome, {$user.displayName || 'Player'}</span>
          <button on:click={() => currentView = 'game'}>Game</button>
          <button on:click={() => currentView = 'leaderboard'}>Leaderboard</button>
          <button on:click={handleLogout}>Logout</button>
        </div>
      {:else}
        <div class="auth-buttons">
          <button on:click={() => currentView = 'login'}>Login</button>
          <button on:click={() => currentView = 'register'}>Register</button>
        </div>
      {/if}
    </nav>
  
    <div class="content">
      {#if !$user}
        {#if currentView === 'login'}
          <Login />
          <p class="switch-auth">
            Don't have an account? 
            <button class="link-button" on:click={() => currentView = 'register'}>
              Register here
            </button>
          </p>
        {:else if currentView === 'register'}
          <Register />
          <p class="switch-auth">
            Already have an account? 
            <button class="link-button" on:click={() => currentView = 'login'}>
              Login here
            </button>
          </p>
        {/if}
      {:else}
        {#if currentView === 'game'}
          <CharacterQuiz />
        {:else if currentView === 'leaderboard'}
          <Leaderboard />
        {/if}
      {/if}
    </div>
  </main>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    
    main {
      min-height: 100vh;
    }
    
    nav {
      background-color: #333;
      color: white;
      padding: 10px 20px;
      display: flex;
      justify-content: flex-end;
    }
    
    .user-info, .auth-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    nav button {
      padding: 8px 16px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    nav button:hover {
      background: #357abd;
    }
    
    .content {
      padding: 20px;
    }
    
    .switch-auth {
      text-align: center;
      margin-top: 20px;
    }
    
    .link-button {
      background: none;
      border: none;
      color: #4a90e2;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
    }
    
    .link-button:hover {
      color: #357abd;
    }
  </style>