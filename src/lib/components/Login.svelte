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

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to save your scores and compete!</p>
        </div>
        
        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    placeholder="Enter your email"
                    required
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    placeholder="Enter your password"
                    required
                />
            </div>
            
            {#if error}
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    {error}
                </div>
            {/if}
            
            <button type="submit" class="auth-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    </div>
</div>

<style>
    .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 200px);
        padding: 20px;
    }
    
    .auth-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 400px;
        padding: 40px;
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .auth-header h2 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 10px;
    }
    
    .auth-header p {
        color: #6b7280;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        color: #4a5568;
        font-weight: 500;
    }
    
    input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.2s ease;
    }
    
    input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
    
    input::placeholder {
        color: #a0aec0;
    }
    
    .auth-button {
        width: 100%;
        padding: 14px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .auth-button:hover:not(:disabled) {
        background: #357abd;
        transform: translateY(-1px);
    }
    
    .auth-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .error-icon {
        font-size: 1.2rem;
    }
</style>