<!-- src/lib/components/Leaderboard.svelte -->
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
    <h2>Top Players</h2>
    
    {#if loading}
      <p>Loading leaderboard...</p>
    {:else if leaderboardData.length === 0}
      <p>No scores yet. Be the first to play!</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {#each leaderboardData as entry, index}
            <tr>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{entry.timeElapsed}s</td>
              <td>{entry.timestamp.toLocaleDateString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
  <style>
    .leaderboard-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    
    tr:hover {
      background-color: #f9f9f9;
    }
  </style>