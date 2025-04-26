<!-- src/lib/components/CharacterQuiz.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { user } from '../stores/authStore';
    import { db } from '../firebase/firebase';
    import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
    import type { Character, Question, GameState } from '../types/types';
    
    const characters: Character[] = [
      { name: "Tralalero Tralala", image: "tralalero-tralala.webp" },
      { name: "Bombardiro Crocodilo", image: "bombardiro-crocodilo.webp" },
      { name: "Tung Tung Tung Tung Tung Tung Tung Tung Tung Sahur", image: "tung-tung-tung-tung-tung-tung-tung-tung-tung-sahur.webp" },
      { name: "Lirilì Larilà", image: "lirili-larila.webp" },
      { name: "Boneca Ambalabu", image: "boneca-ambalabu.webp" },
      { name: "Brr Brr Patapim", image: "brr-brr-patapim.webp" },
      { name: "Chimpanzini Bananini", image: "chimpanzini-bananini.webp" },
      { name: "Bombombini Gusini", image: "bombombini-gusini.webp" },
      { name: "Capuccino Assassino", image: "capuccino-assassino.webp" },
      { name: "Trippi Troppi", image: "trippi-troppi.webp" },
      { name: "Frigo Camelo", image: "frigo-camelo.webp" },
      { name: "La Vaca Saturno Saturnita", image: "la-vaca-saturno-saturnita.webp" },
      { name: "Ballerina Cappucina", image: "ballerina-cappucina.webp" },
      { name: "U Din Din Din Din Dun Ma Din Din Din Dun", image: "u-din-din-din-din-dun-ma-din-din-din-dun.webp" },
      { name: "Trulimero Trulicina", image: "trulimero-trulicina.webp" },
      { name: "Garamaraman dan Madudungdung tak tuntung perkuntung", image: "garamaraman-dan-madudungdung-tak-tuntung-perkuntung.webp" },
      { name: "Girafa Celestre", image: "girafa-celestre.webp" },
      { name: "Bobrito Bandito", image: "bobrito-bandito.webp" },
      { name: "Fruli Frula", image: "fruli-frula.webp" },
      { name: "Ta Ta Ta Ta Ta Ta Ta Ta Ta Ta Ta Sahur", image: "ta-ta-ta-ta-ta-ta-ta-ta-ta-ta-ta-sahur.webp" },
      { name: "Pot Hotspot", image: "pot-hotspot.webp" },
      { name: "Brri Brri Bicus Dicus Bombicus", image: "brri-brri-bicus-dicus-bombicus.webp" },
      { name: "Burbaloni Lulilolli", image: "burbaloni-lulilolli.webp" },
      { name: "Talpa Di Ferro", image: "talpa-di-ferro.webp" },
      { name: "Blueberrinni Octopussini", image: "blueberrinni-octopussini.webp" },
      { name: "Glorbo Fruttodrillo", image: "glorbo-fruttodrillo.webp" },
      { name: "Il Cacto Hipopotamo", image: "il-cacto-hipopotamo.webp" },
      { name: "Chef Crabracadabra", image: "chef-crabracadabra.webp" },
      { name: "Abonono Schimpazinono", image: "abonono-schimpazinono.webp" },
      { name: "Svinino Bombondino", image: "svinino-bombondino.webp" },
      { name: "Bombardiere Lucertola", image: "bombardiere-lucertola.webp" },
      { name: "Rhinodino Dildorino", image: "rhinodino-dildorino.webp" },
      { name: "Tric Trac Baraboom", image: "tric-trac-baraboom.webp" },
      { name: "Centralucci Nuclearucci", image: "centralucci-nuclearucci.webp" },
      { name: "Orangutini Ananasini", image: "orangutini-ananasini.webp" },
      { name: "Espressona Signora", image: "espressona-signora.webp" },
      { name: "Zibra Zubra Zibralini", image: "zibra-zubra-zibralini.webp" },
      { name: "Graipussi Medussi", image: "graipussi-medussi.webp" },
      { name: "Tigrrullini Watermellini", image: "tigrrullini-watermellini.webp" },
      { name: "Unta Tobi Tob Tob", image: "unta-tobi-tob-tob.webp" },
      { name: "Bulbito Bandito Traktorito", image: "bulbito-bandito-traktorito.webp" }
    ];
    
    let gameState: GameState = {
      currentQuestion: 0,
      score: 0,
      timeElapsed: 0,
      gameOver: false,
      questions: []
    };
    
    let selectedAnswer: string | null = null;
    let feedback = '';
    let timer: ReturnType<typeof setInterval> | undefined;
    let startTime: number;
    
    function generateQuestions() {
      let availableCharacters = [...characters];
      gameState.questions = [];
      
      for (let i = 0; i < 10; i++) {
        const imageIndex = Math.floor(Math.random() * availableCharacters.length);
        const correctCharacter = availableCharacters[imageIndex];
        availableCharacters.splice(imageIndex, 1);
        
        let wrongAnswers = characters
          .filter(char => char.name !== correctCharacter.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        
        let options = [correctCharacter, ...wrongAnswers];
        options.sort(() => Math.random() - 0.5);
        
        gameState.questions.push({
          image: correctCharacter.image,
          correctAnswer: correctCharacter.name,
          options: options.map(opt => opt.name)
        });
      }
    }
    
    function startTimer() {
      startTime = Date.now();
      timer = setInterval(() => {
        gameState.timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      }, 1000);
    }
    
    function selectAnswer(answer: string) {
      selectedAnswer = answer;
    }
    
    async function submitAnswer() {
      if (!selectedAnswer) return;
      
      const answerTime = Math.floor((Date.now() - startTime) / 1000);
      
      if (selectedAnswer === gameState.questions[gameState.currentQuestion].correctAnswer) {
        // Score calculation: Base 100 points - time penalty (2 points per second)
        const points = Math.max(100 - (answerTime * 2), 10);
        gameState.score += points;
        feedback = `Correct! +${points} points`;
      } else {
        feedback = `Wrong! The correct answer was ${gameState.questions[gameState.currentQuestion].correctAnswer}`;
      }
      
      setTimeout(async () => {
        if (gameState.currentQuestion < 9) {
          gameState.currentQuestion++;
          selectedAnswer = null;
          feedback = '';
        } else {
          gameState.gameOver = true;
          clearInterval(timer);
          await saveScore();
        }
      }, 1500);
    }
    
    async function saveScore() {
      if ($user) {
        try {
          // First, check if user already has a score
          const q = query(
            collection(db, 'leaderboard'),
            where('userId', '==', $user.uid)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // User already has a score, check if new score is better
            const existingDoc = querySnapshot.docs[0];
            const existingScore = existingDoc.data().score;
            
            if (gameState.score > existingScore) {
              // Update with new better score
              await updateDoc(doc(db, 'leaderboard', existingDoc.id), {
                score: gameState.score,
                timeElapsed: gameState.timeElapsed,
                timestamp: new Date()
              });
            }
          } else {
            // User doesn't have a score yet, create new entry
            await addDoc(collection(db, 'leaderboard'), {
              userId: $user.uid,
              username: $user.displayName || 'Anonymous',
              score: gameState.score,
              timeElapsed: gameState.timeElapsed,
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    }
    
    function restartGame() {
      gameState = {
        currentQuestion: 0,
        score: 0,
        timeElapsed: 0,
        gameOver: false,
        questions: []
      };
      selectedAnswer = null;
      feedback = '';
      generateQuestions();
      startTimer();
    }
    
    onMount(() => {
      generateQuestions();
      startTimer();
    });
    
    onDestroy(() => {
      clearInterval(timer);
    });
</script>

<div class="quiz-container">
    {#if !gameState.gameOver}
        {#if gameState.questions.length > 0}
            <div class="game-header">
                <div class="progress-bar">
                    <div class="progress" style="width: {(gameState.currentQuestion / 10) * 100}%"></div>
                </div>
                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">Question</span>
                        <span class="stat-value">{gameState.currentQuestion + 1}/10</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Score</span>
                        <span class="stat-value">{gameState.score}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Time</span>
                        <span class="stat-value">{gameState.timeElapsed}s</span>
                    </div>
                </div>
            </div>
            
            <div class="question-section">
                <h2>Who is this character?</h2>
                <div class="character-image">
                    <img 
                        src="/images/{gameState.questions[gameState.currentQuestion].image}" 
                        alt="Character to identify"
                    />
                </div>
                
                <div class="options-grid">
                    {#each gameState.questions[gameState.currentQuestion].options as option}
                        <button 
                            class="option-button"
                            class:selected={selectedAnswer === option}
                            class:correct={feedback.startsWith('Correct') && option === gameState.questions[gameState.currentQuestion].correctAnswer}
                            class:wrong={feedback.startsWith('Wrong') && option === selectedAnswer}
                            on:click={() => selectAnswer(option)}
                            disabled={feedback !== ''}
                        >
                            {option}
                        </button>
                    {/each}
                </div>
                
                {#if !feedback}
                    <button 
                        class="submit-button" 
                        on:click={submitAnswer}
                        disabled={!selectedAnswer}
                    >
                        Submit Answer
                    </button>
                {/if}
                
                {#if feedback}
                    <div class="feedback-message" class:correct={feedback.startsWith('Correct')}>
                        {feedback}
                    </div>
                {/if}
            </div>
        {:else}
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading questions...</p>
            </div>
        {/if}
    {:else}
        <div class="game-over-card">
            <h2>Game Over!</h2>
            <div class="score-summary">
                <div class="final-score">
                    <span class="score-label">Final Score</span>
                    <span class="score-value">{gameState.score}</span>
                </div>
                <div class="time-taken">
                    <span class="time-label">Time Taken</span>
                    <span class="time-value">{gameState.timeElapsed} seconds</span>
                </div>
            </div>
            <button class="play-again-button" on:click={restartGame}>Play Again</button>
        </div>
    {/if}
</div>

<style>
    .quiz-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 0 20px;
    }
    
    .game-header {
        margin-bottom: 30px;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 20px;
    }
    
    .progress {
        height: 100%;
        background: #4a90e2;
        transition: width 0.3s ease;
    }
    
    .game-stats {
        display: flex;
        justify-content: space-between;
        background: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .stat-label {
        font-size: 0.9rem;
        color: #6b7280;
        margin-bottom: 4px;
    }
    
    .stat-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .question-section {
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.5rem;
    }
    
    .character-image {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
    }
    
    .character-image img {
        max-width: 300px;
        max-height: 300px;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
    }
    
    .option-button {
        padding: 16px 20px;
        background: #f8f9fa;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1rem;
        color: #2c3e50;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
    }
    
    .option-button:hover:not(:disabled) {
        border-color: #4a90e2;
        transform: translateY(-2px);
    }
    
    .option-button.selected {
        border-color: #4a90e2;
        background: #e6f2ff;
    }
    
    .option-button.correct {
        border-color: #2ecc71;
        background: #d5f5e3;
    }
    
    .option-button.wrong {
        border-color: #e74c3c;
        background: #fdecea;
    }
    
    .option-button:disabled {
        cursor: not-allowed;
    }
    
    .submit-button {
        width: 100%;
        padding: 16px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .submit-button:hover:not(:disabled) {
        background: #357abd;
        transform: translateY(-1px);
    }
    
    .submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .feedback-message {
        margin-top: 20px;
        padding: 16px;
        border-radius: 12px;
        text-align: center;
        font-weight: 600;
        background: #fee2e2;
        color: #dc2626;
    }
    
    .feedback-message.correct {
        background: #d1fae5;
        color: #059669;
    }
    
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #4a90e2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .game-over-card {
        background: white;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        text-align: center;
    }
    
    .game-over-card h2 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 30px;
    }
    
    .score-summary {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-bottom: 40px;
    }
    
    .final-score, .time-taken {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .score-label, .time-label {
        font-size: 1rem;
        color: #6b7280;
        margin-bottom: 8px;
    }
    
    .score-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #4a90e2;
    }
    
    .time-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .play-again-button {
        padding: 16px 32px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .play-again-button:hover {
        background: #357abd;
        transform: translateY(-1px);
    }
    
    @media (max-width: 640px) {
        .options-grid {
            grid-template-columns: 1fr;
        }
        
        .score-summary {
            flex-direction: column;
            gap: 20px;
        }
    }
</style>