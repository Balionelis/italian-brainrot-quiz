<script lang="ts">
    import { user } from '../stores/authStore';
    
    export let onNavigate: (view: 'game' | 'leaderboard') => void;
</script>

<div class="home-container">
    <div class="hero-section">
        <h1>Brainrot Character Matching Game</h1>
        <p class="tagline">Test your knowledge of the brainrot character names!</p>
    </div>
    
    {#if $user}
        <div class="welcome-message">
            <h2>Welcome back, {$user.displayName || 'Player'}!</h2>
        </div>
    {/if}
    
    <div class="cards-container">
        <div class="card" on:click={() => onNavigate('game')}>
            <div class="card-icon">🎮</div>
            <h3>Start New Game</h3>
            <p>Match 10 brainrot characters with their names and compete for the high score!</p>
            <button class="primary-button">Play Now</button>
        </div>
        
        <div class="card" on:click={() => onNavigate('leaderboard')}>
            <div class="card-icon">🏆</div>
            <h3>View Leaderboard</h3>
            <p>See the top players and their scores</p>
            <button class="secondary-button">View Scores</button>
        </div>
    </div>
    
    {#if !$user}
        <div class="login-prompt">
            <p>Login or register to save your scores and compete on the leaderboard!</p>
        </div>
    {/if}
</div>

<style>
    .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
        text-align: center;
    }
    
    .hero-section {
        margin-bottom: 40px;
    }
    
    .hero-section h1 {
        font-size: 3rem;
        color: #2c3e50;
        margin-bottom: 10px;
        font-weight: 700;
    }
    
    .tagline {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 30px;
    }
    
    .welcome-message {
        margin-bottom: 30px;
        background: #f8f9fa;
        padding: 20px;
        border-radius: 12px;
        display: inline-block;
    }
    
    .welcome-message h2 {
        color: #4a90e2;
        margin: 0;
    }
    
    .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .card {
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .card-icon {
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .card h3 {
        font-size: 1.5rem;
        color: #2c3e50;
        margin-bottom: 10px;
    }
    
    .card p {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.5;
    }
    
    .primary-button, .secondary-button {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .primary-button {
        background: #4a90e2;
        color: white;
    }
    
    .primary-button:hover {
        background: #357abd;
    }
    
    .secondary-button {
        background: #f8f9fa;
        color: #4a90e2;
        border: 2px solid #4a90e2;
    }
    
    .secondary-button:hover {
        background: #e9ecef;
    }
    
    .login-prompt {
        margin-top: 40px;
        padding: 20px;
        background: #fff3cd;
        color: #856404;
        border-radius: 12px;
        display: inline-block;
    }
    
    @media (max-width: 768px) {
        .hero-section h1 {
            font-size: 2rem;
        }
        
        .cards-container {
            grid-template-columns: 1fr;
        }
    }
</style>