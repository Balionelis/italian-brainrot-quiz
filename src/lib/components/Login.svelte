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
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .auth-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 400px;
        padding: 40px;
        animation: scaleIn 0.5s ease;
        position: relative;
        overflow: hidden;
    }
    
    .auth-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(90deg, #4a90e2, #357abd);
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .auth-header h2 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 10px;
        background: linear-gradient(45deg, #4a90e2, #357abd);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .auth-header p {
        color: #6b7280;
    }
    
    .form-group {
        margin-bottom: 20px;
        animation: slideInLeft 0.5s ease;
        animation-fill-mode: both;
    }
    
    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.2s; }
    .form-group:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
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
        transition: all 0.3s ease;
        background: #fafafa;
    }
    
    input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
        background: white;
    }
    
    input::placeholder {
        color: #a0aec0;
    }
    
    .auth-button {
        width: 100%;
        padding: 14px;
        background: linear-gradient(45deg, #4a90e2, #357abd);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .auth-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: 0.5s;
    }
    
    .auth-button:hover:not(:disabled)::before {
        left: 100%;
    }
    
    .auth-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
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
        animation: shakeAnimation 0.5s ease;
    }
    
    @keyframes shakeAnimation {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .error-icon {
        font-size: 1.2rem;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
</style>