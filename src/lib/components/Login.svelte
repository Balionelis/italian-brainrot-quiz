<!-- src/lib/components/Login.svelte -->
<script lang="ts">
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { auth } from '../firebase/firebase';
    
    let email = '';
    let password = '';
    let error = '';
    let loading = false;
    
    async function handleLogin() {
      loading = true;
      error = '';
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        error = e.message;
      }
      
      loading = false;
    }
  </script>
  
  <div class="login-container">
    <h2>Login</h2>
    
    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div>
  
  <style>
    .login-container {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      width: 100%;
      padding: 10px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .error {
      color: red;
      margin-bottom: 10px;
    }
  </style>