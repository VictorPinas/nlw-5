import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeLista: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping:boolean;
    isShuffling:boolean;
    play: (episode: Episode) => void;
    playLista: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeLista, setEpisodeLista] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode){
    setEpisodeLista([episode])
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playLista(list: Episode[], index: number){
      setEpisodeLista(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
    }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }
  
  function toggleShuffle(){
      setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState(){
      setEpisodeLista([]);
      setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling ||  (currentEpisodeIndex + 1) < episodeLista.length;

  function playNext(){
      if(isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeLista.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      }else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
    }

   function playPrevious(){
    if (hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }  
    }

  return(
        <PlayerContext.Provider value={{ 
            episodeLista,                                                                                                                                                                               
            currentEpisodeIndex,
            playPrevious, 
            play,
            playNext,
            playLista, 
            isPlaying,
            isLooping,
            isShuffling,
            toggleLoop,
            togglePlay,
            toggleShuffle,
            setPlayingState,
            hasNext,
            hasPrevious,
            clearPlayerState 
        }}
        >
                {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}