<!-- src/lib/components/CharacterQuiz.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { user } from '../stores/authStore';
    import { db } from '../firebase/firebase';
    import { collection, addDoc } from 'firebase/firestore';
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
          await addDoc(collection(db, 'leaderboard'), {
            userId: $user.uid,
            username: $user.displayName || 'Anonymous',
            score: gameState.score,
            timeElapsed: gameState.timeElapsed,
            timestamp: new Date()
          });
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
    <h1>Character Matching Game</h1>
    
    {#if !gameState.gameOver}
      {#if gameState.questions.length > 0}
        <div class="game-info">
          <div>Question {gameState.currentQuestion + 1} of 10</div>
          <div>Score: {gameState.score}</div>
          <div>Time: {gameState.timeElapsed}s</div>
        </div>
        
        <div class="character-image">
          <img 
            src="/images/{gameState.questions[gameState.currentQuestion].image}" 
            alt="Character to identify"
          />
        </div>
        
        <div class="options">
          {#each gameState.questions[gameState.currentQuestion].options as option}
            <button 
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
          <div class="feedback" class:correct={feedback.startsWith('Correct')}>
            {feedback}
          </div>
        {/if}
      {:else}
        <div>Loading questions...</div>
      {/if}
    {:else}
      <div class="game-over">
        <h2>Game Over!</h2>
        <p>Your final score: {gameState.score} points</p>
        <p>Time taken: {gameState.timeElapsed} seconds</p>
        <button on:click={restartGame}>Play Again</button>
      </div>
    {/if}
  </div>
  
  <style>
    .quiz-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .game-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-weight: bold;
    }
    
    .character-image {
      margin: 20px 0;
    }
    
    .character-image img {
      max-width: 300px;
      max-height: 300px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 20px 0;
    }
    
    button {
      padding: 10px 20px;
      font-size: 16px;
      border: 2px solid #ccc;
      border-radius: 5px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:hover:not(:disabled) {
      background: #f0f0f0;
    }
    
    button.selected {
      border-color: #4a90e2;
      background: #e6f0ff;
    }
    
    button.correct {
      border-color: #2ecc71;
      background: #d5f5e3;
    }
    
    button.wrong {
      border-color: #e74c3c;
      background: #fdecea;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .submit-button {
      background: #4a90e2;
      color: white;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .submit-button:hover:not(:disabled) {
      background: #357abd;
    }
    
    .feedback {
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
    }
    
    .feedback.correct {
      color: #2ecc71;
    }
    
    .game-over {
      margin-top: 50px;
    }
    
    .game-over button {
      background: #4a90e2;
      color: white;
      font-weight: bold;
    }
  </style>