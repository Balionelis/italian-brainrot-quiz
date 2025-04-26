export interface Character {
    name: string;
    image: string;
  }
  
  export interface Question {
    image: string;
    correctAnswer: string;
    options: string[];
  }
  
  export interface GameState {
    currentQuestion: number;
    score: number;
    timeElapsed: number;
    gameOver: boolean;
    questions: Question[];
  }
  
  export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    timeElapsed: number;
    timestamp: Date;
  }
  
  export interface User {
    uid: string;
    email: string;
    username: string;
  }