<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '../firebase/firebase';
  import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
  import type { LeaderboardEntry } from '../types/types';
  
  let leaderboardData: LeaderboardEntry[] = [];
  let loading = true;
  
  async function fetchLeaderboard() {
      try {
          const q = query(
              collection(db, 'leaderboard'),
              orderBy('score', 'desc'),
              limit(10)
          );
          
          const querySnapshot = await getDocs(q);
          leaderboardData = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              timestamp: doc.data().timestamp.toDate()
          })) as LeaderboardEntry[];
          
      } catch (error) {
          console.error('Error fetching leaderboard:', error);
      }
      
      loading = false;
  }
  
  onMount(() => {
      fetchLeaderboard();
  });
</script>

<div class="leaderboard-container">
  <div class="leaderboard-header">
      <h1>Leaderboard</h1>
      <p>Top 10 Players</p>
  </div>
  
  {#if loading}
      <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading leaderboard...</p>
      </div>
  {:else if leaderboardData.length === 0}
      <div class="empty-state">
          <span class="empty-icon">🏆</span>
          <p>No scores yet. Be the first to play!</p>
      </div>
  {:else}
      <div class="leaderboard-table">
          {#each leaderboardData as entry, index}
              <div class="leaderboard-row" class:top-three={index < 3}>
                  <div class="rank">
                      {#if index === 0}
                          <span class="medal gold">🥇</span>
                      {:else if index === 1}
                          <span class="medal silver">🥈</span>
                      {:else if index === 2}
                          <span class="medal bronze">🥉</span>
                      {:else}
                          <span class="rank-number">{index + 1}</span>
                      {/if}
                  </div>
                  <div class="player-info">
                      <span class="player-name">{entry.username}</span>
                      <span class="play-date">{entry.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div class="score-info">
                      <span class="score">{entry.score} pts</span>
                      <span class="time">{entry.timeElapsed}s</span>
                  </div>
              </div>
          {/each}
      </div>
  {/if}
</div>

<style>
  .leaderboard-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
  }
  
  .leaderboard-header {
      text-align: center;
      margin-bottom: 40px;
  }
  
  .leaderboard-header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 10px;
  }
  
  .leaderboard-header p {
      color: #6b7280;
      font-size: 1.1rem;
  }
  
  .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  
  .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
  }
  
  .leaderboard-table {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  
  .leaderboard-row {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .leaderboard-row:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .leaderboard-row.top-three {
      background: linear-gradient(135deg, #fff 0%, #f8faff 100%);
      border: 1px solid rgba(74, 144, 226, 0.1);
  }
  
  .rank {
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  .medal {
      font-size: 1.5rem;
  }
  
  .rank-number {
      font-weight: 600;
      color: #6b7280;
      font-size: 1.1rem;
  }
  
  .player-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
  }
  
  .player-name {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1.1rem;
  }
  
  .play-date {
      font-size: 0.9rem;
      color: #6b7280;
  }
  
  .score-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
  }
  
  .score {
      font-weight: 700;
      color: #4a90e2;
      font-size: 1.2rem;
  }
  
  .time {
      font-size: 0.9rem;
      color: #6b7280;
  }
  
  @media (max-width: 640px) {
      .leaderboard-row {
          flex-wrap: wrap;
          gap: 8px;
      }
      
      .rank {
          width: 40px;
      }
      
      .player-info {
          flex: 1 1 60%;
      }
      
      .score-info {
          flex: 1 1 30%;
      }
  }
</style>