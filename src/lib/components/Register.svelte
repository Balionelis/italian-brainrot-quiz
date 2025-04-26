<!-- src/lib/components/Register.svelte -->
<script lang="ts">
    import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
    import { auth, db } from '../firebase/firebase';
    import { setDoc, doc } from 'firebase/firestore';
    
    let email = '';
    let password = '';
    let username = '';
    let error = '';
    let loading = false;
    
    async function handleRegister() {
      loading = true;
      error = '';
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: username,
          email: email,
          createdAt: new Date()
        });
        
      } catch (e: any) {
        error = e.message;
      }
      
      loading = false;
    }
  </script>
  
  <div class="register-container">
    <h2>Register</h2>
    
    <form on:submit|preventDefault={handleRegister}>
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          required
        />
      </div>
      
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
          minlength="6"
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  </div>
  
  <style>
    .register-container {
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